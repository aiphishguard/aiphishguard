import { Download, Printer, Share2, ShieldAlert, ShieldCheck, Copy } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";
import { RiskGauge } from "@/components/scanner/RiskGauge";
import { ThreatRadar } from "@/components/scanner/ThreatRadar";
import { EnsembleVotes } from "@/components/scanner/EnsembleVotes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { printReport, toJson } from "@/lib/export-utils";
import { LEVEL_META } from "@/lib/threat";
import { copyText, relativeTime, toastSafe } from "@/lib/copy";
import { LEGIT_ROOTS } from "@/lib/brands";
import { cn } from "@/lib/utils";

function Feature({ k, v, warn }: { k: string; v: string; warn?: boolean }) {
  return (
    <div className={cn("rounded-lg border border-border/60 bg-secondary/20 p-3", warn && "border-[hsl(var(--threat-high)/0.4)]")}>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="mt-1 break-all font-mono text-xs">{v}</div>
    </div>
  );
}

export function AnalysisResults({ result }: { result: AnalysisResult }) {
  const meta = LEVEL_META[result.threatLevel];
  const f = result.features;

  return (
    <div className="animate-fade-in space-y-6">
      <Card className="overflow-hidden">
        <div className="h-1 w-full" style={{ background: meta.color }} />
        <CardContent className="grid gap-8 p-6 lg:grid-cols-[240px_1fr]">
          <div className="flex flex-col items-center">
            <RiskGauge score={result.riskScore} level={result.threatLevel} />
            <Badge variant={result.threatLevel} className="mt-2">
              {meta.label} · {result.confidence}% conf
            </Badge>
          </div>
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {relativeTime(result.scannedAt)} · {result.durationMs}ms · 10 models
                </div>
                <h2 className="mt-1 break-all font-mono text-sm text-accent sm:text-base">{result.normalizedUrl}</h2>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { copyText(result.normalizedUrl); toastSafe("URL copied"); }}>
                  <Copy /> Copy
                </Button>
                <Button size="sm" variant="outline" onClick={() => toJson(result)}>
                  <Download /> JSON
                </Button>
                <Button size="sm" variant="outline" onClick={() => printReport(result)}>
                  <Printer /> Report
                </Button>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
            {result.warnings.length > 0 && (
              <ul className="mt-4 space-y-2">
                {result.warnings.map((w) => (
                  <li key={w} className="flex gap-2 text-sm text-[hsl(var(--threat-high))]">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            )}
            {result.warnings.length === 0 && (
              <p className="mt-4 flex items-center gap-2 text-sm text-primary">
                <ShieldCheck className="h-4 w-4" /> No high-severity warnings on this URL.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ensemble">
        <TabsList className="flex-wrap">
          <TabsTrigger value="ensemble">Ensemble</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="radar">Radar</TabsTrigger>
          <TabsTrigger value="dns">DNS / TLS</TabsTrigger>
          <TabsTrigger value="advice">Advice</TabsTrigger>
        </TabsList>
        <TabsContent value="ensemble">
          <Card>
            <CardHeader>
              <CardTitle>Ten-model vote</CardTitle>
            </CardHeader>
            <CardContent>
              <EnsembleVotes votes={result.votes} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Extracted features</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <Feature k="Registrable domain" v={f.registrableDomain} />
              <Feature k="TLD" v={`.${f.tld}`} warn={f.suspiciousTld} />
              <Feature k="Protocol" v={f.protocol.toUpperCase()} warn={!f.hasHttps} />
              <Feature k="Subdomains" v={String(f.subdomainCount)} warn={f.subdomainCount >= 3} />
              <Feature k="URL length" v={String(f.urlLength)} />
              <Feature k="Domain entropy" v={f.domainEntropy.toFixed(2)} />
              <Feature k="IP literal" v={f.hasIP ? `IPv${f.ipVersion}` : "No"} warn={f.hasIP} />
              <Feature k="Shortener" v={f.usesShortener ? f.shortener! : "No"} warn={f.usesShortener} />
              <Feature k="Punycode / IDN" v={f.punycode || f.homoglyphs ? "Yes" : "No"} warn={f.homoglyphs} />
              <Feature k="Free host" v={f.freeHost ? "Yes" : "No"} warn={f.freeHost} />
              <Feature k="Login lure" v={f.looksLikeLogin ? "Yes" : "No"} warn={f.looksLikeLogin && !LEGIT_ROOTS.has(f.registrableDomain)} />
              <Feature k="Keywords" v={f.suspiciousKeywords.join(", ") || "—"} warn={f.suspiciousKeywords.length > 2} />
              {f.brandHits.map((b) => (
                <Feature key={b.brand} k={`Brand · ${b.tactic}`} v={`${b.brand} — ${b.evidence}`} warn />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="radar">
          <Card>
            <CardHeader>
              <CardTitle>Threat factor radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ThreatRadar factors={result.threatFactors} />
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {result.threatFactors.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-muted-foreground">{t.name}</span>
                    <span className="font-mono">{t.score}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="dns">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>DNS intelligence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {result.dns ? (
                  <>
                    <Row k="Resolved" v={result.dns.resolved ? "Yes" : "No"} />
                    <Row k="A" v={result.dns.records.A.join(", ") || "—"} />
                    <Row k="AAAA" v={result.dns.records.AAAA.join(", ") || "—"} />
                    <Row k="MX" v={result.dns.records.MX.join(" · ") || "—"} />
                    <Row k="NS" v={result.dns.nameservers.join(" · ") || "—"} />
                    <Row k="SPF" v={result.dns.hasSpf ? "Present" : "Missing"} />
                    <Row k="DMARC" v={result.dns.hasDmarc ? "Present" : "Missing"} />
                    {result.dns.notes.map((n) => (
                      <p key={n} className="text-muted-foreground">{n}</p>
                    ))}
                  </>
                ) : (
                  <p className="text-muted-foreground">DNS probe skipped for this target.</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Transport / TLS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Row k="HTTPS" v={result.ssl.https ? "Yes" : "No"} />
                {result.ssl.notes.map((n) => (
                  <p key={n} className="text-muted-foreground">{n}</p>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="advice">
          <Card>
            <CardHeader>
              <CardTitle>Smart recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {result.recommendations.map((r, i) => (
                  <li key={r} className="flex gap-3 text-sm">
                    <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                    {r}
                  </li>
                ))}
              </ol>
              <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <Share2 className="h-3.5 w-3.5" />
                This report never leaves your browser unless you export it.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/50 py-1.5">
      <span className="text-muted-foreground">{k}</span>
      <span className="break-all text-right font-mono text-xs">{v}</span>
    </div>
  );
}
