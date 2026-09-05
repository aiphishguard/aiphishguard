import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { parseUrlList, useBulkAnalysis } from "@/hooks/useBulkAnalysis";
import { useScanHistory } from "@/hooks/useScanHistory";
import { toCsv, toJson } from "@/lib/export-utils";
import { LEVEL_META } from "@/lib/threat";
import { Seo } from "@/components/layout/Seo";

const SAMPLE = `https://accounts.google.com
http://paypa1-secure-login.xyz/verify
https://appleid.apple.com
https://office365-login-secure.tk/auth
https://bit.ly/3xAccountReset
http://185.243.112.44/signin`;

export default function BulkScanner() {
  const [text, setText] = useState(SAMPLE);
  const { add } = useScanHistory();
  const { running, progress, results, run } = useBulkAnalysis(add);
  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="container py-10">
      <Seo title="Bulk scanner" />
      <div className="font-display text-xs tracking-[0.28em] text-primary">BATCH</div>
      <h1 className="mt-1 font-display text-3xl tracking-wide">Bulk scanner</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        One URL per line (commas and semicolons also work). Up to 50 targets. DNS is skipped after five URLs to keep the batch fast.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Target list</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea className="min-h-[260px] font-mono text-xs" value={text} onChange={(e) => setText(e.target.value)} />
            <div className="mt-4 flex gap-2">
              <Button variant="glow" disabled={running} onClick={() => run(parseUrlList(text))}>
                {running ? `Scanning ${progress.done}/${progress.total}` : `Scan ${parseUrlList(text).length} URLs`}
              </Button>
              <Button variant="outline" onClick={() => setText("")}>
                Clear
              </Button>
            </div>
            {running && <Progress className="mt-4" value={pct} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Results</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={!results.length} onClick={() => toJson(results)}>
                JSON
              </Button>
              <Button size="sm" variant="outline" disabled={!results.length} onClick={() => toCsv(results)}>
                CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="max-h-[360px] space-y-2 overflow-auto">
              {results.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3">
                  <div className="min-w-0">
                    <div className="truncate font-mono text-xs">{r.normalizedUrl}</div>
                    <div className="text-[11px] text-muted-foreground">{r.summary.slice(0, 80)}</div>
                  </div>
                  <Badge variant={r.threatLevel}>{r.riskScore}</Badge>
                </li>
              ))}
              {!results.length && <p className="text-sm text-muted-foreground">Waiting for a batch.</p>}
            </ul>
            {results.length > 0 && (
              <div className="mt-4 grid grid-cols-5 gap-2 text-center text-[11px]">
                {(["safe", "low", "medium", "high", "critical"] as const).map((l) => (
                  <div key={l} className="rounded-md bg-secondary/40 py-2">
                    <div className="font-display text-lg" style={{ color: LEVEL_META[l].color }}>
                      {results.filter((r) => r.threatLevel === l).length}
                    </div>
                    {l}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
