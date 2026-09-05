export interface IntelEvent {
  id: string;
  minutesAgo: number;
  severity: "low" | "medium" | "high" | "critical";
  actor: string;
  title: string;
  region: string;
  ioc: string;
}

export const INTEL: IntelEvent[] = [
  { id: "i1", minutesAgo: 4, severity: "critical", actor: "Scattered Kit-12", title: "PayPal invoice clone using .xyz + punycode 'а'", region: "EU", ioc: "paypаl-secure.xyz" },
  { id: "i2", minutesAgo: 12, severity: "high", actor: "BEC-Nile", title: "CEO wire-transfer lure targeting finance desks", region: "NA", ioc: "reply-to mismatch + gift-card CTA" },
  { id: "i3", minutesAgo: 19, severity: "high", actor: "Office365-Mimic", title: "Fake Microsoft 365 device-code phishing", region: "APAC", ioc: "login.microsoftonline.com.account-verify.tk" },
  { id: "i4", minutesAgo: 27, severity: "medium", actor: "ParcelGhost", title: "DHL 'customs fee' SMS with bit.ly hop", region: "EU", ioc: "bit.ly/dhl-fee-*" },
  { id: "i5", minutesAgo: 41, severity: "critical", actor: "WalletDrain", title: "MetaMask seed-phrase overlay on lookalike host", region: "NA", ioc: "metamask-wallet-sync.com" },
  { id: "i6", minutesAgo: 55, severity: "low", actor: "Noise", title: "Benign marketing shortener spike (not hostile)", region: "GL", ioc: "linktr.ee campaign" },
  { id: "i7", minutesAgo: 73, severity: "high", actor: "TaxSeason", title: "IRS refund lure, raw IPv4 hosting", region: "NA", ioc: "185.243.x.x/irs-refund" },
  { id: "i8", minutesAgo: 88, severity: "medium", actor: "SteamGift", title: "Steam trade-token harvest via subdomain stuffing", region: "EU", ioc: "steamcommunity.login.gift-verify.top" },
  { id: "i9", minutesAgo: 102, severity: "high", actor: "DocuSign-Lite", title: "Shared-host PDF 'review document' kit", region: "LATAM", ioc: "*.netlify.app/doc/review" },
  { id: "i10", minutesAgo: 140, severity: "medium", actor: "AppleID-Echo", title: "appleid combo-squat on free DNS", region: "APAC", ioc: "appleid-recover.duckdns.org" },
];

export const CAMPAIGNS = [
  { name: "Kit-12 PayPal", active: true, victims: "Retail banking", method: "Typosquat + TLS" },
  { name: "Device-code M365", active: true, victims: "SaaS tenants", method: "OAuth device grant" },
  { name: "ParcelGhost SMS", active: true, victims: "Consumers", method: "Shortener + fake duty" },
  { name: "Seed overlay", active: true, victims: "Crypto users", method: "Homograph wallet UI" },
];
