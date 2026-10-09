"use client";

import React from "react";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { LuckyWheelPageContent } from "@/app/components/wheel/LuckyWheelPageContent";

/**
 * หน้าวงล้อพารวย (/wheel)
 */
export default function LuckyWheelPage() {
  return (
    <LobbyDesktopPageShell
      activeCategoryId="home"
      mainClassName="lucky-wheel-page-shell w-full min-w-0 max-w-[var(--content-max)] lg:max-w-none"
    >
      <LuckyWheelPageContent />
    </LobbyDesktopPageShell>
  );
}
