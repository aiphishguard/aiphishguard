import { FormEvent, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveFeedback } from "@/lib/storage";
import { toast } from "sonner";
import type { FeedbackPayload } from "@/types/analysis";
import { Seo } from "@/components/layout/Seo";

export default function Feedback() {
  const [form, setForm] = useState<FeedbackPayload>({
    name: "",
    email: "",
    type: "improvement",
    subject: "",
    message: "",
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.message.trim() || !form.subject.trim()) {
      toast.error("Subject and message are required.");
      return;
    }
    saveFeedback(form);
    toast.success("Logged locally. Thank you — the team reads every note.");
    setForm({ name: "", email: "", type: "improvement", subject: "", message: "" });
  };

  return (
    <div className="container py-10">
      <Seo title="Feedback" />
      <div className="mx-auto max-w-xl">
        <div className="font-display text-xs tracking-[0.28em] text-primary">SIGNAL</div>
        <h1 className="mt-1 font-display text-3xl tracking-wide">Feedback</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bugs, false positives, missed kits, feature ideas. Stored on this device (and synced if Supabase is configured).
        </p>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Send a note</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input className="mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as FeedbackPayload["type"] })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subject</Label>
                <Input className="mt-1" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea className="mt-1" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button type="submit" variant="glow">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
