import { Seo } from "@/components/layout/Seo";

export default function Privacy() {
  return (
    <div className="container py-10">
      <Seo title="Privacy" />
      <article className="prose prose-invert mx-auto max-w-2xl">
        <div className="font-display text-xs tracking-[0.28em] text-primary">LEGAL</div>
        <h1 className="font-display text-3xl tracking-wide">Privacy policy</h1>
        <p className="text-sm text-muted-foreground">Effective 6 January 2026 · Last updated 5 September 2026</p>
        <p>
          AI Phish Guard is a client-side phishing analysis console. URLs you submit are processed in your browser by the
          local ensemble. A DNS lookup via Cloudflare DNS-over-HTTPS is made for the hostname so we can show A/MX/TXT records.
        </p>
        <h2 className="font-display text-xl">What we process</h2>
        <ul className="text-sm text-muted-foreground">
          <li>The URL or message text you paste, in-memory, for the duration of the scan.</li>
          <li>Optional scan history in <code>localStorage</code> on this device only.</li>
          <li>Hostname queries to Cloudflare DoH (<code>cloudflare-dns.com</code>) during live DNS steps.</li>
        </ul>
        <h2 className="font-display text-xl">What we do not do</h2>
        <ul className="text-sm text-muted-foreground">
          <li>No accounts. No tracking pixels. No sale of URLs or messages.</li>
          <li>No silent upload of page content to a model vendor.</li>
        </ul>
        <h2 className="font-display text-xl">Contact</h2>
        <p className="text-sm text-muted-foreground">
          admin@aiphishguard.site · Basit Ali, Ali Hassan, Muhammad Hassam · The Islamia University of Bahawalpur
        </p>
      </article>
    </div>
  );
}
