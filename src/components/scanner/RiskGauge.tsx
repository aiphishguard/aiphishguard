import { useEffect, useState } from "react";
import { scoreColor } from "@/lib/threat";
import type { ThreatLevel } from "@/types/analysis";
import { LEVEL_META } from "@/lib/threat";

export function RiskGauge({ score, level, size = 220 }: { score: number; level: ThreatLevel; size?: number }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnim(Math.round(from + (score - from) * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  const r = 84;
  const c = 2 * Math.PI * r;
  const pct = anim / 100;
  const color = scoreColor(anim);
  const meta = LEVEL_META[level];

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="hsl(222 28% 16%)" strokeWidth="12" />
        <circle
          cx="100" cy="100" r={r} fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dashoffset 0.2s" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-5xl tabular-nums" style={{ color }}>
          {anim}
        </div>
        <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color }}>
          {meta.label}
        </div>
        <div className="mt-1 max-w-[9rem] text-center text-[10px] text-muted-foreground">{meta.hint}</div>
      </div>
    </div>
  );
}
