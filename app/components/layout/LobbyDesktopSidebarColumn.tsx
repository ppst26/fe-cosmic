"use client";

import React from "react";
import type { CategoryId, CategoryItem } from "@/app/types/lobby";
import { LobbyDesktopSidebar } from "./LobbyDesktopSidebar";
import { LobbyDesktopHubMenuStack } from "./LobbyDesktopHubMenuStack";
import type { MenuDialogAction } from "@/app/types/menu";

interface LobbyDesktopSidebarColumnProps {
  categories: CategoryItem[];
  activeCategoryId: CategoryId;
  onSelectCategory?: (id: CategoryId) => void;
  onMenuAction?: (action: MenuDialogAction) => void;
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
  onMenuAction,
  navigationMode = "route",
}: LobbyDesktopSidebarColumnProps) {
  return (
    <>
      <LobbyDesktopSidebar
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={onSelectCategory}
        onMenuAction={onMenuAction}
        navigationMode={navigationMode}
      />
      <div className="lobby-desktop-shell__sidebar-hub lg:flex-1 lg:min-h-0 lg:overflow-x-hidden lg:overflow-y-auto lg:overscroll-contain">
        <LobbyDesktopHubMenuStack onMenuAction={onMenuAction} />
      </div>
    </>
  );
}
