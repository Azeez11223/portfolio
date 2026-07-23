"use client";

import { useId, useState } from "react";
import { ExternalLink, Layers } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Badge, TodoBadge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/tilt-card";
import { Dialog } from "@/components/ui/dialog";

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  oneLiner: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  tech: string[];
  impact: string[];
  duration?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  challenges?: string | null;
  imageUrl?: string | null;
  featured: boolean;
}

export function Projects({ items }: { items: ProjectItem[] }) {
  const [active, setActive] = useState<ProjectItem | null>(null);
  const titleId = useId();

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeader
        eyebrow="Projects"
        title="What I've built so far"
        description="Three projects, each pushed further than a tutorial clone — full detail, including what's still missing, is one click away."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.08}>
            <TiltCard
              onClick={() => {
                if (project.liveUrl) {
                  window.open(project.liveUrl, "_blank", "noopener,noreferrer");
                } else {
                  setActive(project);
                }
              }}
              className="group flex h-full cursor-pointer flex-col p-5"
            >
              <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-soft)] via-transparent to-[var(--secondary-soft)] overflow-hidden">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.imageUrl} alt={project.title} className="h-full w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <Layers size={28} className="text-[var(--accent)] opacity-70" />
                )}
              </div>
              <span className="mt-4 text-xs font-mono uppercase tracking-wide text-[var(--secondary)]">
                {project.category}
              </span>
              <h3 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                {project.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                {project.oneLiner}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.slice(0, 4).map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>

              {/* Separate Action Buttons */}
              <div className="mt-5 flex items-center justify-between gap-2 pt-3 border-t border-[var(--surface-border)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-[#12100b] hover:bg-[var(--accent-strong)] transition-colors"
                    >
                      <ExternalLink size={13} /> Live Demo
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--surface-border)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                    >
                      <GithubIcon size={13} /> GitHub
                    </a>
                  )}
                </div>
                <button
                  onClick={() => setActive(project)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-2 ml-auto"
                >
                  Details
                </button>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Dialog open={!!active} onClose={() => setActive(null)} titleId={titleId}>
        {active && <ProjectDetail project={active} titleId={titleId} />}
      </Dialog>
    </section>
  );
}

function ProjectDetail({ project, titleId }: { project: ProjectItem; titleId: string }) {
  return (
    <div>
      <span className="text-xs font-mono uppercase tracking-wide text-[var(--secondary)]">
        {project.category}
      </span>
      <h3
        id={titleId}
        className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--text-primary)]"
      >
        {project.title}
      </h3>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        {!project.duration || project.duration.startsWith("[TODO") ? (
          <TodoBadge>duration</TodoBadge>
        ) : (
          project.duration
        )}
      </p>

      <div className="mt-5 space-y-4">
        <DetailBlock label="Problem" text={project.problem} />
        <DetailBlock label="Solution" text={project.solution} />

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Key features
          </h4>
          <ul className="mt-2 space-y-1.5">
            {project.features.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-[var(--text-primary)]">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Tech stack
          </h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <Badge key={t} tone="accent">
                {t}
              </Badge>
            ))}
          </div>
        </div>

        {project.impact.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Impact
            </h4>
            <ul className="mt-2 space-y-1.5">
              {project.impact.map((m) => (
                <li key={m} className="flex gap-2 text-sm text-[var(--text-primary)]">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--success)]" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Challenges
          </h4>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {!project.challenges || project.challenges.startsWith("[TODO") ? (
              <TodoBadge>challenge notes</TodoBadge>
            ) : (
              project.challenges
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <GithubIcon size={15} /> View Repo
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--surface-border)] px-4 py-2 text-sm text-[var(--text-muted)]">
              <GithubIcon size={15} /> <TodoBadge>repo link</TodoBadge>
            </span>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[#12100b] hover:bg-[var(--accent-strong)]"
            >
              <ExternalLink size={15} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">{text}</p>
    </div>
  );
}
