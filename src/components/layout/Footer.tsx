import { Link } from "react-router-dom";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/80">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Ensemble phishing detection for the open web. Ten specialized models vote on every URL —
            lexical, homograph, typosquat, brand, DNS, and kit-pattern analysis in one pass.
          </p>
        </div>
        <div>
          <div className="font-display text-xs tracking-[0.2em] text-muted-foreground">PRODUCT</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary">URL Scanner</Link></li>
            <li><Link to="/bulk" className="hover:text-primary">Bulk Scan</Link></li>
            <li><Link to="/email" className="hover:text-primary">Email Analyzer</Link></li>
            <li><Link to="/intel" className="hover:text-primary">Threat Intel</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-display text-xs tracking-[0.2em] text-muted-foreground">PROJECT</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/learn" className="hover:text-primary">Academy</Link></li>
            <li><Link to="/feedback" className="hover:text-primary">Feedback</Link></li>
            <li><Link to="/privacy" className="hover:text-primary">Privacy</Link></li>
            <li><a href="https://github.com/aiphishguard/aiphishguard" className="hover:text-primary">GitHub</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Built at The Islamia University of Bahawalpur · Basit Ali, Ali Hassan, Hassam Mehmood</span>
          <span className="font-mono tracking-widest">v2.0 · LOCAL ENSEMBLE</span>
        </div>
      </div>
    </footer>
  );
}
