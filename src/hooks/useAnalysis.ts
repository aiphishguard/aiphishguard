import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extractUrlFeatures, calculateUrlRiskScore, generateWarnings } from '@/lib/url-analyzer';
import type { 
  AnalysisResult, 
  ThreatLevel, 
  AnalysisStep, 
  ThreatFactors, 
  Recommendation,
  SSLAnalysis,
  RedirectAnalysis,
  DNSAnalysis
} from '@/types/analysis';
import { toast } from 'sonner';

interface UseAnalysisReturn {
  isAnalyzing: boolean;
  analysisProgress: number;
  currentStep: string;
  result: AnalysisResult | null;
  analysisSteps: AnalysisStep[];
  analyze: (url: string, options?: AnalysisOptions) => Promise<AnalysisResult | null>;
  reset: () => void;
}

interface AnalysisOptions {
  deepAnalysis?: boolean;
  virusTotalScan?: boolean;
  sslAnalysis?: boolean;
  redirectAnalysis?: boolean;
  dnsAnalysis?: boolean;
}

const createStep = (id: string, name: string): AnalysisStep => ({
  id,
  name,
  status: 'pending',
});

export function useAnalysis(): UseAnalysisReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);

  const updateStep = (stepId: string, updates: Partial<AnalysisStep>) => {
    setAnalysisSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setCurrentStep('');
    setResult(null);
    setAnalysisSteps([]);
  }, []);

  const generateRecommendations = (
    threatLevel: ThreatLevel, 
    warnings: string[],
    hasSSLIssues: boolean,
    hasRedirectIssues: boolean
  ): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    if (threatLevel === 'critical' || threatLevel === 'high') {
      recommendations.push({
        id: 'avoid-url',
        type: 'danger',
        title: 'Avoid This URL',
        description: 'This URL shows strong indicators of being malicious. Do not enter any personal information.',
        action: 'Report this URL',
      });
    }

    if (threatLevel === 'medium') {
      recommendations.push({
        id: 'proceed-caution',
        type: 'warning',
        title: 'Proceed with Caution',
        description: 'This URL has some suspicious characteristics. Verify its legitimacy before interacting.',
      });
    }

    if (hasSSLIssues) {
      recommendations.push({
        id: 'ssl-warning',
        type: 'warning',
        title: 'SSL Certificate Issues',
        description: 'The SSL certificate has issues that could indicate security problems.',
      });
    }

    if (hasRedirectIssues) {
      recommendations.push({
        id: 'redirect-warning',
        type: 'warning',
        title: 'Suspicious Redirect Chain',
        description: 'This URL uses multiple redirects or URL shorteners which is a common phishing tactic.',
      });
    }

    if (warnings.some(w => w.toLowerCase().includes('brand'))) {
      recommendations.push({
        id: 'brand-impersonation',
        type: 'danger',
        title: 'Possible Brand Impersonation',
        description: 'This URL may be impersonating a well-known brand. Verify you are on the official website.',
      });
    }

    if (threatLevel === 'safe' || threatLevel === 'low') {
      recommendations.push({
        id: 'looks-safe',
        type: 'success',
        title: 'URL Appears Safe',
        description: 'No major threats detected, but always stay vigilant when entering personal information online.',
      });
    }

    recommendations.push({
      id: 'general-tip',
      type: 'info',
      title: 'Security Best Practice',
      description: 'Always verify URLs before entering sensitive information. Look for HTTPS and check the domain spelling.',
    });

    return recommendations;
  };

  const calculateThreatFactors = (
    urlFeatures: any,
    contentAnalysis: any,
    sslAnalysis: SSLAnalysis | undefined,
    virusTotalResult: any
  ): ThreatFactors => {
    // URL Structure (based on url features)
    let urlStructure = 0;
    if (urlFeatures.hasPhishingKeywords) urlStructure += 30;
    if (urlFeatures.hasBrandImpersonation) urlStructure += 25;
    if (urlFeatures.hasIpAddress) urlStructure += 20;
    if (urlFeatures.hasSuspiciousTld) urlStructure += 15;
    if (urlFeatures.urlEntropy > 4) urlStructure += 10;
    urlStructure = Math.min(urlStructure, 100);

    // Domain Reputation (based on various signals)
    let domainReputation = 0;
    if (urlFeatures.hasUrlShortener) domainReputation += 25;
    if (urlFeatures.hasPunycode) domainReputation += 30;
    if (urlFeatures.hasExcessiveSubdomains) domainReputation += 20;
    if (!urlFeatures.hasHttps) domainReputation += 25;
    domainReputation = Math.min(domainReputation, 100);

    // Content Risk
    let contentRisk = 0;
    if (contentAnalysis) {
      if (contentAnalysis.passwordFieldCount > 0) contentRisk += 30;
      if (contentAnalysis.suspiciousScripts > 0) contentRisk += 25;
      if (contentAnalysis.iframeCount > 2) contentRisk += 20;
      contentRisk = Math.min(contentAnalysis.contentRiskScore || contentRisk, 100);
    }

    // SSL Security
    let sslSecurity = 0;
    if (!urlFeatures.hasHttps) {
      sslSecurity = 80;
    } else if (sslAnalysis) {
      if (!sslAnalysis.isValid) sslSecurity += 50;
      if (sslAnalysis.isFreeSSL) sslSecurity += 15;
      if (sslAnalysis.certificateAge < 30) sslSecurity += 25;
      if (sslAnalysis.daysUntilExpiry < 30) sslSecurity += 20;
      sslSecurity = Math.min(sslSecurity, 100);
    }

    // External Intelligence (VirusTotal)
    let externalIntelligence = 0;
    if (virusTotalResult) {
      const maliciousRatio = virusTotalResult.malicious / virusTotalResult.totalEngines;
      externalIntelligence = Math.round(maliciousRatio * 100);
    }

    return {
      urlStructure,
      domainReputation,
      contentRisk,
      sslSecurity,
      externalIntelligence,
    };
  };

  const analyze = useCallback(async (url: string, options: AnalysisOptions = {}): Promise<AnalysisResult | null> => {
    const { 
      deepAnalysis = true, 
      virusTotalScan = false,
      sslAnalysis: runSSL = true,
      redirectAnalysis: runRedirect = true,
      dnsAnalysis: runDNS = true,
    } = options;
    
    try {
      setIsAnalyzing(true);
      setResult(null);
      
      // Initialize analysis steps
      const steps: AnalysisStep[] = [
        createStep('url-features', 'URL Feature Extraction'),
        createStep('ai-analysis', 'AI Threat Analysis'),
      ];
      
      if (deepAnalysis) steps.push(createStep('content-analysis', 'Content Analysis'));
      if (runSSL) steps.push(createStep('ssl-analysis', 'SSL Certificate Analysis'));
      if (runRedirect) steps.push(createStep('redirect-analysis', 'Redirect Chain Analysis'));
      if (runDNS) steps.push(createStep('dns-analysis', 'DNS Record Analysis'));
      if (virusTotalScan) steps.push(createStep('virustotal', 'VirusTotal Scan'));
      steps.push(createStep('compile', 'Compiling Results'));
      
      setAnalysisSteps(steps);

      // Step 1: Extract URL features
      const urlFeaturesStart = Date.now();
      setCurrentStep('Extracting URL features...');
      updateStep('url-features', { status: 'running', startTime: urlFeaturesStart });
      setAnalysisProgress(5);
      
      const urlFeatures = extractUrlFeatures(url);
      const preliminaryScore = calculateUrlRiskScore(urlFeatures);
      const warnings = generateWarnings(urlFeatures);
      
      const urlFeaturesEnd = Date.now();
      updateStep('url-features', { 
        status: 'completed', 
        endTime: urlFeaturesEnd,
        duration: urlFeaturesEnd - urlFeaturesStart,
        result: warnings.length > 0 ? 'warning' : 'pass',
        details: `Extracted ${Object.keys(urlFeatures).length} features. Preliminary score: ${preliminaryScore}`,
      });
      setAnalysisProgress(15);
      
      // Step 2: AI Analysis
      const aiStart = Date.now();
      setCurrentStep('AI analyzing threat patterns...');
      updateStep('ai-analysis', { status: 'running', startTime: aiStart });
      
      const { data: aiData, error: aiError } = await supabase.functions.invoke('analyze-url', {
        body: { url, urlFeatures, preliminaryScore, deepAnalysis }
      });
      
      const aiEnd = Date.now();
      if (aiError) {
        updateStep('ai-analysis', { status: 'failed', endTime: aiEnd, duration: aiEnd - aiStart, result: 'fail' });
        throw new Error('AI analysis failed');
      }
      
      updateStep('ai-analysis', { 
        status: 'completed', 
        endTime: aiEnd,
        duration: aiEnd - aiStart,
        result: aiData.threatLevel === 'safe' || aiData.threatLevel === 'low' ? 'pass' : 'warning',
        details: `Threat level: ${aiData.threatLevel}, Confidence: ${aiData.confidence}%`,
      });
      setAnalysisProgress(30);
      
      let contentAnalysis = undefined;
      let languageDetection = undefined;
      let sslAnalysisResult: SSLAnalysis | undefined = undefined;
      let redirectAnalysisResult: RedirectAnalysis | undefined = undefined;
      let dnsAnalysisResult: DNSAnalysis | undefined = undefined;
      
      // Run parallel analyses
      const parallelPromises: Promise<any>[] = [];
      
      // Content Analysis
      if (deepAnalysis) {
        const contentStart = Date.now();
        setCurrentStep('Analyzing webpage content...');
        updateStep('content-analysis', { status: 'running', startTime: contentStart });
        
        parallelPromises.push(
          supabase.functions.invoke('content-analysis', { body: { url } })
            .then(({ data, error }) => {
              const contentEnd = Date.now();
              if (!error && data) {
                contentAnalysis = data.contentAnalysis;
                languageDetection = data.languageDetection;
                updateStep('content-analysis', { 
                  status: 'completed', 
                  endTime: contentEnd,
                  duration: contentEnd - contentStart,
                  result: data.contentAnalysis?.contentRiskScore > 50 ? 'warning' : 'pass',
                  details: `Forms: ${data.contentAnalysis?.formCount || 0}, Scripts: ${data.contentAnalysis?.scriptCount || 0}`,
                });
              } else {
                updateStep('content-analysis', { status: 'failed', endTime: contentEnd, duration: contentEnd - contentStart, result: 'fail' });
              }
            })
        );
      }

      // SSL Analysis
      if (runSSL) {
        const sslStart = Date.now();
        updateStep('ssl-analysis', { status: 'running', startTime: sslStart });
        
        parallelPromises.push(
          supabase.functions.invoke('ssl-analysis', { body: { url } })
            .then(({ data, error }) => {
              const sslEnd = Date.now();
              if (!error && data) {
                sslAnalysisResult = data;
                updateStep('ssl-analysis', { 
                  status: 'completed', 
                  endTime: sslEnd,
                  duration: sslEnd - sslStart,
                  result: data.riskLevel === 'high' ? 'fail' : data.riskLevel === 'medium' ? 'warning' : 'pass',
                  details: `${data.isValid ? 'Valid' : 'Invalid'} certificate, expires in ${data.daysUntilExpiry} days`,
                });
              } else {
                updateStep('ssl-analysis', { status: 'failed', endTime: sslEnd, duration: sslEnd - sslStart, result: 'fail' });
              }
            })
        );
      }

      // Redirect Analysis
      if (runRedirect) {
        const redirectStart = Date.now();
        updateStep('redirect-analysis', { status: 'running', startTime: redirectStart });
        
        parallelPromises.push(
          supabase.functions.invoke('redirect-analysis', { body: { url } })
            .then(({ data, error }) => {
              const redirectEnd = Date.now();
              if (!error && data) {
                redirectAnalysisResult = data;
                updateStep('redirect-analysis', { 
                  status: 'completed', 
                  endTime: redirectEnd,
                  duration: redirectEnd - redirectStart,
                  result: data.riskLevel === 'high' ? 'fail' : data.riskLevel === 'medium' ? 'warning' : 'pass',
                  details: `${data.totalRedirects} redirects, ${data.hasShortener ? 'URL shortener detected' : 'No shortener'}`,
                });
              } else {
                updateStep('redirect-analysis', { status: 'failed', endTime: redirectEnd, duration: redirectEnd - redirectStart, result: 'fail' });
              }
            })
        );
      }

      // DNS Analysis
      if (runDNS) {
        const dnsStart = Date.now();
        updateStep('dns-analysis', { status: 'running', startTime: dnsStart });
        
        parallelPromises.push(
          supabase.functions.invoke('dns-analysis', { body: { url } })
            .then(({ data, error }) => {
              const dnsEnd = Date.now();
              if (!error && data) {
                dnsAnalysisResult = data;
                updateStep('dns-analysis', { 
                  status: 'completed', 
                  endTime: dnsEnd,
                  duration: dnsEnd - dnsStart,
                  result: data.riskLevel === 'high' ? 'fail' : data.riskLevel === 'medium' ? 'warning' : 'pass',
                  details: `${data.aRecords?.length || 0} A records, MX: ${data.hasMxRecords ? 'Yes' : 'No'}, SPF: ${data.hasSpf ? 'Yes' : 'No'}`,
                });
              } else {
                updateStep('dns-analysis', { status: 'failed', endTime: dnsEnd, duration: dnsEnd - dnsStart, result: 'fail' });
              }
            })
        );
      }

      // Wait for parallel analyses
      await Promise.all(parallelPromises);
      setAnalysisProgress(70);
      
      // VirusTotal Scan (sequential as it may take longer)
      let virusTotalResult = undefined;
      if (virusTotalScan) {
        const vtStart = Date.now();
        setCurrentStep('Scanning with VirusTotal...');
        updateStep('virustotal', { status: 'running', startTime: vtStart });
        
        const { data: vtData, error: vtError } = await supabase.functions.invoke('virustotal-scan', {
          body: { url }
        });
        
        const vtEnd = Date.now();
        if (!vtError && vtData) {
          virusTotalResult = vtData;
          updateStep('virustotal', { 
            status: 'completed', 
            endTime: vtEnd,
            duration: vtEnd - vtStart,
            result: vtData.malicious > 0 ? 'fail' : 'pass',
            details: `${vtData.malicious} malicious, ${vtData.suspicious} suspicious out of ${vtData.totalEngines} engines`,
          });
        } else {
          updateStep('virustotal', { status: 'failed', endTime: vtEnd, duration: vtEnd - vtStart, result: 'fail' });
        }
      }
      
      setAnalysisProgress(90);
      
      // Step: Compile results
      const compileStart = Date.now();
      setCurrentStep('Compiling analysis report...');
      updateStep('compile', { status: 'running', startTime: compileStart });
      
      const threatLevel = aiData.threatLevel as ThreatLevel;
      const confidence = aiData.confidence || 85;
      const riskScore = aiData.riskScore || preliminaryScore;
      
      // Merge warnings
      const allWarnings = [...warnings];
      if (aiData.additionalWarnings) {
        allWarnings.push(...aiData.additionalWarnings);
      }

      // Calculate threat factors
      const threatFactors = calculateThreatFactors(urlFeatures, contentAnalysis, sslAnalysisResult, virusTotalResult);

      // Generate recommendations
      const recommendations = generateRecommendations(
        threatLevel, 
        allWarnings,
        sslAnalysisResult?.riskLevel === 'high' || sslAnalysisResult?.riskLevel === 'medium',
        redirectAnalysisResult?.hasSuspiciousPattern || redirectAnalysisResult?.hasShortener || false
      );
      
      const compileEnd = Date.now();
      updateStep('compile', { 
        status: 'completed', 
        endTime: compileEnd,
        duration: compileEnd - compileStart,
        result: 'pass',
        details: 'Analysis complete',
      });

      // Get final steps state
      const finalSteps = steps.map(step => {
        const current = analysisSteps.find(s => s.id === step.id);
        return current || step;
      });
      
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
        analysisSteps: finalSteps,
        threatFactors,
        recommendations,
        sslAnalysis: sslAnalysisResult,
        redirectAnalysis: redirectAnalysisResult,
        dnsAnalysis: dnsAnalysisResult,
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
    analysisSteps,
    analyze,
    reset,
  };
}