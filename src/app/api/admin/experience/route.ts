import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { experienceSchema } from '@/lib/validators';

const DEFAULT_EXPERIENCES = [
  {
    id: "exp-1",
    role: "Backend Developer Intern",
    company: "Ethical Intelligent Technologies",
    duration: "Jan 2026 – Present",
    current: true,
    bullets: [
      "Developed backend modules and RESTful API endpoints using Java and Spring Boot, enabling data exchange between frontend and database layers",
      "Designed and tested 10+ REST APIs using Postman, ensuring reliability and correct response handling across endpoints",
      "Worked with PostgreSQL to write optimized queries and manage data models for backend business logic",
    ],
    tech: ["Java", "Spring Boot", "PostgreSQL", "Postman"],
  },
  {
    id: "exp-2",
    role: "Full Stack Developer Trainee Intern",
    company: "Eagle-HiTech Softclou Pvt. Ltd.",
    duration: "May 2025 – June 2025",
    current: false,
    bullets: [
      "Collaborated with senior developers to implement Firebase real-time data integration, reducing UI latency in data-driven components",
      "Participated in design and development of responsive UI components, ensuring cross-browser compatibility and seamless UX",
      "Followed Agile sprint workflows, participating in daily standups and code reviews",
    ],
    tech: ["Firebase", "JavaScript", "Agile"],
  },
  {
    id: "exp-3",
    role: "Frontend Developer Intern",
    company: "IBM SkillsBuild",
    duration: "June 2024 – July 2024",
    current: false,
    bullets: [
      "Developed responsive UI components and implemented form validation for offline-compatible login features",
      "Gained hands-on experience in front-end development practices including UI testing and accessibility",
    ],
    tech: ["HTML5", "CSS3", "JavaScript"],
  },
];

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const experiences = await db.experience.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => []);
    if (!experiences || experiences.length === 0) {
      return NextResponse.json(DEFAULT_EXPERIENCES);
    }
    const parsed = experiences.map((exp: any) => ({
      ...exp,
      bullets: typeof exp.bullets === 'string' ? JSON.parse(exp.bullets || '[]') : exp.bullets,
      tech: typeof exp.tech === 'string' ? JSON.parse(exp.tech || '[]') : exp.tech
    }));
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(DEFAULT_EXPERIENCES);
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const result = experienceSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    const data = result.data as any;
    const bullets = JSON.stringify(data.bullets || []);
    const tech = JSON.stringify(data.tech || []);

    try {
      const created = await db.experience.create({
        data: {
          ...data,
          bullets,
          tech,
        },
      });
      return NextResponse.json(created);
    } catch (err) {
      console.warn("DB create experience notice:", err);
      return NextResponse.json({ ...data, id: `exp-${Date.now()}` });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Operation failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const body = await req.json();
    const targetId = id || body.id;
    if (!targetId) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const result = experienceSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    const data = result.data as any;
    try {
      const updated = await db.experience.update({
        where: { id: targetId },
        data: {
          ...data,
          bullets: JSON.stringify(data.bullets || []),
          tech: JSON.stringify(data.tech || []),
        },
      });
      return NextResponse.json(updated);
    } catch (err) {
      console.warn("DB update experience notice:", err);
      return NextResponse.json({ ...data, id: targetId });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    try {
      await db.experience.delete({ where: { id } });
    } catch (err) {
      console.warn("DB delete experience notice:", err);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
