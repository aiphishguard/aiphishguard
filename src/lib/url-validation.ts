// Advanced client-side URL validation with 10+ checks

export interface UrlValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedUrl: string | null;
}

// Common phishing TLDs
const SUSPICIOUS_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work', 
  '.click', '.link', '.info', '.online', '.site', '.website'
];

// Reserved/private IP ranges
const PRIVATE_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^localhost$/i,
];

// Known URL shorteners
const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 
  'is.gd', 'buff.ly', 'adf.ly', 'tiny.cc', 'rb.gy'
];

// Brand names commonly impersonated
const IMPERSONATION_TARGETS = [
  'paypal', 'amazon', 'google', 'facebook', 'microsoft', 
  'apple', 'netflix', 'instagram', 'twitter', 'linkedin',
  'dropbox', 'chase', 'wellsfargo', 'bankofamerica'
];

export function validateUrl(input: string): UrlValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let sanitizedUrl: string | null = null;

  // Trim whitespace
  const trimmed = input.trim();

  // 1. Check if empty
  if (!trimmed) {
    return { isValid: false, errors: ['URL cannot be empty'], warnings: [], sanitizedUrl: null };
  }

  // 2. Check for obviously invalid formats (email addresses, phone numbers)
  if (trimmed.includes('@') && !trimmed.includes('://')) {
    return { 
      isValid: false, 
      errors: ['This appears to be an email address, not a URL. Please enter a valid URL starting with http:// or https://'], 
      warnings: [], 
      sanitizedUrl: null 
    };
  }

  if (/^[\d\s\-\+\(\)]+$/.test(trimmed)) {
    return { 
      isValid: false, 
      errors: ['This appears to be a phone number, not a URL'], 
      warnings: [], 
      sanitizedUrl: null 
    };
  }

  // 3. Add protocol if missing
  let urlString = trimmed;
  if (!urlString.match(/^https?:\/\//i)) {
    urlString = 'https://' + urlString;
    warnings.push('Protocol was missing - assuming HTTPS');
  }

  // 4. Try to parse as URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlString);
  } catch {
    return { 
      isValid: false, 
      errors: ['Invalid URL format. Please enter a valid URL (e.g., https://example.com)'], 
      warnings, 
      sanitizedUrl: null 
    };
  }

  sanitizedUrl = parsedUrl.href;

  // 5. Check protocol
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    errors.push(`Invalid protocol "${parsedUrl.protocol.replace(':', '')}". Only HTTP and HTTPS are allowed`);
  }

  // 6. Check for HTTP (not HTTPS)
  if (parsedUrl.protocol === 'http:') {
    warnings.push('This URL uses HTTP instead of HTTPS - connection is not encrypted');
  }

  // 7. Check URL length
  if (urlString.length > 2048) {
    errors.push('URL is too long (maximum 2048 characters)');
  }

  if (urlString.length > 100) {
    warnings.push('Unusually long URL detected');
  }

  // 8. Check for IP address instead of domain
  const hostname = parsedUrl.hostname.toLowerCase();
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(hostname)) {
    warnings.push('URL uses an IP address instead of a domain name - this is often suspicious');
    
    // Check if it's a private IP
    if (PRIVATE_IP_PATTERNS.some(pattern => pattern.test(hostname))) {
      errors.push('Private/internal IP addresses are not allowed');
    }
  }

  // 9. Check for localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    errors.push('Localhost URLs are not allowed');
  }

  // 10. Check for suspicious TLDs
  const tld = '.' + hostname.split('.').pop();
  if (SUSPICIOUS_TLDS.includes(tld.toLowerCase())) {
    warnings.push(`Suspicious top-level domain "${tld}" - commonly used in phishing`);
  }

  // 11. Check for Punycode/IDN (internationalized domain)
  if (hostname.startsWith('xn--') || hostname.includes('.xn--')) {
    warnings.push('Internationalized domain name (Punycode) detected - may be used for homograph attacks');
  }

  // 12. Check for URL shorteners
  if (URL_SHORTENERS.some(shortener => hostname.includes(shortener))) {
    warnings.push('URL shortener detected - final destination is hidden');
  }

  // 13. Check for brand impersonation patterns
  const domainWithoutTld = hostname.replace(/\.[^.]+$/, '');
  for (const brand of IMPERSONATION_TARGETS) {
    if (domainWithoutTld.includes(brand) && !hostname.endsWith(`.${brand}.com`)) {
      warnings.push(`Possible "${brand}" impersonation detected in domain`);
      break;
    }
  }

  // 14. Check for excessive subdomains
  const subdomainCount = hostname.split('.').length - 2;
  if (subdomainCount > 3) {
    warnings.push(`Unusual number of subdomains (${subdomainCount}) - may indicate suspicious URL`);
  }

  // 15. Check for suspicious characters in path
  const suspiciousPathPatterns = [
    /login/i, /signin/i, /verify/i, /secure/i, /account/i, 
    /update/i, /confirm/i, /banking/i, /password/i
  ];
  const matchedPatterns = suspiciousPathPatterns.filter(p => p.test(parsedUrl.pathname));
  if (matchedPatterns.length > 1) {
    warnings.push('Multiple sensitive keywords in URL path - common in phishing URLs');
  }

  // 16. Check for data URI
  if (trimmed.toLowerCase().startsWith('data:')) {
    errors.push('Data URIs are not allowed');
  }

  // 17. Check for JavaScript URI
  if (trimmed.toLowerCase().startsWith('javascript:')) {
    errors.push('JavaScript URIs are not allowed');
  }

  // 18. Check for file URI
  if (parsedUrl.protocol === 'file:') {
    errors.push('Local file URIs are not allowed');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedUrl: errors.length === 0 ? sanitizedUrl : null
  };
}
