"use client";

import React from "react";
import { useLogoutConfirm } from "@/app/hooks/useLogoutConfirm";
import { ProfileSheetBody } from "@/app/components/profile/ProfileSheetBody";
import { useProfile } from "@/app/hooks/api/account";
import { useDesktopHubModal } from "./DesktopHubModalProvider";
import { useVipModal } from "@/app/components/vip/VipModalProvider";
import { ErrorState, LoadingState } from "@/app/components/ui/StatusState";

/**
 * เนื้อหา hub ข้อมูลบัญชี — โปรไฟล์จาก useProfile ใน DesktopHubModal
 */
export function DesktopHubAccountBody() {
  const { closeHub, openHub } = useDesktopHubModal();
  const { openLogoutConfirm, LogoutConfirmDialog } = useLogoutConfirm(closeHub);
  const { openVipModal } = useVipModal();
  const { data: profile, status, refresh, setData: setProfile } = useProfile();

  if (!profile) {
    if (status === "error") {
      return (
        <ErrorState
          title="โหลดข้อมูลบัญชีไม่สำเร็จ"
          description="ลองใหม่อีกครั้ง หากยังไม่ได้ ให้ออกจากระบบแล้วเข้าสู่ระบบใหม่"
          primaryAction={{ label: "ลองใหม่", onClick: refresh }}
        />
      );
    }
    return <LoadingState label="กำลังโหลดข้อมูลบัญชี…" />;
  }

  return (
    <>
      <ProfileSheetBody
        profile={profile}
        onLogout={openLogoutConfirm}
        onProfileUpdated={setProfile}
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
