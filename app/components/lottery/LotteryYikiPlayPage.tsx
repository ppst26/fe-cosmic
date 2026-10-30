"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LotteryPlayPageShell } from "./LotteryPlayPageShell";
import { LotteryYikiPlayBoard } from "./LotteryYikiPlayBoard";
import { lotteryPlayMarketMeta } from "@/lib/lottery/resolvePlayRound";
import { useT } from "@/lib/i18n/I18nProvider";

interface LotteryYikiPlayPageProps {
  /** ไม่ส่ง = อ่านจาก URL (/lottery/[marketId]/[roundId]) */
  marketSlug?: string;
}

/** Step 3 — แทงยี่กี / ตลาดรายวัน — ใช้ใน lottery .../[roundId]/page.tsx ทุกตลาดยกเว้นหวยรัฐบาลไทย */
export function LotteryYikiPlayPage({ marketSlug: marketSlugProp }: LotteryYikiPlayPageProps) {
  const t = useT("lottery");
  const urlParams = useParams();
  const marketSlug = marketSlugProp ?? ((urlParams?.marketId as string) || "");
  const roundId = (urlParams?.roundId as string) || "";
  const backHref = `/lottery/${marketSlug}`;

  return (
    <LotteryPlayPageShell
      title={t(lotteryPlayMarketMeta(marketSlug).titleKey)}
      backHref={backHref}
      mainClassName="yiki-page-main mx-auto max-w-[var(--content-max)] pb-0 lg:mx-0 lg:max-w-none lg:pb-4 lg:pt-0"
    >
      {({ onStepChange }) => (
        <LotteryYikiPlayBoard
          marketSlug={marketSlug}
          roundId={roundId}
          backHref={backHref}
          onStepChange={onStepChange}
        />
      )}
    </LotteryPlayPageShell>
  );
}
