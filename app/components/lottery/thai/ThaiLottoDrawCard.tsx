import React from "react";
import type { ThaiLottoDraw } from "@/app/types/lottery";
import { LotteryDrawCard } from "../LotteryDrawCard";

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
  return (
    <LotteryDrawCard
      title="หวยรัฐบาลไทย"
      drawLabel={draw.drawLabel}
      remainingMs={remainingMs}
      flagLabel="TH"
      flagTone="th"
      marketSlug="thai-government"
    />
  );
}
