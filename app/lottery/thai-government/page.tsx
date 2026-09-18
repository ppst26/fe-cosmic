"use client";

import React from "react";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { ThaiLottoBetBoard } from "@/app/components/lottery/thai/ThaiLottoBetBoard";
import {
  THAI_LOTTO_BET_TYPES,
  THAI_LOTTO_CURRENT_DRAW,
  THAI_LOTTO_GROUPS,
  THAI_LOTTO_LAST_RESULT,
} from "@/app/data/thaiLottoMockData";

/**
 * หน้าแทงหวยรัฐบาลไทย (/lottery/thai-government)
 */
export default function ThaiGovernmentLotteryPage() {
  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: "แทงหวย", backHref: "/lottery" }}
      mainClassName="mx-auto max-w-[var(--content-max)] lg:mx-0 lg:max-w-none"
    >
      <ThaiLottoBetBoard
        draw={THAI_LOTTO_CURRENT_DRAW}
        lastResult={THAI_LOTTO_LAST_RESULT}
        groups={THAI_LOTTO_GROUPS}
        betTypes={THAI_LOTTO_BET_TYPES}
      />
    </LobbyDesktopPageShell>
  );
}
