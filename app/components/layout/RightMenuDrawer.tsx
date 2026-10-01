"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { CloseIcon, CosmicbetLogo } from "../ui/Icons";
import { MenuItemIcon } from "./MenuItemIcon";
import { MenuDrawerUserAvatar } from "./MenuDrawerUserAvatar";
import { useVipModal } from "../vip/VipModalProvider";
import { useCouponRedeem } from "../coupon/CouponRedeemProvider";
import {
  MENU_DIALOG_ALL_TILES,
  MENU_DIALOG_SECTIONS,
  menuTileRequiresAuth,
  type MenuDialogAction,
  type MenuDialogTile,
} from "../../data/menuMockData";
import { useAuth } from "../auth/AuthProvider";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import { useDesktopHubModal } from "../hub/DesktopHubModalProvider";
import { parseHubFromHref } from "../hub/hubModalRegistry";
import { getIsDesktopViewport, useIsDesktop } from "../hub/useIsDesktop";

interface RightMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Menu dialog — มือถือเต็มจอ: โลโก้ · avatar · grid เมนู
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
    const content = (
      <div className="flex flex-col items-center justify-center gap-2 w-full min-w-0 px-1 text-center">
        <MenuItemIcon
          iconId={tile.iconId}
          variant="asset"
          className="menu-grid-icon h-10 w-10 object-contain shrink-0 sm:h-11 sm:w-11 lg:h-9 lg:w-9"
        />
        <span className="menu-grid-label w-full text-[11px] font-medium leading-[1.25] text-white sm:text-xs lg:text-[11.5px]">
          {tile.label}
        </span>
      </div>
    );

    const tileClass =
      "menu-grid-tile menu-enter-item group flex flex-col items-center justify-center py-2.5 px-1 min-h-[5.25rem] sm:min-h-[5.5rem] lg:min-h-[72px] cursor-pointer select-none outline-none";
    const enterStyle = { "--menu-enter-i": index } as React.CSSProperties;

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

  const renderRow = (tile: MenuDialogTile, index: number) => {
    const content = (
      <>
        <div className="flex items-center gap-3.5 min-w-0">
          <MenuItemIcon
            iconId={tile.iconId}
            variant="asset"
            className="menu-list-icon h-9 w-9 lg:h-7 lg:w-7 object-contain shrink-0"
          />
          <span className="menu-list-label text-[15px] lg:text-[13.5px] font-medium text-white truncate leading-none">
            {tile.label}
          </span>
        </div>
        <span
          className="menu-list-chevron flex h-6 w-6 lg:h-5 lg:w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-white/70"
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

    const rowClass =
      "menu-list-row menu-enter-item group flex w-full items-center justify-between px-4 py-3.5 lg:px-3.5 lg:py-2.5 text-left cursor-pointer select-none outline-none";
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

  const renderMobileMenu = () => (
    <div
      className="menu-content menu-content--mobile menu-content--mobile-stack flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-[max(20px,env(safe-area-inset-bottom,0px))] pt-[max(52px,calc(env(safe-area-inset-top,0px)+44px))]"
    >
      <Link
        href="/"
        className="menu-drawer-header-logo menu-enter-logo inline-flex w-full shrink-0 justify-center py-1"
        aria-label="cosmicbet หน้าหลัก"
        onClick={() => onClose()}
      >
        <CosmicbetLogo className="h-9 max-w-[168px] sm:h-10 sm:max-w-[188px]" />
      </Link>

      <MenuDrawerUserAvatar />

      <div className="menu-grid menu-grid--mobile-drawer mx-auto grid w-full max-w-[20.5rem] shrink-0 grid-cols-3 pb-2 sm:max-w-[22.5rem]">
        {MENU_DIALOG_ALL_TILES.map((tile, index) => renderGridTile(tile, index))}
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
    </div>
  );

  return (
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
  );
}
