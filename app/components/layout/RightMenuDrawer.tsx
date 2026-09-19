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
  type MenuDialogTile,
} from "../../data/menuMockData";
import { useDesktopHubModal } from "../hub/DesktopHubModalProvider";
import { parseHubFromHref } from "../hub/hubModalRegistry";
import { getIsDesktopViewport } from "../hub/useIsDesktop";

interface RightMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_CLASS = "h-6 w-6 shrink-0 text-current";

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

  const renderItem = (tile: MenuDialogTile) => {
    const body = (
      <>
        <MenuItemIcon iconId={tile.iconId} className={ICON_CLASS} />
        <span>{tile.label}</span>
      </>
    );

    if (tile.action) {
      return (
        <button
          key={tile.id}
          type="button"
          className="menu-item menu-item--solid"
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
        className="menu-item menu-item--solid"
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
              <Dialog.Title id="menu-title" className="menu-tab">
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
                    <h3 id={`menu-section-${section.id}`}>{section.sectionLabel}</h3>
                    <div
                      className={`menu-grid ${section.columns === 4 ? "menu-grid--four" : "menu-grid--three"}`}
                    >
                      {section.items.map((tile) => renderItem(tile))}
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
