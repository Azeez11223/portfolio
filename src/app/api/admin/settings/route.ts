import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'prisma', 'site_settings.json');

const DEFAULT_SECTIONS_VISIBILITY = {
  hero: true,
  about: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  github: true,
  certifications: true,
  resume: true,
  contact: true,
  socialLinks: true,
};

async function readVisibilityFile() {
  if (existsSync(SETTINGS_FILE)) {
    try {
      const data = await readFile(SETTINGS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

async function writeVisibilityFile(visibilityObj: any) {
  try {
    await writeFile(SETTINGS_FILE, JSON.stringify(visibilityObj, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing site_settings.json', err);
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    let settings: any = null;
    try {
      const rows: any[] = await db.$queryRawUnsafe(`SELECT * FROM "SiteSettings" WHERE "id" = 'singleton'`);
      settings = rows[0] || null;
    } catch {
      // ignore
    }

    const fileConfig = await readVisibilityFile();
    let sectionsVisibility = DEFAULT_SECTIONS_VISIBILITY;

    if (fileConfig?.sectionsVisibility) {
      sectionsVisibility = { ...DEFAULT_SECTIONS_VISIBILITY, ...fileConfig.sectionsVisibility };
    } else if (settings?.sectionsVisibility) {
      try {
        const parsed = typeof settings.sectionsVisibility === 'string'
          ? JSON.parse(settings.sectionsVisibility)
          : settings.sectionsVisibility;
        sectionsVisibility = { ...DEFAULT_SECTIONS_VISIBILITY, ...parsed };
      } catch {
        // fallback
      }
    }

    return NextResponse.json({
      defaultTheme: settings?.defaultTheme || fileConfig?.defaultTheme || 'dark',
      logoText: settings?.logoText || fileConfig?.logoText || 'MA',
      faviconUrl: settings?.faviconUrl || fileConfig?.faviconUrl || null,
      sectionsVisibility,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const defaultTheme = body.defaultTheme || 'dark';
    const logoText = body.logoText || 'MA';
    const faviconUrl = body.faviconUrl || null;
    const sectionsVisibility = body.sectionsVisibility
      ? (typeof body.sectionsVisibility === 'object' ? body.sectionsVisibility : JSON.parse(body.sectionsVisibility))
      : DEFAULT_SECTIONS_VISIBILITY;

    const mergedVisibility = { ...DEFAULT_SECTIONS_VISIBILITY, ...sectionsVisibility };

    // Write to persistent settings JSON file
    await writeVisibilityFile({
      defaultTheme,
      logoText,
      faviconUrl,
      sectionsVisibility: mergedVisibility,
    });

    // Attempt DB write as well
    try {
      await db.$executeRawUnsafe(
        `INSERT OR REPLACE INTO "SiteSettings" ("id", "defaultTheme", "logoText", "faviconUrl", "sectionsVisibility", "updatedAt") VALUES ('singleton', ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        defaultTheme,
        logoText,
        faviconUrl,
        JSON.stringify(mergedVisibility)
      );
    } catch {
      // DB column might be missing in active connection cache, file backup persists state 100%
      try {
        await db.$executeRawUnsafe(
          `INSERT OR REPLACE INTO "SiteSettings" ("id", "defaultTheme", "logoText", "faviconUrl", "updatedAt") VALUES ('singleton', ?, ?, ?, CURRENT_TIMESTAMP)`,
          defaultTheme,
          logoText,
          faviconUrl
        );
      } catch {
        // ignore DB fallback errors
      }
    }

    return NextResponse.json({
      defaultTheme,
      logoText,
      faviconUrl,
      sectionsVisibility: mergedVisibility,
    });
  } catch (error: any) {
    console.error("PUT /api/admin/settings error:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
