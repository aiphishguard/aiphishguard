import { useCallback, useState } from "react";
import type { AnalysisResult, AnalysisStep } from "@/types/analysis";
import { analyzeUrl } from "@/lib/url-analyzer";
import { validateUrl } from "@/lib/url-validation";
import { toast } from "@/hooks/use-toast";

export function useAnalysis(onComplete?: (r: AnalysisResult) => void) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<AnalysisStep[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (value?: string) => {
      const target = (value ?? url).trim();
      const v = validateUrl(target);
      if (!v.ok) {
        setError(v.error ?? "Invalid URL");
        toast({ title: "Cannot scan", description: v.error, variant: "destructive" });
        return;
      }
      setError(null);
      setLoading(true);
      setResult(null);
      setUrl(v.normalized ?? target);
      try {
        const r = await analyzeUrl(v.normalized ?? target, { onStep: setSteps });
        setResult(r);
        onComplete?.(r);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Analysis failed";
        setError(msg);
        toast({ title: "Scan failed", description: msg, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    },
    [url, onComplete],
  );

  const reset = useCallback(() => {
    setResult(null);
    setSteps([]);
    setError(null);
    setLoading(false);
  }, []);

  return { url, setUrl, loading, steps, result, error, run, reset, setResult };
}
