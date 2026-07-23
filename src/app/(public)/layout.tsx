import { db } from "@/lib/db";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackToTop } from "@/components/layout/back-to-top";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "prisma", "site_settings.json");

const DEFAULT_SECTIONS_VISIBILITY = {
  hero: true,
  about: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  github: true,
  certifications: true,
  resume: true,
  contact: true,
  socialLinks: true,
};

async function getSectionsVisibility() {
  let visibility = DEFAULT_SECTIONS_VISIBILITY;

  if (existsSync(SETTINGS_FILE)) {
    try {
      const data = await readFile(SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed?.sectionsVisibility) {
        return { ...DEFAULT_SECTIONS_VISIBILITY, ...parsed.sectionsVisibility };
      }
    } catch {
      // fallback
    }
  }

  try {
    const rows: any[] = await db.$queryRawUnsafe(`SELECT * FROM "SiteSettings" WHERE "id" = 'singleton'`);
    const settings = rows[0] || null;
    if (settings?.sectionsVisibility) {
      const parsed = typeof settings.sectionsVisibility === "string" ? JSON.parse(settings.sectionsVisibility) : settings.sectionsVisibility;
      return { ...DEFAULT_SECTIONS_VISIBILITY, ...parsed };
    }
  } catch {
    // fallback
  }

  return visibility;
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navLinks, profile, sectionsVisibility] = await Promise.all([
    db.navLink.findMany({ orderBy: { sortOrder: "asc" } }),
    db.profile.findUnique({ where: { id: "singleton" } }),
    getSectionsVisibility(),
  ]);

  const filteredNav = navLinks
    .filter((n) => {
      const key = n.href.replace("#", "");
      if (key === "about" && sectionsVisibility.about === false) return false;
      if (key === "experience" && sectionsVisibility.experience === false) return false;
      if (key === "education" && sectionsVisibility.education === false) return false;
      if (key === "skills" && sectionsVisibility.skills === false) return false;
      if (key === "projects" && sectionsVisibility.projects === false) return false;
      if (key === "certifications" && sectionsVisibility.certifications === false) return false;
      if (key === "contact" && sectionsVisibility.contact === false) return false;
      return true;
    })
    .map((n) => ({ label: n.label, href: n.href }));

  const profileData = profile
    ? {
        name: profile.name,
        email: profile.email,
        linkedin: profile.linkedin,
        github: profile.github,
        resumeUrl: profile.resumeUrl,
      }
    : null;

  return (
    <>
      <LoadingScreen />
      <Navbar nav={filteredNav} profile={profileData} showResume={sectionsVisibility.resume !== false} />
      <main>{children}</main>
      <Footer nav={filteredNav} profile={profileData} />
      <BackToTop />
    </>
  );
}
