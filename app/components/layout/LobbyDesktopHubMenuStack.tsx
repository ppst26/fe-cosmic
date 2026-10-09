"use client";

import React from "react";
import Link from "@/lib/i18n/navigation";
import { useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { HubNavLink } from "@/app/components/hub/HubNavLink";
import {
  hrefToHubId,
  hubRequiresAuth,
} from "@/app/components/hub/hubModalRegistry";
import {
  menuActionRequiresAuth,
  menuHrefRequiresAuth,
} from "@/app/data/menuMockData";
import { DESKTOP_RIGHT_MENU_TILES } from "@/app/data/desktopLobbyMockData";
import { useRequireAuthAction } from "@/app/hooks/useRequireAuthAction";
import type { MenuDialogAction } from "@/app/types/menu";

interface LobbyDesktopHubMenuStackProps {
  onMenuAction?: (action: MenuDialogAction) => void;
}

/**
 * การ์ด hub แนวตั้งขนาดเล็ก — ใช้ใน LobbyDesktopSidebarColumn ใต้แผงเมนู
 */
export function LobbyDesktopHubMenuStack({ onMenuAction }: LobbyDesktopHubMenuStackProps) {
  const router = useRouter();
  const { runWithAuth } = useRequireAuthAction();
  const tiles = DESKTOP_RIGHT_MENU_TILES;

  const tileNeedsAuth = (tile: (typeof tiles)[number]) => {
    if ("action" in tile && tile.action) {
      return menuActionRequiresAuth(tile.action);
    }
    if ("href" in tile && tile.href) {
      const hubId = hrefToHubId(tile.href);
      if (hubId) return hubRequiresAuth(hubId);
      return menuHrefRequiresAuth(tile.href);
    }
    return false;
  };

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

        const isBg = Boolean("isBg" in tile && tile.isBg);
        const body = (
          <>
            {isBg ? (
              <img
                src={tile.visualSrc}
                alt=""
                className="lobby-hub-menu-card__bg absolute inset-0 h-full w-full pointer-events-none"
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <span
              className={`lobby-hub-menu-card__title cosmic-type-hub-title ${
                isBg ? "relative z-10 max-w-[54%] drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]" : ""
              }`}
            >
              {tile.title}
            </span>
            {!isBg ? (
              <span className="lobby-hub-menu-card__visual" aria-hidden="true">
                <img
                  src={tile.visualSrc}
                  alt=""
                  className="lobby-hub-menu-card__visual-img"
                  loading="lazy"
                  decoding="async"
                />
              </span>
            ) : null}
          </>
        );

        if ("action" in tile && tile.action) {
          return (
            <button
              key={tile.id}
              type="button"
              className={className}
              aria-label={tile.ariaLabel}
              onClick={() =>
                runWithAuth(tileNeedsAuth(tile), () => onMenuAction?.(tile.action!))
              }
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
          const href = tile.href;
          return (
            <Link
              key={tile.id}
              href={href}
              className={className}
              title={tile.ariaLabel}
              onClick={(event) => {
                if (!tileNeedsAuth(tile)) return;
                event.preventDefault();
                runWithAuth(true, () => {
                  router.push(href);
                });
              }}
            >
              {body}
            </Link>
          );
        }

        return null;
      })}
    </div>
  );
}
