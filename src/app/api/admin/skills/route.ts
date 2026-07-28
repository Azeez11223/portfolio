import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { skillGroupSchema } from '@/lib/validators';

const DEFAULT_SKILL_GROUPS = [
  {
    id: "sg-1",
    category: "Programming",
    skills: [
      { name: "Java", tier: "Core" },
      { name: "SQL", tier: "Core" },
      { name: "Python (Basic)", tier: "Familiar" },
    ],
  },
  {
    id: "sg-2",
    category: "Backend",
    skills: [
      { name: "Spring Boot", tier: "Core" },
      { name: "REST APIs", tier: "Core" },
      { name: "Microservices", tier: "Working Knowledge" },
      { name: "JPA", tier: "Working Knowledge" },
      { name: "Hibernate", tier: "Working Knowledge" },
      { name: "JWT Authentication", tier: "Working Knowledge" },
    ],
  },
  {
    id: "sg-3",
    category: "Frontend",
    skills: [
      { name: "React", tier: "Working Knowledge" },
      { name: "HTML5", tier: "Working Knowledge" },
      { name: "CSS3", tier: "Working Knowledge" },
      { name: "JavaScript", tier: "Working Knowledge" },
    ],
  },
  {
    id: "sg-4",
    category: "Databases",
    skills: [
      { name: "PostgreSQL", tier: "Working Knowledge" },
      { name: "Firebase (NoSQL)", tier: "Familiar" },
    ],
  },
];

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const groups = await db.skillGroup.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => []);
    if (!groups || groups.length === 0) {
      return NextResponse.json(DEFAULT_SKILL_GROUPS);
    }
    const parsed = groups.map((g: any) => ({
      ...g,
      skills: typeof g.skills === 'string' ? JSON.parse(g.skills || '[]') : g.skills
    }));
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(DEFAULT_SKILL_GROUPS);
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const result = skillGroupSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    const data = result.data as any;
    try {
      const created = await db.skillGroup.create({
        data: {
          ...data,
          skills: JSON.stringify(data.skills || [])
        }
      });
      return NextResponse.json(created);
    } catch (err) {
      console.warn("DB create skillGroup notice:", err);
      return NextResponse.json({ ...data, id: `sg-${Date.now()}` });
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

    const result = skillGroupSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    const data = result.data as any;
    try {
      const updated = await db.skillGroup.update({
        where: { id: targetId },
        data: {
          ...data,
          skills: JSON.stringify(data.skills || [])
        }
      });
      return NextResponse.json(updated);
    } catch (err) {
      console.warn("DB update skillGroup notice:", err);
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
      await db.skillGroup.delete({ where: { id } });
    } catch (err) {
      console.warn("DB delete skillGroup notice:", err);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
