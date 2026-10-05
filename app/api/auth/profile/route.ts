import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findUserById, toProfileUser, updateUserAvatarPreset } from "@/lib/auth/userStore";
import { COOKIE_NAME, parseSessionToken } from "@/lib/auth/session";
import type {
  ProfileResponse,
  UpdateProfileAvatarRequest,
  UpdateProfileAvatarResponse,
} from "@/app/types/auth";

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

/**
 * PATCH /api/auth/profile — อัปเดต preset avatar
 */
export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const userId = parseSessionToken(token);

  if (!userId) {
    return NextResponse.json<UpdateProfileAvatarResponse>(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  let body: UpdateProfileAvatarRequest;
  try {
    body = (await request.json()) as UpdateProfileAvatarRequest;
  } catch {
    return NextResponse.json<UpdateProfileAvatarResponse>(
      { ok: false, error: "INVALID_BODY" },
      { status: 400 },
    );
  }

  const presetId = body.avatarPresetId?.trim();
  if (!presetId) {
    return NextResponse.json<UpdateProfileAvatarResponse>(
      { ok: false, error: "MISSING_PRESET" },
      { status: 400 },
    );
  }

  try {
    const user = await updateUserAvatarPreset(userId, presetId);
    return NextResponse.json<UpdateProfileAvatarResponse>({
      ok: true,
      profile: toProfileUser(user),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (message === "INVALID_PRESET") {
      return NextResponse.json<UpdateProfileAvatarResponse>(
        { ok: false, error: message },
        { status: 400 },
      );
    }
    if (message === "USER_NOT_FOUND") {
      return NextResponse.json<UpdateProfileAvatarResponse>(
        { ok: false, error: message },
        { status: 404 },
      );
    }
    return NextResponse.json<UpdateProfileAvatarResponse>(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
