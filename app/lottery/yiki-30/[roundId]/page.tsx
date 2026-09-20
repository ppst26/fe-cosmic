"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LotteryPlayPageShell } from "@/app/components/lottery/LotteryPlayPageShell";
import { LotteryYikiPlayBoard } from "@/app/components/lottery/LotteryYikiPlayBoard";

/** หน้าแทงหวยยี่กี 30 นาทีของรอบที่เลือก */
export default function Yiki30PlayPage() {
  const urlParams = useParams();
  const roundId = (urlParams?.roundId as string) || "";

  return (
    <LotteryPlayPageShell
      title="หวยยี่กี 30 นาที"
      backHref="/lottery/yiki-30"
      mainClassName="yiki-page-main mx-auto max-w-[var(--content-max)] pb-0 lg:mx-0 lg:max-w-none lg:pb-4 lg:pt-0"
    >
      {({ onStepChange }) => (
        <LotteryYikiPlayBoard
          marketSlug="yiki-30"
          roundId={roundId}
          backHref="/lottery/yiki-30"
          onStepChange={onStepChange}
        />
      )}
    </LotteryPlayPageShell>
  );
}
