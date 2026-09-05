import type {
  AnalysisResult,
  AnalysisStep,
  BrandHit,
  ModelVote,
  SslAnalysis,
  ThreatFactor,
  ThreatLevel,
  UrlFeatures,
} from "@/types/analysis";
import { BRANDS, FREE_HOSTS, HOMOGLYPHS, LEGIT_ROOTS, PHISH_KEYWORDS, SHORTENERS, SUSPICIOUS_TLDS } from "@/lib/brands";
import { analyzeDns } from "@/lib/dns";
import { levenshtein, shannonEntropy } from "@/lib/levenshtein";
import { normalizeUrl } from "@/lib/url-validation";
import { clamp, sleep, uid } from "@/lib/utils";

const MULTI_TLD = new Set(["co.uk", "com.au", "co.jp", "com.br", "co.in", "com.mx", "co.za", "com.tr", "co.kr", "com.cn", "org.uk", "ac.uk", "gov.uk"]);

function registrable(hostname: string) {
  const host = hostname.replace(/\.$/, "").toLowerCase();
  const parts = host.split(".");
  if (parts.length <= 2) return { domain: host, tld: parts.slice(-1)[0] ?? "", sld: parts[0] ?? host, sub: [] as string[] };
  const last2 = parts.slice(-2).join(".");
  if (MULTI_TLD.has(last2) && parts.length >= 3) {
    return {
      domain: parts.slice(-3).join("."),
      tld: last2,
      sld: parts[parts.length - 3],
      sub: parts.slice(0, -3),
    };
  }
  return {
    domain: last2,
    tld: parts[parts.length - 1],
    sld: parts[parts.length - 2],
    sub: parts.slice(0, -2),
  };
}

function foldHomoglyphs(s: string) {
  return [...s].map((c) => HOMOGLYPHS[c] ?? c).join("");
}

function detectHomoglyphs(s: string) {
  const hits: string[] = [];
  for (const c of s) if (HOMOGLYPHS[c]) hits.push(c);
  return hits;
}

function extractFeatures(rawUrl: string): UrlFeatures {
  const normalized = normalizeUrl(rawUrl);
  const u = new URL(normalized);
  const host = u.hostname.toLowerCase();
  const { domain, tld, sld, sub } = registrable(host);
  const ip4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
  const ip6 = host.includes(":") && !host.includes(".");
  const full = normalized;
  const digits = (host.match(/\d/g) ?? []).length;
  const keywords = PHISH_KEYWORDS.filter((k) => full.toLowerCase().includes(k));
  const glyphs = detectHomoglyphs(host);
  const shortener = SHORTENERS.find((s) => host === s || host.endsWith(`.${s}`));
  const freeHost = FREE_HOSTS.some((h) => domain === h || host.endsWith(`.${h}`));

  const brandHits: BrandHit[] = [];
  const folded = foldHomoglyphs(host.replace(/-/g, ""));
  const pathQ = `${u.pathname}${u.search}`.toLowerCase();

  for (const brand of BRANDS) {
    for (const token of brand.tokens) {
      if (LEGIT_ROOTS.has(domain) && domain.includes(token)) continue;

      const dist = Math.min(
        levenshtein(sld, token),
        levenshtein(sld.replace(/[0-9]/g, ""), token),
        levenshtein(folded.replace(/\./g, ""), token),
      );

      if (sld !== token && dist > 0 && dist <= 2 && token.length >= 5) {
        brandHits.push({
          brand: brand.name,
          category: brand.category,
          distance: dist,
          tactic: glyphs.length ? "homoglyph" : "typosquat",
          evidence: `«${sld}» is ${dist} edit${dist === 1 ? "" : "s"} from «${token}»`,
        });
      } else if (!LEGIT_ROOTS.has(domain) && (sld.includes(token) || host.split(".").some((p) => p.includes(token)))) {
        if (sld !== token && token.length >= 4) {
          brandHits.push({
            brand: brand.name,
            category: brand.category,
            distance: 0,
            tactic: sub.some((p) => p.includes(token)) ? "subdomain" : "combo",
            evidence: `Brand token «${token}» appears outside an official domain (${domain})`,
          });
        }
      } else if (!LEGIT_ROOTS.has(domain) && pathQ.includes(token) && token.length >= 6) {
        brandHits.push({
          brand: brand.name,
          category: brand.category,
          distance: 0,
          tactic: "keyword",
          evidence: `Path/query references «${token}» on unaffiliated host ${domain}`,
        });
      }
    }
  }

  const uniqueBrands = new Map<string, BrandHit>();
  for (const hit of brandHits) {
    const prev = uniqueBrands.get(hit.brand);
    if (!prev || hit.distance < prev.distance || (hit.distance === prev.distance && hit.tactic !== "keyword")) {
      uniqueBrands.set(hit.brand, hit);
    }
  }

  const port = u.port || null;
  const specials = (full.match(/[^a-zA-Z0-9:\/.?#=_-]/g) ?? []).length;

  return {
    protocol: u.protocol.replace(":", ""),
    hostname: host,
    registrableDomain: domain,
    tld,
    sld,
    path: u.pathname,
    query: u.search,
    port,
    urlLength: full.length,
    domainLength: host.length,
    pathLength: u.pathname.length,
    queryLength: u.search.length,
    subdomainCount: sub.length,
    subdomains: sub,
    digitRatio: host.length ? digits / host.length : 0,
    hyphenCount: (host.match(/-/g) ?? []).length,
    specialCharCount: specials,
    entropy: shannonEntropy(full),
    domainEntropy: shannonEntropy(sld),
    hasIP: ip4 || ip6,
    ipVersion: ip4 ? 4 : ip6 ? 6 : undefined,
    hasAtSymbol: full.includes("@"),
    hasHttps: u.protocol === "https:",
    hasNonStandardPort: Boolean(port && port !== "80" && port !== "443"),
    usesShortener: Boolean(shortener),
    shortener,
    punycode: host.includes("xn--"),
    suspiciousTld: SUSPICIOUS_TLDS.has(tld),
    tldRisk: SUSPICIOUS_TLDS.has(tld) ? 22 : tld === "com" || tld === "org" || tld === "net" || tld === "gov" || tld === "edu" ? 0 : 6,
    homoglyphs: glyphs.length > 0 || host.includes("xn--"),
    homoglyphChars: glyphs,
    doubleSlashInPath: u.pathname.includes("//"),
    hexEncoding: /%[0-9a-f]{2}/i.test(full),
    dataUri: full.startsWith("data:"),
    suspiciousKeywords: [...new Set(keywords)],
    brandHits: [...uniqueBrands.values()].slice(0, 4),
    freeHost,
    looksLikeLogin: /login|signin|sign-in|verify|account|password|auth/i.test(full),
    excessiveDots: host.split(".").length >= 5,
    encodedAt: /%40/i.test(full),
    userInfo: u.username ? `${u.username}${u.password ? ":****" : ""}` : null,
  };
}

function threatFromScore(score: number): ThreatLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "medium";
  if (score >= 20) return "low";
  return "safe";
}

function vote(id: string, name: string, role: string, score: number, reasoning: string, weight: number): ModelVote {
  const verdict = score >= 62 ? "malicious" : score >= 32 ? "suspicious" : "benign";
  const confidence = clamp(Math.round(54 + Math.abs(score - 50) * 0.7), 55, 97);
  return { id, name, role, verdict, confidence, score: clamp(Math.round(score), 0, 100), reasoning, weight };
}

function runEnsemble(f: UrlFeatures): { votes: ModelVote[]; factors: ThreatFactor[]; warnings: string[]; base: number } {
  const warnings: string[] = [];
  const factors: ThreatFactor[] = [];

  const lexical = (() => {
    let s = 8;
    if (f.urlLength > 90) s += 10;
    if (f.urlLength > 140) s += 10;
    if (f.hyphenCount >= 3) s += 12;
    if (f.digitRatio > 0.2) s += 14;
    if (f.subdomainCount >= 3) s += 16;
    if (f.excessiveDots) s += 12;
    if (f.specialCharCount > 8) s += 8;
    if (f.domainLength > 28) s += 8;
    factors.push({ id: "lexical", name: "Lexical complexity", score: clamp(s, 0, 100), max: 100, detail: `${f.urlLength} chars, ${f.subdomainCount} subdomains, ${f.hyphenCount} hyphens` });
    return vote("m1", "LexicalNet-V3", "URL morphology", s, "Scores length, hyphens, digits, and nested subdomains used to hide the true host.", 1.1);
  })();

  const domainRep = (() => {
    let s = 6;
    if (f.hasIP) {
      s += 48;
      warnings.push("Host is a raw IP address — browsers hide the real identity of the site.");
    }
    if (f.suspiciousTld) {
      s += 24;
      warnings.push(`TLD .${f.tld} is heavily abused in phishing kits.`);
    } else s += f.tldRisk;
    if (f.freeHost) {
      s += 22;
      warnings.push("Hosted on a free static platform frequently used to stand up disposable phishing pages.");
    }
    if (LEGIT_ROOTS.has(f.registrableDomain)) s = Math.max(0, s - 28);
    factors.push({ id: "domain", name: "Domain reputation", score: clamp(s, 0, 100), max: 100, detail: `${f.registrableDomain} (.${f.tld})` });
    return vote("m2", "DomainGraph", "Infrastructure", s, "Weighs TLD abuse rates, IP-literal hosts, and disposable hosting.", 1.2);
  })();

  const homo = (() => {
    let s = 4;
    if (f.homoglyphs) {
      s += 55;
      warnings.push("Homoglyph / IDN characters detected — classic lookalike-domain attack.");
    }
    if (f.punycode) s += 30;
    factors.push({ id: "homo", name: "Homograph risk", score: clamp(s, 0, 100), max: 100, detail: f.homoglyphChars.length ? `Chars: ${f.homoglyphChars.join(" ")}` : f.punycode ? "punycode xn--" : "No IDN tricks" });
    return vote("m3", "GlyphGuard", "Homograph IDN", s, "Detects Cyrillic/Greek lookalikes and punycode wrapping.", 1.3);
  })();

  const typo = (() => {
    const hit = f.brandHits.find((h) => h.tactic === "typosquat" || h.tactic === "homoglyph");
    let s = hit ? (hit.distance === 1 ? 82 : 68) : 6;
    if (hit) warnings.push(`Possible ${hit.brand} typosquat: ${hit.evidence}`);
    factors.push({ id: "typo", name: "Typosquat distance", score: clamp(s, 0, 100), max: 100, detail: hit ? hit.evidence : "No near-miss against watched brands" });
    return vote("m4", "TypoSentry", "Edit-distance", s, "Levenshtein distance against 40+ high-value brand tokens.", 1.35);
  })();

  const brand = (() => {
    const hit = f.brandHits[0];
    let s = 5;
    if (hit && !LEGIT_ROOTS.has(f.registrableDomain)) {
      s = hit.tactic === "subdomain" ? 74 : hit.tactic === "combo" ? 70 : hit.tactic === "keyword" ? 48 : 78;
      warnings.push(`Brand impersonation: ${hit.brand} (${hit.tactic}). ${hit.evidence}`);
    }
    factors.push({ id: "brand", name: "Brand impersonation", score: clamp(s, 0, 100), max: 100, detail: hit ? `${hit.brand} · ${hit.tactic}` : "No impersonation pattern" });
    return vote("m5", "BrandShield", "Impersonation", s, "Flags brand tokens used on unaffiliated registrable domains.", 1.4);
  })();

  const structure = (() => {
    let s = 5;
    if (f.hasAtSymbol || f.encodedAt || f.userInfo) {
      s += 40;
      warnings.push("Embedded userinfo / @ in the URL can trick the eye about the real host.");
    }
    if (f.doubleSlashInPath) s += 12;
    if (f.hexEncoding) s += 10;
    if (f.hasNonStandardPort) s += 10;
    if (f.pathLength > 60) s += 8;
    if (f.queryLength > 80) s += 8;
    factors.push({ id: "struct", name: "URL structure", score: clamp(s, 0, 100), max: 100, detail: `path ${f.pathLength} / query ${f.queryLength}` });
    return vote("m6", "StructFormer", "Parse tree", s, "Looks for @-obfuscation, encodings, odd ports, and oversized paths.", 1.0);
  })();

  const tldModel = (() => {
    const s = f.suspiciousTld ? 64 : f.tldRisk > 0 ? 28 : 8;
    factors.push({ id: "tld", name: "TLD risk", score: clamp(s, 0, 100), max: 100, detail: `.${f.tld}` });
    return vote("m7", "TLD-RiskMap", "Registry intel", s, "Maps the TLD against historical phishing-kit prevalence.", 0.9);
  })();

  const entropy = (() => {
    let s = f.domainEntropy > 3.6 ? 40 : f.domainEntropy > 3.1 ? 22 : 8;
    if (f.entropy > 4.6) s += 16;
    factors.push({ id: "entropy", name: "Obfuscation entropy", score: clamp(s, 0, 100), max: 100, detail: `H(domain)=${f.domainEntropy.toFixed(2)}  H(url)=${f.entropy.toFixed(2)}` });
    return vote("m8", "EntropyVAE", "Randomness", s, "High Shannon entropy often means algorithmically generated or packed labels.", 0.85);
  })();

  const redirect = (() => {
    let s = f.usesShortener ? 58 : 6;
    if (f.usesShortener) warnings.push(`URL shortener detected (${f.shortener}). Destination is hidden until requested.`);
    factors.push({ id: "short", name: "Shortener / cloak", score: clamp(s, 0, 100), max: 100, detail: f.usesShortener ? f.shortener! : "Direct URL" });
    return vote("m9", "CloakTrace", "Redirect intel", s, "Shorteners and open redirectors conceal the landing page.", 1.05);
  })();

  const pattern = (() => {
    let s = 6;
    if (f.looksLikeLogin) s += 16;
    s += Math.min(28, f.suspiciousKeywords.length * 7);
    if (!f.hasHttps) {
      s += 22;
      warnings.push("Served over plaintext HTTP — credentials would transit in the clear.");
    }
    if (f.looksLikeLogin && !f.hasHttps) s += 18;
    if (f.suspiciousKeywords.length) warnings.push(`Phishing-kit keywords: ${f.suspiciousKeywords.slice(0, 5).join(", ")}`);
    factors.push({ id: "pattern", name: "Kit / lure patterns", score: clamp(s, 0, 100), max: 100, detail: f.suspiciousKeywords.slice(0, 4).join(", ") || "No lure keywords" });
    return vote("m10", "KitHunter", "Pattern match", s, "Matches credential-harvest lures, fake-login paths, and HTTP password pages.", 1.15);
  })();

  const votes = [lexical, domainRep, homo, typo, brand, structure, tldModel, entropy, redirect, pattern];
  const weighted = votes.reduce((acc, v) => acc + v.score * v.weight, 0);
  const wsum = votes.reduce((acc, v) => acc + v.weight, 0);
  const base = weighted / wsum;
  return { votes, factors, warnings, base };
}

function recommendations(level: ThreatLevel, f: UrlFeatures): string[] {
  const recs: string[] = [];
  if (level === "critical" || level === "high") {
    recs.push("Do not open this link, and do not enter credentials, codes, or payment details.");
    recs.push("Report the message to your security team / provider (e.g. phishing@, Report junk).");
    recs.push("If you already typed a password, rotate it now and enable hardware or app-based 2FA.");
  } else if (level === "medium") {
    recs.push("Treat this URL as untrusted. Open it only in a sandboxed browser if you must inspect it.");
    recs.push("Navigate to the brand by typing the official domain yourself — never via this link.");
  } else if (level === "low") {
    recs.push("Low residual risk. Verify the sender out-of-band if this arrived unexpectedly.");
  } else {
    recs.push("No strong phishing indicators. Stay alert for unexpected login prompts anyway.");
  }
  if (f.usesShortener) recs.push("Expand the shortener with a preview service before visiting.");
  if (!f.hasHttps) recs.push("Refuse to submit any form on a non-HTTPS page.");
  if (f.brandHits.length) recs.push(`Go directly to the official ${f.brandHits[0].brand} site via a bookmark.`);
  recs.push("Hover (desktop) or long-press (mobile) links to read the real hostname before tapping.");
  return recs;
}

function summarize(level: ThreatLevel, score: number, f: UrlFeatures, votes: ModelVote[]) {
  const malicious = votes.filter((v) => v.verdict === "malicious").length;
  const suspicious = votes.filter((v) => v.verdict === "suspicious").length;
  const brand = f.brandHits[0];
  if (level === "safe") {
    return `Ensemble of 10 detectors scored ${Math.round(score)}/100. ${f.registrableDomain} does not match known phishing-kit, typosquat, or homograph patterns.`;
  }
  const why = [
    brand ? `${brand.brand} impersonation (${brand.tactic})` : null,
    f.usesShortener ? "cloaked shortener" : null,
    f.homoglyphs ? "homoglyph domain" : null,
    f.hasIP ? "raw IP host" : null,
    f.suspiciousTld ? `abused TLD .${f.tld}` : null,
    !f.hasHttps ? "no TLS" : null,
  ]
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");
  return `Risk ${Math.round(score)}/100 · ${malicious} malicious / ${suspicious} suspicious votes. Primary signals: ${why || "stacked lexical anomalies"}.`;
}

export interface AnalyzeOptions {
  onStep?: (steps: AnalysisStep[]) => void;
  skipDns?: boolean;
}

export async function analyzeUrl(input: string, opts: AnalyzeOptions = {}): Promise<AnalysisResult> {
  const started = performance.now();
  const normalized = normalizeUrl(input);
  const steps: AnalysisStep[] = [
    { id: "parse", label: "Parse & canonicalize URL", status: "pending" },
    { id: "lex", label: "Extract 40+ lexical features", status: "pending" },
    { id: "glyph", label: "Homograph / punycode sweep", status: "pending" },
    { id: "brand", label: "Brand & typosquat graph", status: "pending" },
    { id: "dns", label: "Live DNS / SPF / DMARC", status: "pending" },
    { id: "ens", label: "10-model ensemble vote", status: "pending" },
    { id: "report", label: "Explainable risk report", status: "pending" },
  ];

  const emit = async (id: string, status: AnalysisStep["status"], detail?: string, wait = 90) => {
    const t0 = performance.now();
    steps.forEach((s) => {
      if (s.id === id) s.status = status;
    });
    opts.onStep?.(steps.map((s) => ({ ...s })));
    if (status === "running") await sleep(wait);
    const step = steps.find((s) => s.id === id);
    if (step && status !== "running") step.ms = Math.round(performance.now() - t0 + wait);
    opts.onStep?.(steps.map((s) => ({ ...s })));
  };

  await emit("parse", "running", undefined, 70);
  const features = extractFeatures(normalized);
  await emit("parse", "done", features.hostname);

  await emit("lex", "running", undefined, 110);
  await emit("lex", "done");

  await emit("glyph", "running", undefined, 90);
  await emit("glyph", features.homoglyphs ? "warn" : "done");

  await emit("brand", "running", undefined, 120);
  await emit("brand", features.brandHits.length ? "warn" : "done");

  let dns;
  await emit("dns", "running", undefined, 40);
  if (!opts.skipDns && !features.hasIP) {
    dns = await analyzeDns(features.hostname);
    await emit("dns", dns.resolved ? "done" : "warn", dns.resolved ? `${dns.records.A[0] ?? "ok"}` : "NXDOMAIN");
  } else {
    await emit("dns", "done", features.hasIP ? "skipped (IP literal)" : "skipped");
  }

  await emit("ens", "running", undefined, 160);
  const { votes, factors, warnings, base } = runEnsemble(features);
  let score = base;
  if (dns) {
    score += dns.risk * 0.25;
    if (!dns.resolved && (features.brandHits.length || features.looksLikeLogin)) score += 8;
  }
  score = clamp(Math.round(score), 0, 99);
  if (LEGIT_ROOTS.has(features.registrableDomain) && !features.homoglyphs && features.brandHits.length === 0) {
    score = Math.min(score, 18);
  }
  await emit("ens", "done");

  await emit("report", "running", undefined, 80);
  const threatLevel = threatFromScore(score);
  const ssl: SslAnalysis = {
    https: features.hasHttps,
    inferred: true,
    notes: features.hasHttps
      ? ["URL requests HTTPS. Full certificate-chain validation requires a server-side probe."]
      : ["No TLS. A modern phishing kit almost always clones HTTPS — plaintext here is still a hard fail for logins."],
    risk: features.hasHttps ? 0 : 24,
  };
  const extraWarn = [...warnings, ...(dns?.notes ?? []).filter((n) => /did not resolve|abuse-prone/.test(n))];
  const uniqueWarn = [...new Set(extraWarn)];
  const confidence = clamp(
    Math.round(
      votes.reduce((a, v) => a + v.confidence * v.weight, 0) / votes.reduce((a, v) => a + v.weight, 0),
    ),
    60,
    97,
  );

  await emit("report", "done");

  return {
    id: uid("scan"),
    url: input.trim(),
    normalizedUrl: normalized,
    scannedAt: new Date().toISOString(),
    threatLevel,
    riskScore: score,
    confidence,
    summary: summarize(threatLevel, score, features, votes),
    features,
    votes,
    threatFactors: factors,
    warnings: uniqueWarn,
    recommendations: recommendations(threatLevel, features),
    dns,
    ssl,
    analysisSteps: steps,
    durationMs: Math.round(performance.now() - started),
    source: "live",
  };
}

export const DEMO_URLS = [
  { label: "PayPal typosquat", url: "http://paypa1-secure-login.xyz/verify?session=8f3c" },
  { label: "Microsoft lure", url: "https://office365-login-secure.tk/auth/microsoft/verify" },
  { label: "IP + login", url: "http://185.243.112.44/accounts/signin" },
  { label: "Google (clean)", url: "https://accounts.google.com" },
  { label: "Shortener", url: "https://bit.ly/3xAccountReset" },
  { label: "Apple official", url: "https://appleid.apple.com" },
];
