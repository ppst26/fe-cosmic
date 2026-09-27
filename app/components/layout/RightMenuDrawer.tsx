"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import {
  CloseIcon,
} from "../ui/Icons";
import { MenuItemIcon } from "./MenuItemIcon";
import { useVipModal } from "../vip/VipModalProvider";
import { useCouponRedeem } from "../coupon/CouponRedeemProvider";
import {
  MENU_DIALOG_MODEL_SRC,
  MENU_DIALOG_SECTIONS,
  type MenuDialogAction,
  type MenuDialogSection,
  type MenuDialogTile,
} from "../../data/menuMockData";
import { useDesktopHubModal } from "../hub/DesktopHubModalProvider";
import { parseHubFromHref } from "../hub/hubModalRegistry";
import { getIsDesktopViewport } from "../hub/useIsDesktop";

interface RightMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}


/**
 * Menu dialog — mock ติ่ง「เมนู」· panel สูงพอดีเนื้อหา · ชิดเหนือ bottom nav
 * ใช้ class ใน globals.css · เปิดจาก FloatingBottomNav
 */
export function RightMenuDrawer({ isOpen, onClose }: RightMenuDrawerProps) {
  const router = useRouter();
  const { openVipModal } = useVipModal();
  const { openCouponRedeem } = useCouponRedeem();
  const { openHub } = useDesktopHubModal();

  const navigateAndClose = (href: string) => {
    onClose();
    if (getIsDesktopViewport()) {
      const parsed = parseHubFromHref(href);
      if (parsed.id) {
        openHub(parsed.id, parsed.options);
        return;
      }
    }
    if (href.startsWith("/")) {
      router.push(href);
    }
  };

  const runAction = (action: MenuDialogAction) => {
    switch (action) {
      case "vip-rank":
        openVipModal();
        onClose();
      case "coupon":
        openCouponRedeem();
        onClose();
        break;
    }
  };

  const renderGridTile = (tile: MenuDialogTile) => {
    const content = (
      <div className="flex flex-col items-center justify-center gap-1.5 w-full text-center">
        <MenuItemIcon
          iconId={tile.iconId}
          variant="svg"
          className="h-6.5 w-6.5 text-white shrink-0 transition-transform duration-150 group-hover:scale-110"
        />
        <span className="text-[11.5px] font-medium text-white truncate max-w-full leading-tight">
          {tile.label}
        </span>
      </div>
    );

    const tileClass =
      "group flex flex-col items-center justify-center rounded-xl bg-[#0f0c22] border border-white/[0.08] py-2.5 px-1 min-h-[66px] hover:bg-[#191538] hover:border-white/[0.18] active:scale-95 transition-all duration-150 cursor-pointer select-none outline-none";

    if (tile.action) {
      return (
        <button
          key={tile.id}
          type="button"
          className={tileClass}
          onClick={() => runAction(tile.action!)}
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
        onClick={(event) => {
          if (href.startsWith("/")) {
            event.preventDefault();
            navigateAndClose(href);
            return;
          }
          onClose();
        }}
      >
        {content}
      </Link>
    );
  };

  const renderRow = (tile: MenuDialogTile) => {
    const content = (
      <>
        <div className="flex items-center gap-3 min-w-0">
          <MenuItemIcon
            iconId={tile.iconId}
            variant="svg"
            className="h-5.5 w-5.5 text-white shrink-0"
          />
          <span className="text-[13.5px] font-medium text-white truncate leading-none">
            {tile.label}
          </span>
        </div>
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-white/70 group-hover:bg-white/[0.14] group-hover:text-white transition-colors"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-2.5 w-2.5"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
      </>
    );

    const rowClass =
      "group flex w-full items-center justify-between px-3.5 py-2.5 text-left transition-colors duration-150 hover:bg-white/[0.04] active:bg-white/[0.08] cursor-pointer select-none outline-none";

    if (tile.action) {
      return (
        <button
          key={tile.id}
          type="button"
          className={rowClass}
          onClick={() => runAction(tile.action!)}
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
        onClick={(event) => {
          if (href.startsWith("/")) {
            event.preventDefault();
            navigateAndClose(href);
            return;
          }
          onClose();
        }}
      >
        {content}
      </Link>
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="menu-dialog-overlay" />

        <Dialog.Content
          aria-describedby={undefined}
          className="menu-dialog-root outline-none"
        >
          <div className="menu-shell">
            {MENU_DIALOG_MODEL_SRC ? (
              <img className="menu-model" src={MENU_DIALOG_MODEL_SRC} alt="" />
            ) : null}

            <div className="menu-panel glass-menu-panel">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <Dialog.Title id="menu-title" className="text-2xl sm:text-3xl font-bold leading-tight text-white tracking-tight">
                  เมนู
                </Dialog.Title>

                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white/80 hover:text-white border border-white/[0.12] cursor-pointer active:scale-95 transition-all"
                    aria-label="ปิดเมนู"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="menu-content flex flex-col gap-2.5">
                {MENU_DIALOG_SECTIONS.map((section) => (
                  <section
                    key={section.id}
                    className="menu-section flex flex-col"
                    aria-labelledby={`menu-section-${section.id}`}
                  >
                    <h3
                      id={`menu-section-${section.id}`}
                      className="text-[12.5px] font-semibold text-[#8f88ab] mb-1 px-0.5"
                    >
                      {section.sectionLabel}
                    </h3>
                    {section.layout === "vertical" ? (
                      <div className="menu-card-group rounded-xl bg-[#0f0c22] border border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.4)] overflow-hidden divide-y divide-white/[0.04] flex flex-col">
                        {section.items.map((tile) => renderRow(tile))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-1.5 w-full">
                        {section.items.map((tile) => renderGridTile(tile))}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
