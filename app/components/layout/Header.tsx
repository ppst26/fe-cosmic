"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CosmicbetLogo,
  HeaderWalletIcon,
  SearchIcon,
  HamburgerMenuIcon,
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
import { HeaderGuestAuthButtons } from "./HeaderGuestAuthButtons";
import { useDesktopHubModal } from "../hub/DesktopHubModalProvider";
import { parseHubFromHref } from "../hub/hubModalRegistry";

interface HeaderProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  onMenuClick?: () => void;
  /**
   * มือถือ — sticky เอง (default)
   * false เมื่อถูกห่อด้วย .lobby-mobile-sticky-chrome ที่ sticky ทั้งก้อนกับหมวดหมู่
   */
  mobileSticky?: boolean;
}

/**
 * Header — มือถือ: ซ้าย เมนู · กลาง โลโก้ · ขวา ยอดเครดิต+ไอคอนวอลเลท (ล็อกอิน)
 * Desktop lg+: full-width — ซ้าย logo · โปรโมชัน · ค้นหาแบบกะทัดรัด · ขวายอด · ฝาก · แจ้งเตือน · ยศ
 */
export function Header({
  onLoginClick,
  onSignUpClick,
  onMenuClick,
  mobileSticky = true,
}: HeaderProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, openProfile, closeProfile, isProfileOpen } =
    useAuth();
  const { openDeposit } = useDeposit();
  const { openHub } = useDesktopHubModal();
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

  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
      return;
    }
    window.dispatchEvent(new CustomEvent("cosmic:open-menu"));
    const bottomNavMenu = document.querySelector<HTMLButtonElement>(
      'button[aria-label="เมนู"], nav[aria-label="เมนูหลัก"] button:nth-child(3)'
    );
    bottomNavMenu?.click();
  };

  const showAuthSkeleton = !isClientReady || isLoading;
  const showWallet = isClientReady && !isLoading && isAuthenticated;
  const balanceLabel = formatHeaderWalletBalance(MOCK_MAIN_WALLET_BALANCE);
  const rankId = DESKTOP_PLAYER_PANEL_MOCK.rankId as VipRankId;
  const lobbySidebar = useLobbyShellSidebarOptional();
  const sidebarHidden = lobbySidebar?.sidebarHidden ?? false;

  return (
    <>
      <header
        className={cn(
          "w-full min-w-0 border-0 px-3.5 pt-[calc(env(safe-area-inset-top,0px)+8px)] pb-2 sm:px-4 lg:hidden",
          mobileSticky
            ? "cosmic-mobile-chrome-surface sticky top-0 z-50"
            : "relative bg-transparent",
        )}
      >
          <div className="relative mx-auto flex h-11 w-full max-w-(--content-max) items-center justify-between">
            {/* ซ้าย: ไอคอนเมนู (หลังล็อกอิน) — ไม่มี card ครอบ */}
            {showWallet ? (
              <button
                type="button"
                onClick={handleMenuClick}
                className="relative z-10 flex h-9.5 w-9.5 shrink-0 items-center justify-center text-white/90 transition-transform hover:text-white active:scale-95 cursor-pointer"
                aria-label="เปิดเมนู"
              >
                <HamburgerMenuIcon className="h-5.5 w-5.5 text-white" />
              </button>
            ) : (
              <div className="w-0 shrink-0" aria-hidden="true" />
            )}

            {/* กลาง: โลโก้ */}
            <div
              className={cn(
                "pointer-events-auto",
                showWallet
                  ? "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  : "mx-auto"
              )}
            >
              <Link
                href="/"
                className="flex flex-col items-center justify-center text-center outline-none transition-transform hover:scale-102"
                aria-label="Cosmicbet หน้าแรก"
              >
                <CosmicbetLogo className="h-[21px] w-auto max-w-[115px] object-contain sm:h-6 sm:max-w-[130px]" />
                <span className="text-[7.5px] font-medium tracking-[0.24em] text-white/85 uppercase font-sans select-none">
                  PLAY BEYOND LIMITS
                </span>
              </Link>
            </div>

            {/* ขวา: ยอดเครดิต พร้อมไอคอนวอลเลท (หลังล็อกอิน) — ไอคอนเส้นขาว ตัวอักษรเล็กบาง ไม่มี arrow down */}
            {showWallet ? (
              <div className="relative z-10 flex min-w-0 shrink-0 items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (isAuthenticated) {
                      openDeposit();
                    } else {
                      onLoginClick?.();
                    }
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#222228] px-3 text-white transition-all hover:bg-[#2c2c34] active:scale-97 cursor-pointer"
                  aria-label="ฝากเงินและดูยอดเครดิต"
                >
                  <HeaderWalletIcon className="h-3.5 w-3.5 shrink-0 text-white" />
                  <span className="text-xs font-normal tracking-tight text-white tabular-nums">
                    {balanceLabel}
                  </span>
                </button>
              </div>
            ) : (
              <div className="w-0 shrink-0" aria-hidden="true" />
            )}
        </div>
      </header>

      {/* static/pt-0 เสมอ — ถูกครอบด้วย .lobby-desktop-shell__header-band ที่ sticky แทนแล้วเท่านั้น (Header ไม่ได้ mount เดี่ยวที่อื่น) */}
      <header className="header-desktop-bar static z-50 isolate hidden w-full max-w-full shrink-0 pt-0 bg-transparent lg:block">
        <div className="header-desktop-bar__inner relative flex min-h-(--header-desktop-bar-height) w-full max-w-full items-center justify-between gap-x-5 gap-y-3 px-[clamp(12px,2vw,28px)]">
          <div className="flex min-w-0 flex-auto items-center gap-x-[0.65rem] gap-y-[0.55rem]">
            <Link
              href="/"
              className="flex min-w-0 items-center outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-focus-ring"
              aria-label="Cosmicbet หน้าแรก"
            >
              <CosmicbetLogo className="h-7 w-auto max-w-[min(100%,200px)]" />
            </Link>

            {lobbySidebar ? (
              <button
                type="button"
                className={cn(
                  "header-desktop-bar__menu-btn glass-card--soft grid h-(--header-control-height) w-(--header-control-height) min-h-(--header-control-height) min-w-(--header-control-height) shrink-0 place-items-center rounded-(--header-chip-radius) border-0 p-0",
                  sidebarHidden && "is-active",
                )}
                aria-expanded={!sidebarHidden}
                aria-label={sidebarHidden ? "แสดงเมนูด้านซ้าย" : "ซ่อนเมนูด้านซ้าย"}
                onClick={lobbySidebar.toggleSidebarHidden}
              >
                <HeaderSidebarToggleIcon hidden={sidebarHidden} />
              </button>
            ) : null}

            <nav
              className="ms-[0.35rem] hidden items-center gap-[0.35rem] xl:flex"
              aria-label="หมวดหลัก"
            >
              {HEADER_DESKTOP_NAV.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                const showBadge = "showBadge" in item && item.showBadge;
                const parsed = parseHubFromHref(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      if (parsed.id) {
                        e.preventDefault();
                        openHub(parsed.id, parsed.options);
                      }
                    }}
                    className={cn(
                      "header-desktop-bar__nav-link cosmic-type-nav-label glass-card--soft relative inline-flex min-h-(--header-control-height) items-center justify-center rounded-(--header-chip-radius) px-[0.95rem] text-center text-xs font-medium tracking-[0.02em] whitespace-nowrap no-underline",
                      isActive && "is-active",
                    )}
                  >
                    {item.label}
                    {showBadge ? (
                      <span
                        className="header-desktop-bar__nav-badge absolute top-1.5 right-2 h-1.5 w-1.5 rounded-full"
                        aria-hidden
                      />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <label className="header-desktop-bar__search--compact glass-card--soft flex min-h-(--header-control-height) w-[min(10.5rem,28vw)] max-w-42 min-w-27 flex-[0_1_auto] items-center gap-[0.65rem] rounded-(--header-chip-radius) pr-3 pl-[0.65rem] focus-within:w-[min(14rem,36vw)] focus-within:max-w-56">
              <span className="sr-only">ค้นหาเกมหรือค่าย</span>
              <SearchIcon className="h-4.5 w-4.5 shrink-0 text-text-muted" aria-hidden />
              <input
                type="search"
                className="header-desktop-bar__search-input w-full min-w-0 border-0 text-sm font-medium shadow-none outline-none focus:shadow-none focus:outline-none"
                placeholder="ค้นหา"
                autoComplete="off"
              />
            </label>
          </div>

          <div className="flex min-w-0 flex-none flex-nowrap items-center justify-end gap-x-[0.65rem] gap-y-2">
            {showAuthSkeleton ? (
              <div
                className="h-11 w-48 animate-pulse rounded-(--radius-pill) bg-surface-hover"
                aria-hidden="true"
              />
            ) : showWallet ? (
              <div className="inline-flex max-w-full flex-nowrap items-center justify-end gap-[0.45rem]">
                <div
                  className="glass-card--soft inline-flex min-h-(--header-control-height) max-w-[min(100%,10.5rem)] items-center gap-[0.45rem] rounded-(--header-chip-radius) px-[0.9rem] py-0"
                  aria-live="polite"
                >
                  <HeaderWalletIcon className="h-4.5 w-4.5 shrink-0 text-icon-active" />
                  <span className="max-w-[min(100%,7.5rem)] truncate text-sm font-medium tracking-[-0.01em] tabular-nums">
                    {balanceLabel}
                  </span>
                </div>

                {/* `!` จำเป็น — .cosmic-cta-primary--sm อยู่นอก @layer จึงชนะ utility ปกติ */}
                <button
                  type="button"
                  onClick={openDeposit}
                  className="cosmic-cta-primary cosmic-cta-primary--sm min-h-(--header-control-height)! rounded-(--header-chip-radius)! px-3! py-0! text-sm font-medium tracking-[0.04em]!"
                  aria-label="ฝากเงิน"
                  aria-haspopup="dialog"
                >
                  ฝาก
                </button>

                <button
                  type="button"
                  className="header-desktop-bar__icon-btn glass-card--soft glass-icon-btn relative inline-flex h-(--header-control-height)! w-(--header-control-height)! shrink-0 items-center justify-center rounded-(--header-chip-radius) border-0 no-underline"
                  aria-label="การแจ้งเตือน"
                >
                  <HeaderBellIcon />
                  <span
                    className="header-desktop-bar__badge absolute top-1.5 right-1.75 h-1.75 w-1.75 rounded-full"
                    aria-hidden
                  />
                </button>

                <button
                  type="button"
                  onClick={handleProfileClick}
                  className={cn(
                    "header-desktop-bar__rank-btn glass-card--soft inline-grid min-h-(--header-control-height) min-w-(--header-control-height) place-items-center rounded-(--header-chip-radius) border-0 p-[0.2rem]",
                    isProfileOpen && "is-active",
                  )}
                  aria-label="ยศ VIP และโปรไฟล์"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="dialog"
                >
                  <VipRankEmblem rankId={rankId} size="xs" playing={false} />
                </button>
              </div>
            ) : (
              <HeaderGuestAuthButtons
                onLoginClick={onLoginClick}
                onSignUpClick={onSignUpClick}
                className="max-w-full flex-nowrap justify-end gap-[0.45rem]"
                loginClassName="header-desktop-bar__auth-login glass-card--soft min-h-(--header-control-height) rounded-(--header-chip-radius) border-0 px-[0.85rem]"
                signUpClassName="min-h-(--header-control-height)! rounded-(--header-chip-radius)! px-3! py-0! tracking-[0.04em]!"
              />
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
