"use client";

import React, { useEffect, useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { fetchProfile } from "@/lib/auth/client";
import { useAuth } from "../auth/AuthProvider";
import { avatarPresetImageUrl, resolveAvatarPresetId } from "@/app/data/avatarPresets";
import { UserAvatar, UserAvatarPlaceholder } from "../profile/UserAvatar";

interface MenuDrawerUserAvatarProps {
  /** โหลดโปรไฟล์เมื่อเมนูเปิด */
  isMenuOpen?: boolean;
}

/** cache ระดับ module — เปิดเมนูรอบถัดไปไม่ต้องรอ fetch/รูปใหม่ */
let cachedProfile: ProfileUser | null = null;
const preloadedSrc = new Set<string>();

function preloadAvatar(profile: ProfileUser) {
  const presetId = resolveAvatarPresetId(profile.avatarPresetId, profile.id);
  const src = avatarPresetImageUrl(presetId);
  if (preloadedSrc.has(src)) return;
  preloadedSrc.add(src);
  const img = new Image();
  img.decoding = "async";
  img.src = src;
}

/**
 * Avatar วงกลมบนเมนูมือถือ — จาก preset ที่ user เลือก (RightMenuDrawer)
 * ring ขนาดคงที่จาก CSS → placeholder ไม่ทำให้ layout ขยับ
 */
export function MenuDrawerUserAvatar({ isMenuOpen = false }: MenuDrawerUserAvatarProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileUser | null>(cachedProfile);

  /** ออกจากระบบ — ล้างรูปเดิมระหว่าง render (กันรูปคนก่อนค้างตอน login ใหม่) */
  const [wasAuthenticated, setWasAuthenticated] = useState(isAuthenticated);
  if (wasAuthenticated !== isAuthenticated) {
    setWasAuthenticated(isAuthenticated);
    if (!isAuthenticated) setProfile(null);
  }

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      cachedProfile = null;
      return;
    }
    let active = true;
    void fetchProfile().then((data) => {
      if (!active || !data) return;
      cachedProfile = data;
      preloadAvatar(data);
      setProfile(data);
    });
    return () => {
      active = false;
    };
  }, [isMenuOpen, isAuthenticated, isLoading]);

  return (
    <div className="menu-drawer-avatar menu-enter-avatar">
      <div className="menu-drawer-avatar__ring">
        {profile ? (
          <UserAvatar
            profile={profile}
            size="xl"
            eager
            className="menu-drawer-avatar__img !h-full !w-full !rounded-full"
            imageClassName="menu-drawer-avatar__img"
          />
        ) : (
          <UserAvatarPlaceholder size="xl" className="menu-drawer-avatar__img !h-full !w-full" />
        )}
      </div>
    </div>
  );
}
