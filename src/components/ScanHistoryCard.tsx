import { ExternalLink, Clock, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThreatLevelBadge } from './ThreatLevelBadge';
import { ThreatLevel } from '@/types/analysis';
import { formatDistanceToNow } from 'date-fns';

interface ScanHistoryCardProps {
  id: string;
  url: string;
  threatLevel: ThreatLevel;
  riskScore: number;
  confidence: number;
  scannedAt: string;
}

export function ScanHistoryCard({
  url,
  threatLevel,
  riskScore,
  confidence,
  scannedAt,
}: ScanHistoryCardProps) {
  const truncateUrl = (url: string, maxLength: number = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  return (
    <Card className="glass-card hover:border-primary/30 transition-all duration-300 group">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/80 flex items-center justify-center">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm text-foreground truncate" title={url}>
                  {truncateUrl(url)}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(scannedAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{riskScore}%</div>
                <div className="text-xs text-muted-foreground">Risk</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{confidence}%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
            </div>
            <ThreatLevelBadge level={threatLevel} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
