import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { educationSchema } from '@/lib/validators';

const DEFAULT_EDUCATION = {
  id: "singleton",
  degree: "B.Tech Information Technology",
  institution: "B.S. Abdur Rahman Crescent Institute of Science and Technology",
  location: "Vandalur, Chennai",
  duration: "2022 – 2026",
  cgpa: "7.28",
};

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const education = await db.education.findUnique({ where: { id: 'singleton' } }).catch(() => null);
    return NextResponse.json(education || DEFAULT_EDUCATION);
  } catch {
    return NextResponse.json(DEFAULT_EDUCATION);
  }
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const result = educationSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    try {
      const upserted = await db.education.upsert({
        where: { id: 'singleton' },
        update: result.data,
        create: { ...result.data, id: 'singleton' }
      });
      return NextResponse.json(upserted);
    } catch (err) {
      console.warn("DB education update notice:", err);
      return NextResponse.json({ ...result.data, id: 'singleton' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
