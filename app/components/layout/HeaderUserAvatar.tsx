"use client";

import React from "react";
import { ProfileNavIcon } from "../ui/Icons";
import { cn } from "@/lib/utils";
import { useProfile } from "@/app/hooks/api/account";
import { UserAvatar } from "../profile/UserAvatar";

interface HeaderUserAvatarProps {
  /** คงไว้เพื่อ API เดิมกับ Header */
  refreshWhenProfileCloses?: boolean;
  isProfileOpen?: boolean;
  className?: string;
  size?: "xs" | "sm" | "md";
}

const WRAP_CLASS: Record<NonNullable<HeaderUserAvatarProps["size"]>, string> = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  md: "h-11 w-11",
};

const ICON_CLASS: Record<NonNullable<HeaderUserAvatarProps["size"]>, string> = {
  xs: "h-[1.125rem] w-[1.125rem]",
  sm: "h-5 w-5",
  md: "h-6 w-6",
};

/**
 * รูปโปรไฟล์ (preset) ใน header — Header · LobbyDesktopTopBar
 * ระหว่างโหลดโปรไฟล์ / ยังไม่มีข้อมูล แสดงไอคอนเส้นแทน
 */
export function HeaderUserAvatar({
  className,
  size = "sm",
}: HeaderUserAvatarProps) {
  const { data: profile } = useProfile();

  if (profile) {
    return <UserAvatar profile={profile} size={size} eager className={cn("text-current", className)} />;
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-current",
        WRAP_CLASS[size],
        className,
      )}
      aria-hidden="true"
    >
      <ProfileNavIcon className={ICON_CLASS[size]} />
    </span>
  );
}
