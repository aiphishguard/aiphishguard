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

    const hostname = new URL(url).hostname;

    // Query DNS records using Cloudflare's DNS over HTTPS
    const queryDNS = async (type: string) => {
      try {
        const response = await fetch(
          `https://cloudflare-dns.com/dns-query?name=${hostname}&type=${type}`,
          {
            headers: {
              'Accept': 'application/dns-json',
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          return data.Answer?.map((a: any) => a.data) || [];
        }
      } catch (error) {
        console.error(`DNS ${type} query error:`, error);
      }
      return [];
    };

    // Query different record types in parallel
    const [aRecords, mxRecords, txtRecords, nsRecords] = await Promise.all([
      queryDNS('A'),
      queryDNS('MX'),
      queryDNS('TXT'),
      queryDNS('NS'),
    ]);

    // Clean up MX records (remove priority)
    const cleanMxRecords = mxRecords.map((mx: string) => {
      const parts = mx.split(' ');
      return parts.length > 1 ? parts.slice(1).join(' ').replace(/\.$/, '') : mx.replace(/\.$/, '');
    });

    // Check for email authentication
    const hasSpf = txtRecords.some((txt: string) => txt.toLowerCase().includes('v=spf1'));
    const hasDkim = txtRecords.some((txt: string) => txt.toLowerCase().includes('dkim'));
    const hasDmarc = await checkDMARC(hostname);

    // Clean up NS records
    const cleanNsRecords = nsRecords.map((ns: string) => ns.replace(/\.$/, ''));

    // Determine hosting provider (basic detection)
    let hostingProvider: string | undefined;
    let ipLocation: string | undefined;

    if (aRecords.length > 0) {
      const ip = aRecords[0];
      
      // Basic hosting detection based on common patterns
      if (nsRecords.some((ns: string) => ns.includes('cloudflare'))) {
        hostingProvider = 'Cloudflare';
      } else if (nsRecords.some((ns: string) => ns.includes('awsdns'))) {
        hostingProvider = 'Amazon Web Services';
      } else if (nsRecords.some((ns: string) => ns.includes('google'))) {
        hostingProvider = 'Google Cloud';
      } else if (nsRecords.some((ns: string) => ns.includes('azure'))) {
        hostingProvider = 'Microsoft Azure';
      }

      // Try to get IP location using a free API
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.country) {
            ipLocation = geoData.city 
              ? `${geoData.city}, ${geoData.country}`
              : geoData.country;
          }
        }
      } catch (error) {
        console.error('Geo lookup error:', error);
      }
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    
    if (aRecords.length === 0) {
      riskLevel = 'high';
    } else if (!mxRecords.length || (!hasSpf && !hasDkim)) {
      riskLevel = 'medium';
    }

    const analysis = {
      aRecords,
      mxRecords: cleanMxRecords,
      txtRecords: txtRecords.slice(0, 5), // Limit TXT records
      nsRecords: cleanNsRecords,
      hasMxRecords: cleanMxRecords.length > 0,
      hasSpf,
      hasDkim,
      hasDmarc,
      hostingProvider,
      ipLocation,
      riskLevel,
    };

    console.log('DNS analysis completed for:', hostname);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('DNS analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'DNS analysis failed',
        aRecords: [],
        mxRecords: [],
        txtRecords: [],
        nsRecords: [],
        hasMxRecords: false,
        hasSpf: false,
        hasDkim: false,
        hasDmarc: false,
        riskLevel: 'medium',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function checkDMARC(hostname: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=_dmarc.${hostname}&type=TXT`,
      {
        headers: {
          'Accept': 'application/dns-json',
        },
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.Answer?.some((a: any) => 
        a.data.toLowerCase().includes('v=dmarc1')
      ) || false;
    }
  } catch (error) {
    console.error('DMARC check error:', error);
  }
  return false;
}
