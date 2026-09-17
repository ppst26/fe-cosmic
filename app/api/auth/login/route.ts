import { NextResponse } from "next/server";
import { findUserByPhone, toSessionUser } from "@/lib/auth/userStore";
import { verifyPassword } from "@/lib/auth/password";
import { attachSessionCookie } from "@/lib/auth/session";
import type { AuthActionResponse, LoginRequestBody } from "@/app/types/auth";

/**
 * POST /api/auth/login — เข้าสู่ระบบด้วยเบอร์ + รหัสผ่าน
 */
export async function POST(request: Request) {
  let body: LoginRequestBody;
  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    return NextResponse.json<AuthActionResponse>(
      { ok: false, error: "ข้อมูลไม่ถูกต้อง" },
      { status: 400 },
    );
  }

  const phone = body.phone?.trim() ?? "";
  const password = body.password ?? "";

  if (!phone || !password) {
    return NextResponse.json<AuthActionResponse>(
      { ok: false, error: "กรุณากรอกเบอร์และรหัสผ่าน" },
      { status: 400 },
    );
  }

  const user = await findUserByPhone(phone);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json<AuthActionResponse>(
      { ok: false, error: "เบอร์หรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 },
    );
  }

  const sessionUser = toSessionUser(user);
  const response = NextResponse.json<AuthActionResponse>({
    ok: true,
    user: sessionUser,
  });
  attachSessionCookie(response, user.id);
  return response;
}
