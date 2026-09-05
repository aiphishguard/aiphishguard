import { Check, Loader2, AlertTriangle, Circle } from "lucide-react";
import type { AnalysisStep } from "@/types/analysis";
import { cn } from "@/lib/utils";

export function AnalysisTimeline({ steps }: { steps: AnalysisStep[] }) {
  return (
    <ol className="space-y-2">
      {steps.map((s, i) => (
        <li
          key={s.id}
          className={cn(
            "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-all",
            s.status === "running" && "border-primary/40 bg-primary/5 glow-ring",
            s.status === "done" && "border-border/60 bg-secondary/30",
            s.status === "warn" && "border-[hsl(var(--threat-medium)/0.4)] bg-[hsl(var(--threat-medium)/0.08)]",
            s.status === "pending" && "border-transparent opacity-40",
          )}
        >
          <span className="flex h-6 w-6 items-center justify-center">
            {s.status === "running" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            {s.status === "done" && <Check className="h-4 w-4 text-primary" />}
            {s.status === "warn" && <AlertTriangle className="h-4 w-4 text-[hsl(var(--threat-medium))]" />}
            {s.status === "pending" && <Circle className="h-3 w-3 text-muted-foreground" />}
          </span>
          <span className="flex-1 font-medium">{s.label}</span>
          <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
        </li>
      ))}
    </ol>
  );
}
