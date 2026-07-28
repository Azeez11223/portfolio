import { db } from "./db";
import { cookies } from "next/headers";
import crypto, { randomUUID } from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

const globalSessions = globalThis as unknown as {
  activeSessions?: Map<string, { id: string; token: string; expiresAt: Date }>;
};

if (!globalSessions.activeSessions) {
  globalSessions.activeSessions = new Map();
}

const memorySessions = globalSessions.activeSessions;

export async function createSession(): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);
  const sessionObj = { id: token, token, expiresAt };

  memorySessions.set(token, sessionObj);

  try {
    await db.session.create({
      data: { token, expiresAt },
    });
  } catch (err) {
    console.warn("DB session creation notice (using memory fallback):", err);
  }

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

  const memSession = memorySessions.get(token);
  if (memSession) {
    if (memSession.expiresAt < new Date()) {
      memorySessions.delete(token);
      return null;
    }
    return memSession;
  }

  try {
    const session = await db.session.findUnique({
      where: { token },
    });

    if (!session) return null;

    if (session.expiresAt < new Date()) {
      try {
        await db.session.delete({ where: { id: session.id } });
      } catch {}
      return null;
    }

    memorySessions.set(token, session);
    return session;
  } catch (err) {
    console.warn("DB session lookup notice:", err);
    // If DB is offline, allow valid cookie token if present
    const fallbackSession = { id: token, token, expiresAt: new Date(Date.now() + SESSION_MAX_AGE) };
    memorySessions.set(token, fallbackSession);
    return fallbackSession;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    memorySessions.delete(token);
    try {
      await db.session.deleteMany({ where: { token } });
    } catch {}
    cookieStore.delete(SESSION_COOKIE);
  }
}

export function validateCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL || "mdazeezsoftdev@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

  const emailMatch = timingSafeCompare(email.trim(), adminEmail.trim());
  const passwordMatch = timingSafeCompare(password.trim(), adminPassword.trim());

  return emailMatch && passwordMatch;
}

function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

export async function cleanupSessions() {
  try {
    await db.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  } catch {}
}
