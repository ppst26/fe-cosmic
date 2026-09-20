"use client";

import React from "react";
import { formatBaht } from "./lotteryUtils";

const QUICK_AMOUNTS = [5, 10, 20, 50, 100];

interface LotteryPriceControlsProps {
  sameForAll: boolean;
  onToggleSameForAll: (checked: boolean) => void;
  /** กลับไปแก้เลข — ปุ่ม "แก้ไข" และ "กลับแก้ไขเลข" */
  onBack: () => void;
  onQuickAmount: (amount: number) => void;
  onSubmit: () => void;
  submitDisabled: boolean;
  total: number;
  /** ราคาที่เลือกอยู่ — ไฮไลต์ชิปเมื่อตรง */
  selectedAmount?: number | null;
}

/**
 * แถบใส่ราคา — ราคาเท่ากันทั้งหมด · แก้ไข · ยอดรวม · ชิปด่วน · กลับแก้ไขเลข / ส่งโพย
 * ใช้คู่ LotteryPriceSlipPanel ในขั้น price ของทุกประเภทหวย
 */
export function LotteryPriceControls({
  sameForAll,
  onToggleSameForAll,
  onBack,
  onQuickAmount,
  onSubmit,
  submitDisabled,
  total,
  selectedAmount = null,
}: LotteryPriceControlsProps) {
  return (
    <div className="lottery-price-controls" aria-label="ใส่ราคาและส่งโพย">
      <div className="lottery-price-controls__toolbar">
        <label className="lottery-price-controls__checkbox">
          <input
            type="checkbox"
            checked={sameForAll}
            onChange={(event) => onToggleSameForAll(event.target.checked)}
          />
          <span>ราคาเท่ากันทั้งหมด</span>
        </label>
        <button type="button" className="lottery-price-controls__edit" onClick={onBack}>
          <PencilIcon />
          แก้ไข
        </button>
        <div className="lottery-price-controls__total-badge" aria-live="polite">
          <span className="lottery-price-controls__total-label">รวม</span>
          <span className="lottery-price-controls__total-value">{formatBaht(total)}</span>
        </div>
      </div>

      <div className="lottery-price-controls__chips" role="group" aria-label="เลือกราคา">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            aria-pressed={selectedAmount === amount}
            onClick={() => onQuickAmount(amount)}
            className={`lottery-price-chip lottery-price-chip--${amount}${
              selectedAmount === amount ? " is-active" : ""
            }`}
          >
            {amount}
          </button>
        ))}
      </div>

      <div className="lottery-price-controls__actions">
        <button type="button" className="lottery-price-controls__back" onClick={onBack}>
          กลับแก้ไขเลข
        </button>
        <button
          type="button"
          className="cosmic-cta-primary cosmic-cta-primary--lg lottery-price-controls__submit"
          onClick={onSubmit}
          disabled={submitDisabled}
        >
          ส่งโพย
        </button>
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M13.5 3.5a2.12 2.12 0 0 1 3 3L7 16l-4 1 1-4 9.5-9.5Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}
