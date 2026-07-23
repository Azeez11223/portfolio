"use client";

import { motion } from "framer-motion";
import { Mail, ArrowDown } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/ui/counter";
import { TypingRoles } from "@/components/ui/typing-roles";

interface HeroData {
  profile: {
    name: string;
    firstName: string;
    title: string;
    availability: string;
    email: string;
    linkedin: string;
    github: string;
    resumeUrl: string | null;
  };
  roles: string[];
  stats: { value: number; suffix: string; label: string }[];
  objective: { short: string; long: string };
}

export function Hero({ data }: { data: HeroData }) {
  const { profile, roles, stats, objective } = data;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-20"
    >
      <CircuitBackground />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-[var(--text-muted)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
          </span>
          {profile.availability}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-mono text-sm uppercase tracking-[0.25em] text-[var(--accent)]"
        >
          {profile.title}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 font-[family-name:var(--font-space-grotesk)] text-5xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-6xl md:text-7xl"
        >
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] bg-clip-text text-transparent">
            {profile.firstName}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-5 h-7 text-lg text-[var(--text-muted)] sm:text-xl"
        >
          <TypingRoles roles={roles} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg"
        >
          {objective.short}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button variant="primary" onClick={() => scrollTo("#projects")}>
            View Projects
          </Button>
          <a href={profile.resumeUrl || "/resume.pdf"} download>
            <Button variant="secondary">Download Resume</Button>
          </a>
          <div className="flex items-center gap-1">
            <IconLink href={profile.github} label="GitHub profile" icon={<GithubIcon size={18} />} />
            <IconLink href={profile.linkedin} label="LinkedIn profile" icon={<LinkedinIcon size={18} />} />
            <IconLink href={`mailto:${profile.email}`} label="Send email" icon={<Mail size={18} />} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="mx-auto mt-14 grid max-w-md grid-cols-3 gap-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl px-3 py-4">
              <div className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--accent)] sm:text-3xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to About section"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--text-muted)] hover:text-[var(--accent)]"
      >
        <ArrowDown size={20} />
      </motion.a>
    </section>
  );
}

function IconLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      aria-label={label}
      className="rounded-full p-3 text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--accent)]"
    >
      {icon}
    </a>
  );
}

function scrollTo(selector: string) {
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
}

function CircuitBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--bg)]" />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.16] motion-reduce:opacity-[0.1]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="traceGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
        </defs>
        {[
          "M100,650 L100,400 L300,400 L300,200 L550,200",
          "M1100,700 L1100,480 L900,480 L900,300 L650,300",
          "M200,100 L200,260 L420,260 L420,470",
          "M1000,150 L1000,320 L780,320 L780,520 L600,520",
          "M60,300 L260,300",
          "M950,600 L1150,600",
        ].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="url(#traceGrad)"
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
        {[
          [550, 200],
          [420, 470],
          [650, 520],
          [300, 400],
          [900, 480],
          [200, 260],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={4} fill="var(--accent)" />
        ))}
      </svg>
    </div>
  );
}
