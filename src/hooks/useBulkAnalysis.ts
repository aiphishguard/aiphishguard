import { useCallback, useState } from "react";
import type { AnalysisResult } from "@/types/analysis";
import { analyzeUrl } from "@/lib/url-analyzer";
import { validateUrl } from "@/lib/url-validation";

export function parseUrlList(text: string) {
  return text
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);
}

export function useBulkAnalysis(onEach?: (r: AnalysisResult) => void) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const run = useCallback(
    async (lines: string[]) => {
      const urls = lines.map((l) => validateUrl(l)).filter((v) => v.ok);
      setRunning(true);
      setResults([]);
      setProgress({ done: 0, total: urls.length });
      const out: AnalysisResult[] = [];
      for (const u of urls) {
        try {
          const r = await analyzeUrl(u.normalized!, { skipDns: urls.length > 5 });
          out.push(r);
          onEach?.(r);
          setResults([...out]);
        } catch {
          /* skip */
        }
        setProgress({ done: out.length, total: urls.length });
      }
      setRunning(false);
      return out;
    },
    [onEach],
  );

  return { running, progress, results, run, setResults };
}
