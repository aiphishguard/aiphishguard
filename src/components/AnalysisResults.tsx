import { 
  Shield, AlertTriangle, Globe, 
  ChevronDown, ChevronUp, Copy, Download
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThreatLevelBadge } from './ThreatLevelBadge';
import { AnimatedRiskScore } from './AnimatedRiskScore';
import { AnalysisTimeline } from './AnalysisTimeline';
import { SmartRecommendations } from './SmartRecommendations';
import { ThreatRadarChart } from './ThreatRadarChart';
import { UrlFeaturesGrid } from './UrlFeaturesGrid';
import { ContentAnalysisCard } from './ContentAnalysisCard';
import { LanguageDetectionCard } from './LanguageDetectionCard';
import { VirusTotalCard } from './VirusTotalCard';
import { SSLAnalysisCard } from './SSLAnalysisCard';
import { RedirectChainCard } from './RedirectChainCard';
import { DNSAnalysisCard } from './DNSAnalysisCard';
import { ExportOptions } from './ExportOptions';
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

  // Default threat factors if not provided
  const threatFactors = result.threatFactors || {
    urlStructure: result.riskScore * 0.8,
    domainReputation: result.riskScore * 0.6,
    contentRisk: result.contentAnalysis ? result.contentAnalysis.contentRiskScore : 0,
    sslSecurity: result.urlFeatures.hasHttps ? 20 : 80,
    externalIntelligence: result.virusTotalResult 
      ? (result.virusTotalResult.malicious / result.virusTotalResult.totalEngines) * 100 
      : 0,
  };

  // Default recommendations if not provided
  const recommendations = result.recommendations || [
    {
      id: 'default',
      type: result.threatLevel === 'safe' || result.threatLevel === 'low' ? 'success' : 'warning',
      title: result.threatLevel === 'safe' ? 'URL Appears Safe' : 'Exercise Caution',
      description: result.aiAnalysis,
    } as const
  ];

  // Default analysis steps if not provided
  const analysisSteps = result.analysisSteps || [
    { id: '1', name: 'URL Analysis', status: 'completed' as const, result: 'pass' as const, duration: 150 },
    { id: '2', name: 'AI Assessment', status: 'completed' as const, result: result.threatLevel === 'safe' ? 'pass' as const : 'warning' as const, duration: 800 },
  ];

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
            {/* Left: Animated Risk Score */}
            <div className="flex flex-col items-center gap-4">
              <AnimatedRiskScore 
                score={result.riskScore} 
                threatLevel={result.threatLevel}
                size="lg" 
              />
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
                <ExportOptions result={result} />
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

      {/* Detailed Analysis with Tabs */}
      {showDetails && (
        <Tabs defaultValue="overview" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="recommendations">Tips</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ThreatRadarChart 
                factors={threatFactors} 
                threatLevel={result.threatLevel} 
              />
              <SmartRecommendations 
                recommendations={recommendations}
                threatLevel={result.threatLevel}
              />
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="mt-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <AnalysisTimeline steps={analysisSteps} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
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

              {/* SSL Analysis */}
              {result.sslAnalysis && (
                <SSLAnalysisCard analysis={result.sslAnalysis} />
              )}

              {/* Redirect Chain */}
              {result.redirectAnalysis && (
                <RedirectChainCard analysis={result.redirectAnalysis} />
              )}

              {/* DNS Analysis */}
              {result.dnsAnalysis && (
                <DNSAnalysisCard analysis={result.dnsAnalysis} />
              )}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="mt-6">
            <SmartRecommendations 
              recommendations={recommendations}
              threatLevel={result.threatLevel}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Timestamp */}
      <p className="text-center text-sm text-muted-foreground">
        Analysis completed at {new Date(result.timestamp).toLocaleString()}
      </p>
    </div>
  );
}