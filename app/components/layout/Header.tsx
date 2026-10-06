"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsClient } from "@/app/hooks/useIsClient";
import { CosmicbetLogo, SearchIcon, HamburgerMenuIcon, HistoryIcon } from "../ui/Icons";
import { HeaderWalletChip } from "./HeaderWalletChip";
import { useAuth } from "../auth/AuthProvider";
import { useDeposit } from "../deposit/DepositProvider";
import { HeaderUserAvatar } from "./HeaderUserAvatar";
import { HEADER_DESKTOP_NAV } from "@/app/data/lobbyMockData";
import { useWallet } from "@/app/hooks/api/account";
import { useLobbyShellSidebarOptional } from "./LobbyShellSidebarContext";
import { cn } from "@/lib/utils";
import { HeaderGuestAuthButtons } from "./HeaderGuestAuthButtons";
import { NotificationDesktopPopover } from "../notifications/NotificationDesktopPopover";
import { NotificationBellButton } from "../notifications/NotificationBellButton";
import { useNotifications } from "../notifications/NotificationProvider";
import { useDesktopHubModal } from "../hub/DesktopHubModalProvider";
import { parseHubFromHref } from "../hub/hubModalRegistry";
import { formatHeaderWalletBalance } from "@/lib/format";

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
  const isClientReady = useIsClient();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
  const wallet = useWallet();
  const balanceLabel = wallet.data ? formatHeaderWalletBalance(wallet.data.amount) : "—";
  const isProfileRoute =
    pathname === "/profile/account" || pathname.startsWith("/profile/account/");
  const lobbySidebar = useLobbyShellSidebarOptional();
  const sidebarHidden = lobbySidebar?.sidebarHidden ?? false;
  const { openNotifications } = useNotifications();

  return (
    <>
      <header
        data-scrolled={mobileSticky && isScrolled ? "true" : undefined}
        className={cn(
          "w-full min-w-0 border-0 px-2 pb-2 sm:px-2.5 lg:hidden",
          mobileSticky
            ? "cosmic-mobile-chrome-surface sticky top-0 z-50 pt-[calc(env(safe-area-inset-top,0px)+8px)]"
            : "relative bg-transparent pt-2",
        )}
      >
          <div className="relative mx-auto flex h-11 w-full max-w-(--content-max) items-center justify-between">
            {/* ซ้าย: ไอคอนเมนู (หลังล็อกอิน) — ไม่มี card ครอบ */}
            {showWallet ? (
              <div className="relative z-10 flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={handleMenuClick}
                  className="flex h-9.5 w-9.5 items-center justify-center text-white/90 transition-transform hover:text-white active:scale-95 cursor-pointer"
                  aria-label="เปิดเมนู"
                >
                  <HamburgerMenuIcon className="h-5.5 w-5.5 text-white" />
                </button>
                <Link
                  href="/profile/account"
                  className={cn(
                    "cosmic-nav__profile-in-cluster flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-0",
                    isProfileRoute && "is-active",
                  )}
                  aria-label="โปรไฟล์"
                  aria-current={isProfileRoute ? "page" : undefined}
                >
                  <HeaderUserAvatar
                    size="xs"
                    isProfileOpen={isProfileOpen}
                    refreshWhenProfileCloses
                    className="ring-0"
                  />
                </Link>
              </div>
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
                className="inline-flex items-center justify-center outline-none transition-transform hover:scale-102"
                aria-label="Cosmicbet หน้าแรก"
              >
                <CosmicbetLogo className="h-[21px] w-auto max-w-[115px] object-contain sm:h-6 sm:max-w-[130px]" />
              </Link>
            </div>

            {/* ขวา: ยอดเครดิต พร้อมไอคอนวอลเลท (หลังล็อกอิน) — ไอคอนเส้นขาว ตัวอักษรเล็กบาง ไม่มี arrow down */}
            {showWallet ? (
              <div className="relative z-10 flex min-w-0 shrink-0 items-center gap-1.5 overflow-visible">
                <NotificationBellButton
                  plain
                  onClick={openNotifications}
                  className="h-8 w-8"
                  aria-haspopup="dialog"
                />
                <HeaderWalletChip
                  balanceLabel={balanceLabel}
                  variant="mobile"
                  onClick={() => {
                    if (isAuthenticated) {
                      openDeposit();
                    } else {
                      onLoginClick?.();
                    }
                  }}
                />
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
              <>
                <div className="header-wallet-capsule">
                  <HeaderWalletChip
                    balanceLabel={balanceLabel}
                    variant="desktop"
                  />

                  <button
                    type="button"
                    onClick={openDeposit}
                    className="btn-primary btn-primary--sm header-wallet-capsule__deposit !w-auto !px-4 !py-0 text-sm tracking-[0.04em]"
                    aria-label="ฝากเงิน"
                    aria-haspopup="dialog"
                  >
                    ฝาก
                  </button>
                </div>

                <NotificationDesktopPopover />

                <button
                  type="button"
                  onClick={() => openHub("transactions")}
                  className="header-desktop-bar__icon-btn glass-card--soft glass-icon-btn inline-flex h-(--header-control-height) w-(--header-control-height) shrink-0 items-center justify-center rounded-(--header-chip-radius) border-0"
                  aria-label="ประวัติธุรกรรม"
                  aria-haspopup="dialog"
                >
                  <HistoryIcon className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={handleProfileClick}
                  className={cn(
                    "header-desktop-bar__rank-btn glass-card--soft inline-grid min-h-(--header-control-height) min-w-(--header-control-height) place-items-center rounded-(--header-chip-radius) border-0 p-[0.2rem]",
                    isProfileOpen && "is-active",
                  )}
                  aria-label="โปรไฟล์"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="dialog"
                >
                  <HeaderUserAvatar
                    size="sm"
                    isProfileOpen={isProfileOpen}
                    refreshWhenProfileCloses
                    className="h-[calc(var(--header-control-height)-0.35rem)] w-[calc(var(--header-control-height)-0.35rem)] max-h-full max-w-full rounded-full"
                  />
                </button>
              </>
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

