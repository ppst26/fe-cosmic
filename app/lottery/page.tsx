"use client";

import React from "react";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { LotteryHubContent } from "@/app/components/lottery/LotteryHubContent";

/**
 * หน้าแทงหวย (/lottery) — feature · กริดประเภท · ผลหวยล่าสุด
 */
export default function LotteryPage() {
  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: "หวย", backHref: "/" }}
      mainClassName="mx-auto max-w-[var(--content-max)] lg:mx-0 lg:max-w-none"
    >
      <LotteryHubContent showPageHeading={false} />
    </LobbyDesktopPageShell>
  );
}
