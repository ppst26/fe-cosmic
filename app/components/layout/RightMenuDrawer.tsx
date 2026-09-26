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
        break;
      case "coupon":
        openCouponRedeem();
        onClose();
        break;
    }
  };

  const renderItem = (tile: MenuDialogTile, section: MenuDialogSection) => {
    const isHorizontal = section.layout === "horizontal";
    const body = isHorizontal ? (
      <div className="menu-item__inner menu-item__inner--horizontal flex w-full items-center justify-start gap-3 px-3.5 py-3">
        <span className="menu-item__icon flex shrink-0 items-center justify-center text-white" aria-hidden="true">
          <MenuItemIcon iconId={tile.iconId} className="h-6 w-6 text-white" />
        </span>
        <span className="menu-item__label text-[13px] font-medium text-white truncate">{tile.label}</span>
      </div>
    ) : (
      <div className="menu-item__inner menu-item__inner--vertical flex flex-col items-center justify-center gap-1.5 w-full py-3 px-1 text-center">
        <span className="menu-item__icon flex shrink-0 items-center justify-center text-white" aria-hidden="true">
          <MenuItemIcon iconId={tile.iconId} className={section.columns === 3 ? "h-7 w-7 text-white" : "h-6 w-6 text-white"} />
        </span>
        <span className="menu-item__label text-[13px] font-medium text-white truncate max-w-full leading-tight">{tile.label}</span>
      </div>
    );

    const buttonClass = `menu-item menu-item--card ${isHorizontal ? "menu-item--row" : "menu-item--col"}`;

    if (tile.action) {
      return (
        <button
          key={tile.id}
          type="button"
          className={buttonClass}
          onClick={() => runAction(tile.action!)}
        >
          {body}
        </button>
      );
    }

    const href = tile.href ?? "#";
    return (
      <Link
        key={tile.id}
        href={href}
        className={buttonClass}
        onClick={(event) => {
          if (href.startsWith("/")) {
            event.preventDefault();
            navigateAndClose(href);
            return;
          }
          onClose();
        }}
      >
        {body}
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
              <Dialog.Title id="menu-title" className="menu-tab text-2xl font-bold leading-none text-white">
                เมนู
              </Dialog.Title>

              <Dialog.Close asChild>
                <button type="button" className="menu-close glass-menu-close" aria-label="ปิดเมนู">
                  <CloseIcon />
                </button>
              </Dialog.Close>

              <div className="menu-content">
                {MENU_DIALOG_SECTIONS.map((section) => (
                  <section
                    key={section.id}
                    className="menu-section"
                    aria-labelledby={`menu-section-${section.id}`}
                  >
                    <h3
                      id={`menu-section-${section.id}`}
                      className="text-[15px] font-semibold text-white mb-2"
                    >
                      {section.sectionLabel}
                    </h3>
                    <div
                      className={`menu-grid ${
                        section.columns === 2
                          ? "menu-grid--two"
                          : section.columns === 3
                            ? "menu-grid--three"
                            : "menu-grid--four"
                      }`}
                    >
                      {section.items.map((tile) => renderItem(tile, section))}
                    </div>
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
