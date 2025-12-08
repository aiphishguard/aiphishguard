export type ThreatLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';

export interface UrlFeatures {
  // Basic metrics
  urlLength: number;
  domainLength: number;
  pathLength: number;
  
  // Character analysis
  dotCount: number;
  hyphenCount: number;
  underscoreCount: number;
  atSymbolCount: number;
  digitCount: number;
  specialCharCount: number;
  
  // Security indicators
  hasHttps: boolean;
  hasIpAddress: boolean;
  hasPort: boolean;
  hasAtSymbol: boolean;
  
  // Risk signals
  hasSuspiciousTld: boolean;
  hasPhishingKeywords: boolean;
  hasBrandImpersonation: boolean;
  hasUrlShortener: boolean;
  hasPunycode: boolean;
  hasExcessiveSubdomains: boolean;
  
  // Entropy
  urlEntropy: number;
  domainEntropy: number;
}

export interface ContentAnalysis {
  formCount: number;
  passwordFieldCount: number;
  linkCount: number;
  externalLinkCount: number;
  imageCount: number;
  scriptCount: number;
  suspiciousScripts: number;
  iframeCount: number;
  contentRiskScore: number;
  pageTitle: string;
  metaDescription: string;
  textContent: string;
}

export interface LanguageDetection {
  language: string;
  languageCode: string;
  confidence: number;
  isLanguageMismatch: boolean;
  expectedLanguage?: string;
}

export interface VirusTotalResult {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
  totalEngines: number;
  scanDate: string;
  permalink?: string;
}

// Phase 1: New interfaces for enhanced output
export interface AnalysisStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  duration?: number;
  startTime?: number;
  endTime?: number;
  result?: 'pass' | 'fail' | 'warning';
  details?: string;
}

export interface ThreatFactors {
  urlStructure: number;
  domainReputation: number;
  contentRisk: number;
  sslSecurity: number;
  externalIntelligence: number;
}

export interface Recommendation {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  action?: string;
}

// Phase 2: New analysis interfaces
export interface SSLAnalysis {
  isValid: boolean;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysUntilExpiry: number;
  certificateAge: number;
  isFreeSSL: boolean;
  sans: string[];
  protocol: string;
  riskLevel: 'low' | 'medium' | 'high';
  warnings: string[];
}

export interface RedirectChainItem {
  url: string;
  statusCode: number;
  isShortener: boolean;
  isSuspicious: boolean;
}

export interface RedirectAnalysis {
  chain: RedirectChainItem[];
  totalRedirects: number;
  finalUrl: string;
  hasShortener: boolean;
  hasSuspiciousPattern: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface DNSAnalysis {
  aRecords: string[];
  mxRecords: string[];
  txtRecords: string[];
  nsRecords: string[];
  hasMxRecords: boolean;
  hasSpf: boolean;
  hasDkim: boolean;
  hasDmarc: boolean;
  hostingProvider?: string;
  ipLocation?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface AnalysisResult {
  id?: string;
  url: string;
  threatLevel: ThreatLevel;
  confidence: number;
  riskScore: number;
  urlFeatures: UrlFeatures;
  contentAnalysis?: ContentAnalysis;
  languageDetection?: LanguageDetection;
  virusTotalResult?: VirusTotalResult;
  aiAnalysis: string;
  warnings: string[];
  timestamp: string;
  // Phase 1: New fields
  analysisSteps?: AnalysisStep[];
  threatFactors?: ThreatFactors;
  recommendations?: Recommendation[];
  // Phase 2: New fields
  sslAnalysis?: SSLAnalysis;
  redirectAnalysis?: RedirectAnalysis;
  dnsAnalysis?: DNSAnalysis;
}

export interface ScanHistoryItem {
  id: string;
  url: string;
  threatLevel: ThreatLevel;
  riskScore: number;
  timestamp: string;
}

// Phase 3: Bulk scanning interfaces
export interface BulkScanItem {
  id: string;
  url: string;
  status: 'pending' | 'scanning' | 'completed' | 'error';
  result?: AnalysisResult;
  error?: string;
}

export interface BulkScanSummary {
  totalUrls: number;
  completed: number;
  safe: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
  errors: number;
  averageRiskScore: number;
}
