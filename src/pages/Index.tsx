import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AnalysisResults } from "@/components/scanner/AnalysisResults";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useScanHistory } from "@/hooks/useScanHistory";
import { useCallback } from "react";
import type { AnalysisResult } from "@/types/analysis";
import { Seo } from "@/components/layout/Seo";

export default function Index() {
  const { add } = useScanHistory();
  const onComplete = useCallback((r: AnalysisResult) => add(r), [add]);
  const { url, setUrl, loading, steps, result, run } = useAnalysis(onComplete);

  return (
    <>
      <Seo title="Scan" description="Ensemble phishing URL scanner with live DNS and explainable risk." />
      <HeroSection url={url} setUrl={setUrl} loading={loading} onScan={run} steps={steps} />
      {result && (
        <div className="container pb-8">
          <AnalysisResults result={result} />
        </div>
      )}
      <HowItWorks />
      <FeaturesSection />
    </>
  );
}
