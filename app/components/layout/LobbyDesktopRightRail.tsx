"use client";

import React from "react";
import { LobbyDesktopRightMenuGrid } from "./LobbyDesktopRightMenuGrid";
import type { MenuDialogAction } from "@/app/data/menuMockData";

interface LobbyDesktopRightRailProps {
  onMenuAction?: (action: MenuDialogAction) => void;
}

/**
 * แถบขวา desktop lobby — แบนเนอร์เมนู sticky ใต้ header (เหมือน sidebar ซ้าย)
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function LobbyDesktopRightRail({ onMenuAction }: LobbyDesktopRightRailProps) {
  return (
    <aside
      className="lobby-desktop-right-rail sticky top-(--lobby-sidebar-sticky-top) z-[5] hidden w-[280px] shrink-0 flex-col self-start overflow-x-hidden overflow-y-auto overscroll-contain mt-0 max-h-(--lobby-sidebar-panel-height) pb-4 lg:flex xl:w-[300px]"
      aria-label="เมนูกิจกรรมและโปรโมชัน"
    >
      <LobbyDesktopRightMenuGrid onMenuAction={onMenuAction} />
    </aside>
  );
}
