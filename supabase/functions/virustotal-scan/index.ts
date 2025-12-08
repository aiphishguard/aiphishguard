import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VIRUSTOTAL_API_KEY = Deno.env.get('VIRUSTOTAL_API_KEY');

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

    if (!VIRUSTOTAL_API_KEY) {
      console.log('VirusTotal API key not configured');
      return new Response(
        JSON.stringify({ error: 'VirusTotal API key not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Scanning URL with VirusTotal:', url);

    // First, submit the URL for scanning
    const urlId = btoa(url).replace(/=/g, '');
    
    // Try to get existing report first
    const reportResponse = await fetch(
      `https://www.virustotal.com/api/v3/urls/${urlId}`,
      {
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY,
        },
      }
    );

    let scanResult;

    if (reportResponse.ok) {
      const reportData = await reportResponse.json();
      scanResult = reportData.data?.attributes?.last_analysis_stats;
      
      if (!scanResult) {
        // No existing report, submit for scanning
        const submitResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
          method: 'POST',
          headers: {
            'x-apikey': VIRUSTOTAL_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `url=${encodeURIComponent(url)}`,
        });

        if (!submitResponse.ok) {
          throw new Error('Failed to submit URL to VirusTotal');
        }

        const submitData = await submitResponse.json();
        
        // Wait a bit for scan to complete
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Get the analysis result
        const analysisId = submitData.data?.id;
        if (analysisId) {
          const analysisResponse = await fetch(
            `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
            {
              headers: {
                'x-apikey': VIRUSTOTAL_API_KEY,
              },
            }
          );

          if (analysisResponse.ok) {
            const analysisData = await analysisResponse.json();
            scanResult = analysisData.data?.attributes?.stats;
          }
        }
      }
    } else if (reportResponse.status === 404) {
      // URL not found, submit for scanning
      const submitResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
        method: 'POST',
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `url=${encodeURIComponent(url)}`,
      });

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text();
        console.error('VirusTotal submit error:', errorText);
        throw new Error('Failed to submit URL to VirusTotal');
      }

      // Return pending status
      return new Response(
        JSON.stringify({
          malicious: 0,
          suspicious: 0,
          harmless: 0,
          undetected: 0,
          totalEngines: 0,
          scanDate: new Date().toISOString(),
          status: 'scanning',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error(`VirusTotal API error: ${reportResponse.status}`);
    }

    if (!scanResult) {
      return new Response(
        JSON.stringify({
          malicious: 0,
          suspicious: 0,
          harmless: 0,
          undetected: 0,
          totalEngines: 0,
          scanDate: new Date().toISOString(),
          status: 'pending',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = {
      malicious: scanResult.malicious || 0,
      suspicious: scanResult.suspicious || 0,
      harmless: scanResult.harmless || 0,
      undetected: scanResult.undetected || 0,
      totalEngines: (scanResult.malicious || 0) + (scanResult.suspicious || 0) + 
                    (scanResult.harmless || 0) + (scanResult.undetected || 0),
      scanDate: new Date().toISOString(),
      permalink: `https://www.virustotal.com/gui/url/${urlId}`,
    };

    console.log('VirusTotal scan result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in virustotal-scan function:', error);
    const message = error instanceof Error ? error.message : 'VirusTotal scan failed';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
