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

/** แบนเนอร์เมนูแนวนอน — ไอคอนซ้าย · ข้อความขวา */
function RightMenuBannerContent({
  iconId,
  title,
  subtitle,
  emphasis,
}: {
  iconId: string;
  title: string;
  subtitle: string;
  emphasis?: boolean;
}) {
  return (
    <>
      <span className="lobby-right-menu-card__pattern" aria-hidden="true" />
      <span
        className={`lobby-right-menu-card__icon ${emphasis ? "lobby-right-menu-card__icon--emphasis" : ""}`}
      >
        <MenuItemIcon iconId={iconId} className="h-7 w-7 shrink-0 text-white drop-shadow-sm" />
      </span>
      <span className="lobby-right-menu-card__text min-w-0">
        <span
          className={`lobby-right-menu-card__title ${emphasis ? "lobby-right-menu-card__title--emphasis" : ""}`}
        >
          {title}
        </span>
        <span
          className={
            emphasis
              ? "lobby-right-menu-card__subtitle"
              : "lobby-right-menu-card__subtitle-en"
          }
        >
          {subtitle}
        </span>
      </span>
    </>
  );
}

/**
 * แถบเมนูขวา desktop — แบนเนอร์เรียงลง 1 คอลัมน์ (LobbyDesktopRightRail.tsx)
 */
export function LobbyDesktopRightMenuGrid({ onMenuAction }: LobbyDesktopRightMenuGridProps) {
  return (
    <div className="lobby-right-menu-stack w-full min-w-0" aria-label="เมนูด่วน">
      {DESKTOP_RIGHT_MENU_TILES.map((tile) => {
        const className = [
          "lobby-right-menu-card",
          `lobby-right-menu-card--${tile.tone}`,
          tile.variant === "hero" ? "lobby-right-menu-card--emphasis" : "",
        ]
          .filter(Boolean)
          .join(" ");

        const body = (
          <RightMenuBannerContent
            iconId={tile.iconId}
            title={tile.title}
            subtitle={tile.subtitle}
            emphasis={tile.variant === "hero"}
          />
        );

        if ("action" in tile && tile.action) {
          return (
            <button
              key={tile.id}
              type="button"
              className={className}
              aria-label={tile.ariaLabel}
              onClick={() => onMenuAction?.(tile.action!)}
            >
              {body}
            </button>
          );
        }

        if ("href" in tile && hrefToHubId(tile.href)) {
          return (
            <HubNavLink key={tile.id} href={tile.href} className={className} title={tile.ariaLabel}>
              {body}
            </HubNavLink>
          );
        }

        if ("href" in tile) {
          return (
            <Link key={tile.id} href={tile.href} className={className} title={tile.ariaLabel}>
              {body}
            </Link>
          );
        }

        return null;
      })}
    </div>
  );
}
