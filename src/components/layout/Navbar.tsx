import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Radio } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Scan" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/bulk", label: "Bulk" },
  { to: "/email", label: "Email" },
  { to: "/intel", label: "Intel" },
  { to: "/learn", label: "Academy" },
];

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="hidden font-mono text-[11px] tracking-widest text-muted-foreground lg:inline">
      {now.toISOString().slice(11, 19)} UTC
    </span>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "bg-secondary text-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold tracking-widest text-primary sm:flex">
            <Radio className="h-3 w-3 animate-pulse" />
            ONLINE
          </div>
          <Clock />
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <Link to="/feedback">Feedback</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="md:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <Logo className="mb-8" />
              <div className="flex flex-col gap-1">
                {LINKS.map((l) => (
                  <Link key={l.to} to={l.to} className="rounded-md px-3 py-2 text-sm hover:bg-secondary">
                    {l.label}
                  </Link>
                ))}
                <Link to="/feedback" className="rounded-md px-3 py-2 text-sm hover:bg-secondary">
                  Feedback
                </Link>
                <Link to="/privacy" className="rounded-md px-3 py-2 text-sm hover:bg-secondary">
                  Privacy
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
