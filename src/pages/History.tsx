import { useMemo, useState } from "react";
import { Trash2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScanHistory } from "@/hooks/useScanHistory";
import { toCsv, toJson } from "@/lib/export-utils";
import { relativeTime } from "@/lib/utils";
import type { ThreatLevel } from "@/types/analysis";
import { AnalysisResults } from "@/components/scanner/AnalysisResults";
import { Seo } from "@/components/layout/Seo";

export default function History() {
  const { items, remove, clear } = useScanHistory();
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        const match = i.url.toLowerCase().includes(q.toLowerCase()) || i.features.hostname.includes(q.toLowerCase());
        const lvl = level === "all" || i.threatLevel === level;
        return match && lvl;
      }),
    [items, q, level],
  );

  const selected = items.find((i) => i.id === open);

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-display text-xs tracking-[0.28em] text-primary">ARCHIVE</div>
          <h1 className="mt-1 font-display text-3xl tracking-wide">Scan history</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toJson(filtered)} disabled={!filtered.length}>
            JSON
          </Button>
          <Button variant="outline" size="sm" onClick={() => toCsv(filtered)} disabled={!filtered.length}>
            CSV
          </Button>
          <Button variant="destructive" size="sm" onClick={clear} disabled={!items.length}>
            <Trash2 /> Clear
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Filter by URL or host" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            {(["safe", "low", "medium", "high", "critical"] as ThreatLevel[]).map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 space-y-2">
        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">No scans stored on this device.</CardContent>
          </Card>
        )}
        {filtered.map((i) => (
          <button
            key={i.id}
            onClick={() => setOpen(open === i.id ? null : i.id)}
            className="glass flex w-full items-center gap-4 rounded-xl p-4 text-left hover:border-primary/40"
          >
            <div className="font-display text-2xl w-12" style={{ color: `hsl(var(--threat-${i.threatLevel}))` }}>
              {i.riskScore}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-sm">{i.normalizedUrl}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{relativeTime(i.scannedAt)} · {i.features.registrableDomain}</div>
            </div>
            <Badge variant={i.threatLevel}>{i.threatLevel}</Badge>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                remove(i.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-8">
          <AnalysisResults result={selected} />
        </div>
      )}
    </div>
  );
}
