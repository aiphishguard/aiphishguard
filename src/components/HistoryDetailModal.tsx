import { X, RefreshCw, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThreatLevelBadge } from './ThreatLevelBadge';
import { AnimatedRiskScore } from './AnimatedRiskScore';
import { ExportOptions } from './ExportOptions';
import { UrlFeaturesGrid } from './UrlFeaturesGrid';
import { ContentAnalysisCard } from './ContentAnalysisCard';
import { LanguageDetectionCard } from './LanguageDetectionCard';
import { VirusTotalCard } from './VirusTotalCard';
import { SSLAnalysisCard } from './SSLAnalysisCard';
import { RedirectChainCard } from './RedirectChainCard';
import { DNSAnalysisCard } from './DNSAnalysisCard';
import type { AnalysisResult, ThreatLevel } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
  onRescan?: (url: string) => void;
}

export function HistoryDetailModal({ 
  isOpen, 
  onClose, 
  result,
  onRescan 
}: HistoryDetailModalProps) {
  if (!result) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl">Scan Details</DialogTitle>
              <p className="font-mono text-sm text-muted-foreground break-all pr-8">
                {result.url}
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="px-6 pb-6 space-y-6">
            {/* Header Stats */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-secondary/30 rounded-xl">
              <AnimatedRiskScore 
                score={result.riskScore} 
                threatLevel={result.threatLevel}
                size="md"
                animate={false}
              />
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <ThreatLevelBadge level={result.threatLevel} size="lg" />
                  <Badge variant="outline">
                    {result.confidence}% confidence
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Scanned on {new Date(result.timestamp).toLocaleString()}
                </p>
                
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {onRescan && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onRescan(result.url)}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Rescan
                    </Button>
                  )}
                  <ExportOptions result={result} size="sm" />
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit URL
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.aiAnalysis}
              </p>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">
                  Detected Issues ({result.warnings.length})
                </h3>
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

            <Separator />

            {/* Detailed Analysis Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <UrlFeaturesGrid features={result.urlFeatures} />
              
              {result.contentAnalysis && (
                <ContentAnalysisCard analysis={result.contentAnalysis} />
              )}
              
              {result.languageDetection && (
                <LanguageDetectionCard detection={result.languageDetection} />
              )}
              
              {result.virusTotalResult && (
                <VirusTotalCard result={result.virusTotalResult} />
              )}
              
              {result.sslAnalysis && (
                <SSLAnalysisCard analysis={result.sslAnalysis} />
              )}
              
              {result.redirectAnalysis && (
                <RedirectChainCard analysis={result.redirectAnalysis} />
              )}
              
              {result.dnsAnalysis && (
                <DNSAnalysisCard analysis={result.dnsAnalysis} />
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
