"use client";

import React from "react";
import { ProfileNavIcon } from "../ui/Icons";
import { cn } from "@/lib/utils";

interface HeaderUserAvatarProps {
  /** คงไว้เพื่อ API เดิมกับ Header — ไม่ใช้รูป preset แล้ว */
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
 * ไอคอนโปรไฟล์แบบเส้นใน header — Header · LobbyDesktopTopBar
 */
export function HeaderUserAvatar({
  className,
  size = "sm",
}: HeaderUserAvatarProps) {
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
