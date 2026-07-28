import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { certificationSchema } from '@/lib/validators';

const DEFAULT_CERTIFICATIONS = [
  { id: "cert-1", name: "Java", issuer: "HackerRank", credentialUrl: null, imageUrl: null },
  { id: "cert-2", name: "SQL (Intermediate)", issuer: "HackerRank", credentialUrl: null, imageUrl: null },
  { id: "cert-3", name: "English for Competitive Exam", issuer: "NPTEL", credentialUrl: null, imageUrl: null },
];

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const certs = await db.certification.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => []);
    if (!certs || certs.length === 0) {
      return NextResponse.json(DEFAULT_CERTIFICATIONS);
    }
    return NextResponse.json(certs);
  } catch {
    return NextResponse.json(DEFAULT_CERTIFICATIONS);
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const result = certificationSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    try {
      const created = await db.certification.create({ data: result.data });
      return NextResponse.json(created);
    } catch (err) {
      console.warn("DB create certification notice:", err);
      return NextResponse.json({ ...result.data, id: `cert-${Date.now()}` });
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

    const result = certificationSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    try {
      const updated = await db.certification.update({
        where: { id: targetId },
        data: result.data,
      });
      return NextResponse.json(updated);
    } catch (err) {
      console.warn("DB update certification notice:", err);
      return NextResponse.json({ ...result.data, id: targetId });
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
      await db.certification.delete({ where: { id } });
    } catch (err) {
      console.warn("DB delete certification notice:", err);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
