"use client";

import React, { useEffect, useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { fetchProfile } from "@/lib/auth/client";
import { useAuth } from "../auth/AuthProvider";
import { UserAvatar, UserAvatarPlaceholder } from "../profile/UserAvatar";

interface MenuDrawerUserAvatarProps {
  /** โหลดโปรไฟล์เมื่อเมนูเปิด */
  isMenuOpen?: boolean;
}

/**
 * Avatar วงกลมบนเมนูมือถือ — จาก preset ที่ user เลือก (RightMenuDrawer)
 */
export function MenuDrawerUserAvatar({ isMenuOpen = false }: MenuDrawerUserAvatarProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileUser | null>(null);

  useEffect(() => {
    if (!isMenuOpen || isLoading || !isAuthenticated) {
      if (!isMenuOpen) setProfile(null);
      return;
    }
    let active = true;
    void fetchProfile().then((data) => {
      if (active) setProfile(data);
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
