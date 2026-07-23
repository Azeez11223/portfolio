"use client";

import { useState } from "react";
import { Code, Cpu, Database, Cloud, Globe, Wrench, Bot, BookOpen, Layers } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const TIER_MAP = {
  Core: { dot: "bg-[var(--accent)]", label: "Core" },
  "Working Knowledge": { dot: "bg-[var(--secondary)]", label: "Working" },
  Familiar: { dot: "bg-[var(--text-muted)]", label: "Familiar" },
} as Record<string, { dot: string; label: string }>;

const ICON_MAP: Record<string, React.ElementType> = {
  Programming: Code,
  Backend: Cpu,
  Frontend: Globe,
  Databases: Database,
  "CS Fundamentals": BookOpen,
  Cloud: Cloud,
  Tools: Wrench,
  Practices: Layers,
  "AI Tools": Bot,
};

export interface SkillGroupData {
  id: string;
  category: string;
  skills: { name: string; tier: string }[];
}

export function Skills({ groups }: { groups: SkillGroupData[] }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeader
        eyebrow="Skills"
        title="Honest skill tiers"
        description={
          <>
            Three tiers — <strong className="text-[var(--accent)]">Core</strong>{" "}
            (shipped production work),{" "}
            <strong className="text-[var(--secondary)]">Working Knowledge</strong>{" "}
            (project-level), and <strong>Familiar</strong> (classroom / intro) — so
            nobody has to guess what "proficient" means.
          </>
        }
      />

      <div className="mt-12 flex flex-wrap justify-center gap-2">
        {groups.map((group, i) => {
          const Icon = ICON_MAP[group.category] || Code;
          return (
            <button
              key={group.category}
              onClick={() => setActiveTab(i)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeTab === i
                  ? "bg-[var(--accent)] text-[#12100b]"
                  : "glass text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon size={14} />
              {group.category}
            </button>
          );
        })}
      </div>

      <Reveal key={activeTab} delay={0.05}>
        <div className="glass mx-auto mt-8 max-w-2xl rounded-2xl p-6">
          <div className="flex flex-wrap gap-3">
            {groups[activeTab]?.skills.map((s) => {
              const tier = TIER_MAP[s.tier] ?? TIER_MAP["Familiar"];
              return (
                <span
                  key={s.name}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-primary)]"
                >
                  <span className={`h-2 w-2 rounded-full ${tier.dot}`} />
                  {s.name}
                  <span className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                    {tier.label}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </Reveal>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
        {Object.entries(TIER_MAP).map(([key, { dot }]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${dot}`} />
            {key}
          </span>
        ))}
      </div>
    </section>
  );
}
