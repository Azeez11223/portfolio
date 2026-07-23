// Simple in-memory rate limiter for login attempts
const attempts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: WINDOW_MS };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetAt - now,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - entry.count,
    resetIn: entry.resetAt - now,
  };
}

// Contact form rate limiter (more lenient)
const contactAttempts = new Map<string, { count: number; resetAt: number }>();
const CONTACT_WINDOW_MS = 60 * 1000; // 1 minute
const CONTACT_MAX = 3;

export function checkContactRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = contactAttempts.get(key);

  if (!entry || entry.resetAt < now) {
    contactAttempts.set(key, { count: 1, resetAt: now + CONTACT_WINDOW_MS });
    return true;
  }

  if (entry.count >= CONTACT_MAX) return false;

  entry.count++;
  return true;
}
