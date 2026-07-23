"use client";

import dynamic from "next/dynamic";

interface GithubActivityLazyProps {
  username: string;
  name: string;
  github: string;
}

const GithubActivityDynamic = dynamic(
  () => import("@/components/sections/github-activity").then((m) => m.GithubActivity),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="glass h-40 animate-pulse rounded-2xl" />
      </div>
    ),
  }
);

export function GithubActivityLazy(props: GithubActivityLazyProps) {
  return <GithubActivityDynamic {...props} />;
}
