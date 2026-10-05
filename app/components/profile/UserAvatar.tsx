"use client";

import type { ProfileUser } from "@/app/types/auth";
import { avatarPresetImageUrl, resolveAvatarPresetId } from "@/app/data/avatarPresets";
import { ProfileAvatarIcon } from "../ui/Icons";
import { cn } from "@/lib/utils";

type UserAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_PX: Record<UserAvatarSize, number> = {
  xs: 32,
  sm: 40,
  md: 44,
  lg: 56,
  xl: 96,
};

const SIZE_CLASS: Record<UserAvatarSize, string> = {
  xs: "h-8 w-8 rounded-full",
  sm: "h-10 w-10 rounded-full",
  md: "h-11 w-11 rounded-full",
  lg: "h-14 w-14 rounded-xl",
  xl: "h-24 w-24 rounded-full",
};

export interface UserAvatarProps {
  profile: Pick<ProfileUser, "id" | "displayName" | "firstName" | "avatarPresetId" | "avatarUrl">;
  size?: UserAvatarSize;
  className?: string;
  imageClassName?: string;
}

/**
 * รูปโปรไฟล์จาก preset — ใช้ใน ProfileHubHeader · MenuDrawerUserAvatar
 */
export function UserAvatar({
  profile,
  size = "md",
  className,
  imageClassName,
}: UserAvatarProps) {
  const px = SIZE_PX[size];
  const presetId = resolveAvatarPresetId(profile.avatarPresetId, profile.id);
  const src = avatarPresetImageUrl(presetId, px * 2);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden bg-[var(--surface-hover)]",
        SIZE_CLASS[size],
        className,
      )}
    >
      <img
        src={src}
        alt=""
        width={px}
        height={px}
        className={cn("h-full w-full object-cover", imageClassName)}
        loading="lazy"
        decoding="async"
      />
      <span className="sr-only">รูปโปรไฟล์ {profile.displayName}</span>
    </span>
  );
}

/** placeholder เมื่อยังไม่มีโปรไฟล์ */
export function UserAvatarPlaceholder({
  size = "md",
  className,
}: {
  size?: UserAvatarSize;
  className?: string;
}) {
  const iconClass =
    size === "xl"
      ? "h-10 w-10"
      : size === "lg"
        ? "h-8 w-8"
        : size === "sm"
          ? "h-5 w-5"
          : size === "xs"
            ? "h-4 w-4"
            : "h-6 w-6";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-[var(--surface-hover)] text-[var(--icon-default)]",
        SIZE_CLASS[size],
        className,
      )}
      aria-hidden="true"
    >
      <ProfileAvatarIcon className={iconClass} />
    </span>
  );
}
