"use client";

import React from "react";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { LotteryResultsPage } from "@/app/components/lottery/LotteryResultsPage";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";

/**
 * ผลรางวัล (/lottery/results) — ผลหวยทุกตลาดของแต่ละวัน · ลิงก์มาจาก「หน้าผลหวย >>」ในหน้า hub
 */
export default function LotteryResultsRoutePage() {
  const { t } = useLotteryI18n();

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: t("resultsPage.title"), backHref: "/lottery" }}
      mainClassName="lottery-results-page mx-auto max-w-[var(--content-max)] pb-8 lg:mx-0 lg:max-w-none"
    >
      <LotteryResultsPage />
    </LobbyDesktopPageShell>
  );
}
