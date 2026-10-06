"use client";

import { useEffect } from "react";
import { avatarPresetImageUrl, resolveAvatarPresetId } from "@/app/data/avatarPresets";
import { useProfile } from "@/app/hooks/api/account";

/**
 * โหลดโปรไฟล์ + รูป avatar ไว้ตั้งแต่ login — เปิดเมนู / โปรไฟล์แล้วรูปขึ้นทันที (mount ใน app/providers.tsx)
 */
export function ProfileAvatarPrefetch() {
  const { data: profile } = useProfile();
  const avatarSrc = profile
    ? avatarPresetImageUrl(resolveAvatarPresetId(profile.avatarPresetId, profile.id))
    : null;

  useEffect(() => {
    if (!avatarSrc) return;
    const img = new Image();
    img.decoding = "async";
    img.src = avatarSrc;
  }, [avatarSrc]);

  return null;
}
