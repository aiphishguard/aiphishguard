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
}

export interface ScanHistoryItem {
  id: string;
  url: string;
  threatLevel: ThreatLevel;
  riskScore: number;
  timestamp: string;
}
