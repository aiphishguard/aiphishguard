import type { DnsAnalysis, DnsRecordSet } from "@/types/analysis";

const DOH = "https://cloudflare-dns.com/dns-query";

async function query(name: string, type: string): Promise<string[]> {
  try {
    const res = await fetch(`${DOH}?name=${encodeURIComponent(name)}&type=${type}`, {
      headers: { Accept: "application/dns-json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.Answer ?? []).map((a: { data: string }) => String(a.data).replace(/"/g, ""));
  } catch {
    return [];
  }
}

export async function analyzeDns(hostname: string): Promise<DnsAnalysis> {
  const [A, AAAA, MX, NS, TXT, CAA] = await Promise.all([
    query(hostname, "A"),
    query(hostname, "AAAA"),
    query(hostname, "MX"),
    query(hostname, "NS"),
    query(hostname, "TXT"),
    query(hostname, "CAA"),
  ]);

  const records: DnsRecordSet = { A, AAAA, MX, NS, TXT, CAA };
  const resolved = A.length + AAAA.length > 0;
  const hasSpf = TXT.some((t) => t.toLowerCase().includes("v=spf1"));
  const hasDmarc = TXT.some((t) => t.toLowerCase().includes("v=dmarc1"));
  const hasDkimHint = TXT.some((t) => /dkim/i.test(t));
  const mxPresent = MX.length > 0;
  const notes: string[] = [];
  let risk = 0;

  if (!resolved) {
    notes.push("Domain did not resolve over DNS — parked, newly registered, or sinkholed.");
    risk += 28;
  }
  if (resolved && !hasSpf) {
    notes.push("No SPF record. Email from this domain is easier to spoof.");
    risk += 8;
  }
  if (resolved && !hasDmarc) {
    notes.push("No DMARC policy published.");
    risk += 6;
  }
  if (NS.some((n) => /freenom|afraid|duckdns|now-dns/i.test(n))) {
    notes.push("Nameservers associated with free / abuse-prone DNS providers.");
    risk += 18;
  }
  if (resolved && notes.length === 0) {
    notes.push("DNS looks conventional. SPF/DMARC presence is informational, not a verdict.");
  }

  return {
    resolved,
    records,
    hasSpf,
    hasDmarc,
    hasDkimHint,
    mxPresent,
    nameservers: NS,
    notes,
    risk,
  };
}
