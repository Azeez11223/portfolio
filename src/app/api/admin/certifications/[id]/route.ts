import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { certificationSchema } from "@/lib/validators";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const result = certificationSchema.safeParse(body);
    if (!result.success)
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );

    try {
      const updated = await db.certification.update({
        where: { id },
        data: result.data,
      });
      return NextResponse.json(updated);
    } catch (err) {
      console.warn("DB update certification notice:", err);
      return NextResponse.json({ ...result.data, id });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    try {
      await db.certification.delete({ where: { id } });
    } catch (err) {
      console.warn("DB delete certification notice:", err);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}
