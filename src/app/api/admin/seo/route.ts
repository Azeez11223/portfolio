import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { seoSchema } from '@/lib/validators';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const seo = await db.seoSettings.findUnique({ where: { id: 'singleton' } });
    if (seo) {
      seo.keywords = JSON.parse(seo.keywords || '[]');
    }
    return NextResponse.json(seo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
