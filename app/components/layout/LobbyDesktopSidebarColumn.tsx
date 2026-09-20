"use client";

import React from "react";
import type { CategoryId, CategoryItem } from "@/app/types/lobby";
import type { MenuDialogAction } from "@/app/data/menuMockData";
import { LobbyDesktopSidebar } from "./LobbyDesktopSidebar";
import { LobbyDesktopHubMenuStack } from "./LobbyDesktopHubMenuStack";

interface LobbyDesktopSidebarColumnProps {
  categories: CategoryItem[];
  activeCategoryId: CategoryId;
  onSelectCategory?: (id: CategoryId) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onMenuAction?: (action: MenuDialogAction) => void;
  onLogout?: () => void;
  navigationMode?: "route" | "none";
}

/**
 * คอลัมน์ซ้าย desktop — แผงเมนู + การ์ด hub แยกใต้แผง (นอก glass sidebar)
 * ใช้ใน HomeLobbyPage · LobbyDesktopPageShell ภายใน lobby-desktop-shell__sidebar-outside
 */
export function LobbyDesktopSidebarColumn({
  categories,
  activeCategoryId,
  onSelectCategory,
  collapsed,
  onCollapsedChange,
  onMenuAction,
  onLogout,
  navigationMode = "route",
}: LobbyDesktopSidebarColumnProps) {
  return (
    <>
      <LobbyDesktopSidebar
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={onSelectCategory}
        collapsed={collapsed}
        onCollapsedChange={onCollapsedChange}
        onMenuAction={onMenuAction}
        onLogout={onLogout}
        navigationMode={navigationMode}
      />
      {!collapsed ? (
        <div className="lobby-desktop-shell__sidebar-hub">
          <LobbyDesktopHubMenuStack onMenuAction={onMenuAction} />
        </div>
      ) : null}
    </>
  );
}
