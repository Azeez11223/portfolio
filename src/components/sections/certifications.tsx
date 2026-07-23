import { Award, ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  credentialUrl?: string | null;
}

export function Certifications({ items }: { items: CertificationItem[] }) {
  if (!items.length) return null;

  return (
    <section id="certifications" className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
      <SectionHeader
        eyebrow="Certifications"
        title="Verified credentials"
      />

      <ul className="mt-12 space-y-4">
        {items.map((cert, i) => (
          <Reveal as="li" key={cert.id} delay={i * 0.08}>
            <div className="glass flex items-center gap-4 rounded-2xl px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
                <Award size={18} className="text-[var(--accent)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--text-primary)] sm:text-base">
                  {cert.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">{cert.issuer}</p>
              </div>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--accent)]"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
