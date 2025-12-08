import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extractUrlFeatures, calculateUrlRiskScore, generateWarnings } from '@/lib/url-analyzer';
import type { AnalysisResult, ThreatLevel } from '@/types/analysis';
import { toast } from 'sonner';

interface UseAnalysisReturn {
  isAnalyzing: boolean;
  analysisProgress: number;
  currentStep: string;
  result: AnalysisResult | null;
  analyze: (url: string, options?: AnalysisOptions) => Promise<AnalysisResult | null>;
  reset: () => void;
}

interface AnalysisOptions {
  deepAnalysis?: boolean;
  virusTotalScan?: boolean;
}

export function useAnalysis(): UseAnalysisReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setCurrentStep('');
    setResult(null);
  }, []);

  const analyze = useCallback(async (url: string, options: AnalysisOptions = {}): Promise<AnalysisResult | null> => {
    const { deepAnalysis = true, virusTotalScan = false } = options;
    
    try {
      setIsAnalyzing(true);
      setResult(null);
      
      // Step 1: Extract URL features (20%)
      setCurrentStep('Extracting URL features...');
      setAnalysisProgress(10);
      
      const urlFeatures = extractUrlFeatures(url);
      const preliminaryScore = calculateUrlRiskScore(urlFeatures);
      const warnings = generateWarnings(urlFeatures);
      
      setAnalysisProgress(20);
      
      // Step 2: AI Analysis (60%)
      setCurrentStep('AI analyzing threat patterns...');
      
      const { data: aiData, error: aiError } = await supabase.functions.invoke('analyze-url', {
        body: { 
          url, 
          urlFeatures, 
          preliminaryScore,
          deepAnalysis 
        }
      });
      
      if (aiError) {
        console.error('AI analysis error:', aiError);
        throw new Error('AI analysis failed');
      }
      
      setAnalysisProgress(60);
      
      let contentAnalysis = undefined;
      let languageDetection = undefined;
      
      // Step 3: Deep Content Analysis (80%)
      if (deepAnalysis) {
        setCurrentStep('Analyzing webpage content...');
        
        const { data: contentData, error: contentError } = await supabase.functions.invoke('content-analysis', {
          body: { url }
        });
        
        if (!contentError && contentData) {
          contentAnalysis = contentData.contentAnalysis;
          languageDetection = contentData.languageDetection;
        }
      }
      
      setAnalysisProgress(80);
      
      // Step 4: VirusTotal Scan (optional, 95%)
      let virusTotalResult = undefined;
      if (virusTotalScan) {
        setCurrentStep('Scanning with VirusTotal...');
        
        const { data: vtData, error: vtError } = await supabase.functions.invoke('virustotal-scan', {
          body: { url }
        });
        
        if (!vtError && vtData) {
          virusTotalResult = vtData;
        }
      }
      
      setAnalysisProgress(95);
      
      // Step 5: Compile results (100%)
      setCurrentStep('Compiling analysis report...');
      
      const threatLevel = aiData.threatLevel as ThreatLevel;
      const confidence = aiData.confidence || 85;
      const riskScore = aiData.riskScore || preliminaryScore;
      
      // Merge warnings
      const allWarnings = [...warnings];
      if (aiData.additionalWarnings) {
        allWarnings.push(...aiData.additionalWarnings);
      }
      
      const analysisResult: AnalysisResult = {
        id: crypto.randomUUID(),
        url,
        threatLevel,
        confidence,
        riskScore,
        urlFeatures,
        contentAnalysis,
        languageDetection,
        virusTotalResult,
        aiAnalysis: aiData.analysis || 'No analysis available',
        warnings: allWarnings,
        timestamp: new Date().toISOString(),
      };
      
      setAnalysisProgress(100);
      setResult(analysisResult);
      setCurrentStep('Analysis complete');
      
      return analysisResult;
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed. Please try again.');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    isAnalyzing,
    analysisProgress,
    currentStep,
    result,
    analyze,
    reset,
  };
}
