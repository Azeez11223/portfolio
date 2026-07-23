import { GraduationCap, MapPin, CalendarClock, BadgeCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

interface AboutProps {
  profile: {
    location: string;
    availability: string;
    resumeUrl: string | null;
    avatarUrl?: string | null;
    gradYear: number;
  };
  objective: {
    long: string;
  };
  education: {
    degree: string;
    duration: string;
  } | null;
}

export function About({ profile, objective, education }: AboutProps) {
  const facts = [
    { icon: GraduationCap, label: education ? `${education.degree}, ${education.duration}` : "" },
    { icon: MapPin, label: profile.location },
    { icon: CalendarClock, label: `Graduating ${profile.gradYear}` },
    { icon: BadgeCheck, label: profile.availability },
  ].filter((f) => f.label);

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeader
        eyebrow="About"
        title="A backend-leaning fresher, not a padded resume"
        description="No invented client roster, no manufactured years of experience — just the internships, projects, and habits that got me here."
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start">
        <Reveal delay={0.1}>
          <div className="glass mx-auto aspect-square w-48 rounded-3xl lg:w-full overflow-hidden">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt="Profile Photo" className="h-full w-full rounded-3xl object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--accent-soft)] to-transparent font-[family-name:var(--font-space-grotesk)] text-5xl font-semibold text-[var(--accent)]">
                MA
              </div>
            )}
          </div>
        </Reveal>

        <div className="space-y-8">
          <Reveal delay={0.15}>
            <p className="text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
              {objective.long}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {facts.map((f) => (
                <li
                  key={f.label}
                  className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--text-primary)]"
                >
                  <f.icon size={16} className="shrink-0 text-[var(--accent)]" />
                  {f.label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="flex flex-wrap gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} download>
                  <Button variant="primary">Download Resume</Button>
                </a>
              )}
              <a href="#contact">
                <Button variant="secondary">Get in Touch</Button>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
