"use client";

import { useState, useTransition } from "react";
import { Send, Mail, User, MessageSquare } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

interface ContactProfile {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
}

export function Contact({ profile }: { profile: ContactProfile }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to send");
        }

        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    });
  }

  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
      <SectionHeader
        eyebrow="Contact"
        title="Let's connect"
        description="Have a question or want to work together? Drop me a message."
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_280px]">
        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="glass space-y-5 rounded-2xl p-6"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]"
              >
                <User size={12} /> Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]"
              >
                <Mail size={12} /> Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]"
              >
                <MessageSquare size={12} /> Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                minLength={10}
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                className="w-full resize-none rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isPending || status === "sending" || status === "sent"}
            >
              {status === "sending" ? (
                "Sending…"
              ) : status === "sent" ? (
                "Message Sent ✓"
              ) : status === "error" ? (
                "Failed — Try Again"
              ) : (
                <>
                  <Send size={15} className="mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="space-y-4">
            <InfoItem icon={Mail} label="Email" value={profile.email} href={`mailto:${profile.email}`} />
            <InfoItem icon={User} label="Phone" value={profile.phone} href={`tel:${profile.phone}`} />
            <InfoItem icon={User} label="Location" value={profile.location} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="glass flex items-center gap-3 rounded-xl px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
        <Icon size={14} className="text-[var(--accent)]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
        <p className="truncate text-sm text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block hover:opacity-80">
      {content}
    </a>
  ) : (
    content
  );
}
