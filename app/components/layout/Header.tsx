"use client";

import React from "react";
import Link from "next/link";
import {
  CosmicbetLogo,
  ChevronDownIcon,
  DepositNavIcon,
  HeaderWalletIcon,
  ProfileNavIcon,
  WithdrawNavIcon,
} from "../ui/Icons";
import { useAuth } from "../auth/AuthProvider";
import { useDeposit } from "../deposit/DepositProvider";
import { useWithdraw } from "../withdraw/WithdrawProvider";
import { VipRankEmblem } from "../vip/VipRankEmblem";
import type { VipRankId } from "@/app/types/vip";
import { DESKTOP_PLAYER_PANEL_MOCK } from "@/app/data/desktopLobbyMockData";
import {
  formatHeaderWalletBalance,
  MOCK_MAIN_WALLET_BALANCE,
} from "@/app/data/walletMockData";

interface HeaderProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

/**
 * Header — มือถือ: .cosmic-nav (โลโก้ · กระเป๋า/ล็อกอิน · โปรไฟล์)
 * Desktop lg+: ยอดคงเหลือ · ฝาก · ถอน · โปรไฟล์ (borderless pill)
 */
export function Header({ onLoginClick, onSignUpClick }: HeaderProps) {
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
        <div className="cosmic-nav">
          <Link href="/" className="cosmic-logo" aria-label="Cosmicbet หน้าแรก">
            <CosmicbetLogo className="!h-auto !max-w-none w-[clamp(112px,25vw,150px)] object-contain" />
          </Link>

          <div className="cosmic-actions">
            {isLoading ? (
              <div className="wallet-button wallet-button--skeleton" aria-hidden="true" />
            ) : showWallet ? (
              <div className="wallet-button" aria-live="polite">
                <HeaderWalletIcon aria-hidden="true" />
                <span>{balanceLabel}</span>
              </div>
            ) : (
              <div className="cosmic-nav__auth">
                <button type="button" onClick={onLoginClick} className="cosmic-nav__auth-login">
                  LOG IN
                </button>
                <button type="button" onClick={onSignUpClick} className="cosmic-nav__auth-signup">
                  SIGN UP
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleProfileClick}
              className={`profile-button${isProfileOpen ? " is-active" : ""}`}
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
          </div>

          <div className="header-desktop-bar__end">
            {isLoading ? (
              <div
                className="h-11 w-48 animate-pulse rounded-[var(--radius-pill)] bg-[var(--surface-hover)]"
                aria-hidden="true"
              />
            ) : showWallet ? (
              <div className="header-desktop-bar__actions">
                <div className="header-desktop-bar__wallet-pill">
                  <div className="header-desktop-bar__wallet-segment" aria-live="polite">
                    <span className="header-desktop-bar__wallet-segment-icon" aria-hidden="true">
                      <HeaderWalletIcon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="header-desktop-bar__wallet-balance">{balanceLabel}</span>
                  </div>

                  <span className="header-desktop-bar__wallet-rule" aria-hidden="true" />

                  <button
                    type="button"
                    onClick={openDeposit}
                    className="header-desktop-bar__wallet-segment header-desktop-bar__wallet-segment--action"
                    aria-label="ฝากเงิน"
                    aria-haspopup="dialog"
                  >
                    <DepositNavIcon className="header-desktop-bar__action-icon h-[18px] w-[18px]" />
                    <span>ฝาก</span>
                  </button>

                  <span className="header-desktop-bar__wallet-rule" aria-hidden="true" />

                  <button
                    type="button"
                    onClick={openWithdraw}
                    className="header-desktop-bar__wallet-segment header-desktop-bar__wallet-segment--action"
                    aria-label="ถอนเงิน"
                    aria-haspopup="dialog"
                  >
                    <WithdrawNavIcon className="header-desktop-bar__action-icon h-[18px] w-[18px]" />
                    <span>ถอน</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleProfileClick}
                  className={`header-desktop-bar__profile-pill${isProfileOpen ? " is-active" : ""}`}
                  aria-label="โปรไฟล์"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="dialog"
                >
                  <VipRankEmblem rankId={rankId} size="sm" playing={false} />
                  <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-[var(--icon-default)]" aria-hidden />
                </button>
              </div>
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
          </div>
        </div>
      </header>
    </>
  );
}
