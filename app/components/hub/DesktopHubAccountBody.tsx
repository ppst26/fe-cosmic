"use client";

import React, { useEffect, useRef, useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { fetchProfile } from "@/lib/auth/client";
import { useLogoutConfirm } from "@/app/hooks/useLogoutConfirm";
import { ProfileSheetBody } from "@/app/components/profile/ProfileSheetBody";
import { useDesktopHubModal } from "./DesktopHubModalProvider";
import { useVipModal } from "@/app/components/vip/VipModalProvider";
import { ErrorState, LoadingState } from "@/app/components/ui/StatusState";

/**
 * เนื้อหา hub ข้อมูลบัญชี — โหลดโปรไฟล์เมื่อ mount ใน DesktopHubModal
 */
export function DesktopHubAccountBody() {
  const { closeHub, openHub } = useDesktopHubModal();
  const { openLogoutConfirm, LogoutConfirmDialog } = useLogoutConfirm(closeHub);
  const { openVipModal } = useVipModal();
  const [profile, setProfile] = useState<ProfileUser | null | undefined>(undefined);
  const fetchGenRef = useRef(0);
  /** เพิ่มค่าเพื่อโหลดโปรไฟล์ใหม่ (ปุ่มลองใหม่) */
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const gen = ++fetchGenRef.current;
    void fetchProfile().then((data) => {
      if (gen !== fetchGenRef.current) return;
      setProfile(data);
    });
    return () => {
      fetchGenRef.current += 1;
    };
  }, [reloadKey]);

  if (profile === undefined) {
    return <LoadingState label="กำลังโหลดข้อมูลบัญชี…" />;
  }

  if (profile === null) {
    return (
      <ErrorState
        title="โหลดข้อมูลบัญชีไม่สำเร็จ"
        description="ลองใหม่อีกครั้ง หากยังไม่ได้ ให้ออกจากระบบแล้วเข้าสู่ระบบใหม่"
        primaryAction={{
          label: "ลองใหม่",
          onClick: () => {
            setProfile(undefined);
            setReloadKey((key) => key + 1);
          },
        }}
      />
    );
  }

  return (
    <>
      <ProfileSheetBody
        profile={profile}
        onLogout={openLogoutConfirm}
        onOpenTransactions={() => openHub("transactions")}
        onOpenVip={() => {
          closeHub();
          openVipModal();
        }}
      />
      <LogoutConfirmDialog />
    </>
  );
}
