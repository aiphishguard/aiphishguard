import { cn } from "@/lib/utils";

export function Logo({ className, markOnly }: { className?: string; markOnly?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0" aria-hidden>
        <defs>
          <linearGradient id="pg" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22D3EE" />
            <stop offset="1" stopColor="#34D399" />
          </linearGradient>
        </defs>
        <path
          d="M20 4 L34 11 V22 C34 30 27 35.5 20 38 C13 35.5 6 30 6 22 V11 Z"
          fill="rgba(16,185,129,0.08)"
          stroke="url(#pg)"
          strokeWidth="1.7"
        />
        <path d="M14 21 L18.2 25.2 L27 15.5" stroke="url(#pg)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      {!markOnly && (
        <div className="leading-none">
          <div className="font-display text-[13px] tracking-[0.22em] text-foreground">
            AI PHISH <span className="text-primary">GUARD</span>
          </div>
          <div className="mt-0.5 font-mono text-[9px] tracking-[0.28em] text-muted-foreground">THREAT ENGINE</div>
        </div>
      )}
    </div>
  );
}
