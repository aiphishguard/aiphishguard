import { Shield, Activity, Cpu } from "lucide-react";
import { UrlScanner } from "@/components/scanner/UrlScanner";
import { AnalysisTimeline } from "@/components/scanner/AnalysisTimeline";
import type { AnalysisStep } from "@/types/analysis";

export function HeroSection({
  url,
  setUrl,
  loading,
  onScan,
  steps,
}: {
  url: string;
  setUrl: (v: string) => void;
  loading: boolean;
  onScan: (v?: string) => void;
  steps: AnalysisStep[];
}) {
  return (
    <section className="relative overflow-hidden pb-8 pt-10 sm:pt-16">
      <div className="pointer-events-none absolute left-1/2 top-8 h-[420px] w-[420px] -translate-x-1/2">
        <div className="absolute inset-0 rounded-full border border-primary/15 animate-spin-slow" />
        <div className="absolute inset-8 rounded-full border border-accent/10 animate-orbit" />
        <div className="absolute inset-16 rounded-full bg-primary/5 blur-2xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-primary">
            <Activity className="h-3.5 w-3.5" />
            ENSEMBLE · 10 DETECTORS · LIVE DNS
          </div>
          <h1 className="font-display text-4xl leading-tight tracking-[0.08em] sm:text-6xl">
            SEE THE PHISH
            <span className="block text-cyber text-glow">BEFORE YOU CLICK</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            A security-operations console for URLs. Ten specialized models vote on typosquats,
            homographs, brand impersonation, kit patterns and DNS — then explain every point of risk.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <UrlScanner url={url} setUrl={setUrl} loading={loading} onScan={onScan} />
        </div>

        {loading && steps.length > 0 && (
          <div className="mx-auto mt-8 max-w-xl">
            <AnalysisTimeline steps={steps} />
          </div>
        )}

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-3 text-center">
          {[
            { icon: Shield, k: "40+", v: "URL features" },
            { icon: Cpu, k: "10", v: "voting models" },
            { icon: Activity, k: "<2s", v: "median scan" },
          ].map((s) => (
            <div key={s.v} className="glass rounded-xl px-3 py-4">
              <s.icon className="mx-auto mb-2 h-4 w-4 text-primary" />
              <div className="font-display text-xl tracking-widest text-foreground">{s.k}</div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
