"use client";

import { useState } from "react";
import React from "react";
import type { LotteryFlagTone } from "@/app/types/lottery";
import { LotteryCountdown } from "./LotteryFlagOrb";
import { LotteryMarketIcon } from "./LotteryMarketIcon";
import { useLotteryI18n } from "./useLotteryI18n";
import { LotteryRulesModal } from "./LotteryRulesModal";

interface LotteryDrawCardProps {
  title: string;
  drawLabel: string;
  remainingMs: number | null;
  flagLabel?: string;
  flagTone?: LotteryFlagTone;
  /** slug ตลาด — ใช้รูปจาก public/lottery */
  marketSlug?: string;
}

/**
 * การ์ดหัวงวด — ใช้ทุกประเภทหวย (รัฐบาลไทย · ยี่กี · หวยหุ้น)
 * มี marketSlug → กดแล้วเปิด modal กติกา / อัตราการจ่ายของตลาดนั้น
 */
export function LotteryDrawCard({
  title,
  drawLabel,
  remainingMs,
  flagLabel = "TH",
  flagTone = "th",
  marketSlug,
}: LotteryDrawCardProps) {
  const { t, countdown } = useLotteryI18n();
  const [rulesOpen, setRulesOpen] = useState(false);
  const className = "thai-lotto-draw flex flex-wrap items-center gap-3 p-4";
  const content = (
    <>
      <LotteryMarketIcon
        marketSlug={marketSlug}
        size="lg"
        fallbackLabel={flagLabel}
        fallbackTone={flagTone}
      />
      <div className="min-w-0 flex-1">
        <h1 className="thai-lotto-draw__title m-0 leading-[1.4]">{title}</h1>
        <p className="thai-lotto-draw__meta m-0">{drawLabel}</p>
      </div>
      <div className="thai-lotto-draw__close flex flex-col items-end gap-[0.2rem]">
        <span className="thai-lotto-draw__close-label">{t("status.closesIn")}</span>
        <LotteryCountdown
          label={remainingMs === null ? "--:--:--" : countdown(remainingMs)}
        />
      </div>
    </>
  );

  if (marketSlug) {
    return (
      <>
        <button
          type="button"
          onClick={() => setRulesOpen(true)}
          className={`${className} w-full cursor-pointer text-left`}
          aria-haspopup="dialog"
          aria-label={`${t("draw.aria")} — ${t("market.rules")}`}
        >
          {content}
        </button>
        <LotteryRulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} marketSlug={marketSlug} />
      </>
    );
  }
  return (
    <section className={className} aria-label={t("draw.aria")}>
      {content}
    </section>
  );
}
