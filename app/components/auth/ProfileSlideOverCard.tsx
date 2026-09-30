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
import { ProfileHubHeader } from "../profile/ProfileHubHeader";
import { ProfileSheetBody } from "../profile/ProfileSheetBody";
import { CloseIcon } from "../ui/Icons";
import { ResponsiveSheetHeader } from "../ui/ResponsiveSheetHeader";
import {
  RESPONSIVE_SHEET_HANDLE_CLASS,
  responsiveSheetCloseButtonClass,
  responsiveSheetContentClass,
  responsiveSheetOverlayClass,
} from "../ui/responsiveSheetDialog";
import { Menu3DIcon } from "../ui/Menu3DIcon";

interface ProfileSlideOverCardProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * โปรไฟล์ย่อ — bottom sheet glass + หัวม่วง (ทุก breakpoint)
 * ถูก mount ใน TransactionsProvider · เปิดจาก Header / ?layer=profile
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
    router.push("/cashback?tab=loss");
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
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={responsiveSheetOverlayClass("z-[65]")} />

        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className={responsiveSheetContentClass(
            "profile-hub-sheet z-[65] flex max-h-[min(92dvh,720px)] min-h-0 flex-col overflow-hidden !px-0 !pb-0 !pt-0 lg:!w-[min(92vw,480px)]",
            { variant: "profile" },
          )}
        >
          <Dialog.Title className="sr-only">ข้อมูลบัญชี</Dialog.Title>

          <div className="hidden shrink-0 px-4 pt-3 lg:block">
            <ResponsiveSheetHeader
              closeAriaLabel="ปิด"
              titleAlign="start"
              titleIconId="profile"
              titleIconDesktopOnly={false}
              className="responsive-sheet-header--hub responsive-sheet-header--hub-shell"
              title={<span className="text-2xl font-medium tracking-tight">ข้อมูลบัญชี</span>}
            />
          </div>

          <header className="profile-hub-sheet__hero shrink-0 lg:hidden">
            <div className={`${RESPONSIVE_SHEET_HANDLE_CLASS} profile-hub-sheet__handle`} aria-hidden="true" />

            <div className="profile-hub-sheet__hero-bar flex items-center justify-between gap-2 px-4 pb-3 pt-1">
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <Menu3DIcon
                  iconId="profile"
                  size={32}
                  className="profile-hub-sheet__title-icon h-8 w-8 shrink-0 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                />
                <p className="truncate text-base font-medium text-white">โปรไฟล์</p>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className={responsiveSheetCloseButtonClass(
                    "profile-hub-sheet__close !border-white/20 !text-white/90 hover:!text-white",
                  )}
                  aria-label="ปิดโปรไฟล์"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
          </header>

          <div className="profile-hub-sheet__pane flex min-h-0 flex-1 flex-col">
            <div className="profile-hub-sheet__body min-h-0 flex-1 overflow-y-auto px-3 pb-2 pt-3 sm:px-4 lg:px-5 lg:pb-4 lg:pt-1">
              {loading ? (
                <p className="py-4 text-center text-xs text-[var(--text-muted)]">กำลังโหลด...</p>
              ) : null}

              {!loading && profile === null ? (
                <p className="py-4 text-center text-xs text-[var(--text-muted)]">ไม่พบข้อมูลโปรไฟล์</p>
              ) : null}

              {!loading && profile ? (
                <>
                  <div className="lg:hidden">
                    <div className="profile-hub-sheet__user-card mb-3">
                      <ProfileHubHeader profile={profile} variant="sheet" />
                    </div>
                    <ProfileHubBody
                      profile={profile}
                      showHeader={false}
                      onOpenAccountDetail={handleOpenAccountPage}
                      onOpenTransactions={handleOpenTransactions}
                      onOpenLossRebate={handleOpenLossRebate}
                      onOpenVip={handleOpenVip}
                      onLogout={() => void handleLogout()}
                    />
                  </div>

                  <div className="hidden lg:block">
                    <ProfileSheetBody
                      profile={profile}
                      onLogout={() => void handleLogout()}
                      onOpenVip={handleOpenVip}
                    />
                  </div>
                </>
              ) : null}
            </div>

            <footer className="profile-hub-sheet__footer shrink-0 border-t border-[var(--glass-border)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="cosmic-sheet-soft-glass flex w-full items-center justify-center rounded-[var(--radius-panel)] py-3.5 text-sm font-medium text-[var(--text-primary)] transition-[background,transform] duration-[var(--motion-fast)]"
                >
                  ปิด
                </button>
              </Dialog.Close>
            </footer>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
