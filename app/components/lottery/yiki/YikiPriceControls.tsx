"use client";

import React from "react";
import type { YikiBetEntry, YikiSettlementTypeId, YikiSettlementType } from "@/app/types/yiki";
import { formatBaht } from "../lotteryUtils";

const QUICK_AMOUNTS = [5, 10, 20, 50, 100];

interface YikiPriceControlsProps {
  selectedEntry: YikiBetEntry | null;
  settlementTypes: Record<YikiSettlementTypeId, YikiSettlementType>;
  sameForAll: boolean;
  onToggleSameForAll: (checked: boolean) => void;
  pendingAmount: number | null;
  onSelectPendingAmount: (amount: number) => void;
  onApply: () => void;
  canApply: boolean;
  total: number;
}

/**
 * แผงใส่ราคา — พรีวิวเลขที่กำลังแก้ไข + ติ๊ก "ราคาเท่ากันทั้งหมด" + ชิปราคาด่วน + ปุ่ม "แก้ไข" + ยอดรวม
 * ใช้ใน YikiBetBoard แทนแผงเลือกเลข ในคอลัมน์ขวาหลังกด "ใส่ราคา"
 * เลือกแถวในโพย (YikiPricePanel) ก่อน แล้วกดชิปราคา + "แก้ไข" เพื่อใส่ราคาให้แถวนั้น (หรือทุกแถวถ้าติ๊กราคาเท่ากัน)
 */
export function YikiPriceControls({
  selectedEntry,
  settlementTypes,
  sameForAll,
  onToggleSameForAll,
  pendingAmount,
  onSelectPendingAmount,
  onApply,
  canApply,
  total,
}: YikiPriceControlsProps) {
  const selectedRate = selectedEntry ? settlementTypes[selectedEntry.settlementTypeId].payoutRate : null;

  return (
    <div className="thai-lotto-panel yiki-price-controls" aria-label="ใส่ราคา">
      <h2 className="yiki-price-controls__title">ใส่ราคา</h2>

      {selectedEntry ? (
        <div className="yiki-price-controls__preview">
          <span className="yiki-price-controls__preview-label">เลขที่เลือก</span>
          <span className="yiki-price-controls__preview-number">{selectedEntry.number.split("").join(" ")}</span>
          {selectedRate !== null ? (
            <span className="yiki-price-controls__preview-rate">x{selectedRate}</span>
          ) : null}
        </div>
      ) : null}

      <label className="yiki-price-controls__checkbox">
        <input
          type="checkbox"
          checked={sameForAll}
          onChange={(event) => onToggleSameForAll(event.target.checked)}
        />
        <span>ราคาเท่ากันทั้งหมด</span>
      </label>

      <div className="yiki-price-controls__chips" role="group" aria-label="เลือกราคา">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            aria-pressed={pendingAmount === amount}
            onClick={() => onSelectPendingAmount(amount)}
            className={`yiki-price-chip yiki-price-chip--${amount}${pendingAmount === amount ? " is-active" : ""}`}
          >
            {amount}
          </button>
        ))}
      </div>

      <button type="button" className="yiki-price-controls__apply" onClick={onApply} disabled={!canApply}>
        <EditIcon />
        แก้ไข
      </button>

      <div className="yiki-price-controls__total">
        <span>รวมแทง</span>
        <span>{formatBaht(total)} บาท</span>
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="m13.5 3.5 3 3-9 9-3.75.75.75-3.75 9-9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
