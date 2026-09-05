export type ThreatLevel = "safe" | "low" | "medium" | "high" | "critical";

export type ModelVerdict = "benign" | "suspicious" | "malicious";

export interface ModelVote {
  id: string;
  name: string;
  role: string;
  verdict: ModelVerdict;
  confidence: number;
  score: number;
  reasoning: string;
  weight: number;
}

export interface ThreatFactor {
  id: string;
  name: string;
  score: number;
  max: number;
  detail: string;
}

export interface AnalysisStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "warn" | "error";
  detail?: string;
  ms?: number;
}

export interface BrandHit {
  brand: string;
  category: string;
  distance: number;
  tactic: "typosquat" | "homoglyph" | "keyword" | "subdomain" | "combo";
  evidence: string;
}

export interface UrlFeatures {
  protocol: string;
  hostname: string;
  registrableDomain: string;
  tld: string;
  sld: string;
  path: string;
  query: string;
  port: string | null;
  urlLength: number;
  domainLength: number;
  pathLength: number;
  queryLength: number;
  subdomainCount: number;
  subdomains: string[];
  digitRatio: number;
  hyphenCount: number;
  specialCharCount: number;
  entropy: number;
  domainEntropy: number;
  hasIP: boolean;
  ipVersion?: 4 | 6;
  hasAtSymbol: boolean;
  hasHttps: boolean;
  hasNonStandardPort: boolean;
  usesShortener: boolean;
  shortener?: string;
  punycode: boolean;
  suspiciousTld: boolean;
  tldRisk: number;
  homoglyphs: boolean;
  homoglyphChars: string[];
  doubleSlashInPath: boolean;
  hexEncoding: boolean;
  dataUri: boolean;
  suspiciousKeywords: string[];
  brandHits: BrandHit[];
  freeHost: boolean;
  looksLikeLogin: boolean;
  excessiveDots: boolean;
  encodedAt: boolean;
  userInfo: string | null;
}

export interface DnsRecordSet {
  A: string[];
  AAAA: string[];
  MX: string[];
  NS: string[];
  TXT: string[];
  CAA: string[];
}

export interface DnsAnalysis {
  resolved: boolean;
  records: DnsRecordSet;
  hasSpf: boolean;
  hasDmarc: boolean;
  hasDkimHint: boolean;
  mxPresent: boolean;
  nameservers: string[];
  notes: string[];
  risk: number;
}

export interface SslAnalysis {
  https: boolean;
  inferred: boolean;
  notes: string[];
  risk: number;
}

export interface AnalysisResult {
  id: string;
  url: string;
  normalizedUrl: string;
  scannedAt: string;
  threatLevel: ThreatLevel;
  riskScore: number;
  confidence: number;
  summary: string;
  features: UrlFeatures;
  votes: ModelVote[];
  threatFactors: ThreatFactor[];
  warnings: string[];
  recommendations: string[];
  dns?: DnsAnalysis;
  ssl: SslAnalysis;
  analysisSteps: AnalysisStep[];
  durationMs: number;
  source: "live" | "demo";
}

export interface BulkJob {
  id: string;
  createdAt: string;
  status: "idle" | "running" | "done";
  total: number;
  completed: number;
  results: AnalysisResult[];
}

export interface FeedbackPayload {
  name: string;
  email: string;
  type: "bug" | "feature" | "improvement" | "other";
  subject: string;
  message: string;
}

export interface EmailAnalysis {
  id: string;
  scannedAt: string;
  riskScore: number;
  threatLevel: ThreatLevel;
  confidence: number;
  summary: string;
  signals: { id: string; name: string; severity: ThreatLevel | "info"; detail: string }[];
  extractedUrls: string[];
  urlResults: AnalysisResult[];
  recommendations: string[];
}
