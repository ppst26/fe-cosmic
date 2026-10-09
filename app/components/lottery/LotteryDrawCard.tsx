"use client";

import React from "react";
import Link from "@/lib/i18n/navigation";
import type { LotteryFlagTone } from "@/app/types/lottery";
import { LotteryCountdown } from "./LotteryFlagOrb";
import { LotteryMarketIcon } from "./LotteryMarketIcon";
import { useLotteryI18n } from "./useLotteryI18n";
import { lotteryRulesHref } from "@/lib/lottery/rules";

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
 * มี marketSlug → กดแล้วไปหน้ากติกา / อัตราการจ่ายของตลาดนั้น (/lottery/rules/[slug])
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
      <Link
        href={lotteryRulesHref(marketSlug)}
        className={className}
        aria-label={`${t("draw.aria")} — ${t("market.rules")}`}
      >
        {content}
      </Link>
    );
  }
  return (
    <section className={className} aria-label={t("draw.aria")}>
      {content}
    </section>
  );
}
