"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import type { ProfileUser } from "@/app/types/auth";
import { fetchProfile } from "@/lib/auth/client";
import { useAuth } from "./AuthProvider";
import { useVipModal } from "../vip/VipModalProvider";
import { useDesktopHubModal } from "../hub/DesktopHubModalProvider";
import { getIsDesktopViewport } from "../hub/useIsDesktop";
import { ProfileHubBody } from "../profile/ProfileHubBody";

interface ProfileSlideOverCardProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * การ์ดโปรไฟล์ยึดมุมขวาบน (ใต้ปุ่มโปรไฟล์ใน Header) — ทุก breakpoint
 * ไม่ใช้ overlay/backdrop · รายละเอียดบัญชีเต็ม → hub modal บน desktop
 */
export function ProfileSlideOverCard({ isOpen, onClose }: ProfileSlideOverCardProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const { openVipModal } = useVipModal();
  const { openHub } = useDesktopHubModal();
  const [profile, setProfile] = useState<ProfileUser | null | undefined>(undefined);
  const fetchGenRef = React.useRef(0);

  React.useEffect(() => {
    if (!isOpen) return;

    const gen = ++fetchGenRef.current;
    void fetchProfile().then((data) => {
      if (gen !== fetchGenRef.current) return;
      setProfile(data);
    });
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      fetchGenRef.current += 1;
      setProfile(undefined);
      onClose();
    }
  };

  const loading = isOpen && profile === undefined;

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const handleOpenTransactions = () => {
    onClose();
    if (getIsDesktopViewport()) {
      openHub("transactions");
      return;
    }
    router.push("/transactions");
  };

  const handleOpenLossRebate = () => {
    onClose();
    if (getIsDesktopViewport()) {
      openHub("cashback", { cashbackTab: "loss" });
      return;
    }
    router.push("/loss-rebate");
  };

  const handleOpenVip = () => {
    onClose();
    openVipModal();
  };

  const handleOpenAccountPage = () => {
    onClose();
    if (getIsDesktopViewport()) {
      openHub("account");
      return;
    }
    router.push("/profile/account");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      <Dialog.Portal>
        <div className="fixed inset-x-0 top-14 z-[60] pointer-events-none px-[var(--page-gutter)] sm:top-16 lg:top-[calc(env(safe-area-inset-top,0px)+var(--header-desktop-bar-height))]">
          <div className="mx-auto flex w-full max-w-[var(--content-max)] justify-end lg:max-w-[min(1680px,calc(100%-2*var(--page-gutter)))]">
            <Dialog.Content
              aria-describedby={undefined}
              onOpenAutoFocus={(event) => event.preventDefault()}
              className="pointer-events-auto cosmic-modal-shell flex max-h-[min(calc(100dvh-4rem),440px)] w-[min(100%,300px)] flex-col overflow-hidden bg-[var(--surface-mid)] px-3 pb-3 pt-3 text-[var(--text-primary)] shadow-[0_8px_24px_rgba(0,0,0,0.35)] outline-none origin-top-right data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 duration-150 lg:max-h-[min(calc(100dvh-6rem),480px)]"
            >
              <Dialog.Title className="sr-only">โปรไฟล์</Dialog.Title>

              <div className="min-h-0 flex-1 overflow-y-auto px-0 pb-0 pt-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {loading && (
                  <p className="py-6 text-center text-xs text-[var(--text-muted)]">กำลังโหลด...</p>
                )}

                {!loading && profile === null && (
                  <p className="py-6 text-center text-xs text-[var(--text-muted)]">
                    ไม่พบข้อมูลโปรไฟล์
                  </p>
                )}

                {!loading && profile && (
                  <ProfileHubBody
                    profile={profile}
                    onOpenAccountDetail={handleOpenAccountPage}
                    onOpenTransactions={handleOpenTransactions}
                    onOpenLossRebate={handleOpenLossRebate}
                    onOpenVip={handleOpenVip}
                    onLogout={() => void handleLogout()}
                  />
                )}
              </div>
            </Dialog.Content>
          </div>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
