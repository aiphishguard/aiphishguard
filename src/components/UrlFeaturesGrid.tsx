import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle, Info } from 'lucide-react';
import type { UrlFeatures } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface UrlFeaturesGridProps {
  features: UrlFeatures;
}

interface FeatureItem {
  label: string;
  value: boolean | number | string;
  type: 'boolean' | 'number' | 'warning';
  description?: string;
  isRisk?: boolean;
}

export function UrlFeaturesGrid({ features }: UrlFeaturesGridProps) {
  const featureItems: FeatureItem[] = [
    { label: 'HTTPS', value: features.hasHttps, type: 'boolean', isRisk: !features.hasHttps },
    { label: 'IP Address', value: features.hasIpAddress, type: 'warning', isRisk: features.hasIpAddress },
    { label: 'Suspicious TLD', value: features.hasSuspiciousTld, type: 'warning', isRisk: features.hasSuspiciousTld },
    { label: 'Phishing Keywords', value: features.hasPhishingKeywords, type: 'warning', isRisk: features.hasPhishingKeywords },
    { label: 'Brand Impersonation', value: features.hasBrandImpersonation, type: 'warning', isRisk: features.hasBrandImpersonation },
    { label: 'URL Shortener', value: features.hasUrlShortener, type: 'warning', isRisk: features.hasUrlShortener },
    { label: 'Punycode', value: features.hasPunycode, type: 'warning', isRisk: features.hasPunycode },
    { label: 'Excessive Subdomains', value: features.hasExcessiveSubdomains, type: 'warning', isRisk: features.hasExcessiveSubdomains },
  ];

  const metricItems = [
    { label: 'URL Length', value: features.urlLength },
    { label: 'Domain Length', value: features.domainLength },
    { label: 'Path Length', value: features.pathLength },
    { label: 'URL Entropy', value: features.urlEntropy.toFixed(2) },
    { label: 'Domain Entropy', value: features.domainEntropy.toFixed(2) },
    { label: 'Dot Count', value: features.dotCount },
    { label: 'Digit Count', value: features.digitCount },
    { label: 'Special Chars', value: features.specialCharCount },
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          URL Feature Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Indicators */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Security Indicators</p>
          <div className="grid grid-cols-2 gap-2">
            {featureItems.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg text-sm",
                  item.isRisk ? "bg-destructive/10" : "bg-secondary/50"
                )}
              >
                <span className="font-medium">{item.label}</span>
                {item.type === 'boolean' ? (
                  item.value ? (
                    <Check className="h-4 w-4 text-threat-safe" />
                  ) : (
                    <X className="h-4 w-4 text-threat-critical" />
                  )
                ) : item.value ? (
                  <AlertTriangle className="h-4 w-4 text-threat-high" />
                ) : (
                  <Check className="h-4 w-4 text-threat-safe" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">URL Metrics</p>
          <div className="grid grid-cols-2 gap-2">
            {metricItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 text-sm"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <Badge variant="outline" className="font-mono">
                  {item.value}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
