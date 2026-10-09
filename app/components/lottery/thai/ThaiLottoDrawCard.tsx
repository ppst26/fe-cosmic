"use client";

import React from "react";
import type { ThaiLottoDraw } from "@/app/types/lottery";
import { LotteryDrawCard } from "../LotteryDrawCard";
import { useLotteryI18n } from "../useLotteryI18n";

/**
 * การ์ดหัวงวดหวยรัฐบาลไทย — ห่อ LotteryDrawCard
 */
export function ThaiLottoDrawCard({
  draw,
  remainingMs,
}: {
  draw: ThaiLottoDraw;
  remainingMs: number | null;
}) {
  const { t, roundLabel } = useLotteryI18n();
  return (
    <LotteryDrawCard
      title={t("markets.thaiGovernment")}
      drawLabel={roundLabel(draw.drawLabel)}
      remainingMs={remainingMs}
      flagLabel="TH"
      flagTone="th"
      marketSlug="thai-government"
    />
  );
}
