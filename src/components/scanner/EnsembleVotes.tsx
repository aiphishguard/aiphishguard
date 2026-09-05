import type { ModelVote } from "@/types/analysis";
import { cn } from "@/lib/utils";

const VERDICT = {
  benign: "text-[hsl(var(--threat-safe))] bg-[hsl(var(--threat-safe)/0.12)]",
  suspicious: "text-[hsl(var(--threat-medium))] bg-[hsl(var(--threat-medium)/0.12)]",
  malicious: "text-[hsl(var(--threat-critical))] bg-[hsl(var(--threat-critical)/0.12)]",
};

export function EnsembleVotes({ votes }: { votes: ModelVote[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {votes.map((v) => (
        <div key={v.id} className="rounded-lg border border-border/70 bg-secondary/20 p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-display text-xs tracking-wide">{v.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{v.role}</div>
            </div>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", VERDICT[v.verdict])}>
              {v.verdict}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
              style={{ width: `${v.score}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{v.reasoning}</p>
        </div>
      ))}
    </div>
  );
}
