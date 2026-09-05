import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const ITEMS = [
  { label: "Scan a URL", to: "/", hint: "Home" },
  { label: "Dashboard", to: "/dashboard", hint: "Analytics" },
  { label: "Scan history", to: "/history", hint: "History" },
  { label: "Bulk scanner", to: "/bulk", hint: "Batch" },
  { label: "Email analyzer", to: "/email", hint: "Message" },
  { label: "Threat intelligence", to: "/intel", hint: "Feed" },
  { label: "Phishing academy", to: "/learn", hint: "Learn" },
  { label: "Send feedback", to: "/feedback", hint: "Contact" },
  { label: "Privacy policy", to: "/privacy", hint: "Legal" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        nav("/");
        document.getElementById("url-input")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav]);

  const filtered = useMemo(
    () => ITEMS.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="border-b border-border p-3">
          <Input
            autoFocus
            placeholder="Jump to a surface…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <ul className="max-h-72 overflow-auto p-2">
          {filtered.map((i) => (
            <li key={i.to}>
              <button
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
                onClick={() => {
                  nav(i.to);
                  setOpen(false);
                  setQ("");
                }}
              >
                <span>{i.label}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{i.hint}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-3 py-2 font-mono text-[10px] tracking-widest text-muted-foreground">
          CTRL/⌘ K · / FOCUSES SCANNER
        </div>
      </DialogContent>
    </Dialog>
  );
}
