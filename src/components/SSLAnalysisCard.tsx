import { Lock, Unlock, Shield, AlertTriangle, Calendar, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SSLAnalysis } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface SSLAnalysisCardProps {
  analysis: SSLAnalysis;
  className?: string;
}

const riskColors = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function SSLAnalysisCard({ analysis, className }: SSLAnalysisCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getExpiryStatus = () => {
    if (analysis.daysUntilExpiry < 0) return { label: 'Expired', color: 'text-destructive' };
    if (analysis.daysUntilExpiry < 30) return { label: 'Expiring Soon', color: 'text-warning' };
    return { label: `${analysis.daysUntilExpiry} days`, color: 'text-success' };
  };

  const expiryStatus = getExpiryStatus();

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {analysis.isValid ? (
              <Lock className="h-5 w-5 text-success" />
            ) : (
              <Unlock className="h-5 w-5 text-destructive" />
            )}
            SSL Certificate Analysis
          </CardTitle>
          <Badge className={cn("border", riskColors[analysis.riskLevel])}>
            {analysis.riskLevel} risk
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Validity Status */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
          <Shield className={cn(
            "h-8 w-8",
            analysis.isValid ? "text-success" : "text-destructive"
          )} />
          <div>
            <p className="font-medium text-sm">
              {analysis.isValid ? 'Valid Certificate' : 'Invalid Certificate'}
            </p>
            <p className="text-xs text-muted-foreground">
              {analysis.protocol}
            </p>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Issuer
            </span>
            <span className="font-medium truncate ml-2 max-w-[200px]">
              {analysis.issuer}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Valid From
            </span>
            <span className="font-medium">{formatDate(analysis.validFrom)}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Expires
            </span>
            <span className={cn("font-medium", expiryStatus.color)}>
              {formatDate(analysis.validTo)} ({expiryStatus.label})
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Certificate Type</span>
            <Badge variant={analysis.isFreeSSL ? "secondary" : "default"}>
              {analysis.isFreeSSL ? 'Free (Let\'s Encrypt)' : 'Commercial'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Certificate Age</span>
            <span className="font-medium">{analysis.certificateAge} days</span>
          </div>
        </div>

        {/* SANs */}
        {analysis.sans.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Subject Alternative Names ({analysis.sans.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {analysis.sans.slice(0, 5).map((san, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {san}
                </Badge>
              ))}
              {analysis.sans.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{analysis.sans.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Warnings */}
        {analysis.warnings.length > 0 && (
          <div className="space-y-2">
            {analysis.warnings.map((warning, i) => (
              <div 
                key={i}
                className="flex items-start gap-2 text-sm text-warning bg-warning/10 p-2 rounded"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
