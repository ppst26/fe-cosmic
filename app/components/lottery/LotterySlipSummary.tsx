"use client";

import React from "react";
import { useToast } from "@/context/ToastContext";
import Link from "@/lib/i18n/navigation";
import type { LotterySlipLine, LotterySubmittedSlip } from "@/app/types/lotterySlip";
import type { LotteryMessageKey } from "@/app/types/lottery";
import { formatBaht, formatLotteryDigitsDisplay } from "./lotteryUtils";
import { useLotteryI18n } from "./useLotteryI18n";
import { CopyIcon } from "../ui/Icons";
import { COSMIC_BTN_PRIMARY } from "../ui/cosmicButtonClasses";

interface LotterySlipSummaryProps {
  slip: LotterySubmittedSlip;
  continuePlayHref?: string;
}

function groupSlipLines(lines: LotterySlipLine[]) {
  const groups: { typeLabelKey: LotteryMessageKey; items: LotterySlipLine[] }[] = [];
  const indexByLabel = new Map<LotteryMessageKey, number>();

  for (const line of lines) {
    const existing = indexByLabel.get(line.typeLabelKey);
    if (existing === undefined) {
      indexByLabel.set(line.typeLabelKey, groups.length);
      groups.push({ typeLabelKey: line.typeLabelKey, items: [line] });
    } else {
      groups[existing].items.push(line);
    }
  }

  return groups;
}

/**
 * สรุปโพยหลังส่งแทง — อ้างอิง UI โพยทอง (หัวงวด · รายการแยกประเภท · ยอดรวม · แทงต่อ)
 */
export function LotterySlipSummary({ slip, continuePlayHref }: LotterySlipSummaryProps) {
  const { showToast } = useToast();
  const { t, dateTime } = useLotteryI18n();
  const groups = groupSlipLines(slip.lines);
  const playHref = continuePlayHref ?? slip.continuePlayHref;
  const drawSchedule = dateTime(slip.drawAt);
  const purchasedLabel = dateTime(slip.purchasedAt);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(slip.shortId);
      showToast(t("summary.copied"), "success", 2500);
    } catch {
      showToast(t("summary.copyFailed"), "error");
    }
  };

  return (
    <article
      className="lottery-slip-summary flex flex-col gap-4 pb-3 pt-1"
      aria-label={t("summary.aria")}
    >
      <header className="lottery-slip-summary__head flex flex-col gap-2">
        <div className="lottery-slip-summary__head-row flex items-start justify-between gap-3">
          <p className="lottery-slip-summary__meta m-0">
            {t("summary.drawDate", { date: drawSchedule })}
          </p>
          <button
            type="button"
            className="lottery-slip-summary__slip-id inline-flex items-center gap-[0.35rem] m-0 p-0"
            onClick={() => void handleCopyId()}
            aria-label={t("summary.copyAria")}
          >
            <span>{t("summary.slipId", { id: slip.shortId })}</span>
            <CopyIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
          </button>
        </div>
        <div className="lottery-slip-summary__head-row flex items-start justify-between gap-3">
          <p className="lottery-slip-summary__meta m-0">{t("summary.purchased", { date: purchasedLabel })}</p>
          <p className="lottery-slip-summary__status m-0 whitespace-nowrap">{t("summary.submitted")}</p>
        </div>
      </header>

      <p className="lottery-slip-summary__note m-0">
        {t("summary.note", { note: slip.note?.trim() ? slip.note : t("summary.noNote") })}
      </p>

      <div className="lottery-slip-summary__groups flex flex-col gap-2.5">
        {groups.map((group) => (
          <section
            key={group.typeLabelKey}
            className="lottery-slip-summary__group overflow-hidden"
          >
            <div className="lottery-slip-summary__group-head flex items-center justify-between gap-3 px-3.5 py-2.5 sm:px-4">
              <span className="lottery-slip-summary__group-title">{t(group.typeLabelKey)}</span>
              <span className="lottery-slip-summary__group-count shrink-0">
                {t("slip.itemCount", { count: group.items.length })}
              </span>
            </div>
            <ul className="lottery-slip-summary__rows m-0 px-3 pb-2.5 pt-1.5 sm:px-3.5">
              {group.items.map((line) => (
                <li
                  key={`${line.typeKey}-${line.number}-${line.amount}`}
                  className="lottery-slip-summary__row grid grid-cols-[minmax(0,1fr)_auto_auto_minmax(4.25rem,auto)] items-center gap-1.5 py-2"
                >
                  <span className="lottery-slip-summary__number">
                    {formatLotteryDigitsDisplay(line.number)}
                  </span>
                  <span className="lottery-slip-summary__pill lottery-slip-summary__pill--stake min-w-[3rem] px-2 py-1 text-center">
                    {formatBaht(line.amount)}
                  </span>
                  <span className="lottery-slip-summary__pill min-w-[3.25rem] px-2 py-1 text-center">
                    x{line.payoutRate.toLocaleString("th-TH")}
                  </span>
                  <span className="lottery-slip-summary__pill lottery-slip-summary__pill--win min-w-0 px-2 py-1 text-center">
                    {formatBaht(line.potentialWin)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="lottery-slip-summary__totals mt-0.5 grid grid-cols-2 gap-3 px-3.5 py-3.5 sm:px-4">
        <div className="lottery-slip-summary__total-cell flex flex-col items-center gap-[0.35rem] text-center">
          <span className="lottery-slip-summary__total-label">{t("summary.stake")}</span>
          <strong className="lottery-slip-summary__total-value">{formatBaht(slip.totalStake)}</strong>
        </div>
        <div className="lottery-slip-summary__total-cell flex flex-col items-center gap-[0.35rem] text-center">
          <span className="lottery-slip-summary__total-label">{t("summary.winLoss")}</span>
          <span className="lottery-slip-summary__total-muted">
            {slip.winLoss === null ? "—" : formatBaht(slip.winLoss)}
          </span>
        </div>
      </footer>

      <div className="lottery-slip-summary__actions grid grid-cols-2 gap-2.5">
        <Link
          href="/lottery/slips"
          className="lottery-price-controls__back grid min-h-11 place-items-center px-3 text-center no-underline"
        >
          {t("summary.allSlips")}
        </Link>
        <Link
          href={playHref}
          className={`${COSMIC_BTN_PRIMARY} cosmic-cta-primary--lg lottery-slip-summary__continue px-3 text-center no-underline`}
        >
          {t("summary.continue")}
        </Link>
      </div>
    </article>
  );
}
