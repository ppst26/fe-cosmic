"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HubNavLink } from "@/app/components/hub/HubNavLink";
import { hrefToHubId } from "@/app/components/hub/hubModalRegistry";
import type { MenuDialogAction } from "@/app/data/menuMockData";
import { DESKTOP_RIGHT_MENU_TILES } from "@/app/data/desktopLobbyMockData";

interface LobbyDesktopHubMenuStackProps {
  onMenuAction?: (action: MenuDialogAction) => void;
}

/**
 * การ์ด hub แนวตั้งขนาดเล็ก — ใช้ใน LobbyDesktopSidebarColumn ใต้แผงเมนู
 */
export function LobbyDesktopHubMenuStack({ onMenuAction }: LobbyDesktopHubMenuStackProps) {
  const tiles = DESKTOP_RIGHT_MENU_TILES;

  return (
    <div className="lobby-hub-menu-stack w-full min-w-0" aria-label="เมนูด่วน">
      {tiles.map((tile, index) => {
        const isWideSpan =
          ("variant" in tile && (tile as { variant?: string }).variant === "wide") ||
          (index === tiles.length - 1 && tiles.length % 2 === 1);
        const className = cn(
          "lobby-hub-menu-card glass-card glass-card--soft lobby-hub-menu-card--glass",
          isWideSpan && "lobby-hub-menu-card--span-2",
        );

        const body = (
          <>
            <span className="lobby-hub-menu-card__title cosmic-type-hub-title">{tile.title}</span>
            <span className="lobby-hub-menu-card__visual" aria-hidden="true">
              <img
                src={tile.visualSrc}
                alt=""
                className="lobby-hub-menu-card__visual-img"
                loading="lazy"
                decoding="async"
              />
            </span>
          </>
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
