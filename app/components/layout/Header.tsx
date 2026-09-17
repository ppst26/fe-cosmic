"use client";

import React from "react";
import Link from "next/link";
import {
  CosmicbetLogo,
  GiftIcon,
  HeaderWalletIcon,
  ProfileNavIcon,
} from "../ui/Icons";
import { useAuth } from "../auth/AuthProvider";
import { useDeposit } from "../deposit/DepositProvider";
import {
  formatHeaderWalletBalance,
  MOCK_MAIN_WALLET_BALANCE,
} from "@/app/data/walletMockData";

interface HeaderProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

/**
 * Header notch — มือถือ: โลโก้ซ้าย · ยอด/ล็อกอินกลาง · โปรไฟล์ขวา
 * Desktop lobby: โลโก้กลางในแท็บ notch · กระเป๋า/ฝาก/แจ้งเตือนขวา
 */
export function Header({ onLoginClick, onSignUpClick }: HeaderProps) {
  const { isAuthenticated, isLoading, openProfile, closeProfile, isProfileOpen } = useAuth();
  const { openDeposit } = useDeposit();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      if (isProfileOpen) {
        closeProfile();
      } else {
        openProfile();
      }
      return;
    }
    onLoginClick?.();
  };

  const showWallet = !isLoading && isAuthenticated;
  const balanceLabel = formatHeaderWalletBalance(MOCK_MAIN_WALLET_BALANCE);

  return (
    <header className="header-notch-shell w-full min-w-0">
      <div className="header-notch-inner">
        <div className="header-notch-wing min-w-0 lg:invisible lg:max-w-0 lg:overflow-hidden lg:opacity-0">
          <Link
            href="/"
            className="block min-w-0 max-w-[min(100%,140px)] outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] active:scale-95 rounded-[var(--radius-control)] sm:max-w-[160px]"
            aria-label="Cosmicbet หน้าแรก"
          >
            <CosmicbetLogo />
          </Link>
        </div>

        <div className="header-notch-center">
          <div className="header-notch-tab" aria-live="polite">
            <div className="flex w-full max-w-full items-center justify-center lg:hidden">
              {isLoading ? (
                <div
                  className="h-6 w-[7.5rem] animate-pulse rounded-[var(--radius-pill)] bg-[var(--surface-hover)]/80 sm:h-7 sm:w-[8.5rem]"
                  aria-hidden="true"
                />
              ) : showWallet ? (
                <>
                  <HeaderWalletIcon className="h-[18px] w-[18px] shrink-0 text-[var(--icon-default)] sm:h-5 sm:w-5" />
                  <span className="truncate text-sm font-extrabold tabular-nums tracking-tight sm:text-base">
                    {balanceLabel}
                  </span>
                </>
              ) : (
                <div className="flex max-w-full items-center justify-center gap-1 sm:gap-1.5">
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="shrink-0 whitespace-nowrap px-1 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--text-primary)] transition-colors hover:text-white active:opacity-80 sm:px-1.5 sm:text-[11px]"
                  >
                    LOG IN
                  </button>
                  <button
                    type="button"
                    onClick={onSignUpClick}
                    className="cosmic-action-btn shrink-0 cursor-pointer whitespace-nowrap px-2.5 py-1 text-[10px] uppercase tracking-wide sm:px-3.5 sm:py-1.5 sm:text-[11px]"
                  >
                    SIGN UP
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/"
              className="header-notch-tab-logo hidden min-w-0 max-w-[min(100%,160px)] outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] lg:block"
              aria-label="Cosmicbet หน้าแรก"
            >
              <CosmicbetLogo className="h-[22px] sm:h-6" />
            </Link>
          </div>
        </div>

        <div className="header-notch-wing header-notch-wing--end">
          <div className="header-notch-desktop-tools hidden flex-wrap items-center justify-end gap-1.5 lg:flex">
            <Link
              href="/promotions"
              className="lobby-desktop-header-dock__icon-btn"
              aria-label="โปรโมชั่น"
            >
              <GiftIcon className="h-[18px] w-[18px]" />
            </Link>

            {isLoading ? (
              <div className="h-9 w-28 animate-pulse rounded-[var(--radius-pill)] bg-[var(--surface-hover)]" />
            ) : showWallet ? (
              <>
                <div className="lobby-desktop-header-dock__balance" aria-live="polite">
                  <HeaderWalletIcon className="h-[18px] w-[18px] shrink-0 text-[var(--icon-default)]" />
                  <span className="truncate tabular-nums text-sm font-extrabold">{balanceLabel}</span>
                </div>
                <button
                  type="button"
                  onClick={openDeposit}
                  className="cosmic-action-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide"
                  aria-label="เปิดหน้าฝากเงิน"
                  aria-haspopup="dialog"
                >
                  <HeaderWalletIcon className="h-3.5 w-3.5" />
                  ฝากเงิน
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="px-1.5 py-1 text-[10px] font-bold uppercase text-[var(--text-secondary)] hover:text-white"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={onSignUpClick}
                  className="cosmic-action-btn px-2.5 py-1 text-[10px] uppercase"
                >
                  Sign up
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleProfileClick}
              className="lobby-desktop-header-dock__avatar"
              aria-label="โปรไฟล์"
              aria-expanded={isProfileOpen}
              aria-haspopup="dialog"
            >
              <ProfileNavIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="lobby-desktop-header-dock__icon-btn"
              aria-label="การแจ้งเตือน"
            >
              <HeaderBellIcon />
              <span className="lobby-desktop-header-dock__badge" aria-hidden />
            </button>
          </div>

          <button
            type="button"
            onClick={handleProfileClick}
            className="header-notch-profile-btn lg:hidden"
            aria-label="โปรไฟล์"
            aria-expanded={isProfileOpen}
            aria-haspopup="dialog"
          >
            <ProfileNavIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function HeaderBellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
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
