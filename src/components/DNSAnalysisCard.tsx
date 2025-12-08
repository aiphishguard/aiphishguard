import { 
  Globe, 
  Mail, 
  Server, 
  Shield, 
  CheckCircle2, 
  XCircle,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DNSAnalysis } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface DNSAnalysisCardProps {
  analysis: DNSAnalysis;
  className?: string;
}

const riskColors = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function DNSAnalysisCard({ analysis, className }: DNSAnalysisCardProps) {
  const emailAuthChecks = [
    { label: 'SPF', value: analysis.hasSpf },
    { label: 'DKIM', value: analysis.hasDkim },
    { label: 'DMARC', value: analysis.hasDmarc },
  ];

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            DNS Analysis
          </CardTitle>
          <Badge className={cn("border", riskColors[analysis.riskLevel])}>
            {analysis.riskLevel} risk
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* IP and Location */}
        <div className="grid gap-3">
          {analysis.aRecords.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Server className="h-4 w-4" />
                IP Address
              </span>
              <span className="font-mono font-medium">
                {analysis.aRecords[0]}
                {analysis.aRecords.length > 1 && (
                  <span className="text-muted-foreground ml-1">
                    (+{analysis.aRecords.length - 1})
                  </span>
                )}
              </span>
            </div>
          )}
          
          {analysis.ipLocation && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </span>
              <span className="font-medium">{analysis.ipLocation}</span>
            </div>
          )}
          
          {analysis.hostingProvider && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Server className="h-4 w-4" />
                Hosting
              </span>
              <span className="font-medium">{analysis.hostingProvider}</span>
            </div>
          )}
        </div>

        {/* MX Records */}
        <div className="p-3 rounded-lg bg-secondary/30">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Mail Exchange (MX)</span>
            {analysis.hasMxRecords ? (
              <CheckCircle2 className="h-4 w-4 text-success ml-auto" />
            ) : (
              <XCircle className="h-4 w-4 text-warning ml-auto" />
            )}
          </div>
          {analysis.mxRecords.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {analysis.mxRecords.slice(0, 3).map((mx, i) => (
                <Badge key={i} variant="outline" className="text-xs font-mono">
                  {mx}
                </Badge>
              ))}
              {analysis.mxRecords.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{analysis.mxRecords.length - 3}
                </Badge>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No MX records found</p>
          )}
        </div>

        {/* Email Authentication */}
        <div className="p-3 rounded-lg bg-secondary/30">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Email Authentication</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {emailAuthChecks.map((check) => (
              <div 
                key={check.label}
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg",
                  check.value ? "bg-success/10" : "bg-destructive/10"
                )}
              >
                {check.value ? (
                  <CheckCircle2 className="h-5 w-5 text-success mb-1" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive mb-1" />
                )}
                <span className="text-xs font-medium">{check.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nameservers */}
        {analysis.nsRecords.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Nameservers</p>
            <div className="flex flex-wrap gap-1">
              {analysis.nsRecords.slice(0, 4).map((ns, i) => (
                <Badge key={i} variant="outline" className="text-xs font-mono">
                  {ns}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
