"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { YikiBetBoard } from "@/app/components/lottery/yiki/YikiBetBoard";
import {
  YIKI_BET_TYPES,
  YIKI_GROUPS,
  YIKI_SETTLEMENT_TYPES,
  getYikiRoundById,
} from "@/app/data/yikiMockData";

/**
 * หน้าแทงหวยยี่กี 30 นาทีของรอบที่เลือก (/lottery/yiki-30/[roundId])
 */
export default function Yiki30PlayPage() {
  const urlParams = useParams();
  const roundId = (urlParams?.roundId as string) || "";
  const round = useMemo(() => getYikiRoundById(roundId), [roundId]);

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: "หวยยี่กี 30 นาที", backHref: "/lottery/yiki-30" }}
      hideBottomNav
      mainClassName="yiki-page-main mx-auto max-w-[var(--content-max)] pb-0 lg:mx-0 lg:max-w-none lg:pb-4 lg:pt-0"
    >
      {round ? (
        <YikiBetBoard
          round={round}
          groups={YIKI_GROUPS}
          betTypes={YIKI_BET_TYPES}
          settlementTypes={YIKI_SETTLEMENT_TYPES}
          backHref="/lottery/yiki-30"
        />
      ) : (
        <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ไม่พบรอบที่เลือก</p>
      )}
    </LobbyDesktopPageShell>
  );
}
