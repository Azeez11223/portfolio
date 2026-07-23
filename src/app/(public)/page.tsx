import { db } from "@/lib/db";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Education } from "@/components/sections/education";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Certifications } from "@/components/sections/certifications";
import { GithubActivityLazy } from "@/components/sections/github-activity-lazy";
import { Contact } from "@/components/sections/contact";
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

  return DEFAULT_SECTIONS_VISIBILITY;
}

export default async function Home() {
  const [
    profile,
    objective,
    heroRoles,
    stats,
    experiences,
    education,
    skillGroups,
    projects,
    certifications,
    sectionsVisibility,
  ] = await Promise.all([
    db.profile.findUnique({ where: { id: "singleton" } }),
    db.careerObjective.findUnique({ where: { id: "singleton" } }),
    db.heroRole.findMany({ orderBy: { sortOrder: "asc" } }),
    db.stat.findMany({ orderBy: { sortOrder: "asc" } }),
    db.experience.findMany({ orderBy: { sortOrder: "asc" } }),
    db.education.findUnique({ where: { id: "singleton" } }),
    db.skillGroup.findMany({ orderBy: { sortOrder: "asc" } }),
    db.project.findMany({ orderBy: { sortOrder: "asc" } }),
    db.certification.findMany({ orderBy: { sortOrder: "asc" } }),
    getSectionsVisibility(),
  ]);

  if (!profile || !objective) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--text-muted)]">
          Portfolio data not found. Please run the database seed.
        </p>
      </div>
    );
  }

  const heroData = {
    profile: {
      ...profile,
      resumeUrl: sectionsVisibility.resume !== false ? profile.resumeUrl : null,
      github: sectionsVisibility.socialLinks !== false ? profile.github : "",
      linkedin: sectionsVisibility.socialLinks !== false ? profile.linkedin : "",
      email: sectionsVisibility.socialLinks !== false ? profile.email : "",
    },
    roles: heroRoles.map((r) => r.text),
    stats: stats.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label })),
    objective: { short: objective.short, long: objective.long },
  };

  const experienceData = experiences.map((e) => ({
    ...e,
    bullets: JSON.parse(e.bullets) as string[],
    tech: JSON.parse(e.tech) as string[],
  }));

  const skillData = skillGroups.map((g) => ({
    ...g,
    skills: JSON.parse(g.skills) as { name: string; tier: string }[],
  }));

  const projectData = projects.map((p) => ({
    ...p,
    features: JSON.parse(p.features) as string[],
    tech: JSON.parse(p.tech) as string[],
    impact: JSON.parse(p.impact) as string[],
  }));

  const aboutProfile = {
    ...profile,
    resumeUrl: sectionsVisibility.resume !== false ? profile.resumeUrl : null,
  };

  return (
    <>
      {sectionsVisibility.hero !== false && <Hero data={heroData} />}
      {sectionsVisibility.about !== false && (
        <About profile={aboutProfile} objective={objective} education={education} />
      )}
      {sectionsVisibility.experience !== false && <Experience entries={experienceData} />}
      {sectionsVisibility.education !== false && <Education data={education} />}
      {sectionsVisibility.skills !== false && <Skills groups={skillData} />}
      {sectionsVisibility.projects !== false && <Projects items={projectData} />}
      {sectionsVisibility.certifications !== false && <Certifications items={certifications} />}
      {sectionsVisibility.github !== false && (
        <GithubActivityLazy username={profile.githubUsername} name={profile.name} github={profile.github} />
      )}
      {sectionsVisibility.contact !== false && <Contact profile={profile} />}
    </>
  );
}
