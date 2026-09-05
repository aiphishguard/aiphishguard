const PRIVATE_V4 = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^169\.254\./,
  /^0\./,
  /^255\./,
];

const BLOCKED_PROTOCOLS = /^(javascript|data|file|vbscript|blob|about):/i;

export interface ValidationResult {
  ok: boolean;
  url?: string;
  normalized?: string;
  error?: string;
  warnings: string[];
}

export function normalizeUrl(input: string): string {
  const trimmed = input.trim().replace(/[\u200B-\u200D\uFEFF]/g, "");
  if (!trimmed) return "";
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function validateUrl(input: string): ValidationResult {
  const warnings: string[] = [];
  const raw = input.trim();
  if (!raw) return { ok: false, error: "Enter a URL to scan.", warnings };
  if (raw.length > 2048) return { ok: false, error: "URL exceeds the 2048 character safety limit.", warnings };
  if (BLOCKED_PROTOCOLS.test(raw)) {
    return { ok: false, error: "This protocol is blocked (possible XSS / local file probe).", warnings };
  }

  const normalized = normalizeUrl(raw);
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return { ok: false, error: "That doesn’t look like a valid URL.", warnings };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { ok: false, error: "Only HTTP and HTTPS URLs can be scanned.", warnings };
  }

  const host = parsed.hostname;
  if (PRIVATE_V4.some((re) => re.test(host)) || host === "::1") {
    warnings.push("This host is a private / loopback address. Scanning continues, but it cannot be a public phishing site.");
  }

  if (parsed.username) {
    warnings.push("URL contains embedded user credentials — a classic phishing obfuscation trick.");
  }

  return { ok: true, url: raw, normalized, warnings };
}

export function isProbablyUrl(text: string) {
  return /https?:\/\/\S+/i.test(text) || /(?:www\.)?[a-z0-9-]+\.[a-z]{2,}\S*/i.test(text);
}
