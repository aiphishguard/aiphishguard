import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ExternalLink, AlertTriangle, Check, HelpCircle, X } from 'lucide-react';
import type { VirusTotalResult } from '@/types/analysis';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VirusTotalCardProps {
  result: VirusTotalResult;
}

export function VirusTotalCard({ result }: VirusTotalCardProps) {
  const total = result.totalEngines;
  const maliciousPercent = (result.malicious / total) * 100;
  
  const getOverallStatus = () => {
    if (result.malicious > 0) return 'dangerous';
    if (result.suspicious > 0) return 'suspicious';
    return 'clean';
  };

  const status = getOverallStatus();

  const stats = [
    { 
      label: 'Malicious', 
      value: result.malicious, 
      icon: X,
      color: 'text-threat-critical bg-threat-critical/10' 
    },
    { 
      label: 'Suspicious', 
      value: result.suspicious, 
      icon: AlertTriangle,
      color: 'text-threat-high bg-threat-high/10' 
    },
    { 
      label: 'Harmless', 
      value: result.harmless, 
      icon: Check,
      color: 'text-threat-safe bg-threat-safe/10' 
    },
    { 
      label: 'Undetected', 
      value: result.undetected, 
      icon: HelpCircle,
      color: 'text-muted-foreground bg-secondary' 
    },
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            VirusTotal Scan
          </CardTitle>
          {result.permalink && (
            <Button variant="ghost" size="sm" asChild>
              <a href={result.permalink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                View Report
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className={cn(
          "flex items-center justify-between p-4 rounded-lg",
          status === 'dangerous' && "bg-threat-critical/10 border border-threat-critical/20",
          status === 'suspicious' && "bg-threat-high/10 border border-threat-high/20",
          status === 'clean' && "bg-threat-safe/10 border border-threat-safe/20",
        )}>
          <div>
            <p className="text-sm text-muted-foreground">Scan Result</p>
            <p className={cn(
              "text-xl font-bold capitalize",
              status === 'dangerous' && "text-threat-critical",
              status === 'suspicious' && "text-threat-high",
              status === 'clean' && "text-threat-safe",
            )}>
              {status}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Detection Rate</p>
            <p className="text-xl font-bold">
              {result.malicious}/{total}
            </p>
          </div>
        </div>

        {/* Detection Bar */}
        <div className="space-y-2">
          <div className="flex h-4 rounded-full overflow-hidden bg-secondary">
            <div 
              className="bg-threat-critical transition-all" 
              style={{ width: `${(result.malicious / total) * 100}%` }}
            />
            <div 
              className="bg-threat-high transition-all" 
              style={{ width: `${(result.suspicious / total) * 100}%` }}
            />
            <div 
              className="bg-threat-safe transition-all" 
              style={{ width: `${(result.harmless / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg",
                stat.color
              )}
            >
              <stat.icon className="h-4 w-4" />
              <span className="flex-1 text-sm">{stat.label}</span>
              <Badge variant="outline" className="font-mono">
                {stat.value}
              </Badge>
            </div>
          ))}
        </div>

        {/* Scan Date */}
        <p className="text-xs text-muted-foreground text-center">
          Scanned: {new Date(result.scanDate).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
