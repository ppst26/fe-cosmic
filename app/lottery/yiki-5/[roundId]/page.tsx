"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LotteryPlayPageShell } from "@/app/components/lottery/LotteryPlayPageShell";
import { LotteryYikiPlayBoard } from "@/app/components/lottery/LotteryYikiPlayBoard";

/** Step 3 — แทงหวยยี่กี 5 นาที */
export default function Yiki5PlayPage() {
  const urlParams = useParams();
  const roundId = (urlParams?.roundId as string) || "";

  return (
    <LotteryPlayPageShell
      title="หวยยี่กี 5 นาที"
      backHref="/lottery/yiki-5"
      mainClassName="yiki-page-main mx-auto max-w-[var(--content-max)] pb-0 lg:mx-0 lg:max-w-none lg:pb-4 lg:pt-0"
    >
      {({ onStepChange }) => (
        <LotteryYikiPlayBoard
          marketSlug="yiki-5"
          roundId={roundId}
          backHref="/lottery/yiki-5"
          onStepChange={onStepChange}
        />
      )}
    </LotteryPlayPageShell>
  );
}
