import type { UrlFeatures } from '@/types/analysis';

// Suspicious TLDs commonly used in phishing
const SUSPICIOUS_TLDS = [
  '.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.click', '.link',
  '.top', '.work', '.date', '.racing', '.download', '.stream',
  '.loan', '.trade', '.party', '.science', '.cricket', '.win',
  '.review', '.accountant', '.faith', '.bid', '.webcam'
];

// Phishing keywords
const PHISHING_KEYWORDS = [
  'login', 'signin', 'sign-in', 'verify', 'verification', 'update',
  'secure', 'account', 'banking', 'password', 'credential', 'confirm',
  'suspended', 'unusual', 'activity', 'locked', 'unlock', 'restore',
  'validate', 'authenticate', 'security', 'alert', 'warning', 'urgent',
  'expire', 'expired', 'limited', 'immediately', 'action', 'required',
  'paypal', 'netflix', 'amazon', 'microsoft', 'apple', 'google',
  'facebook', 'instagram', 'whatsapp', 'bank', 'chase', 'wellsfargo'
];

// Brand names for impersonation detection
const BRAND_NAMES = [
  'paypal', 'netflix', 'amazon', 'microsoft', 'apple', 'google',
  'facebook', 'instagram', 'whatsapp', 'twitter', 'linkedin',
  'chase', 'wellsfargo', 'bankofamerica', 'citibank', 'usbank',
  'dropbox', 'adobe', 'spotify', 'uber', 'airbnb', 'ebay',
  'yahoo', 'outlook', 'office365', 'icloud', 'steam', 'discord'
];

// URL shorteners
const URL_SHORTENERS = [
  'bit.ly', 'goo.gl', 'tinyurl.com', 't.co', 'ow.ly', 'is.gd',
  'buff.ly', 'adf.ly', 'j.mp', 'tiny.cc', 'shorte.st', 'cutt.ly'
];

/**
 * Calculate Shannon entropy of a string
 */
function calculateEntropy(str: string): number {
  if (!str || str.length === 0) return 0;
  
  const freq: Record<string, number> = {};
  for (const char of str.toLowerCase()) {
    freq[char] = (freq[char] || 0) + 1;
  }
  
  let entropy = 0;
  const len = str.length;
  
  for (const char in freq) {
    const p = freq[char] / len;
    entropy -= p * Math.log2(p);
  }
  
  return Math.round(entropy * 100) / 100;
}

/**
 * Check if string contains an IP address
 */
function hasIpAddress(url: string): boolean {
  const ipv4Pattern = /(\d{1,3}\.){3}\d{1,3}/;
  const ipv6Pattern = /\[?([a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}\]?/;
  return ipv4Pattern.test(url) || ipv6Pattern.test(url);
}

/**
 * Check if URL uses punycode (internationalized domain)
 */
function hasPunycode(url: string): boolean {
  return url.includes('xn--');
}

/**
 * Check for brand impersonation in domain
 */
function detectBrandImpersonation(domain: string, path: string): boolean {
  const lowercaseDomain = domain.toLowerCase();
  const lowercasePath = path.toLowerCase();
  
  for (const brand of BRAND_NAMES) {
    // Check if brand is in subdomain but not the main domain
    if (lowercaseDomain.includes(brand) && !lowercaseDomain.endsWith(`${brand}.com`)) {
      return true;
    }
    // Check if brand is in path (common phishing pattern)
    if (lowercasePath.includes(brand)) {
      return true;
    }
  }
  return false;
}

/**
 * Extract and analyze URL features
 */
export function extractUrlFeatures(urlString: string): UrlFeatures {
  let url: URL;
  
  try {
    // Add protocol if missing
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = 'https://' + urlString;
    }
    url = new URL(urlString);
  } catch {
    // Return default features for invalid URLs
    return getDefaultFeatures();
  }
  
  const domain = url.hostname;
  const path = url.pathname + url.search;
  const fullUrl = url.href;
  
  // Count characters
  const dotCount = (fullUrl.match(/\./g) || []).length;
  const hyphenCount = (fullUrl.match(/-/g) || []).length;
  const underscoreCount = (fullUrl.match(/_/g) || []).length;
  const atSymbolCount = (fullUrl.match(/@/g) || []).length;
  const digitCount = (fullUrl.match(/\d/g) || []).length;
  const specialCharCount = (fullUrl.match(/[!#$%&*+,/:;=?@[\]^`{|}~]/g) || []).length;
  
  // Check for suspicious TLDs
  const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld));
  
  // Check for phishing keywords
  const hasPhishingKeywords = PHISHING_KEYWORDS.some(keyword => 
    fullUrl.toLowerCase().includes(keyword)
  );
  
  // Check for URL shorteners
  const hasUrlShortener = URL_SHORTENERS.some(shortener => 
    domain.includes(shortener)
  );
  
  // Count subdomains
  const subdomainCount = domain.split('.').length - 2;
  const hasExcessiveSubdomains = subdomainCount > 3;
  
  return {
    urlLength: fullUrl.length,
    domainLength: domain.length,
    pathLength: path.length,
    dotCount,
    hyphenCount,
    underscoreCount,
    atSymbolCount,
    digitCount,
    specialCharCount,
    hasHttps: url.protocol === 'https:',
    hasIpAddress: hasIpAddress(fullUrl),
    hasPort: url.port !== '',
    hasAtSymbol: atSymbolCount > 0,
    hasSuspiciousTld,
    hasPhishingKeywords,
    hasBrandImpersonation: detectBrandImpersonation(domain, path),
    hasUrlShortener,
    hasPunycode: hasPunycode(domain),
    hasExcessiveSubdomains,
    urlEntropy: calculateEntropy(fullUrl),
    domainEntropy: calculateEntropy(domain),
  };
}

function getDefaultFeatures(): UrlFeatures {
  return {
    urlLength: 0,
    domainLength: 0,
    pathLength: 0,
    dotCount: 0,
    hyphenCount: 0,
    underscoreCount: 0,
    atSymbolCount: 0,
    digitCount: 0,
    specialCharCount: 0,
    hasHttps: false,
    hasIpAddress: false,
    hasPort: false,
    hasAtSymbol: false,
    hasSuspiciousTld: false,
    hasPhishingKeywords: false,
    hasBrandImpersonation: false,
    hasUrlShortener: false,
    hasPunycode: false,
    hasExcessiveSubdomains: false,
    urlEntropy: 0,
    domainEntropy: 0,
  };
}

/**
 * Calculate a preliminary risk score based on URL features
 */
export function calculateUrlRiskScore(features: UrlFeatures): number {
  let score = 0;
  
  // High-risk indicators (each adds 15-20 points)
  if (features.hasIpAddress) score += 20;
  if (features.hasBrandImpersonation) score += 20;
  if (features.hasPhishingKeywords) score += 15;
  if (features.hasSuspiciousTld) score += 15;
  if (!features.hasHttps) score += 15;
  
  // Medium-risk indicators (each adds 8-12 points)
  if (features.hasPunycode) score += 12;
  if (features.hasUrlShortener) score += 10;
  if (features.hasExcessiveSubdomains) score += 10;
  if (features.hasAtSymbol) score += 10;
  if (features.hasPort) score += 8;
  
  // Low-risk indicators based on thresholds
  if (features.urlLength > 75) score += 5;
  if (features.urlLength > 100) score += 5;
  if (features.urlEntropy > 4.5) score += 5;
  if (features.dotCount > 4) score += 3;
  if (features.digitCount > 10) score += 3;
  
  return Math.min(100, score);
}

/**
 * Generate warnings based on URL features
 */
export function generateWarnings(features: UrlFeatures): string[] {
  const warnings: string[] = [];
  
  if (!features.hasHttps) {
    warnings.push('Connection is not encrypted (HTTP)');
  }
  if (features.hasIpAddress) {
    warnings.push('URL uses IP address instead of domain name');
  }
  if (features.hasBrandImpersonation) {
    warnings.push('Possible brand impersonation detected');
  }
  if (features.hasPhishingKeywords) {
    warnings.push('Phishing-related keywords found in URL');
  }
  if (features.hasSuspiciousTld) {
    warnings.push('Suspicious top-level domain detected');
  }
  if (features.hasPunycode) {
    warnings.push('Internationalized domain (punycode) detected');
  }
  if (features.hasUrlShortener) {
    warnings.push('URL shortener detected - actual destination hidden');
  }
  if (features.hasExcessiveSubdomains) {
    warnings.push('Excessive number of subdomains');
  }
  if (features.hasAtSymbol) {
    warnings.push('URL contains @ symbol - may hide actual destination');
  }
  if (features.urlEntropy > 4.5) {
    warnings.push('High URL randomness - possible auto-generated URL');
  }
  
  return warnings;
}
