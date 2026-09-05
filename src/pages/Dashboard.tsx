import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScanHistory } from "@/hooks/useScanHistory";
import { LEVEL_META } from "@/lib/threat";
import type { ThreatLevel } from "@/types/analysis";
import { relativeTime } from "@/lib/utils";
import { Seo } from "@/components/layout/Seo";

const LEVELS: ThreatLevel[] = ["safe", "low", "medium", "high", "critical"];

export default function Dashboard() {
  const { items, stats } = useScanHistory();
  const pie = LEVELS.map((l) => ({ name: LEVEL_META[l].label, value: stats.byLevel[l], color: LEVEL_META[l].color }));
  const timeline = [...items].reverse().map((i, idx) => ({
    i: idx + 1,
    score: i.riskScore,
    t: new Date(i.scannedAt).toLocaleTimeString(),
  }));

  return (
    <div className="container py-10">
      <Seo title="Dashboard" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-display text-xs tracking-[0.28em] text-primary">OPERATIONS</div>
          <h1 className="mt-1 font-display text-3xl tracking-wide">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">Local scan telemetry. Empty until you run the engine.</p>
        </div>
        <Button asChild variant="glow">
          <Link to="/">New scan</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { k: "Total scans", v: stats.total },
          { k: "Avg risk", v: stats.avg },
          { k: "High + critical", v: stats.byLevel.high + stats.byLevel.critical },
          { k: "Clean", v: stats.byLevel.safe },
        ].map((s) => (
          <Card key={s.k}>
            <CardContent className="p-5">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{s.k}</div>
              <div className="mt-2 font-display text-3xl">{s.v}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk over scans</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            {timeline.length ? (
              <ResponsiveContainer>
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="risk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(187 92% 48%)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="hsl(187 92% 48%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(222 28% 16%)" strokeDasharray="3 3" />
                  <XAxis dataKey="t" tick={{ fill: "hsl(215 16% 62%)", fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "hsl(215 16% 62%)", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1f2a44" }} />
                  <Area type="monotone" dataKey="score" stroke="hsl(160 84% 43%)" fill="url(#risk)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Empty />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Threat distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            {stats.total ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                    {pie.map((p) => (
                      <Cell key={p.name} fill={p.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1f2a44" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 && <Empty />}
          <ul className="divide-y divide-border">
            {items.slice(0, 8).map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-mono text-xs text-accent">{i.normalizedUrl}</div>
                  <div className="text-[11px] text-muted-foreground">{relativeTime(i.scannedAt)}</div>
                </div>
                <span className="font-display" style={{ color: LEVEL_META[i.threatLevel].color }}>
                  {i.riskScore}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Empty() {
  return <p className="flex h-full items-center justify-center text-sm text-muted-foreground">No telemetry yet — run a scan.</p>;
}
