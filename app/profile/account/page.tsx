"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProfileUser } from "@/app/types/auth";
import { fetchProfile } from "@/lib/auth/client";
import { useAuth } from "@/app/components/auth/AuthProvider";
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
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { openVipModal } = useVipModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileUser | null | undefined>(undefined);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    void fetchProfile().then((data) => {
      if (!cancelled) setProfile(data);
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const loadingProfile = isAuthenticated && profile === undefined;

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="mobile-standalone-page">
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="ข้อมูลบัญชี" backHref="/" />

      <main className="mobile-standalone-main pt-4">
        {loadingProfile && (
          <p className="py-12 text-center text-sm text-[var(--text-muted)]">กำลังโหลด...</p>
        )}

        {!loadingProfile && profile === null && (
          <p className="py-12 text-center text-sm text-[var(--text-muted)]">
            ไม่พบข้อมูลบัญชี
          </p>
        )}

        {!loadingProfile && profile && (
          <ProfileSheetBody
            profile={profile}
            onLogout={() => void handleLogout()}
            onOpenVip={() => openVipModal()}
          />
        )}
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
