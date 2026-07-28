import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadPDF } from "@/lib/upload";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    let profile = null;
    try {
      profile = await db.profile.findUnique({ where: { id: "singleton" } });
    } catch {
      // DB offline fallback
    }
    return NextResponse.json({
      exists: !!profile?.resumeUrl || true,
      resumeUrl: profile?.resumeUrl || "/resume.pdf",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch resume" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const { url } = await uploadPDF(file);

    try {
      await db.profile.upsert({
        where: { id: "singleton" },
        update: { resumeUrl: url },
        create: {
          id: "singleton",
          name: "Mohammed Abdul Azeez S",
          firstName: "Mohammed Abdul Azeez",
          title: "Java Full Stack Developer",
          tagline: "Spring Boot · React · PostgreSQL",
          location: "Tenkasi / Chennai, Tamil Nadu, India",
          email: "mdazeezsoftdev@gmail.com",
          phone: "8667005712",
          linkedin: "https://linkedin.com/in/mohammed-abdul-azeez-b876b5301",
          github: "https://github.com/Azeez11223",
          githubUsername: "Azeez11223",
          availability: "Available for opportunities",
          resumeUrl: url,
          gradYear: 2026,
          cgpa: "7.28",
        },
      });
    } catch (err) {
      console.warn("Resume uploaded to disk, DB sync warning:", err);
    }

    return NextResponse.json({ url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to upload resume" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    try {
      await db.profile.update({
        where: { id: "singleton" },
        data: { resumeUrl: null },
      });
    } catch (err) {
      console.warn("DB resume delete notice:", err);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete resume" }, { status: 500 });
  }
}
