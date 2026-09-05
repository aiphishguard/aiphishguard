import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const QUIZ = [
  {
    q: "Which hostname is the real Apple ID portal?",
    options: ["appleid.apple.com", "appleid-apple.com", "appleid.apple.com.verify-account.tk", "xn--pple-43d.com"],
    answer: 0,
    why: "The registrable domain must be apple.com. Hyphenated lookalikes, nested TLDs, and punycode are classic kits.",
  },
  {
    q: "A message says 'wire the invoice to this new account today, keep it confidential.' What is it?",
    options: ["Normal vendor update", "Business Email Compromise", "Spam, but safe", "A 2FA prompt"],
    answer: 1,
    why: "Urgency + secrecy + payment diversion is the BEC triad. Call the vendor on a known number.",
  },
  {
    q: "Why are URL shorteners dangerous in unsolicited mail?",
    options: ["They always host malware", "They hide the landing host until you request it", "They break HTTPS", "Browsers cannot open them"],
    answer: 1,
    why: "The visible link is not the destination. Preview or expand before visiting.",
  },
];

export default function Learn() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const item = QUIZ[idx];
  const done = idx >= QUIZ.length;

  return (
    <div className="container py-10">
      <Seo title="Academy" />
      <div className="font-display text-xs tracking-[0.28em] text-primary">ACADEMY</div>
      <h1 className="mt-1 font-display text-3xl tracking-wide">Spot the phish</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Detection is half the product. The other half is a human who hesitates for one extra second.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{done ? "Session complete" : `Drill ${idx + 1} / ${QUIZ.length}`}</CardTitle>
          </CardHeader>
          <CardContent>
            {done ? (
              <div>
                <div className="font-display text-5xl text-cyber">{score}/{QUIZ.length}</div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {score === QUIZ.length ? "You read hostnames like an analyst." : "Review the wrong answers — kits rely on exactly those misses."}
                </p>
                <Button className="mt-6" onClick={() => { setIdx(0); setScore(0); setPicked(null); }}>
                  Drill again
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-lg">{item.q}</p>
                <div className="mt-4 grid gap-2">
                  {item.options.map((o, i) => {
                    const show = picked !== null;
                    const correct = i === item.answer;
                    return (
                      <button
                        key={o}
                        disabled={picked !== null}
                        onClick={() => {
                          setPicked(i);
                          if (i === item.answer) setScore((s) => s + 1);
                        }}
                        className={`rounded-lg border px-3 py-3 text-left text-sm transition ${
                          show && correct
                            ? "border-primary bg-primary/10"
                            : show && picked === i
                              ? "border-destructive bg-destructive/10"
                              : "border-border hover:border-primary/40"
                        }`}
                      >
                        <span className="font-mono text-[11px] text-muted-foreground mr-2">{String.fromCharCode(65 + i)}</span>
                        {o}
                      </button>
                    );
                  })}
                </div>
                {picked !== null && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">{item.why}</p>
                    <Button className="mt-4" variant="glow" onClick={() => { setIdx((n) => n + 1); setPicked(null); }}>
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <Accordion type="single" collapsible className="glass rounded-xl px-5">
            <AccordionItem value="a">
              <AccordionTrigger>Read the hostname, not the logo</AccordionTrigger>
              <AccordionContent>Logos are trivial to clone. The registrable domain is not. Train your eye on the last two labels.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Hover, don’t hurry</AccordionTrigger>
              <AccordionContent>Phishing wins on time pressure. Preview links, call the vendor, type the domain yourself.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="c">
              <AccordionTrigger>OTPs are not secrets you type into inbound mail</AccordionTrigger>
              <AccordionContent>A real service never asks you to paste a one-time code into a chat or a just-arrived form.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="d">
              <AccordionTrigger>Homographs exist</AccordionTrigger>
              <AccordionContent>Cyrillic а and Latin a are different code points. This engine folds them. Your eyes might not.</AccordionContent>
            </AccordionItem>
          </Accordion>
          <Card className="mt-4">
            <CardContent className="p-5 text-sm text-muted-foreground">
              <Badge className="mb-3">Field note</Badge>
              <p>Most successful phishing does not look “scammy.” It looks like a password reset you almost expected.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
