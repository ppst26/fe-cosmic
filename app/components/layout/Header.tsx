"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CosmicbetLogo,
  HeaderWalletIcon,
  ProfileNavIcon,
  SearchIcon,
} from "../ui/Icons";
import { useAuth } from "../auth/AuthProvider";
import { useDeposit } from "../deposit/DepositProvider";
import { VipRankEmblem } from "../vip/VipRankEmblem";
import type { VipRankId } from "@/app/types/vip";
import { DESKTOP_PLAYER_PANEL_MOCK } from "@/app/data/desktopLobbyMockData";
import { HEADER_DESKTOP_NAV } from "@/app/data/lobbyMockData";
import {
  formatHeaderWalletBalance,
  MOCK_MAIN_WALLET_BALANCE,
} from "@/app/data/walletMockData";
import { useLobbyShellSidebarOptional } from "./LobbyShellSidebarContext";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

/**
 * Header — มือถือ: โลโก้ · ยอดเครดิต+ไอคอนกระเป๋า (ล็อกอิน) · โปรไฟล์ · ไม่มีการ์ด/ค้นหา/ปุ่ม +
 * Desktop lg+: full-width — ซ้าย logo · โปรโมชัน · ค้นหาแบบกะทัดรัด · ขวายอด · ฝาก · แจ้งเตือน · ยศ
 */
export function Header({ onLoginClick, onSignUpClick }: HeaderProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, openProfile, closeProfile, isProfileOpen } =
    useAuth();
  const { openDeposit } = useDeposit();
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

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

  const showAuthSkeleton = !isClientReady || isLoading;
  const showWallet = isClientReady && !isLoading && isAuthenticated;
  const balanceLabel = formatHeaderWalletBalance(MOCK_MAIN_WALLET_BALANCE);
  const rankId = DESKTOP_PLAYER_PANEL_MOCK.rankId as VipRankId;
  const lobbySidebar = useLobbyShellSidebarOptional();
  const sidebarHidden = lobbySidebar?.sidebarHidden ?? false;

  return (
    <>
      <header className="cosmic-nav-shell w-full min-w-0 lg:hidden">
        <div className="cosmic-nav glass-mobile-nav">
          <Link href="/" className="cosmic-logo" aria-label="Cosmicbet หน้าแรก">
            <CosmicbetLogo className="!h-auto !max-w-none w-[clamp(96px,22vw,132px)] object-contain" />
          </Link>

          <div className="cosmic-actions">
            {showAuthSkeleton ? (
              <div
                className="h-9 w-[8.75rem] animate-pulse rounded-[var(--radius-pill)] bg-[var(--surface-hover)]"
                aria-hidden="true"
              />
            ) : showWallet ? (
              <div className="cosmic-nav__user-cluster glass-card--soft">
                <div className="cosmic-nav__wallet-inline" aria-live="polite">
                  <HeaderWalletIcon
                    className="h-5 w-5 shrink-0 text-[var(--icon-active)]"
                    aria-hidden="true"
                  />
                  <span className="cosmic-nav__wallet-balance text-sm font-medium tabular-nums">
                    {balanceLabel}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className={`cosmic-nav__profile-in-cluster profile-button${isProfileOpen ? " is-active" : ""}`}
                  aria-label="โปรไฟล์"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="dialog"
                >
                  <ProfileNavIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="cosmic-nav__auth">
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="cosmic-nav__auth-login glass-card--soft"
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
          </div>
        </div>
      </header>

      <header className="header-desktop-bar hidden lg:block">
        <div className="header-desktop-bar__inner header-desktop-bar__inner--split">
          <div className="header-desktop-bar__start">
            <Link
              href="/"
              className="header-desktop-bar__logo outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              aria-label="Cosmicbet หน้าแรก"
            >
              <CosmicbetLogo className="h-7 w-auto max-w-[min(100%,200px)]" />
            </Link>

            {lobbySidebar ? (
              <button
                type="button"
                className={cn(
                  "header-desktop-bar__menu-btn glass-card--soft",
                  sidebarHidden && "is-active",
                )}
                aria-expanded={!sidebarHidden}
                aria-label={sidebarHidden ? "แสดงเมนูด้านซ้าย" : "ซ่อนเมนูด้านซ้าย"}
                onClick={lobbySidebar.toggleSidebarHidden}
              >
                <HeaderSidebarToggleIcon hidden={sidebarHidden} />
              </button>
            ) : null}

            <nav className="header-desktop-bar__nav" aria-label="หมวดหลัก">
              {HEADER_DESKTOP_NAV.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                const showBadge = "showBadge" in item && item.showBadge;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`header-desktop-bar__nav-link cosmic-type-nav-label text-xs font-medium glass-card--soft${isActive ? " is-active" : ""}`}
                  >
                    {item.label}
                    {showBadge ? (
                      <span className="header-desktop-bar__nav-badge" aria-hidden />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <label className="header-desktop-bar__search header-desktop-bar__search--compact glass-card--soft">
              <span className="sr-only">ค้นหาเกมหรือค่าย</span>
              <SearchIcon className="h-[18px] w-[18px] shrink-0 text-[var(--text-muted)]" aria-hidden />
              <input
                type="search"
                className="header-desktop-bar__search-input text-sm font-medium"
                placeholder="ค้นหา"
                autoComplete="off"
              />
            </label>
          </div>

          <div className="header-desktop-bar__end">
            {showAuthSkeleton ? (
              <div
                className="h-11 w-48 animate-pulse rounded-[var(--radius-pill)] bg-[var(--surface-hover)]"
                aria-hidden="true"
              />
            ) : showWallet ? (
              <div className="header-desktop-bar__actions">
                <div className="header-desktop-bar__wallet glass-card--soft" aria-live="polite">
                  <HeaderWalletIcon className="h-[18px] w-[18px] shrink-0 text-[var(--icon-active)]" />
                  <span className="header-desktop-bar__wallet-balance text-sm font-medium tabular-nums">
                    {balanceLabel}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={openDeposit}
                  className="cosmic-cta-primary cosmic-cta-primary--sm text-sm font-medium"
                  aria-label="ฝากเงิน"
                  aria-haspopup="dialog"
                >
                  ฝาก
                </button>

                <button
                  type="button"
                  className="header-desktop-bar__icon-btn glass-card--soft glass-icon-btn"
                  aria-label="การแจ้งเตือน"
                >
                  <HeaderBellIcon />
                  <span className="header-desktop-bar__badge" aria-hidden />
                </button>

                <button
                  type="button"
                  onClick={handleProfileClick}
                  className={`header-desktop-bar__rank-btn glass-card--soft${isProfileOpen ? " is-active" : ""}`}
                  aria-label="ยศ VIP และโปรไฟล์"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="dialog"
                >
                  <VipRankEmblem rankId={rankId} size="xs" playing={false} />
                </button>
              </div>
            ) : (
              <div className="header-desktop-bar__actions">
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="header-desktop-bar__auth-login text-xs font-medium uppercase tracking-wide glass-card--soft"
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
          </div>
        </div>
      </header>
    </>
  );
}

/** ไอคอนย่อ/ขยายคอลัมน์ซ้าย — อิง Dexsport panel toggle */
function HeaderSidebarToggleIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" aria-hidden>
      <rect
        x="2.5"
        y="3.5"
        width="15"
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        d={hidden ? "M7.5 8.5 5 10.5 7.5 12.5" : "M7.5 3.5v13"}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeaderBellIcon() {
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
