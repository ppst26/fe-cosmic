"use client";

import React, { useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { UserAvatar } from "./UserAvatar";
import { ProfileAvatarPicker } from "./ProfileAvatarPicker";
import { cn } from "@/lib/utils";

interface ProfileAccountAvatarSectionProps {
  profile: ProfileUser;
  onProfileUpdated?: (profile: ProfileUser) => void;
}

/**
 * Avatar บนสุดหน้าข้อมูลบัญชี — แตะเปิดเลือก preset (ProfileAccountTabs)
 */
export function ProfileAccountAvatarSection({
  profile,
  onProfileUpdated,
}: ProfileAccountAvatarSectionProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      <section className="profile-account-avatar flex flex-col items-center gap-2 pb-1 pt-0">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className={cn(
            "group rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-page)]",
          )}
          aria-label="เปลี่ยนรูปโปรไฟล์"
        >
          <span className="menu-drawer-avatar__ring inline-flex">
            <UserAvatar
              profile={profile}
              size="xl"
              className="menu-drawer-avatar__img !h-full !w-full !rounded-full ring-2 ring-transparent transition-[box-shadow] group-hover:ring-[var(--border-active)]"
              imageClassName="menu-drawer-avatar__img"
            />
          </span>
        </button>
        <p className="text-xs text-[var(--text-muted)]">แตะรูปเพื่อเปลี่ยนโปรไฟล์</p>
      </section>

      <ProfileAvatarPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        currentPresetId={profile.avatarPresetId}
        onSaved={(next) => onProfileUpdated?.(next)}
      />
    </>
  );
}
