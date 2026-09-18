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
  /** กดชิปราคา — ใส่ราคาทันที (รายการที่เลือกอยู่ หรือทุกรายการถ้าติ๊กราคาเท่ากันทั้งหมด) */
  onQuickAmount: (amount: number) => void;
  /** กลับไปแก้เลขต่อ */
  onBack: () => void;
  /** ส่งโพย — ยังไม่เชื่อม API ถ้า disabled จริงจะปิดปุ่มไว้ */
  onSubmit: () => void;
  submitDisabled: boolean;
  total: number;
}

/**
 * แผงใส่ราคา — พรีวิวเลขที่กำลังแก้ไข + ติ๊ก "ราคาเท่ากันทั้งหมด" + ชิปราคาด่วน + ยอดรวม + ปุ่มกลับแก้ไขเลข/ส่งโพย
 * ใช้ใน YikiBetBoard แทนแผงเลือกเลข ในคอลัมน์ขวาหลังกด "ใส่ราคา" — ทั้งสองปุ่มอยู่ในการ์ดนี้ ไม่มีแถบปุ่มล่างสุดแยกแล้ว
 * เลือกแถวในโพย (YikiPricePanel) ก่อน แล้วกดชิปราคาเพื่อใส่ราคาให้แถวนั้นทันที (หรือทุกแถวถ้าติ๊กราคาเท่ากัน)
 */
export function YikiPriceControls({
  selectedEntry,
  settlementTypes,
  sameForAll,
  onToggleSameForAll,
  onQuickAmount,
  onBack,
  onSubmit,
  submitDisabled,
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
            aria-pressed={selectedEntry?.amount === amount}
            onClick={() => onQuickAmount(amount)}
            className={`yiki-price-chip yiki-price-chip--${amount}${
              selectedEntry?.amount === amount ? " is-active" : ""
            }`}
          >
            {amount}
          </button>
        ))}
      </div>

      <div className="yiki-price-controls__total">
        <span>รวมแทง</span>
        <span>{formatBaht(total)} บาท</span>
      </div>

      <div className="yiki-price-controls__actions">
        <button type="button" className="yiki-price-controls__back" onClick={onBack}>
          แก้ไข
        </button>
        <button
          type="button"
          className="cosmic-action-btn yiki-price-controls__submit"
          onClick={onSubmit}
          disabled={submitDisabled}
        >
          ส่งโพย
        </button>
      </div>
    </div>
  );
}
