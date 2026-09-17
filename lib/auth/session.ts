import { createHmac, timingSafeEqual } from "crypto";
import type { NextResponse } from "next/server";

const COOKIE_NAME = "cm_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 30;

function getSessionSecret(): string {
  return process.env.AUTH_SESSION_SECRET ?? "cosmicbet-dev-session-secret-change-me";
}

/**
 * สร้าง token session แบบ signed (userId.timestamp.sig)
 */
export function createSessionToken(userId: string): string {
  const timestamp = Date.now().toString();
  const payload = `${userId}.${timestamp}`;
  const sig = createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

/**
 * ตรวจ token และคืน userId ถ้าถูกต้อง
 */
export function parseSessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, timestamp, sig] = parts;
  if (!userId || !timestamp || !sig) return null;
  const payload = `${userId}.${timestamp}`;
  const expected = createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
  try {
    const ok = timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
    return ok ? userId : null;
  } catch {
    return null;
  }
}

/**
 * ตั้ง cookie session บน response
 */
export function attachSessionCookie(response: NextResponse, userId: string): void {
  const token = createSessionToken(userId);
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

/**
 * ลบ cookie session
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export { COOKIE_NAME };
