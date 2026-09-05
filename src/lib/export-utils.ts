import type { AnalysisResult } from "@/types/analysis";
import { downloadBlob } from "@/lib/utils";

export function toJson(results: AnalysisResult | AnalysisResult[]) {
  const payload = Array.isArray(results) ? results : [results];
  downloadBlob(
    `phishguard-${Date.now()}.json`,
    JSON.stringify(payload, null, 2),
    "application/json",
  );
}

export function toCsv(results: AnalysisResult[]) {
  const header = ["scannedAt", "url", "threatLevel", "riskScore", "confidence", "domain", "summary"];
  const rows = results.map((r) =>
    [r.scannedAt, r.url, r.threatLevel, r.riskScore, r.confidence, r.features.registrableDomain, r.summary]
      .map((c) => `"${String(c).replace(/"/g, '""')}"`)
      .join(","),
  );
  downloadBlob(`phishguard-${Date.now()}.csv`, [header.join(","), ...rows].join("\n"), "text/csv");
}

export function printReport(result: AnalysisResult) {
  const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=1200");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><title>PhishGuard Report</title>
  <style>
    body{font-family:ui-sans-serif,system-ui;background:#0b1220;color:#e5eef7;padding:40px;line-height:1.5}
    h1{letter-spacing:.2em;font-size:14px;color:#22d3ee}
    .score{font-size:64px;margin:8px 0;color:${result.riskScore >= 60 ? "#fb7185" : result.riskScore >= 40 ? "#fbbf24" : "#34d399"}}
    .card{border:1px solid #1f2a44;border-radius:16px;padding:20px;margin:16px 0;background:#0f172a}
    li{margin:6px 0}
    code{color:#67e8f9}
  </style></head><body>
  <h1>AI PHISH GUARD · THREAT REPORT</h1>
  <div class="card">
    <div>${new Date(result.scannedAt).toLocaleString()}</div>
    <code>${result.normalizedUrl}</code>
    <div class="score">${result.riskScore}</div>
    <strong>${result.threatLevel.toUpperCase()}</strong> · confidence ${result.confidence}%
    <p>${result.summary}</p>
  </div>
  <div class="card"><h3>Warnings</h3><ul>${result.warnings.map((x) => `<li>${x}</li>`).join("") || "<li>None</li>"}</ul></div>
  <div class="card"><h3>Recommendations</h3><ul>${result.recommendations.map((x) => `<li>${x}</li>`).join("")}</ul></div>
  <div class="card"><h3>Ensemble</h3><ul>${result.votes.map((v) => `<li>${v.name} — ${v.verdict} (${v.score})</li>`).join("")}</ul></div>
  <script>window.print()</script>
  </body></html>`);
  w.document.close();
}
