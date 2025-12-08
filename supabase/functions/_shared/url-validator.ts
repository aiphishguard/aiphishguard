// Shared URL validation utility to prevent SSRF attacks

const BLOCKED_IP_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  /^169\.254\./, // Link-local / cloud metadata
  /^0\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
  /^fd/i,
];

const BLOCKED_HOSTNAMES = [
  'metadata.google.internal',
  'metadata.google.com',
  'instance-data',
  '169.254.169.254',
];

export function isValidPublicUrl(urlString: string): { valid: boolean; error?: string } {
  try {
    const url = new URL(urlString);
    
    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }
    
    const hostname = url.hostname.toLowerCase();
    
    // Check blocked hostnames
    if (BLOCKED_HOSTNAMES.some(h => hostname === h || hostname.endsWith('.' + h))) {
      return { valid: false, error: 'This URL is not allowed' };
    }
    
    // Check blocked IP patterns
    if (BLOCKED_IP_PATTERNS.some(pattern => pattern.test(hostname))) {
      return { valid: false, error: 'Private or internal URLs are not allowed' };
    }
    
    // Basic URL length validation
    if (urlString.length > 2048) {
      return { valid: false, error: 'URL is too long (max 2048 characters)' };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}
