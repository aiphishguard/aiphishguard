export interface BrandProfile {
  name: string;
  tokens: string[];
  category: string;
}

export const BRANDS: BrandProfile[] = [
  { name: "Google", tokens: ["google", "gmail", "youtube", "gstatic", "accounts-google"], category: "tech" },
  { name: "Apple", tokens: ["apple", "icloud", "appleid", "itunes", "appstore"], category: "tech" },
  { name: "Microsoft", tokens: ["microsoft", "outlook", "office365", "office", "live", "onedrive", "azure", "hotmail", "msn"], category: "tech" },
  { name: "Amazon", tokens: ["amazon", "aws", "kindle", "primevideo", "amazonses"], category: "commerce" },
  { name: "PayPal", tokens: ["paypal", "paypalsecure"], category: "finance" },
  { name: "Meta", tokens: ["facebook", "instagram", "whatsapp", "meta", "fb"], category: "social" },
  { name: "Netflix", tokens: ["netflix"], category: "media" },
  { name: "Spotify", tokens: ["spotify"], category: "media" },
  { name: "X / Twitter", tokens: ["twitter", "x.com"], category: "social" },
  { name: "LinkedIn", tokens: ["linkedin"], category: "social" },
  { name: "GitHub", tokens: ["github"], category: "tech" },
  { name: "Dropbox", tokens: ["dropbox"], category: "tech" },
  { name: "Adobe", tokens: ["adobe", "acrobat"], category: "tech" },
  { name: "Coinbase", tokens: ["coinbase"], category: "crypto" },
  { name: "Binance", tokens: ["binance"], category: "crypto" },
  { name: "MetaMask", tokens: ["metamask"], category: "crypto" },
  { name: "Chase", tokens: ["chase", "jpmorgan"], category: "bank" },
  { name: "Bank of America", tokens: ["bankofamerica", "bofa"], category: "bank" },
  { name: "Wells Fargo", tokens: ["wellsfargo"], category: "bank" },
  { name: "Citibank", tokens: ["citibank", "citi"], category: "bank" },
  { name: "HSBC", tokens: ["hsbc"], category: "bank" },
  { name: "Barclays", tokens: ["barclays", "barclay"], category: "bank" },
  { name: "Visa", tokens: ["visa"], category: "finance" },
  { name: "Mastercard", tokens: ["mastercard"], category: "finance" },
  { name: "American Express", tokens: ["americanexpress", "amex"], category: "finance" },
  { name: "Revolut", tokens: ["revolut"], category: "finance" },
  { name: "Wise", tokens: ["wise", "transferwise"], category: "finance" },
  { name: "Steam", tokens: ["steampowered", "steamcommunity", "steam"], category: "gaming" },
  { name: "Epic Games", tokens: ["epicgames", "fortnite"], category: "gaming" },
  { name: "PlayStation", tokens: ["playstation", "sony", "psn"], category: "gaming" },
  { name: "DHL", tokens: ["dhl"], category: "shipping" },
  { name: "FedEx", tokens: ["fedex"], category: "shipping" },
  { name: "UPS", tokens: ["ups"], category: "shipping" },
  { name: "USPS", tokens: ["usps"], category: "shipping" },
  { name: "IRS", tokens: ["irs", "internalrevenue"], category: "gov" },
  { name: "Payoneer", tokens: ["payoneer"], category: "finance" },
  { name: "Stripe", tokens: ["stripe"], category: "finance" },
  { name: "DocuSign", tokens: ["docusign"], category: "saas" },
  { name: "Zoom", tokens: ["zoom"], category: "saas" },
  { name: "Slack", tokens: ["slack"], category: "saas" },
  { name: "TikTok", tokens: ["tiktok", "bytedance"], category: "social" },
  { name: "Discord", tokens: ["discord"], category: "social" },
  { name: "Reddit", tokens: ["reddit"], category: "social" },
  { name: "eBay", tokens: ["ebay"], category: "commerce" },
  { name: "Walmart", tokens: ["walmart"], category: "commerce" },
  { name: "AliExpress", tokens: ["aliexpress", "alibaba"], category: "commerce" },
  { name: "Outlook / Office", tokens: ["office", "sharepoint", "teams"], category: "tech" },
];

export const SHORTENERS = [
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly",
  "rebrand.ly", "cutt.ly", "shorturl.at", "tiny.cc", "rb.gy", "trib.al",
  "lnkd.in", "s.id", "v.gd", "bl.ink", "short.io", "soo.gd",
];

export const SUSPICIOUS_TLDS = new Set([
  "tk", "ml", "ga", "cf", "gq", "xyz", "top", "click", "link", "zip", "mov",
  "country", "stream", "download", "loan", "win", "review", "science", "work",
  "party", "date", "accountants", "racing", "bid", "trade", "webcam", "guru",
  "rest", "icu", "cfd", "sbs", "cyou", "quest", "shop", "fun", "bond", "beauty",
  "hair", "skin", "makeup", "yokohama", "tokyo", "support", "help", "security",
  "ren", "wang", "xin", "top", "buzz", "kim", "vip",
]);

export const FREE_HOSTS = [
  "github.io", "gitlab.io", "netlify.app", "vercel.app", "web.app", "firebaseapp.com",
  "pages.dev", "herokuapp.com", "glitch.me", "repl.co", "blogspot.com", "wordpress.com",
  "weebly.com", "wixsite.com", "square.site", "webflow.io", "surge.sh", "ngrok.io",
  "trycloudflare.com", "duckdns.org", "000webhostapp.com", "infinityfreeapp.com",
];

export const PHISH_KEYWORDS = [
  "login", "signin", "sign-in", "verify", "verification", "secure", "update",
  "account", "password", "passwd", "credential", "confirm", "unlock", "recover",
  "wallet", "invoice", "billing", "suspend", "limited", "unusual", "activity",
  "reset", "auth", "oauth", "session", "support-ticket", "dhl-parcel",
  "bankof", "webscr", "cmd-login", "resolve", "security-check",
];

export const HOMOGLYPHS: Record<string, string> = {
  "а": "a", "е": "e", "о": "o", "р": "p", "с": "c", "у": "y", "х": "x",
  "і": "i", "ј": "j", "ѕ": "s", "һ": "h", "ԁ": "d", "ɡ": "g",
  "Α": "A", "Β": "B", "Ε": "E", "Ζ": "Z", "Η": "H", "Ι": "I", "Κ": "K",
  "Μ": "M", "Ν": "N", "Ο": "O", "Ρ": "P", "Τ": "T", "Υ": "Y", "Χ": "X",
  "օ": "o", "ӏ": "l", "ⅼ": "l", "Ⅰ": "I", "ο": "o",
};

export const LEGIT_ROOTS = new Set([
  "google.com", "google.co.uk", "youtube.com", "gmail.com", "apple.com", "icloud.com",
  "microsoft.com", "live.com", "office.com", "office365.com", "outlook.com", "azure.com",
  "amazon.com", "amazonaws.com", "paypal.com", "paypal.me", "facebook.com", "instagram.com",
  "whatsapp.com", "meta.com", "netflix.com", "spotify.com", "twitter.com", "x.com",
  "linkedin.com", "github.com", "dropbox.com", "adobe.com", "coinbase.com", "binance.com",
  "chase.com", "bankofamerica.com", "wellsfargo.com", "citibank.com", "citi.com",
  "hsbc.com", "barclays.com", "visa.com", "mastercard.com", "americanexpress.com",
  "steampowered.com", "steamcommunity.com", "epicgames.com", "dhl.com", "fedex.com",
  "ups.com", "usps.com", "irs.gov", "gov.uk", "wikipedia.org", "cloudflare.com",
  "mozilla.org", "reddit.com", "discord.com", "tiktok.com", "zoom.us", "slack.com",
  "stripe.com", "docusign.com", "ebay.com", "walmart.com", "alibaba.com", "aliexpress.com",
]);
