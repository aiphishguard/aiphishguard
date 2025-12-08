import { 
  AlertTriangle, 
  Shield, 
  Info, 
  CheckCircle2,
  ExternalLink,
  AlertOctagon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Recommendation, ThreatLevel } from '@/types/analysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SmartRecommendationsProps {
  recommendations: Recommendation[];
  threatLevel: ThreatLevel;
  className?: string;
}

const typeConfig = {
  danger: {
    icon: AlertOctagon,
    bgColor: 'bg-destructive/10',
    borderColor: 'border-l-destructive',
    textColor: 'text-destructive',
    iconBg: 'bg-destructive/20',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-warning/10',
    borderColor: 'border-l-warning',
    textColor: 'text-warning',
    iconBg: 'bg-warning/20',
  },
  info: {
    icon: Info,
    bgColor: 'bg-info/10',
    borderColor: 'border-l-info',
    textColor: 'text-info',
    iconBg: 'bg-info/20',
  },
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-success/10',
    borderColor: 'border-l-success',
    textColor: 'text-success',
    iconBg: 'bg-success/20',
  },
};

export function SmartRecommendations({ 
  recommendations, 
  threatLevel, 
  className 
}: SmartRecommendationsProps) {
  // Sort recommendations by severity
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const order = { danger: 0, warning: 1, info: 2, success: 3 };
    return order[a.type] - order[b.type];
  });

  const getHeaderMessage = () => {
    switch (threatLevel) {
      case 'critical':
        return "⚠️ Critical Security Alert - Immediate Action Required";
      case 'high':
        return "🚨 High Risk Detected - Please Review Carefully";
      case 'medium':
        return "⚡ Moderate Risk - Proceed with Caution";
      case 'low':
        return "✓ Low Risk - Minor Concerns Detected";
      case 'safe':
        return "✅ This URL Appears Safe";
      default:
        return "Security Recommendations";
    }
  };

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-primary" />
          Smart Recommendations
        </CardTitle>
        <p className={cn(
          "text-sm font-medium",
          threatLevel === 'critical' || threatLevel === 'high' 
            ? "text-destructive" 
            : "text-muted-foreground"
        )}>
          {getHeaderMessage()}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {sortedRecommendations.map((rec) => {
          const config = typeConfig[rec.type];
          const Icon = config.icon;
          
          return (
            <div
              key={rec.id}
              className={cn(
                "flex gap-3 p-4 rounded-lg border-l-4",
                config.bgColor,
                config.borderColor
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                config.iconBg
              )}>
                <Icon className={cn("w-5 h-5", config.textColor)} />
              </div>
              
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm">{rec.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {rec.description}
                </p>
                {rec.action && (
                  <Button
                    variant="link"
                    size="sm"
                    className={cn("p-0 h-auto text-xs", config.textColor)}
                  >
                    {rec.action}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        
        {/* What to do section for dangerous URLs */}
        {(threatLevel === 'critical' || threatLevel === 'high') && (
          <div className="mt-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <h4 className="font-semibold text-sm text-destructive mb-2">
              🛑 If You Already Clicked This Link:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• Do NOT enter any personal information</li>
              <li>• Close the page immediately</li>
              <li>• Clear your browser cache and cookies</li>
              <li>• Run a security scan on your device</li>
              <li>• Change passwords if you entered any credentials</li>
              <li>• Monitor your accounts for suspicious activity</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
