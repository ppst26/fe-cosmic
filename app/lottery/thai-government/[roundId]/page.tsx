"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { ThaiLottoBetBoard } from "@/app/components/lottery/thai/ThaiLottoBetBoard";
import {
  THAI_LOTTO_BET_TYPES,
  THAI_LOTTO_GROUPS,
  THAI_LOTTO_LAST_RESULT,
} from "@/app/data/thaiLottoMockData";
import { getThaiLottoDrawByRoundId } from "@/app/data/lotteryRoundsMockData";

/**
 * Step 3 — แทงหวยรัฐบาลไทยตามรอบที่เลือก
 */
export default function ThaiGovernmentLotteryPlayPage() {
  const urlParams = useParams();
  const roundId = (urlParams?.roundId as string) || "";
  const draw = useMemo(() => getThaiLottoDrawByRoundId(roundId), [roundId]);

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: "หวยรัฐบาลไทย", backHref: "/lottery/thai-government" }}
      hideBottomNav
      mainClassName="mx-auto max-w-[var(--content-max)] lg:mx-0 lg:max-w-none"
    >
      {draw ? (
        <ThaiLottoBetBoard
          draw={draw}
          lastResult={THAI_LOTTO_LAST_RESULT}
          groups={THAI_LOTTO_GROUPS}
          betTypes={THAI_LOTTO_BET_TYPES}
        />
      ) : (
        <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ไม่พบรอบที่เลือก</p>
      )}
    </LobbyDesktopPageShell>
  );
}
