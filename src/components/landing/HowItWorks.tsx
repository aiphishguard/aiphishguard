const STEPS = [
  { n: "01", t: "Canonicalize", d: "Protocol, host, userinfo, punycode, and private-range checks before anything else runs." },
  { n: "02", t: "Feature graph", d: "Forty-plus lexical and structural signals: entropy, hyphens, nested labels, encodings, kit keywords." },
  { n: "03", t: "Vote", d: "Ten weighted models cast benign / suspicious / malicious ballots with independent reasoning." },
  { n: "04", t: "Brief", d: "A single risk score, a radar, DNS evidence, and actions a human can take in the next 30 seconds." },
];

export function HowItWorks() {
  return (
    <section className="container pb-8">
      <div className="glass overflow-hidden rounded-2xl">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[240px] bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 p-8">
            <div className="font-display text-xs tracking-[0.28em] text-primary">PIPELINE</div>
            <h2 className="mt-2 font-display text-3xl tracking-wide">How a scan thinks</h2>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              No GPU required. The entire ensemble runs on-device so a pasted URL never has to leave your workstation unless you opt into DNS.
            </p>
            <div className="mt-8 h-px w-full overflow-hidden bg-border">
              <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent animate-sweep" />
            </div>
          </div>
          <ol className="grid sm:grid-cols-2">
            {STEPS.map((s) => (
              <li key={s.n} className="border-t border-border p-6 lg:border-l lg:border-t-0 lg:even:border-l lg:[&:nth-child(-n+2)]:border-t-0 lg:[&:nth-child(n+3)]:border-t">
                <div className="font-mono text-xs text-primary">{s.n}</div>
                <div className="mt-2 font-display tracking-wide">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
