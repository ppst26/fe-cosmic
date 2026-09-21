"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { LotterySlipLine, LotterySubmittedSlip } from "@/app/types/lotterySlip";
import { formatBaht, formatLotteryDigitsDisplay, formatLotterySlipDateTime } from "./lotteryUtils";
import { CopyIcon } from "../ui/Icons";

interface LotterySlipSummaryProps {
  slip: LotterySubmittedSlip;
  continuePlayHref?: string;
}

function groupSlipLines(lines: LotterySlipLine[]) {
  const groups: { typeLabel: string; items: LotterySlipLine[] }[] = [];
  const indexByLabel = new Map<string, number>();

  for (const line of lines) {
    const existing = indexByLabel.get(line.typeLabel);
    if (existing === undefined) {
      indexByLabel.set(line.typeLabel, groups.length);
      groups.push({ typeLabel: line.typeLabel, items: [line] });
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
  const [copied, setCopied] = useState(false);
  const groups = groupSlipLines(slip.lines);
  const playHref = continuePlayHref ?? slip.continuePlayHref;
  const drawSchedule = formatLotterySlipDateTime(slip.drawAt);
  const purchasedLabel = formatLotterySlipDateTime(slip.purchasedAt);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(slip.shortId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard ไม่พร้อม */
    }
  };

  return (
    <article
      className="lottery-slip-summary flex flex-col gap-[0.85rem] pt-1 pb-6"
      aria-label="สรุปโพย"
    >
      <header className="lottery-slip-summary__head flex flex-col gap-[0.45rem]">
        <div className="lottery-slip-summary__head-row flex items-start justify-between gap-3">
          <p className="lottery-slip-summary__meta m-0">
            งวดวันที่ {drawSchedule}
          </p>
          <button
            type="button"
            className="lottery-slip-summary__slip-id inline-flex items-center gap-[0.35rem] m-0 p-0"
            onClick={() => void handleCopyId()}
            aria-label="คัดลอกเลขโพย"
          >
            <span>โพย #{slip.shortId}</span>
            <CopyIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
          </button>
        </div>
        <div className="lottery-slip-summary__head-row flex items-start justify-between gap-3">
          <p className="lottery-slip-summary__meta m-0">ซื้อ {purchasedLabel}</p>
          <p className="lottery-slip-summary__status m-0 whitespace-nowrap">ส่งโพยแล้ว</p>
        </div>
      </header>

      <p className="lottery-slip-summary__note m-0">
        โน้ต {slip.note?.trim() ? slip.note : "ไม่มีบันทึกข้อความ"}
      </p>

      <div className="lottery-slip-summary__groups">
        {groups.map((group) => (
          <section
            key={group.typeLabel}
            className="lottery-slip-summary__group overflow-hidden"
          >
            <div className="lottery-slip-summary__group-head flex items-center justify-between gap-2 px-[0.85rem] py-[0.55rem]">
              <span>{group.typeLabel}</span>
              <span>{group.items.length} รายการ</span>
            </div>
            <ul className="lottery-slip-summary__rows m-0 px-2 pt-[0.35rem] pb-2">
              {group.items.map((line) => (
                <li
                  key={`${line.typeKey}-${line.number}-${line.amount}`}
                  className="lottery-slip-summary__row grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-[0.35rem] px-1 py-[0.35rem]"
                >
                  <span className="lottery-slip-summary__number">
                    {formatLotteryDigitsDisplay(line.number)}
                  </span>
                  <span className="lottery-slip-summary__pill lottery-slip-summary__pill--stake min-w-[3.25rem] px-[0.45rem] py-[0.28rem] text-center">
                    {formatBaht(line.amount)}
                  </span>
                  <span className="lottery-slip-summary__pill min-w-[3.25rem] px-[0.45rem] py-[0.28rem] text-center">
                    x{line.payoutRate.toLocaleString("th-TH")}
                  </span>
                  <span className="lottery-slip-summary__pill lottery-slip-summary__pill--win min-w-[4.25rem] px-[0.45rem] py-[0.28rem] text-center">
                    {formatBaht(line.potentialWin)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="lottery-slip-summary__totals grid grid-cols-2 gap-2 mt-1 px-[0.65rem] py-[0.85rem]">
        <div className="lottery-slip-summary__total-cell flex flex-col items-center gap-[0.35rem] text-center">
          <span className="lottery-slip-summary__total-label">เดิมพัน</span>
          <strong className="lottery-slip-summary__total-value">{formatBaht(slip.totalStake)}</strong>
        </div>
        <div className="lottery-slip-summary__total-cell flex flex-col items-center gap-[0.35rem] text-center">
          <span className="lottery-slip-summary__total-label">แพ้/ชนะ</span>
          <span className="lottery-slip-summary__total-muted">
            {slip.winLoss === null ? "—" : formatBaht(slip.winLoss)}
          </span>
        </div>
      </footer>

      {copied ? (
        <p className="lottery-slip-summary__copy-hint m-0 text-center" role="status">
          คัดลอกเลขโพยแล้ว
        </p>
      ) : null}

      <div className="lottery-slip-summary__actions grid grid-cols-2 gap-[0.65rem] mt-[0.35rem]">
        <Link
          href="/lottery/slips"
          className="lottery-slip-summary__btn lottery-slip-summary__btn--ghost flex min-h-11 items-center justify-center px-3 py-[0.55rem] text-center"
        >
          โพยทั้งหมด
        </Link>
        <Link
          href={playHref}
          className="lottery-slip-summary__btn lottery-slip-summary__btn--primary flex min-h-11 items-center justify-center px-3 py-[0.55rem] text-center"
        >
          แทงต่อ
        </Link>
      </div>
    </article>
  );
}
