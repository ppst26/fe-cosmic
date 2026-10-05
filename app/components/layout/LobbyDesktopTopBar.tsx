"use client";

import React from "react";
import { SearchIcon, ProfileNavIcon } from "../ui/Icons";
import { HeaderUserAvatar } from "./HeaderUserAvatar";
import { HeaderWalletChip } from "./HeaderWalletChip";
import { useAuth } from "../auth/AuthProvider";
import {
  formatHeaderWalletBalance,
} from "@/app/data/walletMockData";
import { fetchWalletBalance } from "@/lib/api/profile";
import { HeaderGuestAuthButtons } from "./HeaderGuestAuthButtons";
import { NotificationDesktopPopover } from "../notifications/NotificationDesktopPopover";

interface LobbyDesktopTopBarProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

/**
 * แถบบน desktop lobby — ช่องค้นหากลาง · กระเป๋า · แจ้งเตือน · โปรไฟล์
 * ถูกเรียกใช้ใน app/page.tsx (ซ่อนบนมือถือ)
 */
export function LobbyDesktopTopBar({
  onLoginClick,
  onSignUpClick,
}: LobbyDesktopTopBarProps) {
  const { isAuthenticated, isLoading, openProfile } = useAuth();
  const balanceLabel = formatHeaderWalletBalance(fetchWalletBalance().amount);

  const handleProfile = () => {
    if (isAuthenticated) {
      openProfile();
      return;
    }
    onLoginClick?.();
  };

  return (
    <header
      className="lobby-desktop-topbar hidden w-full min-w-0 items-center gap-4 lg:flex"
      aria-label="แถบค้นหาและบัญชี"
    >
      <div className="lobby-desktop-topbar__search flex min-w-0 flex-1">
        <label className="lobby-desktop-topbar__search-field w-full">
          <span className="sr-only">ค้นหาเกม</span>
          <SearchIcon className="h-[18px] w-[18px] shrink-0 text-[var(--text-muted)]" aria-hidden />
          <input
            type="search"
            placeholder="ค้นหาเกม, ค่ายเกม หรือชื่อเกมที่คุณชอบ..."
            className="lobby-desktop-topbar__search-input"
          />
        </label>
      </div>

      <div className="lobby-desktop-topbar__actions flex shrink-0 items-center gap-2.5">
        {isLoading ? (
          <div className="h-10 w-32 animate-pulse rounded-[var(--radius-pill)] bg-[var(--surface-hover)]" />
        ) : isAuthenticated ? (
          <HeaderWalletChip balanceLabel={balanceLabel} variant="desktop" />
        ) : (
          <HeaderGuestAuthButtons
            onLoginClick={onLoginClick}
            onSignUpClick={onSignUpClick}
            loginClassName="header-desktop-bar__auth-login glass-card--soft rounded-(--header-chip-radius) border-0 px-[0.85rem]"
            signUpClassName=""
          />
        )}

        <NotificationDesktopPopover />

        <button
          type="button"
          onClick={handleProfile}
          className="lobby-desktop-topbar__avatar"
          aria-label="โปรไฟล์"
        >
          {isAuthenticated ? (
            <HeaderUserAvatar size="sm" className="h-9 w-9 rounded-full" />
          ) : (
            <ProfileNavIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  );
}
