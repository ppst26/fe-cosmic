"use client";

import React from "react";
import { SearchIcon, HeaderWalletIcon, ProfileNavIcon } from "../ui/Icons";
import { useAuth } from "../auth/AuthProvider";
import {
  formatHeaderWalletBalance,
  MOCK_MAIN_WALLET_BALANCE,
} from "@/app/data/walletMockData";

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
  const balanceLabel = formatHeaderWalletBalance(MOCK_MAIN_WALLET_BALANCE);

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
          <div className="lobby-desktop-topbar__wallet">
            <HeaderWalletIcon className="h-[18px] w-[18px] text-[var(--icon-default)]" />
            <span className="tabular-nums font-medium">{balanceLabel}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLoginClick}
              className="px-2 py-1 text-xs font-medium uppercase text-[var(--text-secondary)] hover:text-white"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={onSignUpClick}
              className="cosmic-cta-primary cosmic-cta-primary--sm uppercase tracking-wide"
            >
              Sign up
            </button>
          </div>
        )}

        <button
          type="button"
          className="lobby-desktop-topbar__icon-btn"
          aria-label="การแจ้งเตือน"
        >
          <BellIcon />
          <span className="lobby-desktop-topbar__badge" aria-hidden />
        </button>

        <button
          type="button"
          onClick={handleProfile}
          className="lobby-desktop-topbar__avatar"
          aria-label="โปรไฟล์"
        >
          <ProfileNavIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M12 3a4.5 4.5 0 0 0-4.5 4.5v2.1c0 .5-.2 1-.55 1.35L5.8 13.2A1.2 1.2 0 0 0 6.75 15h10.5a1.2 1.2 0 0 0 .95-1.8l-1.15-2.25a2 2 0 0 1-.55-1.35V7.5A4.5 4.5 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 17a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
