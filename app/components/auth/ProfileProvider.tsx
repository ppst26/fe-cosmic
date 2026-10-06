"use client";

import React, { createContext, useContext, useEffect } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { fetchProfile } from "@/lib/auth/client";
import { avatarPresetImageUrl, resolveAvatarPresetId } from "@/app/data/avatarPresets";
import { useScopedResource, type ScopedResource } from "@/app/hooks/useScopedResource";
import { useAuth } from "./AuthProvider";

const ProfileContext = createContext<ScopedResource<ProfileUser> | null>(null);

/**
 * โปรไฟล์เต็มของผู้ใช้ที่ login — โหลดครั้งเดียวต่อ session แล้วแชร์ทั้งแอป
 * แทนการเรียก fetchProfile() แยกในแต่ละ component · ต้องอยู่ใต้ AuthProvider (app/providers.tsx)
 */
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const profile = useScopedResource<ProfileUser>(user?.id ?? null, fetchProfile);
  const avatarSrc = profile.data
    ? avatarPresetImageUrl(resolveAvatarPresetId(profile.data.avatarPresetId, profile.data.id))
    : null;

  /** โหลดรูป avatar ไว้ก่อน — เปิดเมนู / โปรไฟล์แล้วรูปขึ้นทันที */
  useEffect(() => {
    if (!avatarSrc) return;
    const img = new Image();
    img.decoding = "async";
    img.src = avatarSrc;
  }, [avatarSrc]);

  return <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>;
}

/**
 * อ่านโปรไฟล์ — data / status / refresh() / setData() (หลังบันทึก avatar ฯลฯ)
 * ใช้ใน ProfileSlideOverCard · DesktopHubAccountBody · MenuDrawerUserAvatar · /profile/account · /referral
 */
export function useProfile(): ScopedResource<ProfileUser> {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile ต้องใช้ภายใน ProfileProvider");
  return ctx;
}
