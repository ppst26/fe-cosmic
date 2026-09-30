import { NextResponse } from "next/server";
import {
  createUser,
  toSessionUser,
} from "@/lib/auth/userStore";
import { attachSessionCookie } from "@/lib/auth/session";
import type { AuthActionResponse, RegisterRequestBody } from "@/app/types/auth";
import {
  isBankAccountNumber,
  isPasswordLengthOk,
  isPersonName,
  isThaiMobilePhone,
  sanitizeBankAccount,
  sanitizePhone,
} from "@/lib/fieldInput";

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

  const phone = sanitizePhone(body.phone ?? "");
  const password = body.password ?? "";
  const bankAccountNumber = sanitizeBankAccount(body.bankAccountNumber ?? "");

  if (!isThaiMobilePhone(phone)) {
    return NextResponse.json<AuthActionResponse>(
      { ok: false, error: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก ขึ้นต้นด้วย 0" },
      { status: 400 },
    );
  }

  if (!isPasswordLengthOk(password)) {
    return NextResponse.json<AuthActionResponse>(
      { ok: false, error: "รหัสผ่านต้องมี 6–32 ตัวอักษร" },
      { status: 400 },
    );
  }

  if (!isPersonName(body.firstName ?? "") || !isPersonName(body.lastName ?? "")) {
    return NextResponse.json<AuthActionResponse>(
      { ok: false, error: "ชื่อและนามสกุลต้องเป็นตัวอักษร" },
      { status: 400 },
    );
  }

  if (!body.bankId || !body.channelId || !isBankAccountNumber(bankAccountNumber)) {
    return NextResponse.json<AuthActionResponse>(
      { ok: false, error: "เลขบัญชีต้องเป็นตัวเลข 10–12 หลัก" },
      { status: 400 },
    );
  }

  try {
    const user = await createUser({
      phone,
      password,
      firstName: body.firstName,
      lastName: body.lastName,
      bankAccountNumber,
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
