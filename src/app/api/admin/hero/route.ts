import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const profile = await db.profile.findUnique({ where: { id: 'singleton' } });
    const objective = await db.careerObjective.findUnique({ where: { id: 'singleton' } });
    const roles = await db.heroRole.findMany({ orderBy: { sortOrder: 'asc' } });
    const stats = await db.stat.findMany({ orderBy: { sortOrder: 'asc' } });

    return NextResponse.json({ profile, objective, roles, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { profile, objective, careerObjective, roles, stats } = body;
    const targetObjective = objective || careerObjective;

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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

