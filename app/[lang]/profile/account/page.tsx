"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useProfile } from "@/app/hooks/api/account";
import { ErrorState, LoadingState } from "@/app/components/ui/StatusState";
import { useLogoutConfirm } from "@/app/hooks/useLogoutConfirm";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { ProfileSheetBody } from "@/app/components/profile/ProfileSheetBody";
import { useVipModal } from "@/app/components/vip/VipModalProvider";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";
/**
 * หน้าข้อมูลบัญชี — เปิดจาก popover โปรไฟล์ (ไม่แสดงใน popover)
 */
export default function ProfileAccountPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { openLogoutConfirm, LogoutConfirmDialog } = useLogoutConfirm(() => router.replace("/"));
  const { openVipModal } = useVipModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: profile, status: profileStatus, refresh, setData: setProfile } = useProfile();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);


  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="mobile-standalone-page">
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="ข้อมูลบัญชี" backHref="/" />

      <main className="mobile-standalone-main pt-4">
        {!profile && profileStatus === "loading" && <LoadingState label="กำลังโหลดข้อมูลบัญชี…" />}

        {!profile && profileStatus === "error" && (
          <ErrorState
            variant="card"
            title="โหลดข้อมูลบัญชีไม่สำเร็จ"
            description="ลองใหม่อีกครั้ง หากยังไม่ได้ ให้ออกจากระบบแล้วเข้าสู่ระบบใหม่"
            primaryAction={{ label: "ลองใหม่", onClick: refresh }}
          />
        )}

        {profile && (
          <ProfileSheetBody
            profile={profile}
            onLogout={openLogoutConfirm}
            onOpenVip={() => openVipModal()}
            onProfileUpdated={setProfile}
          />
        )}
      </main>

      <LogoutConfirmDialog />

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
