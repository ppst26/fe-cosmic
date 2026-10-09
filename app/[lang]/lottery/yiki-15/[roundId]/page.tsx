"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LotteryPlayPageShell } from "@/app/components/lottery/LotteryPlayPageShell";
import { LotteryYikiPlayBoard } from "@/app/components/lottery/LotteryYikiPlayBoard";
import { useT } from "@/lib/i18n/I18nProvider";

/** หน้าแทงหวยยี่กี 15 นาทีของรอบที่เลือก */
export default function Yiki15PlayPage() {
  const t = useT("lottery");
  const urlParams = useParams();
  const roundId = (urlParams?.roundId as string) || "";

  return (
    <LotteryPlayPageShell
      title={t("markets.yiki15")}
      backHref="/lottery/yiki-15"
      mainClassName="yiki-page-main mx-auto max-w-[var(--content-max)] pb-0 lg:mx-0 lg:max-w-none lg:pb-4 lg:pt-0"
    >
      {({ onStepChange }) => (
        <LotteryYikiPlayBoard
          marketSlug="yiki-15"
          roundId={roundId}
          backHref="/lottery/yiki-15"
          onStepChange={onStepChange}
        />
      )}
    </LotteryPlayPageShell>
  );
}
