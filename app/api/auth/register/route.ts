import { NextResponse } from "next/server";
import {
  createUser,
  toSessionUser,
} from "@/lib/auth/userStore";
import { attachSessionCookie } from "@/lib/auth/session";
import type { AuthActionResponse, RegisterRequestBody } from "@/app/types/auth";

/**
 * POST /api/auth/register — สมัครสมาชิก + ตั้ง session cookie
 */
export async function POST(request: Request) {
  let body: RegisterRequestBody;
  try {
    body = (await request.json()) as RegisterRequestBody;
  } catch {
    return NextResponse.json<AuthActionResponse>(
      { ok: false, error: "ข้อมูลไม่ถูกต้อง" },
      { status: 400 },
    );
  }

  const phone = body.phone?.trim() ?? "";
  const password = body.password ?? "";

  if (!phone || password.length < 6) {
    return NextResponse.json<AuthActionResponse>(
      { ok: false, error: "กรุณากรอกเบอร์และรหัสผ่านให้ครบ" },
      { status: 400 },
    );
  }

  if (!body.firstName?.trim() || !body.lastName?.trim()) {
    return NextResponse.json<AuthActionResponse>(
      { ok: false, error: "กรุณากรอกชื่อและนามสกุล" },
      { status: 400 },
    );
  }

  if (!body.bankId || !body.channelId || !body.bankAccountNumber?.trim()) {
    return NextResponse.json<AuthActionResponse>(
      { ok: false, error: "กรุณากรอกข้อมูลธนาคารให้ครบ" },
      { status: 400 },
    );
  }

  try {
    const user = await createUser({
      phone,
      password,
      firstName: body.firstName,
      lastName: body.lastName,
      bankAccountNumber: body.bankAccountNumber,
      bankId: body.bankId,
      channelId: body.channelId,
    });

    const sessionUser = toSessionUser(user);
    const response = NextResponse.json<AuthActionResponse>({
      ok: true,
      user: sessionUser,
    });
    attachSessionCookie(response, user.id);
    return response;
  } catch (err) {
    if (err instanceof Error && err.message === "PHONE_TAKEN") {
      return NextResponse.json<AuthActionResponse>(
        { ok: false, error: "เบอร์นี้มีบัญชีอยู่แล้ว" },
        { status: 409 },
      );
    }
    return NextResponse.json<AuthActionResponse>(
      { ok: false, error: "ไม่สามารถสมัครได้ ลองใหม่อีกครั้ง" },
      { status: 500 },
    );
  }
}
