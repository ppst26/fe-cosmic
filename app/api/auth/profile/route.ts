import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findUserById, toProfileUser } from "@/lib/auth/userStore";
import { COOKIE_NAME, parseSessionToken } from "@/lib/auth/session";
import type { ProfileResponse } from "@/app/types/auth";

/**
 * GET /api/auth/profile — ข้อมูลโปรไฟล์ผู้ใช้ที่ล็อกอิน
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const userId = parseSessionToken(token);

  if (!userId) {
    return NextResponse.json<ProfileResponse>({ profile: null }, { status: 401 });
  }

  const user = await findUserById(userId);
  if (!user) {
    return NextResponse.json<ProfileResponse>({ profile: null }, { status: 401 });
  }

  return NextResponse.json<ProfileResponse>({ profile: toProfileUser(user) });
}
