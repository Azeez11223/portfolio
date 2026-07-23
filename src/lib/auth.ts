import { db } from "./db";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

export async function createSession(): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);

  await db.session.create({
    data: { token, expiresAt },
  });

  return token;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE / 1000,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({ where: { token } });
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { id: session.id } });
    return null;
  }

  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { token } });
    cookieStore.delete(SESSION_COOKIE);
  }
}

export function validateCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) return false;

  // Timing-safe comparison to prevent timing attacks
  const emailMatch = timingSafeCompare(email, adminEmail);
  const passwordMatch = timingSafeCompare(password, adminPassword);

  return emailMatch && passwordMatch;
}

function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    // Compare against self to maintain constant time
    const crypto = require("crypto");
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  const crypto = require("crypto");
  return crypto.timingSafeEqual(bufA, bufB);
}

// Clean up expired sessions periodically
export async function cleanupSessions() {
  await db.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}
