import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";

interface NavItem {
  label: string;
  href: string;
}

interface FooterProfile {
  name: string;
  email: string;
  linkedin: string;
  github: string;
}

interface FooterProps {
  nav: NavItem[];
  profile: FooterProfile | null;
}

export function Footer({ nav, profile }: FooterProps) {
  return (
    <footer className="border-t border-[var(--surface-border)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--text-primary)]">
            {profile?.name ?? "Portfolio"}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} · Built with Next.js, Tailwind CSS & Framer Motion
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-4 text-sm text-[var(--text-muted)]">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-[var(--text-primary)]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex gap-3">
          {profile?.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            >
              <GithubIcon size={18} />
            </a>
          )}
          {profile?.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            >
              <LinkedinIcon size={18} />
            </a>
          )}
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              aria-label="Send email"
              className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            >
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
