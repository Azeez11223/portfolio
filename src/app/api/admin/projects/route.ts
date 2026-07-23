import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { projectSchema } from '@/lib/validators';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const projects = await db.project.findMany({ orderBy: { sortOrder: 'asc' } });
    const parsed = projects.map((proj: any) => ({
      ...proj,
      features: JSON.parse(proj.features || '[]'),
      tech: JSON.parse(proj.tech || '[]'),
      impact: JSON.parse(proj.impact || '[]'),
    }));
    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const result = projectSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    const data = result.data as any;
    const created = await db.project.create({
      data: {
        ...data,
        features: JSON.stringify(data.features || []),
        tech: JSON.stringify(data.tech || []),
        impact: JSON.stringify(data.impact || [])
      },
    });
    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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

    const result = projectSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    const data = result.data as any;
    const updated = await db.project.update({
      where: { id: targetId },
      data: {
        ...data,
        features: JSON.stringify(data.features || []),
        tech: JSON.stringify(data.tech || []),
        impact: JSON.stringify(data.impact || [])
      },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await db.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

