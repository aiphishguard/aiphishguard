import { Fingerprint, Globe2, Layers, Mail, Radar, ScanLine, ShieldCheck, Swords } from "lucide-react";

const FEATURES = [
  { icon: Layers, title: "10-model ensemble", body: "Lexical, glyph, typosquat, brand, structure, TLD, entropy, cloaking, kit, and infra detectors vote independently." },
  { icon: Fingerprint, title: "Homograph hunter", body: "Cyrillic, Greek, and punycode lookalikes are folded back to Latin and scored against watched brands." },
  { icon: Swords, title: "Brand impersonation", body: "Forty-plus high-value brands — banks, Big Tech, crypto, shipping — watched for combo-squats and fake logins." },
  { icon: Globe2, title: "Live DNS intel", body: "Cloudflare DNS-over-HTTPS for A/AAAA/MX/NS/TXT. SPF and DMARC presence is part of the score." },
  { icon: Mail, title: "Email & SMS lures", body: "Paste a message. We extract links, score social-engineering language, and scan every URL in-line." },
  { icon: ScanLine, title: "Bulk operations", body: "Drop a list of 50 URLs. Parallel-safe sequential analysis with CSV/JSON export for IR tickets." },
  { icon: Radar, title: "Explainable radar", body: "Every point on the gauge maps to a named factor you can brief to a human — no black box." },
  { icon: ShieldCheck, title: "Privacy by default", body: "History lives in your browser. Optional Supabase sync. Submitted URLs are not sold, ever." },
];

export function FeaturesSection() {
  return (
    <section className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="font-display text-xs tracking-[0.28em] text-primary">CAPABILITIES</div>
        <h2 className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">A SOC in the browser</h2>
        <p className="mt-3 text-muted-foreground">
          Recreated from the original PhishGuard AI brief — then pushed harder on explanation, ensemble voting, and visual threat storytelling.
        </p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <article key={f.title} className="glass rounded-xl p-5 transition hover:border-primary/40">
            <f.icon className="h-5 w-5 text-accent" />
            <h3 className="mt-4 font-display text-sm tracking-wide">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
