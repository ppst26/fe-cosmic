"use client";

import React from "react";
import Link from "next/link";
import { HubNavLink } from "@/app/components/hub/HubNavLink";
import { hrefToHubId } from "@/app/components/hub/hubModalRegistry";
import { MenuItemIcon } from "@/app/components/layout/MenuItemIcon";
import type { MenuDialogAction } from "@/app/data/menuMockData";
import { DESKTOP_RIGHT_MENU_TILES } from "@/app/data/desktopLobbyMockData";

interface LobbyDesktopRightMenuGridProps {
  onMenuAction?: (action: MenuDialogAction) => void;
}

/** เนื้อหาการ์d เมนู — hero กลาง · cell ไอคอนซ้ายข้อความขวา */
function RightMenuCardContent({
  variant,
  iconId,
  title,
  subtitle,
}: {
  variant: "hero" | "cell";
  iconId: string;
  title: string;
  subtitle: string;
}) {
  const iconClass =
    variant === "hero"
      ? "h-8 w-8 text-white drop-shadow-sm"
      : "h-7 w-7 text-white drop-shadow-sm";

  return (
    <>
      <span className="lobby-right-menu-card__pattern" aria-hidden="true" />
      {variant === "hero" ? (
        <>
          <span className="lobby-right-menu-card__icon lobby-right-menu-card__icon--hero">
            <MenuItemIcon iconId={iconId} className={iconClass} />
          </span>
          <span className="lobby-right-menu-card__title lobby-right-menu-card__title--hero">
            {title}
          </span>
          <span className="lobby-right-menu-card__subtitle">{subtitle}</span>
        </>
      ) : (
        <>
          <span className="lobby-right-menu-card__icon">
            <MenuItemIcon iconId={iconId} className={iconClass} />
          </span>
          <span className="lobby-right-menu-card__text min-w-0">
            <span className="lobby-right-menu-card__title">{title}</span>
            <span className="lobby-right-menu-card__subtitle-en">{subtitle}</span>
          </span>
        </>
      )}
    </>
  );
}

/**
 * กริดเมนูแถบขวา desktop — แบนเนอร์แนะนำเพื่อน + 2×2 (CSS ตาม mock ไม่ใช่รูปรวม)
 * ถูกเรียกใช้ใน LobbyDesktopRightRail.tsx
 */
export function LobbyDesktopRightMenuGrid({ onMenuAction }: LobbyDesktopRightMenuGridProps) {
  return (
    <div className="lobby-right-menu-grid w-full min-w-0" aria-label="เมนูด่วน">
      {DESKTOP_RIGHT_MENU_TILES.map((tile) => {
        const className = [
          "lobby-right-menu-card",
          `lobby-right-menu-card--${tile.variant}`,
          `lobby-right-menu-card--${tile.tone}`,
        ].join(" ");

        const body = (
          <RightMenuCardContent
            variant={tile.variant}
            iconId={tile.iconId}
            title={tile.title}
            subtitle={tile.subtitle}
          />
        );

        if ("action" in tile && tile.action === "vip-rank") {
          return (
            <button
              key={tile.id}
              type="button"
              className={className}
              aria-label={tile.ariaLabel}
              onClick={() => onMenuAction?.("vip-rank")}
            >
              {body}
            </button>
          );
        }

        if (hrefToHubId(tile.href)) {
          return (
            <HubNavLink key={tile.id} href={tile.href} className={className} title={tile.ariaLabel}>
              {body}
            </HubNavLink>
          );
        }

        return (
          <Link key={tile.id} href={tile.href} className={className} title={tile.ariaLabel}>
            {body}
          </Link>
        );
      })}
    </div>
  );
}
