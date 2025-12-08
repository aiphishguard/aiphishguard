import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Lock, Link, Code, Image, AlertTriangle } from 'lucide-react';
import type { ContentAnalysis } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface ContentAnalysisCardProps {
  analysis: ContentAnalysis;
}

export function ContentAnalysisCard({ analysis }: ContentAnalysisCardProps) {
  const getRiskColor = (score: number) => {
    if (score < 3) return 'bg-threat-safe';
    if (score < 5) return 'bg-threat-medium';
    if (score < 7) return 'bg-threat-high';
    return 'bg-threat-critical';
  };

  const stats = [
    { icon: FileText, label: 'Forms', value: analysis.formCount, risk: analysis.formCount > 1 },
    { icon: Lock, label: 'Password Fields', value: analysis.passwordFieldCount, risk: analysis.passwordFieldCount > 0 },
    { icon: Link, label: 'Total Links', value: analysis.linkCount, risk: false },
    { icon: Link, label: 'External Links', value: analysis.externalLinkCount, risk: analysis.externalLinkCount > 20 },
    { icon: Image, label: 'Images', value: analysis.imageCount, risk: false },
    { icon: Code, label: 'Scripts', value: analysis.scriptCount, risk: false },
    { icon: AlertTriangle, label: 'Suspicious Scripts', value: analysis.suspiciousScripts, risk: analysis.suspiciousScripts > 0 },
    { icon: Code, label: 'iFrames', value: analysis.iframeCount, risk: analysis.iframeCount > 2 },
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Content Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content Risk Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Content Risk Score</span>
            <span className={cn(
              "font-bold",
              analysis.contentRiskScore < 3 && "text-threat-safe",
              analysis.contentRiskScore >= 3 && analysis.contentRiskScore < 5 && "text-threat-medium",
              analysis.contentRiskScore >= 5 && analysis.contentRiskScore < 7 && "text-threat-high",
              analysis.contentRiskScore >= 7 && "text-threat-critical",
            )}>
              {analysis.contentRiskScore}/10
            </span>
          </div>
          <Progress 
            value={analysis.contentRiskScore * 10} 
            className={cn("h-2", getRiskColor(analysis.contentRiskScore))}
          />
        </div>

        {/* Page Info */}
        {(analysis.pageTitle || analysis.metaDescription) && (
          <div className="space-y-2">
            {analysis.pageTitle && (
              <div className="p-2 rounded-lg bg-secondary/50">
                <span className="text-xs text-muted-foreground">Page Title</span>
                <p className="text-sm font-medium truncate">{analysis.pageTitle}</p>
              </div>
            )}
            {analysis.metaDescription && (
              <div className="p-2 rounded-lg bg-secondary/50">
                <span className="text-xs text-muted-foreground">Meta Description</span>
                <p className="text-sm truncate">{analysis.metaDescription}</p>
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg text-sm",
                stat.risk ? "bg-destructive/10" : "bg-secondary/50"
              )}
            >
              <stat.icon className={cn(
                "h-4 w-4",
                stat.risk ? "text-destructive" : "text-muted-foreground"
              )} />
              <span className="flex-1 text-muted-foreground">{stat.label}</span>
              <Badge 
                variant={stat.risk ? "destructive" : "secondary"}
                className="font-mono text-xs"
              >
                {stat.value}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
