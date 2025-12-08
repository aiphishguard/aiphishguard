import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extractUrlFeatures, calculateUrlRiskScore, generateWarnings } from '@/lib/url-analyzer';
import type { AnalysisResult, ThreatLevel, BulkScanItem, BulkScanSummary } from '@/types/analysis';
import { toast } from 'sonner';

interface UseBulkAnalysisReturn {
  items: BulkScanItem[];
  summary: BulkScanSummary;
  isScanning: boolean;
  progress: number;
  currentUrl: string;
  startBulkScan: (urls: string[]) => Promise<void>;
  rescanUrl: (url: string) => Promise<void>;
  reset: () => void;
}

const CONCURRENT_SCANS = 3;

export function useBulkAnalysis(): UseBulkAnalysisReturn {
  const [items, setItems] = useState<BulkScanItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');

  const calculateSummary = useCallback((scanItems: BulkScanItem[]): BulkScanSummary => {
    const completed = scanItems.filter(i => i.status === 'completed');
    const errors = scanItems.filter(i => i.status === 'error').length;
    
    const threatCounts = {
      safe: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    let totalRiskScore = 0;
    
    for (const item of completed) {
      if (item.result) {
        threatCounts[item.result.threatLevel]++;
        totalRiskScore += item.result.riskScore;
      }
    }

    return {
      totalUrls: scanItems.length,
      completed: completed.length,
      ...threatCounts,
      errors,
      averageRiskScore: completed.length > 0 ? totalRiskScore / completed.length : 0,
    };
  }, []);

  const [summary, setSummary] = useState<BulkScanSummary>({
    totalUrls: 0,
    completed: 0,
    safe: 0,
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
    errors: 0,
    averageRiskScore: 0,
  });

  const analyzeUrl = async (url: string): Promise<AnalysisResult | null> => {
    try {
      const urlFeatures = extractUrlFeatures(url);
      const preliminaryScore = calculateUrlRiskScore(urlFeatures);
      const warnings = generateWarnings(urlFeatures);

      const { data: aiData, error: aiError } = await supabase.functions.invoke('analyze-url', {
        body: { url, urlFeatures, preliminaryScore, deepAnalysis: false }
      });

      if (aiError) throw aiError;

      const threatLevel = aiData.threatLevel as ThreatLevel;
      const confidence = aiData.confidence || 85;
      const riskScore = aiData.riskScore || preliminaryScore;

      const allWarnings = [...warnings];
      if (aiData.additionalWarnings) {
        allWarnings.push(...aiData.additionalWarnings);
      }

      return {
        id: crypto.randomUUID(),
        url,
        threatLevel,
        confidence,
        riskScore,
        urlFeatures,
        aiAnalysis: aiData.analysis || 'No analysis available',
        warnings: allWarnings,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Bulk analysis error for', url, error);
      return null;
    }
  };

  const startBulkScan = useCallback(async (urls: string[]) => {
    setIsScanning(true);
    setProgress(0);

    // Initialize items
    const initialItems: BulkScanItem[] = urls.map(url => ({
      id: crypto.randomUUID(),
      url,
      status: 'pending',
    }));
    setItems(initialItems);

    const queue = [...initialItems];
    const results: BulkScanItem[] = [...initialItems];
    let completed = 0;

    const processUrl = async (item: BulkScanItem): Promise<void> => {
      const index = results.findIndex(i => i.id === item.id);
      
      // Update status to scanning
      results[index] = { ...item, status: 'scanning' };
      setItems([...results]);
      setCurrentUrl(item.url);

      const result = await analyzeUrl(item.url);

      if (result) {
        results[index] = { ...item, status: 'completed', result };
      } else {
        results[index] = { ...item, status: 'error', error: 'Analysis failed' };
      }

      completed++;
      setItems([...results]);
      setProgress((completed / urls.length) * 100);
      setSummary(calculateSummary(results));
    };

    // Process URLs in batches using index tracking
    let currentIndex = 0;
    
    const batchProcess = async () => {
      const batch = initialItems.slice(currentIndex, currentIndex + CONCURRENT_SCANS);
      
      if (batch.length === 0) return;
      
      currentIndex += batch.length;
      
      await Promise.all(batch.map(processUrl));

      // Process next batch if there are more items
      if (currentIndex < initialItems.length) {
        await batchProcess();
      }
    };

    try {
      await batchProcess();
      toast.success(`Bulk scan complete! ${completed} URLs analyzed.`);
    } catch (error) {
      console.error('Bulk scan error:', error);
      toast.error('Bulk scan encountered errors');
    } finally {
      setIsScanning(false);
      setCurrentUrl('');
    }
  }, [calculateSummary]);

  const rescanUrl = useCallback(async (url: string) => {
    const index = items.findIndex(i => i.url === url);
    if (index === -1) return;

    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], status: 'scanning' };
    setItems(updatedItems);

    const result = await analyzeUrl(url);

    if (result) {
      updatedItems[index] = { ...updatedItems[index], status: 'completed', result };
    } else {
      updatedItems[index] = { ...updatedItems[index], status: 'error', error: 'Rescan failed' };
    }

    setItems(updatedItems);
    setSummary(calculateSummary(updatedItems));
  }, [items, calculateSummary]);

  const reset = useCallback(() => {
    setItems([]);
    setIsScanning(false);
    setProgress(0);
    setCurrentUrl('');
    setSummary({
      totalUrls: 0,
      completed: 0,
      safe: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
      errors: 0,
      averageRiskScore: 0,
    });
  }, []);

  return {
    items,
    summary,
    isScanning,
    progress,
    currentUrl,
    startBulkScan,
    rescanUrl,
    reset,
  };
}
