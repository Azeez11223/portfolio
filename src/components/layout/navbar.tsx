"use client";

import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { Menu, X, Moon, Sun, Download } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface NavProfile {
  name: string;
  email: string;
  linkedin: string;
  github: string;
  resumeUrl: string | null;
}

interface NavbarProps {
  nav: NavItem[];
  profile: NavProfile | null;
  showResume?: boolean;
}

export function Navbar({ nav, profile, showResume = true }: NavbarProps) {
  const [condensed, setCondensed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = nav
      .map((n) => document.querySelector(n.href))
      .filter(Boolean) as Element[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [nav]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          condensed ? "py-2" : "py-4"
        )}
      >
        <div
          className={cn(
            "glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 transition-all duration-300",
            condensed ? "py-2" : "py-3"
          )}
        >
          <a
            href="#hero"
            className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold tracking-tight text-[var(--text-primary)]"
          >
            MA<span className="text-[var(--accent)]">.</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeSection === item.href
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            {showResume && (
              <a
                href={profile?.resumeUrl || "/resume.pdf"}
                download
                className="hidden items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[#12100b] hover:bg-[var(--accent-strong)] sm:inline-flex"
              >
                <Download size={14} /> Resume
              </a>
            )}
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="rounded-full p-2 text-[var(--text-primary)] hover:bg-[var(--surface)] md:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-[var(--accent)]"
      />

      {drawerOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="glass absolute right-0 top-0 flex h-full w-72 flex-col gap-2 p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="rounded-full p-2 text-[var(--text-primary)] hover:bg-[var(--surface)]"
              >
                <X size={20} />
              </button>
            </div>
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-[var(--text-primary)] hover:bg-[var(--surface)]"
              >
                {item.label}
              </a>
            ))}
            {showResume && (
              <a
                href={profile?.resumeUrl || "/resume.pdf"}
                download
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[#12100b]"
              >
                <Download size={14} /> Download Resume
              </a>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
