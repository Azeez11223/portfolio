import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { seoSchema } from '@/lib/validators';

const DEFAULT_SEO = {
  id: "singleton",
  siteTitle: "Mohammed Abdul Azeez S — Java Full Stack Developer",
  siteDescription:
    "Final-year IT student who builds backend systems the way production teams do: Spring Boot services, versioned REST APIs, and schemas that hold up under real queries.",
  keywords: [
    "Java Full Stack Developer",
    "Spring Boot Developer",
    "React Developer",
    "PostgreSQL",
    "Backend Developer Intern",
    "Mohammed Abdul Azeez S",
  ],
  siteUrl: "https://mdazeezsoftdev.vercel.app",
};

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const seo = await db.seoSettings.findUnique({ where: { id: 'singleton' } }).catch(() => null);
    if (seo) {
      return NextResponse.json({
        ...seo,
        keywords: typeof seo.keywords === 'string' ? JSON.parse(seo.keywords || '[]') : seo.keywords,
      });
    }
    return NextResponse.json(DEFAULT_SEO);
  } catch {
    return NextResponse.json(DEFAULT_SEO);
  }
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const result = seoSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    const data = result.data as any;
    try {
      const upserted = await db.seoSettings.upsert({
        where: { id: 'singleton' },
        update: {
          ...data,
          keywords: JSON.stringify(data.keywords || [])
        },
        create: {
          ...data,
          id: 'singleton',
          keywords: JSON.stringify(data.keywords || [])
        }
      });
      return NextResponse.json(upserted);
    } catch (err) {
      console.warn("DB update seoSettings notice:", err);
      return NextResponse.json({ ...data, id: 'singleton' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
