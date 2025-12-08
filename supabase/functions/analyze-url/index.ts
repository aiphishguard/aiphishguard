import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { isValidPublicUrl } from "../_shared/url-validator.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, urlFeatures, preliminaryScore, deepAnalysis } = await req.json();

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

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the analysis prompt
    const systemPrompt = `You are an expert cybersecurity AI specialized in phishing detection. 
You analyze URLs and their features to detect phishing attempts, malware, and other security threats.
You must respond with a JSON object containing your analysis.

Analyze the given URL and its extracted features to determine if it's a phishing attempt.
Consider these factors:
- URL structure and patterns (length, special characters, subdomains)
- Domain characteristics (suspicious TLDs, brand impersonation, IP addresses)
- Security indicators (HTTPS, punycode, URL shorteners)
- Common phishing patterns and techniques

Your response MUST be a valid JSON object with these exact fields:
{
  "threatLevel": "safe" | "low" | "medium" | "high" | "critical",
  "confidence": number (0-100),
  "riskScore": number (0-100),
  "analysis": "string describing your analysis in 2-3 sentences",
  "additionalWarnings": ["array", "of", "specific", "warnings"]
}`;

    const userPrompt = `Analyze this URL for phishing threats:

URL: ${url}

Extracted Features:
- URL Length: ${urlFeatures.urlLength}
- Domain Length: ${urlFeatures.domainLength}
- Has HTTPS: ${urlFeatures.hasHttps}
- Has IP Address: ${urlFeatures.hasIpAddress}
- Suspicious TLD: ${urlFeatures.hasSuspiciousTld}
- Phishing Keywords: ${urlFeatures.hasPhishingKeywords}
- Brand Impersonation: ${urlFeatures.hasBrandImpersonation}
- URL Shortener: ${urlFeatures.hasUrlShortener}
- Punycode: ${urlFeatures.hasPunycode}
- Excessive Subdomains: ${urlFeatures.hasExcessiveSubdomains}
- URL Entropy: ${urlFeatures.urlEntropy}
- Domain Entropy: ${urlFeatures.domainEntropy}
- Preliminary Risk Score: ${preliminaryScore}

Provide your phishing threat analysis as a JSON object.`;

    console.log('Calling Lovable AI for URL analysis:', url);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from AI');
    }

    console.log('AI Response:', content);

    // Parse the JSON response
    let analysisResult;
    try {
      // Extract JSON from the response (in case it's wrapped in markdown)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback based on preliminary score
      analysisResult = {
        threatLevel: preliminaryScore > 60 ? 'high' : preliminaryScore > 30 ? 'medium' : 'low',
        confidence: 70,
        riskScore: preliminaryScore,
        analysis: 'Analysis completed based on URL features. Manual review recommended.',
        additionalWarnings: []
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in analyze-url function:', error);
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
