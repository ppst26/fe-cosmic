"use client";

import React from "react";
import Link from "@/lib/i18n/navigation";
import { HubNavLink } from "@/app/components/hub/HubNavLink";
import { hrefToHubId } from "@/app/components/hub/hubModalRegistry";
import { DESKTOP_RIGHT_MENU_TILES } from "@/app/data/desktopLobbyMockData";
import type { MenuDialogAction } from "@/app/types/menu";
import { useT } from "@/lib/i18n/I18nProvider";

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
  isBg,
  emphasis,
}: {
  title: string;
  subtitle: string;
  visualSrc: string;
  isBg?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="lobby-right-menu-card__body relative overflow-hidden">
      {isBg ? (
        <img
          src={visualSrc}
          alt=""
          className="lobby-hub-menu-card__bg absolute inset-0 h-full w-full pointer-events-none"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <div className={`lobby-right-menu-card__text min-w-0 ${isBg ? "relative z-10" : ""}`}>
        <span
          className={`lobby-right-menu-card__title cosmic-type-rail-card-title ${emphasis ? "lobby-right-menu-card__title--emphasis text-xl lg:text-2xl" : ""}`}
        >
          {title}
        </span>
        <span className="lobby-right-menu-card__subtitle cosmic-type-rail-card-subtitle">{subtitle}</span>
      </div>
      {!isBg ? (
        <div className="lobby-right-menu-card__visual" aria-hidden="true">
          <img src={visualSrc} alt="" className="lobby-right-menu-card__visual-img" loading="lazy" decoding="async" />
        </div>
      ) : null}
    </div>
  );
}

export function LobbyDesktopRightMenuGrid({ onMenuAction }: LobbyDesktopRightMenuGridProps) {
  const t = useT("nav");
  const tHome = useT("home");
  return (
    <div className="lobby-right-menu-stack flex w-full min-w-0 flex-col gap-2" aria-label={t("desktop.quickMenu")}>
      {DESKTOP_RIGHT_MENU_TILES.map((tile) => {
        const className = [
          "lobby-right-menu-card",
          "glass-card",
          "glass-card--soft",
          "lobby-right-menu-card--glass",
        ].join(" ");

        const isBg = Boolean("isBg" in tile && tile.isBg);
        const body = (
          <RightMenuGlassCardContent
            title={tHome(tile.titleKey)}
            subtitle={tHome(tile.subtitleKey)}
            visualSrc={tile.visualSrc}
            isBg={isBg}
            emphasis={false}
          />
        );

        if ("action" in tile && tile.action) {
          return (
            <button
              key={tile.id}
              type="button"
              className={className}
              aria-label={tHome(tile.ariaLabelKey)}
              onClick={() => onMenuAction?.(tile.action!)}
            >
              {body}
            </button>
          );
        }

        if ("href" in tile && hrefToHubId(tile.href)) {
          return (
            <HubNavLink key={tile.id} href={tile.href} className={className} title={tHome(tile.ariaLabelKey)}>
              {body}
            </HubNavLink>
          );
        }

        if ("href" in tile) {
          return (
            <Link key={tile.id} href={tile.href} className={className} title={tHome(tile.ariaLabelKey)}>
              {body}
            </Link>
          );
        }

        return null;
      })}
    </div>
  );
}
