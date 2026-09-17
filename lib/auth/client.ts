import type {
  AuthActionResponse,
  AuthSessionResponse,
  LoginRequestBody,
  ProfileResponse,
  RegisterRequestBody,
  SessionUser,
} from "@/app/types/auth";

const jsonHeaders = { "Content-Type": "application/json" };

/**
 * เรียก API auth ฝั่ง client (ส่ง cookie อัตโนมัติ)
 */
export async function fetchSession(): Promise<SessionUser | null> {
  const res = await fetch("/api/auth/session", { credentials: "include" });
  if (!res.ok) return null;
  const data = (await res.json()) as AuthSessionResponse;
  return data.user;
}

export async function registerUser(body: RegisterRequestBody): Promise<AuthActionResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return (await res.json()) as AuthActionResponse;
}

export async function loginUser(body: LoginRequestBody): Promise<AuthActionResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return (await res.json()) as AuthActionResponse;
}

export async function fetchProfile() {
  const res = await fetch("/api/auth/profile", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  const data = (await res.json()) as ProfileResponse;
  return data.profile;
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
