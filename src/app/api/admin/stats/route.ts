import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [
      totalProjects,
      totalExperiences,
      totalMessages,
      unreadMessages,
      totalCertifications,
      totalSkillGroups
    ] = await Promise.all([
      db.project.count(),
      db.experience.count(),
      db.contactMessage.count(),
      db.contactMessage.count({ where: { status: 'unread' } }),
      db.certification.count(),
      db.skillGroup.count()
    ]);

    return NextResponse.json({
      totalProjects,
      totalExperiences,
      totalMessages,
      unreadMessages,
      totalCertifications,
      totalSkillGroups
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
