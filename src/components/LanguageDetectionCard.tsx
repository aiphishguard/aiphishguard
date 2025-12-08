import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Languages, AlertTriangle, Check } from 'lucide-react';
import type { LanguageDetection } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface LanguageDetectionCardProps {
  detection: LanguageDetection;
}

export function LanguageDetectionCard({ detection }: LanguageDetectionCardProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          Language Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Detected Language */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
          <div>
            <p className="text-sm text-muted-foreground">Detected Language</p>
            <p className="text-xl font-bold">{detection.language}</p>
          </div>
          <Badge variant="outline" className="font-mono text-lg px-3 py-1">
            {detection.languageCode.toUpperCase()}
          </Badge>
        </div>

        {/* Confidence */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-bold">{detection.confidence}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${detection.confidence}%` }}
            />
          </div>
        </div>

        {/* Language Mismatch Warning */}
        {detection.isLanguageMismatch ? (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Language Mismatch Detected</p>
              <p className="text-sm text-muted-foreground">
                Expected language based on domain TLD: <strong>{detection.expectedLanguage}</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This could indicate a phishing site impersonating a legitimate service.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-threat-safe/10 border border-threat-safe/20">
            <Check className="h-5 w-5 text-threat-safe" />
            <p className="text-sm">
              Language matches expected region for this domain.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
