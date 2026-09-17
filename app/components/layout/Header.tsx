"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CosmicbetLogo,
  HeaderWalletIcon,
  ProfileNavIcon,
} from "../ui/Icons";
import { useAuth } from "../auth/AuthProvider";
import { useDeposit } from "../deposit/DepositProvider";
import { VipRankEmblem } from "../vip/VipRankEmblem";
import type { VipRankId } from "@/app/types/vip";
import { DESKTOP_PLAYER_PANEL_MOCK } from "@/app/data/desktopLobbyMockData";
import {
  formatHeaderWalletBalance,
  MOCK_MAIN_WALLET_BALANCE,
} from "@/app/data/walletMockData";

const GEMS_ASSET_SRC = "/assets/gems/gems.webp";

interface HeaderProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

/**
 * Header — มือถือ: notch · Desktop lg+: แถบเต็มความกว้าง (โฮม: พื้นหลังเต็มจอ · เนื้อหาใน __inner กว้างเท่า lobby frame)
 * ย่อ/ขยาย sidebar ใช้ปุ่มที่แถบซ้ายล่าง — ไม่มี hamburger ใน header
 */
export function Header({ onLoginClick, onSignUpClick }: HeaderProps) {
  const { isAuthenticated, isLoading, user, openProfile, closeProfile, isProfileOpen } =
    useAuth();
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
  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.phone
    : "";
  const rankId = DESKTOP_PLAYER_PANEL_MOCK.rankId as VipRankId;
  const rankLabel = DESKTOP_PLAYER_PANEL_MOCK.rankLabel;
  const gemsLabel = DESKTOP_PLAYER_PANEL_MOCK.gems.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <header className="header-notch-shell w-full min-w-0 lg:hidden">
        <div className="header-notch-inner">
          <div className="header-notch-wing min-w-0">
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
              <div className="flex w-full max-w-full items-center justify-center">
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
            </div>
          </div>

          <div className="header-notch-wing header-notch-wing--end">
            <button
              type="button"
              onClick={handleProfileClick}
              className="header-notch-profile-btn"
              aria-label="โปรไฟล์"
              aria-expanded={isProfileOpen}
              aria-haspopup="dialog"
            >
              <ProfileNavIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <header className="header-desktop-bar hidden lg:block">
        <div className="header-desktop-bar__inner">
          <div className="header-desktop-bar__start">
            <Link
              href="/"
              className="header-desktop-bar__logo outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              aria-label="Cosmicbet หน้าแรก"
            >
              <CosmicbetLogo className="h-7 w-auto max-w-[min(100%,200px)]" />
            </Link>
          </div>

          <div className="header-desktop-bar__end">
            {isLoading ? (
              <div
                className="h-11 w-48 animate-pulse rounded-[var(--radius-pill)] bg-[var(--surface-hover)]"
                aria-hidden="true"
              />
            ) : showWallet ? (
              <>
                <div className="header-desktop-bar__stat" aria-live="polite">
                  <span className="header-desktop-bar__stat-text">
                    <span className="header-desktop-bar__stat-label">THB</span>
                    <span className="header-desktop-bar__stat-value">{balanceLabel}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={openDeposit}
                  className="header-desktop-bar__deposit"
                  aria-label="เปิดหน้าฝากเงิน"
                  aria-haspopup="dialog"
                >
                  <HeaderWalletIcon className="h-4 w-4 shrink-0" />
                  <span>ฝากเงิน</span>
                </button>

                <div className="header-desktop-bar__divider" aria-hidden="true" />

                <div className="header-desktop-bar__stat">
                  <Image
                    src={GEMS_ASSET_SRC}
                    alt=""
                    width={28}
                    height={28}
                    className="header-desktop-bar__gems-img"
                    aria-hidden="true"
                  />
                  <span className="header-desktop-bar__stat-text">
                    <span className="header-desktop-bar__stat-label">Gems</span>
                    <span className="header-desktop-bar__stat-value">{gemsLabel}</span>
                  </span>
                </div>

                <div className="header-desktop-bar__divider" aria-hidden="true" />

                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="header-desktop-bar__user"
                  aria-label="โปรไฟล์"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="dialog"
                >
                  <VipRankEmblem rankId={rankId} size="sm" playing={false} />
                  <span className="header-desktop-bar__user-text">
                    <span className="header-desktop-bar__user-name">{displayName}</span>
                    <span className="header-desktop-bar__user-rank">{rankLabel}</span>
                  </span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="px-2 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)] transition-colors hover:text-white"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={onSignUpClick}
                  className="cosmic-action-btn px-4 py-2 text-xs uppercase"
                >
                  Sign up
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleProfileClick}
              className={`header-desktop-bar__icon-btn${isProfileOpen ? " is-active" : ""}`}
              aria-label="โปรไฟล์"
              aria-expanded={isProfileOpen}
              aria-haspopup="dialog"
            >
              <ProfileNavIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
