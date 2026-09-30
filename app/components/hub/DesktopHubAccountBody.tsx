"use client";

import React, { useEffect, useRef, useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { fetchProfile } from "@/lib/auth/client";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { ProfileSheetBody } from "@/app/components/profile/ProfileSheetBody";
import { useDesktopHubModal } from "./DesktopHubModalProvider";
import { useVipModal } from "@/app/components/vip/VipModalProvider";

/**
 * เนื้อหา hub ข้อมูลบัญชี — โหลดโปรไฟล์เมื่อ mount ใน DesktopHubModal
 */
export function DesktopHubAccountBody() {
  const { logout } = useAuth();
  const { closeHub } = useDesktopHubModal();
  const { openVipModal } = useVipModal();
  const [profile, setProfile] = useState<ProfileUser | null | undefined>(undefined);
  const fetchGenRef = useRef(0);

  useEffect(() => {
    const gen = ++fetchGenRef.current;
    void fetchProfile().then((data) => {
      if (gen !== fetchGenRef.current) return;
      setProfile(data);
    });
    return () => {
      fetchGenRef.current += 1;
    };
  }, []);

  if (profile === undefined) {
    return (
      <p className="py-12 text-center text-sm text-[var(--text-muted)]">กำลังโหลด...</p>
    );
  }

  if (profile === null) {
    return (
      <p className="py-12 text-center text-sm text-[var(--text-muted)]">ไม่พบข้อมูลบัญชี</p>
    );
  }

  const handleLogout = async () => {
    await logout();
    closeHub();
  };

  return (
    <ProfileSheetBody
      profile={profile}
      onLogout={() => void handleLogout()}
      onOpenVip={() => {
        closeHub();
        openVipModal();
      }}
    />
  );
}
