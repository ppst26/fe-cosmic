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
    <article className="lottery-slip-summary" aria-label="สรุปโพย">
      <header className="lottery-slip-summary__head">
        <div className="lottery-slip-summary__head-row">
          <p className="lottery-slip-summary__meta">
            งวดวันที่ {drawSchedule}
          </p>
          <button
            type="button"
            className="lottery-slip-summary__slip-id"
            onClick={() => void handleCopyId()}
            aria-label="คัดลอกเลขโพย"
          >
            <span>โพย #{slip.shortId}</span>
            <CopyIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
          </button>
        </div>
        <div className="lottery-slip-summary__head-row">
          <p className="lottery-slip-summary__meta">ซื้อ {purchasedLabel}</p>
          <p className="lottery-slip-summary__status">ส่งโพยแล้ว</p>
        </div>
      </header>

      <p className="lottery-slip-summary__note">
        โน้ต {slip.note?.trim() ? slip.note : "ไม่มีบันทึกข้อความ"}
      </p>

      <div className="lottery-slip-summary__groups">
        {groups.map((group) => (
          <section key={group.typeLabel} className="lottery-slip-summary__group">
            <div className="lottery-slip-summary__group-head">
              <span>{group.typeLabel}</span>
              <span>{group.items.length} รายการ</span>
            </div>
            <ul className="lottery-slip-summary__rows">
              {group.items.map((line) => (
                <li key={`${line.typeKey}-${line.number}-${line.amount}`} className="lottery-slip-summary__row">
                  <span className="lottery-slip-summary__number">
                    {formatLotteryDigitsDisplay(line.number)}
                  </span>
                  <span className="lottery-slip-summary__pill lottery-slip-summary__pill--stake">
                    {formatBaht(line.amount)}
                  </span>
                  <span className="lottery-slip-summary__pill">
                    x{line.payoutRate.toLocaleString("th-TH")}
                  </span>
                  <span className="lottery-slip-summary__pill lottery-slip-summary__pill--win">
                    {formatBaht(line.potentialWin)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="lottery-slip-summary__totals">
        <div className="lottery-slip-summary__total-cell">
          <span className="lottery-slip-summary__total-label">เดิมพัน</span>
          <strong className="lottery-slip-summary__total-value">{formatBaht(slip.totalStake)}</strong>
        </div>
        <div className="lottery-slip-summary__total-cell">
          <span className="lottery-slip-summary__total-label">แพ้/ชนะ</span>
          <span className="lottery-slip-summary__total-muted">
            {slip.winLoss === null ? "—" : formatBaht(slip.winLoss)}
          </span>
        </div>
      </footer>

      {copied ? (
        <p className="lottery-slip-summary__copy-hint" role="status">คัดลอกเลขโพยแล้ว</p>
      ) : null}

      <div className="lottery-slip-summary__actions">
        <Link href="/lottery/slips" className="lottery-slip-summary__btn lottery-slip-summary__btn--ghost">
          โพยทั้งหมด
        </Link>
        <Link href={playHref} className="lottery-slip-summary__btn lottery-slip-summary__btn--primary">
          แทงต่อ
        </Link>
      </div>
    </article>
  );
}
