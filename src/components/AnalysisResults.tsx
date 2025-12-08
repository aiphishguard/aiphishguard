import { 
  Shield, AlertTriangle, Globe, Lock, FileText, 
  Languages, ExternalLink, Check, X, Info,
  ChevronDown, ChevronUp, Copy
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThreatLevelBadge } from './ThreatLevelBadge';
import { RiskGauge } from './RiskGauge';
import { UrlFeaturesGrid } from './UrlFeaturesGrid';
import { ContentAnalysisCard } from './ContentAnalysisCard';
import { LanguageDetectionCard } from './LanguageDetectionCard';
import { VirusTotalCard } from './VirusTotalCard';
import type { AnalysisResult } from '@/types/analysis';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onNewScan: () => void;
}

export function AnalysisResults({ result, onNewScan }: AnalysisResultsProps) {
  const [showDetails, setShowDetails] = useState(false);

  const copyToClipboard = () => {
    const text = `
PhishGuard AI Analysis Report
=============================
URL: ${result.url}
Threat Level: ${result.threatLevel.toUpperCase()}
Risk Score: ${result.riskScore}/100
Confidence: ${result.confidence}%
Analyzed: ${new Date(result.timestamp).toLocaleString()}

AI Analysis:
${result.aiAnalysis}

Warnings:
${result.warnings.map(w => `• ${w}`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(text);
    toast.success('Analysis report copied to clipboard');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Result Card */}
      <Card className="glass-card overflow-hidden">
        <div 
          className={cn(
            "h-2 w-full",
            result.threatLevel === 'safe' && 'bg-threat-safe',
            result.threatLevel === 'low' && 'bg-threat-low',
            result.threatLevel === 'medium' && 'bg-threat-medium',
            result.threatLevel === 'high' && 'bg-threat-high',
            result.threatLevel === 'critical' && 'bg-threat-critical',
          )}
        />
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* Left: Risk Gauge */}
            <div className="flex flex-col items-center gap-4">
              <RiskGauge score={result.riskScore} size="lg" />
              <ThreatLevelBadge level={result.threatLevel} size="lg" />
              <p className="text-sm text-muted-foreground text-center">
                {result.confidence}% confidence
              </p>
            </div>

            {/* Right: Details */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Globe className="h-4 w-4" />
                  <span>Analyzed URL</span>
                </div>
                <p className="font-mono text-sm bg-secondary/50 rounded-lg p-3 break-all">
                  {result.url}
                </p>
              </div>

              {/* AI Analysis */}
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Shield className="h-4 w-4" />
                  <span>AI Analysis</span>
                </div>
                <p className="text-foreground leading-relaxed">
                  {result.aiAnalysis}
                </p>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Detected Issues ({result.warnings.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.warnings.map((warning, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-destructive/10 text-destructive border-destructive/20"
                      >
                        {warning}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button onClick={onNewScan} className="gradient-primary">
                  <Shield className="mr-2 h-4 w-4" />
                  Scan Another URL
                </Button>
                <Button variant="outline" onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Report
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Show Details
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis (Expandable) */}
      {showDetails && (
        <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
          {/* URL Features */}
          <UrlFeaturesGrid features={result.urlFeatures} />

          {/* Content Analysis */}
          {result.contentAnalysis && (
            <ContentAnalysisCard analysis={result.contentAnalysis} />
          )}

          {/* Language Detection */}
          {result.languageDetection && (
            <LanguageDetectionCard detection={result.languageDetection} />
          )}

          {/* VirusTotal Results */}
          {result.virusTotalResult && (
            <VirusTotalCard result={result.virusTotalResult} />
          )}
        </div>
      )}

      {/* Timestamp */}
      <p className="text-center text-sm text-muted-foreground">
        Analysis completed at {new Date(result.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
