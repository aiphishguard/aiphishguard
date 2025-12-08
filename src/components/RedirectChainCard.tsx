import { ArrowRight, Link2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RedirectAnalysis } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface RedirectChainCardProps {
  analysis: RedirectAnalysis;
  className?: string;
}

const riskColors = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
};

const statusCodeColors: Record<number, string> = {
  200: 'bg-success/10 text-success',
  301: 'bg-info/10 text-info',
  302: 'bg-info/10 text-info',
  307: 'bg-info/10 text-info',
  308: 'bg-info/10 text-info',
  400: 'bg-warning/10 text-warning',
  403: 'bg-destructive/10 text-destructive',
  404: 'bg-destructive/10 text-destructive',
  500: 'bg-destructive/10 text-destructive',
};

export function RedirectChainCard({ analysis, className }: RedirectChainCardProps) {
  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Redirect Chain Analysis
          </CardTitle>
          <Badge className={cn("border", riskColors[analysis.riskLevel])}>
            {analysis.riskLevel} risk
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {analysis.totalRedirects === 0 
            ? 'No redirects detected' 
            : `${analysis.totalRedirects} redirect${analysis.totalRedirects > 1 ? 's' : ''} detected`}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30">
            {analysis.hasShortener ? (
              <AlertTriangle className="h-5 w-5 text-warning" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-success" />
            )}
            <div>
              <p className="text-xs text-muted-foreground">URL Shortener</p>
              <p className="text-sm font-medium">
                {analysis.hasShortener ? 'Detected' : 'None'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30">
            {analysis.hasSuspiciousPattern ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-success" />
            )}
            <div>
              <p className="text-xs text-muted-foreground">Suspicious Pattern</p>
              <p className="text-sm font-medium">
                {analysis.hasSuspiciousPattern ? 'Detected' : 'None'}
              </p>
            </div>
          </div>
        </div>

        {/* Redirect Chain Visualization */}
        {analysis.chain.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Redirect Path</p>
            <div className="space-y-2">
              {analysis.chain.map((item, index) => (
                <div key={index} className="relative">
                  <div 
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border",
                      item.isSuspicious 
                        ? "bg-destructive/5 border-destructive/30" 
                        : "bg-secondary/30 border-border/50"
                    )}
                  >
                    {/* Status Code Badge */}
                    <Badge 
                      className={cn(
                        "shrink-0",
                        statusCodeColors[item.statusCode] || "bg-muted"
                      )}
                    >
                      {item.statusCode}
                    </Badge>
                    
                    {/* URL */}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs truncate" title={item.url}>
                        {truncateUrl(item.url)}
                      </p>
                      <div className="flex gap-2 mt-1">
                        {item.isShortener && (
                          <Badge variant="outline" className="text-xs bg-warning/10 text-warning">
                            Shortener
                          </Badge>
                        )}
                        {item.isSuspicious && (
                          <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive">
                            Suspicious
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow connecting to next item */}
                  {index < analysis.chain.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowRight className="h-4 w-4 text-muted-foreground transform rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Destination */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">Final Destination</p>
          <p className="font-mono text-sm break-all">{analysis.finalUrl}</p>
        </div>
      </CardContent>
    </Card>
  );
}
