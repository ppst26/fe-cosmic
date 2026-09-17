import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findUserById, toSessionUser } from "@/lib/auth/userStore";
import { COOKIE_NAME, parseSessionToken } from "@/lib/auth/session";
import type { AuthSessionResponse } from "@/app/types/auth";

/**
 * GET /api/auth/session — อ่านผู้ใช้จาก cookie ปัจจุบัน
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const userId = parseSessionToken(token);

  if (!userId) {
    return NextResponse.json<AuthSessionResponse>({ user: null });
  }

  const user = await findUserById(userId);
  if (!user) {
    return NextResponse.json<AuthSessionResponse>({ user: null });
  }

  return NextResponse.json<AuthSessionResponse>({ user: toSessionUser(user) });
}
