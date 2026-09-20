"use client";

import React from "react";
import Link from "next/link";
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
  return (
    <div className="lobby-hub-menu-stack w-full min-w-0" aria-label="เมนูด่วน">
      {DESKTOP_RIGHT_MENU_TILES.map((tile) => {
        const className =
          "lobby-hub-menu-card glass-card glass-card--soft lobby-hub-menu-card--glass";

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
