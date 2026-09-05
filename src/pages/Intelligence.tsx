import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CAMPAIGNS, INTEL } from "@/lib/intel";
import { LEVEL_META } from "@/lib/threat";
import { Seo } from "@/components/layout/Seo";

export default function Intelligence() {
  return (
    <div className="container py-10">
      <Seo title="Threat intelligence" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-display text-xs tracking-[0.28em] text-primary">THREAT WIRE</div>
          <h1 className="mt-1 font-display text-3xl tracking-wide">Intelligence</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            A living picture of the lure landscape the ensemble is tuned against. Events are representative campaign patterns — not a claim of live telemetry from your network.
          </p>
        </div>
        <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] tracking-widest text-primary">
          FEED · SIMULATED SOC
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border/70 bg-secondary/20">
        <div className="flex animate-ticker whitespace-nowrap py-2 font-mono text-xs text-muted-foreground">
          {[...INTEL, ...INTEL].map((e, i) => (
            <span key={i} className="mx-6">
              <span style={{ color: LEVEL_META[e.severity].color }}>●</span> {e.title} · {e.ioc}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {CAMPAIGNS.map((c) => (
          <Card key={c.name}>
            <CardHeader>
              <CardTitle className="text-base">{c.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div>Victims · {c.victims}</div>
              <div>Method · {c.method}</div>
              <Badge variant={c.active ? "critical" : "secondary"}>{c.active ? "Active" : "Quiet"}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent events</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {INTEL.map((e) => (
              <li key={e.id} className="grid gap-2 py-4 sm:grid-cols-[88px_1fr_200px] sm:items-center">
                <span className="font-mono text-[11px] text-muted-foreground">{e.minutesAgo}m ago</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={e.severity}>{e.severity}</Badge>
                    <span className="text-sm font-medium">{e.title}</span>
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-accent">{e.ioc}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {e.actor}
                  <div>{e.region}</div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
