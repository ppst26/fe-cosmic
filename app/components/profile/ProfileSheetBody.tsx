"use client";

import React from "react";
import type { ProfileUser } from "@/app/types/auth";
import { ProfileAccountTabs } from "./ProfileAccountTabs";

interface ProfileSheetBodyProps {
  profile: ProfileUser;
  onLogout: () => void;
  onOpenVip?: () => void;
  /** ใช้ใน popover โปรไฟล์ — ย่อ spacing */
  compact?: boolean;
}

/**
 * เนื้อหาหน้าข้อมูลบัญชี (/profile/account)
 */
export function ProfileSheetBody({
  profile,
  onLogout,
  onOpenVip,
  compact = false,
}: ProfileSheetBodyProps) {
  return (
    <ProfileAccountTabs
      profile={profile}
      onLogout={onLogout}
      onOpenVip={onOpenVip}
      compact={compact}
    />
  );
}
