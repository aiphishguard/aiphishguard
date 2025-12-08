import { useState, useCallback } from 'react';
import { Upload, FileText, X, Play, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BulkUrlScannerProps {
  onStartScan: (urls: string[]) => void;
  isScanning: boolean;
  progress: number;
  currentUrl?: string;
}

const MAX_URLS = 50;

export function BulkUrlScanner({ 
  onStartScan, 
  isScanning, 
  progress,
  currentUrl 
}: BulkUrlScannerProps) {
  const [urls, setUrls] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const parseUrls = (text: string): string[] => {
    const lines = text.split(/[\n,]/).map(line => line.trim());
    const validUrls: string[] = [];
    
    for (const line of lines) {
      if (!line) continue;
      try {
        // Add protocol if missing
        const urlWithProtocol = line.startsWith('http') ? line : `https://${line}`;
        new URL(urlWithProtocol);
        validUrls.push(urlWithProtocol);
      } catch {
        // Skip invalid URLs
      }
    }
    
    return [...new Set(validUrls)]; // Remove duplicates
  };

  const handleTextChange = (value: string) => {
    setTextInput(value);
    const parsed = parseUrls(value);
    setUrls(parsed.slice(0, MAX_URLS));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleFile = (file: File) => {
    const validTypes = ['text/plain', 'text/csv', 'application/csv'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
      toast.error('Please upload a .txt or .csv file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      handleTextChange(content);
    };
    reader.readAsText(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const removeUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const clearAll = () => {
    setUrls([]);
    setTextInput('');
  };

  const handleStartScan = () => {
    if (urls.length === 0) {
      toast.error('Please add at least one URL to scan');
      return;
    }
    onStartScan(urls);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Bulk URL Scanner
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload a file or paste URLs to scan multiple websites at once (max {MAX_URLS})
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-secondary">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Drop your file here</p>
              <p className="text-sm text-muted-foreground">
                or click to upload (.txt, .csv)
              </p>
            </div>
            <input
              type="file"
              accept=".txt,.csv"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Browse Files
              </label>
            </Button>
          </div>
        </div>

        {/* Manual Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Or paste URLs (one per line or comma-separated)
          </label>
          <Textarea
            placeholder="https://example.com&#10;https://another-site.com&#10;suspicious-domain.xyz"
            value={textInput}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={5}
            className="font-mono text-sm"
            disabled={isScanning}
          />
        </div>

        {/* URL Preview */}
        {urls.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                URLs to scan ({urls.length}/{MAX_URLS})
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAll}
                disabled={isScanning}
              >
                Clear All
              </Button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 p-2 bg-secondary/30 rounded-lg">
              {urls.map((url, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between gap-2 p-2 bg-background/50 rounded text-sm"
                >
                  <span className="font-mono truncate flex-1">{url}</span>
                  {!isScanning && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 shrink-0"
                      onClick={() => removeUrl(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        {isScanning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Scanning...</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            {currentUrl && (
              <p className="text-xs text-muted-foreground font-mono truncate">
                Current: {currentUrl}
              </p>
            )}
          </div>
        )}

        {/* Start Button */}
        <Button 
          onClick={handleStartScan}
          disabled={urls.length === 0 || isScanning}
          className="w-full gradient-primary"
          size="lg"
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning {urls.length} URLs...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Bulk Scan ({urls.length} URLs)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
