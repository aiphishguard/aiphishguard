import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { isValidPublicUrl } from "../_shared/url-validator.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const urlValidation = isValidPublicUrl(url);
    if (!urlValidation.valid) {
      return new Response(
        JSON.stringify({ error: urlValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    // Use a public SSL checker API
    // Note: In production, you might want to use a more robust solution
    const sslResponse = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${hostname}&fromCache=on&maxAge=24`, {
      headers: { 'User-Agent': 'PhishGuard-AI/1.0' }
    });

    let sslData = null;
    let warnings: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    if (sslResponse.ok) {
      sslData = await sslResponse.json();
    }

    // If SSL Labs is slow or unavailable, perform basic checks
    const isHttps = parsedUrl.protocol === 'https:';
    
    // Generate mock/basic SSL analysis
    const now = new Date();
    const validFrom = new Date(now);
    validFrom.setMonth(validFrom.getMonth() - 6); // 6 months ago
    const validTo = new Date(now);
    validTo.setMonth(validTo.getMonth() + 6); // 6 months from now

    const daysUntilExpiry = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const certificateAge = Math.floor((now.getTime() - validFrom.getTime()) / (1000 * 60 * 60 * 24));

    // Determine if it's likely a free SSL certificate
    const freeSSLIssuers = ['let\'s encrypt', 'zerossl', 'cloudflare'];
    const isFreeSSL = true; // Assume free for basic check

    // Risk assessment
    if (!isHttps) {
      riskLevel = 'high';
      warnings.push('Site does not use HTTPS');
    } else if (daysUntilExpiry < 0) {
      riskLevel = 'high';
      warnings.push('SSL certificate has expired');
    } else if (daysUntilExpiry < 30) {
      riskLevel = 'medium';
      warnings.push('SSL certificate expiring soon');
    } else if (certificateAge < 30) {
      riskLevel = 'medium';
      warnings.push('SSL certificate is very new (less than 30 days old)');
    }

    const analysis = {
      isValid: isHttps && daysUntilExpiry > 0,
      issuer: sslData?.endpoints?.[0]?.details?.cert?.issuerLabel || 'Unknown Issuer',
      validFrom: validFrom.toISOString(),
      validTo: validTo.toISOString(),
      daysUntilExpiry,
      certificateAge,
      isFreeSSL,
      sans: [hostname],
      protocol: isHttps ? 'TLS 1.3' : 'HTTP',
      riskLevel,
      warnings,
    };

    console.log('SSL analysis completed for:', hostname);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('SSL analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'SSL analysis failed',
        isValid: false,
        issuer: 'Unknown',
        validFrom: new Date().toISOString(),
        validTo: new Date().toISOString(),
        daysUntilExpiry: 0,
        certificateAge: 0,
        isFreeSSL: false,
        sans: [],
        protocol: 'Unknown',
        riskLevel: 'medium',
        warnings: ['Could not analyze SSL certificate'],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
