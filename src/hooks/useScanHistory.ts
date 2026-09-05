import { useCallback, useEffect, useMemo, useState } from "react";
import type { AnalysisResult, ThreatLevel } from "@/types/analysis";
import { clearHistory, loadHistory, pushHistory, saveHistory } from "@/lib/storage";

export function useScanHistory() {
  const [items, setItems] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  const add = useCallback((item: AnalysisResult) => {
    setItems(pushHistory(item));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.id !== id);
      saveHistory(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setItems([]);
  }, []);

  const stats = useMemo(() => {
    const byLevel: Record<ThreatLevel, number> = { safe: 0, low: 0, medium: 0, high: 0, critical: 0 };
    for (const i of items) byLevel[i.threatLevel]++;
    const avg = items.length ? Math.round(items.reduce((a, b) => a + b.riskScore, 0) / items.length) : 0;
    return { total: items.length, byLevel, avg };
  }, [items]);

  return { items, add, remove, clear, stats };
}
