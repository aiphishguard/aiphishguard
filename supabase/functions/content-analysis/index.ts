import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { isValidPublicUrl } from "../_shared/url-validator.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

// TLD to language mapping for mismatch detection
const TLD_LANGUAGE_MAP: Record<string, string> = {
  'ru': 'Russian',
  'cn': 'Chinese',
  'jp': 'Japanese',
  'kr': 'Korean',
  'de': 'German',
  'fr': 'French',
  'es': 'Spanish',
  'it': 'Italian',
  'pt': 'Portuguese',
  'nl': 'Dutch',
  'pl': 'Polish',
  'ua': 'Ukrainian',
  'br': 'Portuguese',
  'ar': 'Arabic',
  'th': 'Thai',
  'vn': 'Vietnamese',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate URL to prevent SSRF attacks
    const urlValidation = isValidPublicUrl(url);
    if (!urlValidation.valid) {
      console.log('URL validation failed:', urlValidation.error);
      return new Response(
        JSON.stringify({ error: urlValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching content for:', url);

    // Fetch the webpage content
    let htmlContent = '';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const pageResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!pageResponse.ok) {
        throw new Error(`HTTP ${pageResponse.status}`);
      }

      htmlContent = await pageResponse.text();
    } catch (fetchError) {
      console.error('Failed to fetch webpage:', fetchError);
      return new Response(
        JSON.stringify({ 
          error: 'Could not fetch webpage content',
          contentAnalysis: null,
          languageDetection: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract content features
    const formCount = (htmlContent.match(/<form/gi) || []).length;
    const passwordFieldCount = (htmlContent.match(/type=["']password["']/gi) || []).length;
    const linkCount = (htmlContent.match(/<a\s/gi) || []).length;
    const imageCount = (htmlContent.match(/<img/gi) || []).length;
    const scriptCount = (htmlContent.match(/<script/gi) || []).length;
    const iframeCount = (htmlContent.match(/<iframe/gi) || []).length;

    // Count external links
    let externalLinkCount = 0;
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const hrefMatches = htmlContent.matchAll(/href=["']([^"']+)["']/gi);
      for (const match of hrefMatches) {
        try {
          const linkUrl = new URL(match[1], url);
          if (linkUrl.hostname !== domain) {
            externalLinkCount++;
          }
        } catch {}
      }
    } catch {}

    // Detect suspicious scripts
    const suspiciousPatterns = [
      /eval\s*\(/gi,
      /document\.write/gi,
      /unescape\s*\(/gi,
      /fromCharCode/gi,
      /atob\s*\(/gi,
      /btoa\s*\(/gi,
      /\.innerHTML\s*=/gi,
    ];
    let suspiciousScripts = 0;
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(htmlContent)) {
        suspiciousScripts++;
      }
    }

    // Extract page title
    const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : '';

    // Extract meta description
    const metaMatch = htmlContent.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    const metaDescription = metaMatch ? metaMatch[1].trim() : '';

    // Extract text content for language detection
    const textContent = htmlContent
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 2000);

    // Calculate content risk score
    let contentRiskScore = 0;
    if (passwordFieldCount > 0) contentRiskScore += 2;
    if (formCount > 1) contentRiskScore += 1;
    if (suspiciousScripts > 0) contentRiskScore += suspiciousScripts;
    if (iframeCount > 2) contentRiskScore += 1;
    if (externalLinkCount > 30) contentRiskScore += 1;
    contentRiskScore = Math.min(10, contentRiskScore);

    const contentAnalysis = {
      formCount,
      passwordFieldCount,
      linkCount,
      externalLinkCount,
      imageCount,
      scriptCount,
      suspiciousScripts,
      iframeCount,
      contentRiskScore,
      pageTitle,
      metaDescription,
      textContent: textContent.slice(0, 500),
    };

    // Language detection using AI
    let languageDetection = null;
    if (textContent.length > 50 && LOVABLE_API_KEY) {
      try {
        const langPrompt = `Detect the primary language of this text and respond with ONLY a JSON object:
{
  "language": "English",
  "languageCode": "en",
  "confidence": 95
}

Text to analyze:
${textContent.slice(0, 1000)}`;

        const langResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-lite',
            messages: [
              { role: 'user', content: langPrompt }
            ],
          }),
        });

        if (langResponse.ok) {
          const langResult = await langResponse.json();
          const langContent = langResult.choices?.[0]?.message?.content;
          
          if (langContent) {
            const jsonMatch = langContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const langData = JSON.parse(jsonMatch[0]);
              
              // Check for language mismatch
              let expectedLanguage = null;
              let isLanguageMismatch = false;
              
              try {
                const urlObj = new URL(url);
                const tld = urlObj.hostname.split('.').pop()?.toLowerCase() || '';
                if (TLD_LANGUAGE_MAP[tld]) {
                  expectedLanguage = TLD_LANGUAGE_MAP[tld];
                  isLanguageMismatch = langData.language.toLowerCase() !== expectedLanguage.toLowerCase();
                }
              } catch {}

              languageDetection = {
                language: langData.language,
                languageCode: langData.languageCode,
                confidence: langData.confidence,
                isLanguageMismatch,
                expectedLanguage,
              };
            }
          }
        }
      } catch (langError) {
        console.error('Language detection failed:', langError);
      }
    }

    return new Response(
      JSON.stringify({ contentAnalysis, languageDetection }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in content-analysis function:', error);
    const message = error instanceof Error ? error.message : 'Content analysis failed';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
