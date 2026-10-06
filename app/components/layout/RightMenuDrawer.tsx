"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { CloseIcon, CosmicbetLogo, LogOutIcon } from "../ui/Icons";
import { useLogoutConfirm } from "@/app/hooks/useLogoutConfirm";
import { MenuItemIcon } from "./MenuItemIcon";
import { MenuDrawerUserAvatar } from "./MenuDrawerUserAvatar";
import { useVipModal } from "../vip/VipModalProvider";
import { useCouponRedeem } from "../coupon/CouponRedeemProvider";
import {
  MENU_DIALOG_MOBILE_GRID_ITEMS,
  MENU_DIALOG_MOBILE_LIST_ITEMS,
  MENU_DIALOG_SECTIONS,
  menuTileRequiresAuth,
  type MenuDialogAction,
  type MenuDialogTile,
} from "../../data/menuMockData";
import { MenuDrawerMobileToolbar } from "./MenuDrawerMobileToolbar";
import { useAuth } from "../auth/AuthProvider";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import { useDesktopHubModal } from "../hub/DesktopHubModalProvider";
import { parseHubFromHref } from "../hub/hubModalRegistry";
import { getIsDesktopViewport, useIsDesktop } from "../hub/useIsDesktop";
import { cn } from "@/lib/utils";

interface RightMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Menu dialog — มือถือเต็มจอ: avatar · โลโก้ · grid เมนู
 * เดสก์ท็อป: panel ลอยชิดเหนือ bottom nav · เปิดจาก FloatingBottomNav
 */
export function RightMenuDrawer({ isOpen, onClose }: RightMenuDrawerProps) {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const { openVipModal } = useVipModal();
  const { openCouponRedeem } = useCouponRedeem();
  const { openHub } = useDesktopHubModal();
  const { isAuthenticated, isLoading } = useAuth();
  const { open: openLogin } = useOverlayLayer("login");
  const { open: openSignUp } = useOverlayLayer("signup");
  const { openLogoutConfirm, LogoutConfirmDialog } = useLogoutConfirm(onClose);

  const openLoginFromMenu = () => {
    onClose();
    window.setTimeout(() => openLogin(), 0);
  };

  const openSignUpFromMenu = () => {
    onClose();
    window.setTimeout(() => openSignUp(), 0);
  };

  const renderGuestAuthActions = (enterIndex: number, withEnterAnimation = true) => (
    <div
      className={cn(
        "menu-drawer-guest-auth flex w-full shrink-0 flex-col gap-2.5",
        withEnterAnimation && "menu-enter-item",
      )}
      style={withEnterAnimation ? ({ "--menu-enter-i": enterIndex } as React.CSSProperties) : undefined}
    >
      <button type="button" className="auth-btn auth-btn--register w-full" onClick={openSignUpFromMenu}>
        สมัครสมาชิก
      </button>
      <button type="button" className="auth-btn auth-btn--login w-full" onClick={openLoginFromMenu}>
        เข้าสู่ระบบ
      </button>
    </div>
  );

  /** เมนูที่ต้องล็อกอิน — ปิดเมนูแล้วเปิด login sheet */
  const runWithAuth = (tile: MenuDialogTile, action: () => void) => {
    if (menuTileRequiresAuth(tile)) {
      if (isLoading) return;
      if (!isAuthenticated) {
        onClose();
        window.setTimeout(() => openLogin(), 0);
        return;
      }
    }
    action();
  };

  const navigateAndClose = (href: string) => {
    if (getIsDesktopViewport()) {
      const parsed = parseHubFromHref(href);
      if (parsed.id) {
        onClose();
        openHub(parsed.id, parsed.options);
        return;
      }
    }
    if (href.startsWith("/")) {
      /* ห้าม onClose() หลัง push — closeMenu จาก useOverlayLayer จะ router.replace(pathname)
         บนหน้า lobby ปัจจุบัน ทับ navigation ไป stand-alone page (modal ใช้ onClose+openLayer จึงไม่พัง) */
      router.push(href);
    }
  };

  const runAction = (action: MenuDialogAction) => {
    switch (action) {
      case "vip-rank":
        onClose();
        setTimeout(() => openVipModal(), 0);
        break;
      case "coupon":
        onClose();
        setTimeout(() => openCouponRedeem(), 0);
        break;
    }
  };

  const renderGridTile = (tile: MenuDialogTile, index: number) => {
    const comingSoon = tile.comingSoon === true;

    const content = (
      <div className="flex flex-col items-center justify-center gap-1.5 w-full min-w-0 px-0.5 text-center">
        <MenuItemIcon
          iconId={tile.iconId}
          variant="asset"
          className={cn(
            "menu-grid-icon object-contain shrink-0 lg:h-9 lg:w-9",
            comingSoon && "opacity-45 grayscale-[0.35]",
          )}
        />
        <span
          className={cn(
            "menu-grid-label w-full font-medium leading-snug lg:text-[11.5px]",
            comingSoon ? "text-[var(--text-muted)]" : "text-white",
          )}
        >
          {tile.label}
        </span>
        {comingSoon ? (
          <span className="text-[9px] font-medium uppercase tracking-wide text-[var(--accent-muted)]">
            Coming soon
          </span>
        ) : null}
      </div>
    );

    const tileClass = cn(
      "menu-grid-tile menu-enter-item group flex min-w-0 flex-col items-center justify-center px-0.5 py-1 min-h-0 select-none outline-none lg:min-h-[72px] lg:py-2.5",
      comingSoon
        ? "cursor-not-allowed opacity-70 pointer-events-none"
        : "cursor-pointer",
    );
    const enterStyle = { "--menu-enter-i": index } as React.CSSProperties;

    if (comingSoon) {
      return (
        <div
          key={tile.id}
          className={tileClass}
          style={enterStyle}
          aria-disabled="true"
          title="Coming soon"
        >
          {content}
        </div>
      );
    }

    if (tile.action) {
      return (
        <button
          key={tile.id}
          type="button"
          className={tileClass}
          style={enterStyle}
          onClick={() => runWithAuth(tile, () => runAction(tile.action!))}
        >
          {content}
        </button>
      );
    }

    const href = tile.href ?? "#";
    return (
      <Link
        key={tile.id}
        href={href}
        className={tileClass}
        style={enterStyle}
        onClick={(event) => {
          if (href.startsWith("/")) {
            event.preventDefault();
            runWithAuth(tile, () => navigateAndClose(href));
            return;
          }
          onClose();
        }}
      >
        {content}
      </Link>
    );
  };

  const renderRow = (
    tile: MenuDialogTile,
    index: number,
    density: "default" | "compact" = "default",
  ) => {
    const content = (
      <>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <MenuItemIcon
            iconId={tile.iconId}
            variant="asset"
            className="menu-list-icon object-contain shrink-0 lg:h-7 lg:w-7"
          />
          <span className="menu-list-label min-w-0 flex-1 truncate font-medium leading-snug text-white lg:text-[13.5px]">
            {tile.label}
          </span>
        </div>
        <span
          className="menu-list-chevron flex h-5 w-5 shrink-0 items-center justify-center rounded-full lg:h-5 lg:w-5"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3 lg:h-2.5 lg:w-2.5"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
      </>
    );

    const rowClass = cn(
      "menu-list-row menu-enter-item group flex w-full items-center justify-between text-left cursor-pointer select-none outline-none",
      density === "compact"
        ? "menu-list-row--drawer-compact"
        : "px-4 py-3.5 lg:px-3.5 lg:py-2.5",
    );
    const enterStyle = { "--menu-enter-i": index } as React.CSSProperties;

    if (tile.action) {
      return (
        <button
          key={tile.id}
          type="button"
          className={rowClass}
          style={enterStyle}
          onClick={() => runWithAuth(tile, () => runAction(tile.action!))}
        >
          {content}
        </button>
      );
    }

    const href = tile.href ?? "#";
    return (
      <Link
        key={tile.id}
        href={href}
        className={rowClass}
        style={enterStyle}
        onClick={(event) => {
          if (href.startsWith("/")) {
            event.preventDefault();
            runWithAuth(tile, () => navigateAndClose(href));
            return;
          }
          onClose();
        }}
      >
        {content}
      </Link>
    );
  };

  const mobileMenuEnterBase = isAuthenticated ? 5 : 1;
  const mobileGuestAuthEnterIndex =
    mobileMenuEnterBase +
    MENU_DIALOG_MOBILE_LIST_ITEMS.length +
    MENU_DIALOG_MOBILE_GRID_ITEMS.length;

  const renderMobileMenu = () => (
    <div
      className="menu-content menu-content--mobile menu-content--mobile-stack flex min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-hidden"
    >
      <div className="menu-drawer-mobile-scroll">
        {isAuthenticated ? (
          <MenuDrawerUserAvatar isMenuOpen={isOpen} />
        ) : (
          <div className="menu-drawer-guest-brand menu-enter-logo flex shrink-0 justify-center pb-0.5 pt-0.5">
            <CosmicbetLogo className="h-7 w-auto max-w-[min(72vw,168px)] object-contain" />
          </div>
        )}

        {isAuthenticated ? (
          <MenuDrawerMobileToolbar onClose={onClose} onRequireLogin={() => openLogin()} />
        ) : null}

        <div className="menu-card-group menu-drawer-list-card menu-enter-item flex shrink-0 flex-col overflow-hidden">
          {MENU_DIALOG_MOBILE_LIST_ITEMS.map((tile, index) =>
            renderRow(tile, mobileMenuEnterBase + index, "compact"),
          )}
        </div>

        <div
          className="menu-drawer-grid-card menu-enter-item w-full shrink-0 overflow-hidden"
          style={
            {
              "--menu-enter-i": mobileMenuEnterBase + MENU_DIALOG_MOBILE_LIST_ITEMS.length,
            } as React.CSSProperties
          }
        >
          <div className="menu-grid menu-grid--mobile-drawer menu-grid--three grid w-full">
            {MENU_DIALOG_MOBILE_GRID_ITEMS.map((tile, index) =>
              renderGridTile(
                tile,
                mobileMenuEnterBase + MENU_DIALOG_MOBILE_LIST_ITEMS.length + 1 + index,
              ),
            )}
          </div>
        </div>

        {isAuthenticated ? (
          <button
            type="button"
            className="menu-drawer-logout menu-drawer-logout--mobile menu-enter-item flex w-full shrink-0 items-center justify-center gap-1.5"
            style={{ "--menu-enter-i": mobileGuestAuthEnterIndex } as React.CSSProperties}
            onClick={() => {
              onClose();
              window.setTimeout(() => openLogoutConfirm(), 0);
            }}
          >
            <LogOutIcon className="shrink-0 text-destructive" aria-hidden="true" />
            <span className="menu-drawer-logout__label font-medium text-destructive">
              ออกจากระบบ
            </span>
          </button>
        ) : (
          <div
            className="menu-drawer-guest-auth-slot menu-enter-item flex w-full shrink-0 flex-col"
            style={{ "--menu-enter-i": mobileGuestAuthEnterIndex } as React.CSSProperties}
          >
            {renderGuestAuthActions(mobileGuestAuthEnterIndex, false)}
          </div>
        )}
      </div>
    </div>
  );

  const renderDesktopMenu = () => (
    <div className="menu-content flex flex-col gap-2.5">
      {MENU_DIALOG_SECTIONS.map((section) => (
        <section
          key={section.id}
          className="menu-section flex flex-col"
          aria-labelledby={`menu-section-${section.id}`}
        >
          <h3
            id={`menu-section-${section.id}`}
            className="menu-section-heading cosmic-type-caption mb-1 px-0.5 text-[#8f88ab]"
          >
            {section.sectionLabel}
          </h3>
          {section.layout === "vertical" ? (
            <div className="menu-card-group rounded-xl bg-[#0f0c22] shadow-[0_4px_16px_rgba(0,0,0,0.4)] overflow-hidden divide-y divide-white/[0.04] flex flex-col">
              {section.items.map((tile, index) => renderRow(tile, index))}
            </div>
          ) : (
            <div className="menu-grid grid grid-cols-4 gap-1.5 w-full">
              {section.items.map((tile, index) => renderGridTile(tile, index))}
            </div>
          )}
        </section>
      ))}

      {isAuthenticated ? (
        <button
          type="button"
          className="menu-drawer-logout mt-2 flex w-full items-center justify-center gap-2 px-2 py-2.5"
          onClick={() => {
            onClose();
            window.setTimeout(() => openLogoutConfirm(), 0);
          }}
        >
          <LogOutIcon className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
          <span className="menu-drawer-logout__label text-sm font-medium text-destructive">
            ออกจากระบบ
          </span>
        </button>
      ) : (
        renderGuestAuthActions(MENU_DIALOG_SECTIONS.reduce((n, s) => n + s.items.length, 0))
      )}
    </div>
  );

  return (
    <>
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="menu-dialog-overlay" />

        <Dialog.Content
          aria-describedby={undefined}
          className="menu-dialog-root outline-none"
        >
          <div className="menu-shell">
            <Dialog.Title id="menu-title" className="sr-only">
              เมนู
            </Dialog.Title>

            <Dialog.Close asChild>
              <button type="button" className="menu-close-btn" aria-label="ปิดเมนู">
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </Dialog.Close>

            <div className="menu-panel glass-menu-panel menu-panel--hub">
              {isDesktop ? renderDesktopMenu() : renderMobileMenu()}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    <LogoutConfirmDialog />
    </>
  );
}
