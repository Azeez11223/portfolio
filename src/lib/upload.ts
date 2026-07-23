import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_PDF_TYPES = ["application/pdf"];

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function uploadImage(
  file: File
): Promise<{ url: string; filename: string }> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Invalid image type. Allowed: JPEG, PNG, WebP, GIF");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size: 5MB");
  }

  await ensureUploadDir();

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `${randomUUID()}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  // Try to optimize with sharp, fallback to raw save
  try {
    const sharp = (await import("sharp")).default;
    await sharp(buffer)
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(filepath.replace(/\.[^.]+$/, ".jpg"));

    const optimizedFilename = filename.replace(/\.[^.]+$/, ".jpg");
    return {
      url: `/uploads/${optimizedFilename}`,
      filename: optimizedFilename,
    };
  } catch {
    // Fallback: save as-is
    await writeFile(filepath, buffer);
    return {
      url: `/uploads/${filename}`,
      filename,
    };
  }
}

export async function uploadPDF(
  file: File
): Promise<{ url: string; filename: string }> {
  if (!ALLOWED_PDF_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only PDF is allowed");
  }

  if (file.size > MAX_FILE_SIZE * 2) {
    throw new Error("File too large. Maximum size: 10MB");
  }

  await ensureUploadDir();

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `resume-${Date.now()}.pdf`;
  const filepath = path.join(UPLOAD_DIR, filename);
  await writeFile(filepath, buffer);

  // Sync to public/resume.pdf for static URL access
  try {
    const staticResumePath = path.join(process.cwd(), "public", "resume.pdf");
    await writeFile(staticResumePath, buffer);
  } catch {
    // Non-fatal if static copy fails
  }

  return {
    url: `/uploads/${filename}`,
    filename,
  };
}

export async function deleteFile(url: string): Promise<void> {
  if (!url || !url.startsWith("/uploads/")) return;

  const filename = url.replace("/uploads/", "");
  const filepath = path.join(UPLOAD_DIR, filename);

  try {
    if (existsSync(filepath)) {
      await unlink(filepath);
    }
  } catch {
    // File may not exist, that's ok
  }
}
