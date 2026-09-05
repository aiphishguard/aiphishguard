import type { ThreatLevel } from "@/types/analysis";

export const LEVEL_META: Record<
  ThreatLevel,
  { label: string; hint: string; color: string; bg: string }
> = {
  safe: { label: "Safe", hint: "No material phishing indicators", color: "hsl(var(--threat-safe))", bg: "hsl(var(--threat-safe) / 0.12)" },
  low: { label: "Low", hint: "Minor anomalies — stay alert", color: "hsl(var(--threat-low))", bg: "hsl(var(--threat-low) / 0.12)" },
  medium: { label: "Medium", hint: "Treat as untrusted", color: "hsl(var(--threat-medium))", bg: "hsl(var(--threat-medium) / 0.12)" },
  high: { label: "High", hint: "Likely phishing — do not continue", color: "hsl(var(--threat-high))", bg: "hsl(var(--threat-high) / 0.12)" },
  critical: { label: "Critical", hint: "Active lure — do not interact", color: "hsl(var(--threat-critical))", bg: "hsl(var(--threat-critical) / 0.14)" },
};

export function levelColor(level: ThreatLevel) {
  return LEVEL_META[level].color;
}

export function scoreColor(score: number) {
  if (score >= 80) return "hsl(var(--threat-critical))";
  if (score >= 60) return "hsl(var(--threat-high))";
  if (score >= 40) return "hsl(var(--threat-medium))";
  if (score >= 20) return "hsl(var(--threat-low))";
  return "hsl(var(--threat-safe))";
}
