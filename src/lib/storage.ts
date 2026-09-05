import type { AnalysisResult, FeedbackPayload } from "@/types/analysis";
import { supabase } from "@/integrations/supabase/client";

const KEY = "phishguard.history.v1";
const FB = "phishguard.feedback.v1";
const MAX = 200;

export function loadHistory(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AnalysisResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: AnalysisResult[]) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
}

export function pushHistory(item: AnalysisResult) {
  const next = [item, ...loadHistory().filter((x) => x.id !== item.id)].slice(0, MAX);
  saveHistory(next);
  void syncRemote(item);
  return next;
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}

export function saveFeedback(payload: FeedbackPayload) {
  const all = JSON.parse(localStorage.getItem(FB) ?? "[]");
  all.unshift({ ...payload, createdAt: new Date().toISOString() });
  localStorage.setItem(FB, JSON.stringify(all.slice(0, 50)));
}

async function syncRemote(item: AnalysisResult) {
  if (!supabase) return;
  try {
    await supabase.from("scan_history").insert({
      url: item.url,
      threat_level: item.threatLevel,
      risk_score: item.riskScore,
      confidence: item.confidence,
      analysis: item.summary,
      url_features: item.features,
      threat_factors: item.threatFactors,
      warnings: item.warnings,
      analysis_steps: item.analysisSteps,
      scanned_at: item.scannedAt,
    });
  } catch {
    /* table may not exist — local history is source of truth */
  }
}
