import { GraduationCap, MapPin, Calendar } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

interface EducationData {
  degree: string;
  institution: string;
  location: string;
  duration: string;
  cgpa: string;
}

export function Education({ data }: { data: EducationData | null }) {
  if (!data) return null;

  return (
    <section id="education" className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
      <SectionHeader
        eyebrow="Education"
        title="Academic background"
      />

      <Reveal delay={0.1}>
        <div className="glass mt-12 rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
              <GraduationCap size={24} className="text-[var(--accent)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--text-primary)]">
                {data.degree}
              </h3>
              <p className="mt-1 text-[var(--text-muted)]">{data.institution}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[var(--accent)]" />
                  {data.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[var(--accent)]" />
                  {data.duration}
                </span>
              </div>
              <div className="mt-4 inline-block rounded-full bg-[var(--accent-soft)] px-4 py-1.5 text-sm font-medium text-[var(--accent)]">
                CGPA: {data.cgpa}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
