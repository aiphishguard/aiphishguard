import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { analyzeEmail } from "@/lib/email-analyzer";
import type { EmailAnalysis } from "@/types/analysis";
import { LEVEL_META } from "@/lib/threat";
import { RiskGauge } from "@/components/scanner/RiskGauge";
import { AnalysisResults } from "@/components/scanner/AnalysisResults";
import { Seo } from "@/components/layout/Seo";

const SAMPLE = `From: PayPal Security <service@paypa1-secure.xyz>
Reply-To: helpdesk@mail-secure-login.tk
Subject: Urgent: your account will be suspended in 2 hours

Dear customer,
We detected unusual activity. Kindly verify your account immediately
or it will be locked. Click here to confirm your password:
https://paypa1-secure-login.xyz/verify?session=8f3c

PayPal Security Team`;

export default function EmailAnalyzer() {
  const [text, setText] = useState(SAMPLE);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailAnalysis | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      setResult(await analyzeEmail(text));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <Seo title="Email analyzer" />
      <div className="font-display text-xs tracking-[0.28em] text-primary">MESSAGE</div>
      <h1 className="mt-1 font-display text-3xl tracking-wide">Email & SMS analyzer</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Paste headers and body. We score urgency, credential lures, BEC payment diversion, Reply-To mismatches, then fan out every extracted URL through the ensemble.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Raw message</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea className="min-h-[320px] font-mono text-xs" value={text} onChange={(e) => setText(e.target.value)} />
            <Button className="mt-4" variant="glow" disabled={loading || !text.trim()} onClick={run}>
              {loading ? "Reading lure…" : "Analyze message"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verdict</CardTitle>
          </CardHeader>
          <CardContent>
            {!result && <p className="text-sm text-muted-foreground">Run an analysis to populate the brief.</p>}
            {result && (
              <div>
                <div className="flex justify-center">
                  <RiskGauge score={result.riskScore} level={result.threatLevel} size={180} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{result.summary}</p>
                <ul className="mt-4 space-y-2">
                  {result.signals.map((s) => (
                    <li key={s.id} className="rounded-lg border border-border/70 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{s.name}</span>
                        <Badge variant={s.severity === "info" ? "secondary" : s.severity}>{s.severity}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {result?.urlResults.map((r) => (
        <div key={r.id} className="mt-8">
          <div className="mb-3 font-display text-xs tracking-widest text-muted-foreground" style={{ color: LEVEL_META[r.threatLevel].color }}>
            LINK · {r.normalizedUrl}
          </div>
          <AnalysisResults result={r} />
        </div>
      ))}
    </div>
  );
}
