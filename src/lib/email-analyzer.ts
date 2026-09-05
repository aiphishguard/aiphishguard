import type { EmailAnalysis, ThreatLevel } from "@/types/analysis";
import { analyzeUrl } from "@/lib/url-analyzer";
import { uid, clamp } from "@/lib/utils";

const URL_RE = /https?:\/\/[^\s<>"')\]]+/gi;
const BARE_RE = /(?:www\.)[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s<>"')\]]*)?/gi;

const SIGNALS: { id: string; re: RegExp; name: string; severity: ThreatLevel | "info"; detail: string; score: number }[] = [
  { id: "urgency", re: /immediately|urgent|act now|within \d+ hours|account will be|suspended|final notice|last chance/i, name: "Urgency pressure", severity: "high", detail: "Uses time pressure to short-circuit judgment — a hallmark of social engineering.", score: 18 },
  { id: "cred", re: /verify (your )?account|confirm (your )?password|update (your )?(payment|billing)|unlock your|login to continue/i, name: "Credential harvest", severity: "critical", detail: "Asks the reader to authenticate or update payment data via the message.", score: 24 },
  { id: "prize", re: /you (have )?won|lottery|claim your prize|free iphone|selected as a winner|refund of \$?\d+/i, name: "Too-good lure", severity: "high", detail: "Prize / refund bait is statistically correlated with phishing and advance-fee fraud.", score: 16 },
  { id: "authority", re: /it department|security team|ceo|human resources|helpdesk|apple support|paypal security|microsoft 365/i, name: "Authority impersonation", severity: "medium", detail: "Invokes a trusted authority figure or brand security team.", score: 12 },
  { id: "secrecy", re: /do not tell|keep this confidential|don't share this email|internal only/i, name: "Secrecy request", severity: "high", detail: "Discourages verification with colleagues — BEC pattern.", score: 16 },
  { id: "wire", re: /wire transfer|gift cards?|bitcoin|usdt|crypto wallet|change of bank details|new account number/i, name: "Payment diversion", severity: "critical", detail: "Attempts to reroute money — treat as a business-email-compromise attempt.", score: 26 },
  { id: "grammar", re: /kindly\s+(do|click|confirm)|dear (customer|user|valued)|failure to comply/i, name: "Boilerplate phrasing", severity: "low", detail: "Generic salutation and 'kindly' constructions are over-represented in kits.", score: 8 },
  { id: "mismatch", re: /click (here|below)|follow this link|open the attachment/i, name: "Unexplained CTA", severity: "medium", detail: "Calls to click or open without an independent way to verify the destination.", score: 10 },
  { id: "otp", re: /one[- ]time (code|password)|otp|2fa code|verification code is/i, name: "OTP interception", severity: "high", detail: "May be trying to harvest a one-time code in real time.", score: 18 },
];

function level(score: number): ThreatLevel {
  if (score >= 78) return "critical";
  if (score >= 58) return "high";
  if (score >= 38) return "medium";
  if (score >= 18) return "low";
  return "safe";
}

export async function analyzeEmail(raw: string): Promise<EmailAnalysis> {
  const text = raw.trim();
  const found = new Set<string>();
  for (const m of text.match(URL_RE) ?? []) found.add(m.replace(/[.,;]+$/, ""));
  for (const m of text.match(BARE_RE) ?? []) found.add(`https://${m.replace(/[.,;]+$/, "")}`);
  const extractedUrls = [...found].slice(0, 8);

  const signals = SIGNALS.filter((s) => s.re.test(text)).map(({ id, name, severity, detail }) => ({
    id,
    name,
    severity,
    detail,
  }));

  let score = signals.reduce((a, s) => a + (SIGNALS.find((x) => x.id === s.id)?.score ?? 0), 0);

  const urlResults = [];
  for (const url of extractedUrls.slice(0, 4)) {
    const r = await analyzeUrl(url, { skipDns: extractedUrls.length > 1 });
    urlResults.push(r);
    score += r.riskScore * 0.35;
  }

  if (/^[A-Z0-9._%+-]+@/.test(text) === false && /from:\s*/i.test(text)) {
    /* headers present */
  }
  const reply = text.match(/reply-to:\s*([^\s]+)/i)?.[1];
  const from = text.match(/from:.*<([^>]+)>/i)?.[1] || text.match(/from:\s*(\S+@\S+)/i)?.[1];
  if (from && reply && from.split("@")[1]?.toLowerCase() !== reply.split("@")[1]?.toLowerCase()) {
    signals.push({
      id: "replyto",
      name: "Reply-To mismatch",
      severity: "high",
      detail: `From domain and Reply-To domain differ (${from} vs ${reply}).`,
    });
    score += 18;
  }

  score = clamp(Math.round(score), 0, 99);
  const threatLevel = level(score);
  const summary =
    threatLevel === "safe"
      ? "No strong social-engineering or malicious-URL patterns in this message."
      : `Scored ${score}/100 with ${signals.length} content signals and ${extractedUrls.length} extracted link${extractedUrls.length === 1 ? "" : "s"}.`;

  const recommendations = [
    threatLevel === "critical" || threatLevel === "high"
      ? "Do not click links or open attachments. Report as phishing and delete."
      : "Verify the sender through a second channel before acting.",
    "Never provide passwords, OTPs, or seed phrases from an inbound message.",
    extractedUrls.length ? "Scan each URL independently — the visible text of a link is not the destination." : "No hyperlinks were extracted.",
  ];

  return {
    id: uid("eml"),
    scannedAt: new Date().toISOString(),
    riskScore: score,
    threatLevel,
    confidence: clamp(70 + signals.length * 4, 70, 96),
    summary,
    signals,
    extractedUrls,
    urlResults,
    recommendations,
  };
}
