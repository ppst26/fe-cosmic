"use client";

import React from "react";
import { useProfile } from "@/app/hooks/api/account";
import { UserAvatar, UserAvatarPlaceholder } from "../profile/UserAvatar";

/**
 * Avatar วงกลมบนเมนูมือถือ — จาก preset ที่ user เลือก (RightMenuDrawer)
 * โปรไฟล์ + รูปโหลดล่วงหน้าตั้งแต่ login (ProfileAvatarPrefetch) · ring ขนาดคงที่จาก CSS → placeholder ไม่ทำให้ layout ขยับ
 */
export function MenuDrawerUserAvatar() {
  const { data: profile } = useProfile();

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
