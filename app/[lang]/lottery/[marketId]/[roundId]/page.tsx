"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { LotteryPlayPageShell } from "@/app/components/lottery/LotteryPlayPageShell";
import { LotteryYikiPlayBoard } from "@/app/components/lottery/LotteryYikiPlayBoard";
import { getLotteryMarketBySlug } from "@/app/data/lotteryMarketsMockData";
import { useT } from "@/lib/i18n/I18nProvider";

/** Step 3 — แทงหวยตลาดรายวัน (/lottery/[marketId]/[roundId]) */
export default function LotteryMarketPlayPage() {
  const t = useT("lottery");
  const urlParams = useParams();
  const marketId = (urlParams?.marketId as string) || "";
  const roundId = (urlParams?.roundId as string) || "";
  const market = useMemo(() => getLotteryMarketBySlug(marketId), [marketId]);

  return (
    <LotteryPlayPageShell
      title={t(market?.titleKey ?? "hub.title")}
      backHref={`/lottery/${marketId}`}
      mainClassName="yiki-page-main mx-auto max-w-[var(--content-max)] pb-0 lg:mx-0 lg:max-w-none lg:pb-4 lg:pt-0"
    >
      {({ onStepChange }) => (
        <LotteryYikiPlayBoard
          marketSlug={marketId}
          roundId={roundId}
          backHref={`/lottery/${marketId}`}
          onStepChange={onStepChange}
        />
      )}
    </LotteryPlayPageShell>
  );
}
