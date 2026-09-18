"use client";

import React from "react";
import { LobbyDesktopRightMenuGrid } from "./LobbyDesktopRightMenuGrid";
import type { MenuDialogAction } from "@/app/data/menuMockData";

interface LobbyDesktopRightRailProps {
  onMenuAction?: (action: MenuDialogAction) => void;
}

/**
 * แถบขวา desktop lobby — กริดรูปเมนู (แนะนำเพื่อน · เช็คอิน · วงล้อ · โปร · VIP)
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function LobbyDesktopRightRail({ onMenuAction }: LobbyDesktopRightRailProps) {
  return (
    <aside
      className="lobby-desktop-right-rail hidden w-[280px] shrink-0 flex-col lg:flex xl:w-[300px]"
      aria-label="เมนูกิจกรรมและโปรโมชัน"
    >
      <LobbyDesktopRightMenuGrid onMenuAction={onMenuAction} />
    </aside>
  );
}
