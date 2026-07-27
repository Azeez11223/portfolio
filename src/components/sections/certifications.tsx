"use client";

import { useState } from "react";
import { Award, ExternalLink, Eye, X, Image as ImageIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  credentialUrl?: string | null;
  imageUrl?: string | null;
}

export function Certifications({ items }: { items: CertificationItem[] }) {
  const [activePhoto, setActivePhoto] = useState<{ url: string; title: string; issuer: string } | null>(null);

  if (!items || !items.length) return null;

  return (
    <section id="certifications" className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
      <SectionHeader
        eyebrow="Certifications"
        title="Verified credentials & certificates"
      />

      <ul className="mt-12 space-y-4">
        {items.map((cert, i) => (
          <Reveal as="li" key={cert.id} delay={i * 0.08}>
            <div className="glass flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl p-4 sm:px-5 sm:py-4 transition-all duration-300 hover:border-[var(--accent-glow)]">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {cert.imageUrl ? (
                  <button
                    onClick={() => setActivePhoto({ url: cert.imageUrl!, title: cert.name, issuer: cert.issuer })}
                    className="relative group shrink-0 w-16 h-12 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all cursor-pointer"
                    title="Click to view certificate photo"
                  >
                    <img
                      src={cert.imageUrl}
                      alt={cert.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye size={16} className="text-white" />
                    </div>
                  </button>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
                    <Award size={20} className="text-[var(--accent)]" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--text-primary)] sm:text-base">
                    {cert.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">{cert.issuer}</p>
                </div>
              </div>

              {/* Action Buttons: Photo & Live Link */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {cert.imageUrl && (
                  <button
                    onClick={() => setActivePhoto({ url: cert.imageUrl!, title: cert.name, issuer: cert.issuer })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--text-muted)] bg-[var(--surface-hover)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors cursor-pointer border border-[var(--border)]"
                  >
                    <ImageIcon size={14} />
                    <span>View Photo</span>
                  </button>
                )}

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--accent)] bg-[var(--accent-soft)] hover:bg-[var(--accent)] hover:text-black transition-all cursor-pointer border border-[var(--accent-glow)]"
                    title="Open Live Credential Link"
                  >
                    <span>Live Link</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </ul>

      {/* Certificate Photo Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl max-w-3xl w-full p-4 sm:p-6 space-y-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                  {activePhoto.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">{activePhoto.issuer}</p>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Photo Container */}
            <div className="relative w-full max-h-[70vh] flex items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-[var(--border)] p-2">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <a
                href={activePhoto.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[var(--accent)] bg-[var(--accent-soft)] hover:bg-[var(--accent)] hover:text-black rounded-xl transition-colors cursor-pointer"
              >
                <ExternalLink size={14} /> Open Full Image
              </a>
              <button
                onClick={() => setActivePhoto(null)}
                className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--surface)] rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

