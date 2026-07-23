"use client";

import { useEffect, useState } from "react";
import { Star, GitFork, ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

interface GithubActivityProps {
  username: string;
  name: string;
  github: string;
}

export function GithubActivity({ username, name, github }: GithubActivityProps) {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
    )
      .then((res) => {
        if (!res.ok) throw new Error("GitHub API request failed");
        return res.json();
      })
      .then((data: Repo[]) => {
        if (!cancelled) setRepos(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="github" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeader
        eyebrow="GitHub"
        title="Live from github.com"
        description="Pulled directly from the GitHub API — not a static screenshot, so it's only ever as current as the repo itself."
      />

      <Reveal delay={0.1}>
        <div className="glass mt-10 overflow-x-auto rounded-2xl p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://ghchart.rshah.org/f0a83c/${username}`}
            alt={`${name}'s GitHub contribution graph`}
            loading="lazy"
            width={880}
            height={110}
            className="mx-auto min-w-[720px]"
          />
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {error && (
          <p className="col-span-full text-sm text-[var(--text-muted)]">
            Couldn&apos;t load repositories right now — browse them directly on{" "}
            <a href={github} className="text-[var(--accent)] hover:underline">
              GitHub
            </a>
            .
          </p>
        )}

        {!repos && !error &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass h-32 animate-pulse rounded-2xl" />
          ))}

        {repos?.map((repo, i) => (
          <Reveal key={repo.id} delay={i * 0.05}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="glass flex h-full flex-col justify-between rounded-2xl p-5 hover:border-[var(--accent)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate font-mono text-sm font-semibold text-[var(--text-primary)]">
                    {repo.name}
                  </h3>
                  <ExternalLink size={14} className="shrink-0 text-[var(--text-muted)]" />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--text-muted)]">
                  {repo.description ?? "No description provided."}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                {repo.language && <Badge>{repo.language}</Badge>}
                <span className="flex items-center gap-1">
                  <Star size={12} /> {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={12} /> {repo.forks_count}
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
