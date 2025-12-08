import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { isValidPublicUrl } from "../_shared/url-validator.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 
  'is.gd', 'buff.ly', 'adf.ly', 'j.mp', 'tr.im',
  'short.link', 'cutt.ly', 'rb.gy', 'shorturl.at'
];

const SUSPICIOUS_PATTERNS = [
  /login/i,
  /signin/i,
  /account/i,
  /verify/i,
  /secure/i,
  /update/i,
  /confirm/i,
  /banking/i,
  /paypal/i,
  /amazon/i,
  /apple/i,
  /microsoft/i,
  /google/i,
];

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

    const urlValidation = isValidPublicUrl(url);
    if (!urlValidation.valid) {
      return new Response(
        JSON.stringify({ error: urlValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const chain: Array<{
      url: string;
      statusCode: number;
      isShortener: boolean;
      isSuspicious: boolean;
    }> = [];

    let currentUrl = url;
    let redirectCount = 0;
    const maxRedirects = 10;
    let hasShortener = false;
    let hasSuspiciousPattern = false;

    while (redirectCount < maxRedirects) {
      try {
        const response = await fetch(currentUrl, {
          method: 'HEAD',
          redirect: 'manual',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; PhishGuard/1.0)',
          },
        });

        const hostname = new URL(currentUrl).hostname.toLowerCase();
        const isShortener = URL_SHORTENERS.some(s => hostname.includes(s));
        const isSuspicious = SUSPICIOUS_PATTERNS.some(p => p.test(currentUrl));

        if (isShortener) hasShortener = true;
        if (isSuspicious) hasSuspiciousPattern = true;

        chain.push({
          url: currentUrl,
          statusCode: response.status,
          isShortener,
          isSuspicious,
        });

        // Check for redirect
        const location = response.headers.get('location');
        if (location && (response.status >= 300 && response.status < 400)) {
          // Handle relative URLs
          try {
            currentUrl = new URL(location, currentUrl).href;
          } catch {
            currentUrl = location;
          }
          redirectCount++;
        } else {
          break;
        }
      } catch (error) {
        console.error('Redirect fetch error:', error);
        chain.push({
          url: currentUrl,
          statusCode: 0,
          isShortener: false,
          isSuspicious: false,
        });
        break;
      }
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    
    if (redirectCount > 5 || hasSuspiciousPattern) {
      riskLevel = 'high';
    } else if (hasShortener || redirectCount > 2) {
      riskLevel = 'medium';
    }

    const analysis = {
      chain,
      totalRedirects: redirectCount,
      finalUrl: currentUrl,
      hasShortener,
      hasSuspiciousPattern,
      riskLevel,
    };

    console.log('Redirect analysis completed:', {
      originalUrl: url,
      totalRedirects: redirectCount,
      finalUrl: currentUrl,
    });

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Redirect analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Redirect analysis failed',
        chain: [],
        totalRedirects: 0,
        finalUrl: '',
        hasShortener: false,
        hasSuspiciousPattern: false,
        riskLevel: 'medium',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
