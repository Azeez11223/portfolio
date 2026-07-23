"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Briefcase } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  duration: string;
  current: boolean;
  bullets: string[];
  tech: string[];
}

export function Experience({ entries }: { entries: ExperienceEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
      <SectionHeader
        eyebrow="Experience"
        title="Three internships, in order"
        description="Reverse-chronological — each one built on the last, from frontend fundamentals to production backend work."
      />

      <div className="relative mt-14">
        <div
          aria-hidden="true"
          className="absolute left-[19px] top-2 bottom-2 w-px bg-[var(--surface-border)]"
        />
        <ul className="space-y-4">
          {entries.map((entry, i) => {
            const open = openIndex === i;
            return (
              <Reveal as="li" key={entry.id} delay={i * 0.08} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className={`absolute left-[11px] top-6 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${
                    entry.current
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--surface-border)] bg-[var(--bg)]"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      entry.current ? "bg-[var(--accent)]" : "bg-[var(--text-muted)]"
                    }`}
                  />
                </span>

                <div className="glass rounded-2xl">
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={15} className="text-[var(--accent)]" />
                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--text-primary)]">
                          {entry.role}
                        </h3>
                        {entry.current && (
                          <Badge tone="accent" className="ml-1">Current</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {entry.company} · {entry.duration}
                      </p>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[var(--text-muted)] transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <ul className="space-y-2">
                            {entry.bullets.map((b) => (
                              <li
                                key={b}
                                className="flex gap-2 text-sm leading-relaxed text-[var(--text-muted)]"
                              >
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                                {b}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {entry.tech.map((t) => (
                              <Badge key={t}>{t}</Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
