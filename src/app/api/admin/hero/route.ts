import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

const DEFAULT_PROFILE = {
  id: "singleton",
  name: "Mohammed Abdul Azeez S",
  firstName: "Mohammed Abdul Azeez",
  title: "Java Full Stack Developer",
  tagline: "Spring Boot · React · PostgreSQL",
  location: "Tenkasi / Chennai, Tamil Nadu, India",
  email: "mdazeezsoftdev@gmail.com",
  phone: "8667005712",
  linkedin: "https://linkedin.com/in/mohammed-abdul-azeez-b876b5301",
  github: "https://github.com/Azeez11223",
  githubUsername: "Azeez11223",
  availability: "Available for opportunities",
  resumeUrl: "/resume.pdf",
  avatarUrl: null,
  gradYear: 2026,
  cgpa: "7.28",
};

const DEFAULT_OBJECTIVE = {
  id: "singleton",
  short: "Final-year IT student who builds backend systems the way production teams do: Spring Boot services, versioned REST APIs, and schemas that hold up under real queries.",
  long: "I'm a final-year B.Tech Information Technology student building hands-on experience with Spring Boot, REST APIs, and PostgreSQL through internships rather than a classroom-only curriculum. My focus is scalable backend systems and cloud-native architecture, and I work with GitHub Copilot and ChatGPT as part of a modern, AI-assisted development workflow, not as a shortcut around understanding the code. I'm looking to join an enterprise backend team in an Agile environment where I can keep shipping production-shaped work.",
};

const DEFAULT_ROLES = [
  { id: "hr-1", text: "Spring Boot Developer" },
  { id: "hr-2", text: "React Developer" },
  { id: "hr-3", text: "REST API Builder" },
  { id: "hr-4", text: "AI-Native Engineer" },
];

const DEFAULT_STATS = [
  { id: "st-1", value: 3, suffix: "", label: "Internships" },
  { id: "st-2", value: 5, suffix: "+", label: "Projects Built" },
  { id: "st-3", value: 3, suffix: "", label: "Certifications" },
];

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const profile = await db.profile.findUnique({ where: { id: 'singleton' } }).catch(() => null);
    const objective = await db.careerObjective.findUnique({ where: { id: 'singleton' } }).catch(() => null);
    const roles = await db.heroRole.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => []);
    const stats = await db.stat.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => []);

    return NextResponse.json({
      profile: profile || DEFAULT_PROFILE,
      objective: objective || DEFAULT_OBJECTIVE,
      roles: roles.length > 0 ? roles : DEFAULT_ROLES,
      stats: stats.length > 0 ? stats : DEFAULT_STATS,
    });
  } catch {
    return NextResponse.json({
      profile: DEFAULT_PROFILE,
      objective: DEFAULT_OBJECTIVE,
      roles: DEFAULT_ROLES,
      stats: DEFAULT_STATS,
    });
  }
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { profile, objective, careerObjective, roles, stats } = body;
    const targetObjective = objective || careerObjective;

    try {
      await db.$transaction(async (tx) => {
        if (profile) {
          const { id, updatedAt, ...profileData } = profile;
          await tx.profile.upsert({
            where: { id: 'singleton' },
            update: profileData,
            create: { ...profileData, id: 'singleton' },
          });
        }
        if (targetObjective) {
          const { id, updatedAt, ...objData } = targetObjective;
          await tx.careerObjective.upsert({
            where: { id: 'singleton' },
            update: objData,
            create: { ...objData, id: 'singleton' },
          });
        }
        if (roles) {
          await tx.heroRole.deleteMany({});
          if (roles.length > 0) {
            const cleanRoles = roles.map((r: any, idx: number) => ({
              text: r.text,
              sortOrder: r.sortOrder ?? idx,
            }));
            await tx.heroRole.createMany({ data: cleanRoles });
          }
        }
        if (stats) {
          await tx.stat.deleteMany({});
          if (stats.length > 0) {
            const cleanStats = stats.map((s: any, idx: number) => ({
              value: Number(s.value) || 0,
              suffix: s.suffix || '',
              label: s.label || '',
              sortOrder: s.sortOrder ?? idx,
            }));
            await tx.stat.createMany({ data: cleanStats });
          }
        }
      });
    } catch (err) {
      console.warn("DB update hero section notice:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
