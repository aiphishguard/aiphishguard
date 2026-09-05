import { FormEvent } from "react";
import { Loader2, ScanSearch, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_URLS } from "@/lib/url-analyzer";

export function UrlScanner({
  url,
  setUrl,
  loading,
  onScan,
}: {
  url: string;
  setUrl: (v: string) => void;
  loading: boolean;
  onScan: (v?: string) => void;
}) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onScan();
  };

  return (
    <div className="relative">
      <form onSubmit={submit} className="glass glow-ring rounded-2xl p-2 sm:p-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <ScanSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="url-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a suspicious URL — https://…"
              autoComplete="off"
              spellCheck={false}
              className="h-14 w-full rounded-xl border-0 bg-transparent pl-11 pr-4 font-mono text-sm outline-none placeholder:text-muted-foreground/70"
            />
          </div>
          <Button type="submit" variant="glow" size="lg" disabled={loading} className="h-14 min-w-[148px] rounded-xl">
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {loading ? "Analyzing" : "Scan URL"}
          </Button>
        </div>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Try</span>
        {DEMO_URLS.map((d) => (
          <button
            key={d.url}
            type="button"
            onClick={() => {
              setUrl(d.url);
              onScan(d.url);
            }}
            className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
