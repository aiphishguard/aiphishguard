import { useState } from 'react';
import { Search, Shield, Loader2, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface UrlScannerProps {
  onAnalyze: (url: string, options: { deepAnalysis: boolean; virusTotalScan: boolean }) => void;
  isAnalyzing: boolean;
  progress: number;
  currentStep: string;
}

export function UrlScanner({ onAnalyze, isAnalyzing, progress, currentStep }: UrlScannerProps) {
  const [url, setUrl] = useState('');
  const [deepAnalysis, setDeepAnalysis] = useState(true);
  const [virusTotalScan, setVirusTotalScan] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim(), { deepAnalysis, virusTotalScan });
    }
  };

  const exampleUrls = [
    'https://secure-paypal-login.xyz/verify',
    'https://www.google.com',
    'http://192.168.1.1/login',
    'https://amaz0n-security.tk/account',
  ];

  return (
    <Card className="glass-card overflow-hidden">
      <div className="h-1 w-full gradient-primary" />
      <CardContent className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary animate-pulse-slow" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Scan URL for Threats
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter a URL to analyze for phishing attempts, malware, and other security threats using AI-powered detection.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter URL to analyze (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isAnalyzing}
              className="pl-12 h-14 text-base md:text-lg bg-secondary/50 border-2 focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="deepAnalysis"
                checked={deepAnalysis}
                onCheckedChange={(checked) => setDeepAnalysis(checked as boolean)}
                disabled={isAnalyzing}
              />
              <Label 
                htmlFor="deepAnalysis" 
                className="text-sm font-medium cursor-pointer flex items-center gap-2"
              >
                <Zap className="h-4 w-4 text-primary" />
                Deep Content Analysis
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="virusTotalScan"
                checked={virusTotalScan}
                onCheckedChange={(checked) => setVirusTotalScan(checked as boolean)}
                disabled={isAnalyzing}
              />
              <Label 
                htmlFor="virusTotalScan" 
                className="text-sm font-medium cursor-pointer flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4 text-warning" />
                VirusTotal Scan
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!url.trim() || isAnalyzing}
            className={cn(
              "w-full h-14 text-lg font-semibold transition-all",
              "gradient-primary hover:opacity-90"
            )}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-5 w-5" />
                Analyze URL
              </>
            )}
          </Button>
        </form>

        {isAnalyzing && (
          <div className="mt-6 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{currentStep}</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-3 text-center">
            Try an example:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {exampleUrls.map((exampleUrl) => (
              <Button
                key={exampleUrl}
                variant="outline"
                size="sm"
                onClick={() => setUrl(exampleUrl)}
                disabled={isAnalyzing}
                className="text-xs font-mono truncate max-w-[200px]"
              >
                {exampleUrl.replace('https://', '').replace('http://', '')}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
