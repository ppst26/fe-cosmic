"use client";

import React from "react";
import Link from "next/link";
import { HubNavLink } from "@/app/components/hub/HubNavLink";
import { hrefToHubId } from "@/app/components/hub/hubModalRegistry";
import { ChevronRightIcon, RefundIcon } from "../ui/Icons";
import { MenuItemIcon } from "./MenuItemIcon";
import {
  DESKTOP_ACTIVITY_LINKS,
  DESKTOP_PLAYER_PANEL_MOCK,
} from "@/app/data/desktopLobbyMockData";
import type { MenuDialogAction } from "@/app/data/menuMockData";

interface LobbyDesktopRightRailProps {
  /** คงไว้ให้ page.tsx — ลิงก์บัญชีย้ายไป header / hub แล้ว */
  onMenuAction?: (action: MenuDialogAction) => void;
}

/**
 * แถบขวา desktop lobby — กิจกรรม · คืนยอดเสีย (กระเป๋า/แรงค์/Gems อยู่ที่ header)
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function LobbyDesktopRightRail(_: LobbyDesktopRightRailProps) {
  return (
    <aside
      className="lobby-desktop-right-rail hidden w-[280px] shrink-0 flex-col gap-3 lg:flex xl:w-[300px]"
      aria-label="เมนูกิจกรรมและโปรโมชัน"
    >
      <nav className="lobby-desktop-panel" aria-label="กิจกรรม">
        <ul className="flex flex-col gap-0.5">
          {DESKTOP_ACTIVITY_LINKS.map((item) => (
            <li key={item.id}>
              {hrefToHubId(item.href) ? (
                <HubNavLink href={item.href} className="lobby-desktop-panel__link">
                  <span className="flex items-center gap-2.5">
                    <MenuItemIcon iconId={item.iconId} />
                    {item.label}
                  </span>
                  <ChevronRightIcon className="h-4 w-4 opacity-60" />
                </HubNavLink>
              ) : (
                <Link href={item.href} className="lobby-desktop-panel__link">
                  <span className="flex items-center gap-2.5">
                    <MenuItemIcon iconId={item.iconId} />
                    {item.label}
                  </span>
                  <ChevronRightIcon className="h-4 w-4 opacity-60" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="lobby-desktop-panel">
        <div className="flex items-start gap-2">
          <RefundIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--chart-2)]" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">คืนยอดเสีย</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {DESKTOP_PLAYER_PANEL_MOCK.cashbackHint}
            </p>
            <HubNavLink
              href="/cashback"
              className="mt-2 inline-block text-xs font-semibold text-[var(--chart-2)] hover:underline"
            >
              ดูรายละเอียด
            </HubNavLink>
          </div>
        </div>
      </div>
    </aside>
  );
}
