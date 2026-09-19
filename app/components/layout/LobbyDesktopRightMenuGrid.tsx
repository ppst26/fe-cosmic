"use client";

import React from "react";
import Link from "next/link";
import { HubNavLink } from "@/app/components/hub/HubNavLink";
import { hrefToHubId } from "@/app/components/hub/hubModalRegistry";
import type { MenuDialogAction } from "@/app/data/menuMockData";
import { DESKTOP_RIGHT_MENU_TILES } from "@/app/data/desktopLobbyMockData";

interface LobbyDesktopRightMenuGridProps {
  onMenuAction?: (action: MenuDialogAction) => void;
}

/**
 * การ์ดเมนูขวา desktop — glass · ข้อความซ้าย · asset 3D ขวา
 * ถูกเรียกจาก LobbyDesktopRightRail.tsx
 */
function RightMenuGlassCardContent({
  title,
  subtitle,
  visualSrc,
  emphasis,
}: {
  title: string;
  subtitle: string;
  visualSrc: string;
  emphasis?: boolean;
}) {
  return (
    <div className="lobby-right-menu-card__body">
      <div className="lobby-right-menu-card__text min-w-0">
        <span
          className={`lobby-right-menu-card__title ${emphasis ? "lobby-right-menu-card__title--emphasis" : ""}`}
        >
          {title}
        </span>
        <span className="lobby-right-menu-card__subtitle">{subtitle}</span>
      </div>
      <div className="lobby-right-menu-card__visual" aria-hidden="true">
        <img src={visualSrc} alt="" className="lobby-right-menu-card__visual-img" loading="lazy" decoding="async" />
      </div>
    </div>
  );
}

export function LobbyDesktopRightMenuGrid({ onMenuAction }: LobbyDesktopRightMenuGridProps) {
  return (
    <div className="lobby-right-menu-stack w-full min-w-0" aria-label="เมนูด่วน">
      {DESKTOP_RIGHT_MENU_TILES.map((tile) => {
        const className = [
          "lobby-right-menu-card",
          "glass-card",
          "glass-card--soft",
          "lobby-right-menu-card--glass",
          tile.variant === "hero" ? "lobby-right-menu-card--emphasis" : "",
        ]
          .filter(Boolean)
          .join(" ");

        const body = (
          <RightMenuGlassCardContent
            title={tile.title}
            subtitle={tile.subtitle}
            visualSrc={tile.visualSrc}
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
