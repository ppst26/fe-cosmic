"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CosmicbetLogo,
  ChevronDownIcon,
  HeaderWalletIcon,
  ProfileNavIcon,
  SearchIcon,
  WithdrawNavIcon,
} from "../ui/Icons";
import { useAuth } from "../auth/AuthProvider";
import { useDeposit } from "../deposit/DepositProvider";
import { useWithdraw } from "../withdraw/WithdrawProvider";
import { VipRankEmblem } from "../vip/VipRankEmblem";
import type { VipRankId } from "@/app/types/vip";
import { DESKTOP_PLAYER_PANEL_MOCK } from "@/app/data/desktopLobbyMockData";
import { HEADER_DESKTOP_NAV } from "@/app/data/lobbyMockData";
import {
  formatHeaderWalletBalance,
  MOCK_MAIN_WALLET_BALANCE,
} from "@/app/data/walletMockData";

interface HeaderProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

/**
 * Header — มือถือ: .glass-mobile-nav (โลโก้ · ค้นหา · กระเป๋า+ฝาก · โปรไฟล์)
 * Desktop lg+: โลโก้ · โปรโมชัน · ค้นหา · กระเป๋า · CTA ฝาก · ไอคอน · โปรไฟล์ (glass-card--soft)
 */
export function Header({ onLoginClick, onSignUpClick }: HeaderProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, openProfile, closeProfile, isProfileOpen } =
    useAuth();
  const { openDeposit } = useDeposit();
  const { openWithdraw } = useWithdraw();

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
  const rankId = DESKTOP_PLAYER_PANEL_MOCK.rankId as VipRankId;

  return (
    <>
      <header className="cosmic-nav-shell w-full min-w-0 lg:hidden">
        <div className="cosmic-nav glass-mobile-nav">
          <Link href="/" className="cosmic-logo" aria-label="Cosmicbet หน้าแรก">
            <CosmicbetLogo className="!h-auto !max-w-none w-[clamp(96px,22vw,132px)] object-contain" />
          </Link>

          <div className="cosmic-actions">
            <button
              type="button"
              className="cosmic-nav__chip glass-card--soft glass-icon-btn"
              aria-label="ค้นหาเกม"
            >
              <SearchIcon className="h-5 w-5" aria-hidden />
            </button>

            {isLoading ? (
              <div
                className="cosmic-nav__wallet-cluster glass-card--soft wallet-button--skeleton"
                aria-hidden="true"
              />
            ) : showWallet ? (
              <div className="cosmic-nav__wallet-cluster glass-card--soft">
                <div className="wallet-button wallet-button--cluster" aria-live="polite">
                  <HeaderWalletIcon aria-hidden="true" />
                  <span>{balanceLabel}</span>
                </div>
                <button
                  type="button"
                  onClick={openDeposit}
                  className="cosmic-nav__deposit-cta cosmic-cta-primary"
                  aria-label="ฝากเงิน"
                  aria-haspopup="dialog"
                >
                  +
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

            <button
              type="button"
              onClick={handleProfileClick}
              className={`profile-button cosmic-nav__chip glass-card--soft glass-icon-btn${isProfileOpen ? " is-active" : ""}`}
              aria-label="โปรไฟล์"
              aria-expanded={isProfileOpen}
              aria-haspopup="dialog"
            >
              <ProfileNavIcon aria-hidden="true" />
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

            <nav className="header-desktop-bar__nav" aria-label="หมวดหลัก">
              {HEADER_DESKTOP_NAV.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                const showBadge = "showBadge" in item && item.showBadge;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`header-desktop-bar__nav-link glass-card--soft${isActive ? " is-active" : ""}`}
                  >
                    {item.label}
                    {showBadge ? (
                      <span className="header-desktop-bar__nav-badge" aria-hidden />
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="header-desktop-bar__center">
            <label className="header-desktop-bar__search glass-card--soft">
              <span className="sr-only">ค้นหาเกมหรือค่าย</span>
              <SearchIcon className="h-[18px] w-[18px] shrink-0 text-[var(--text-muted)]" aria-hidden />
              <input
                type="search"
                className="header-desktop-bar__search-input"
                placeholder="ค้นหาเกม / ค่าย"
                autoComplete="off"
              />
            </label>
          </div>

          <div className="header-desktop-bar__end">
            {isLoading ? (
              <div
                className="h-11 w-48 animate-pulse rounded-[var(--radius-pill)] bg-[var(--surface-hover)]"
                aria-hidden="true"
              />
            ) : showWallet ? (
              <div className="header-desktop-bar__actions">
                <div className="header-desktop-bar__wallet glass-card--soft" aria-live="polite">
                  <HeaderWalletIcon className="h-[18px] w-[18px] shrink-0 text-[var(--icon-active)]" />
                  <span className="header-desktop-bar__wallet-balance">{balanceLabel}</span>
                </div>

                <button
                  type="button"
                  onClick={openDeposit}
                  className="cosmic-cta-primary cosmic-cta-primary--sm"
                  aria-label="ฝากเงิน"
                  aria-haspopup="dialog"
                >
                  ฝาก
                </button>

                <button
                  type="button"
                  onClick={openWithdraw}
                  className="header-desktop-bar__icon-btn glass-card--soft glass-icon-btn"
                  aria-label="ถอนเงิน"
                  aria-haspopup="dialog"
                >
                  <WithdrawNavIcon className="h-[18px] w-[18px]" />
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
                  className={`header-desktop-bar__profile-pill glass-card--soft${isProfileOpen ? " is-active" : ""}`}
                  aria-label="โปรไฟล์"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="dialog"
                >
                  <VipRankEmblem rankId={rankId} size="sm" playing={false} />
                  <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-[var(--icon-default)]" aria-hidden />
                </button>
              </div>
            ) : (
              <div className="header-desktop-bar__actions">
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="header-desktop-bar__auth-login glass-card--soft"
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
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="header-desktop-bar__icon-btn glass-card--soft glass-icon-btn"
                  aria-label="บัญชี"
                >
                  <ProfileNavIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
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
