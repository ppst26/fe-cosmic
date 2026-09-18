"use client";

import React from "react";
import type { YikiBetEntry, YikiSettlementTypeId, YikiSettlementType } from "@/app/types/yiki";
import { formatBaht } from "../lotteryUtils";

interface YikiPricePanelProps {
  entries: YikiBetEntry[];
  settlementTypes: Record<YikiSettlementTypeId, YikiSettlementType>;
  defaultAmount: number;
  onDefaultAmountChange: (amount: number) => void;
  onApplyAmountToAll: () => void;
  onAmountChange: (entryId: string, amount: number) => void;
}

/** แปลงค่าจาก input เป็นจำนวนเต็มบาท (ว่าง = 0) */
function parseAmount(raw: string): number {
  const digits = raw.replace(/\D/g, "").slice(0, 7);
  return digits ? Number(digits) : 0;
}

/**
 * ขั้นใส่ราคา — จัดกลุ่มเลขตามผลการจ่ายเหมือนโพยตอนเลือกเลข แต่ใส่ราคาต่อรายการได้แล้ว
 * ใช้ใน YikiBetBoard หลังกด "ใส่ราคา" (แสดงแทน YikiSlip ในคอลัมน์ซ้าย)
 */
export function YikiPricePanel({
  entries,
  settlementTypes,
  defaultAmount,
  onDefaultAmountChange,
  onApplyAmountToAll,
  onAmountChange,
}: YikiPricePanelProps) {
  const groupOrder: YikiSettlementTypeId[] = [];
  const grouped = new Map<YikiSettlementTypeId, YikiBetEntry[]>();
  for (const entry of entries) {
    if (!grouped.has(entry.settlementTypeId)) {
      grouped.set(entry.settlementTypeId, []);
      groupOrder.push(entry.settlementTypeId);
    }
    grouped.get(entry.settlementTypeId)!.push(entry);
  }

  const total = entries.reduce((sum, entry) => sum + (entry.amount ?? 0), 0);
  const hasInvalid = entries.some((entry) => !entry.amount || entry.amount <= 0);

  return (
    <div className="yiki-slip">
      <div className="yiki-slip__head">{entries.length} รายการ</div>

      <div className="thai-lotto-slip__default">
        <label htmlFor="yiki-default-amount" className="thai-lotto-slip__default-label">
          ราคาต่อรายการ
        </label>
        <div className="thai-lotto-amount">
          <input
            id="yiki-default-amount"
            inputMode="numeric"
            value={defaultAmount || ""}
            onChange={(event) => onDefaultAmountChange(parseAmount(event.target.value))}
            className="thai-lotto-amount__input"
          />
          <span className="thai-lotto-amount__unit">บาท</span>
        </div>
        <button type="button" className="thai-lotto-slip__text-btn" onClick={onApplyAmountToAll}>
          ใช้กับทุกรายการ
        </button>
      </div>

      <div className="yiki-slip__list">
        {groupOrder.map((settlementTypeId) => {
          const groupEntries = grouped.get(settlementTypeId)!;
          const settlementType = settlementTypes[settlementTypeId];
          return (
            <div key={settlementTypeId} className="yiki-slip__group">
              <div className="yiki-slip__group-head">
                <span>{settlementType.label}</span>
                <span>{groupEntries.length}</span>
              </div>
              {groupEntries.map((entry) => {
                const invalid = !entry.amount || entry.amount <= 0;
                const inputId = `yiki-amount-${entry.id}`;
                return (
                  <div key={entry.id} className="yiki-price-row">
                    <span className="yiki-slip__number">{entry.number}</span>
                    <label htmlFor={inputId} className="yiki-price-row__payout">
                      ชนะได้ {formatBaht((entry.amount ?? 0) * settlementType.payoutRate)}
                    </label>
                    <span className={`thai-lotto-amount thai-lotto-amount--sm${invalid ? " is-invalid" : ""}`}>
                      <input
                        id={inputId}
                        inputMode="numeric"
                        value={entry.amount || ""}
                        aria-invalid={invalid}
                        onChange={(event) => onAmountChange(entry.id, parseAmount(event.target.value))}
                        className="thai-lotto-amount__input"
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {hasInvalid ? (
        <p className="thai-lotto-slip__error" role="alert">
          กรุณาใส่ราคาทุกรายการ
        </p>
      ) : null}

      <div className="thai-lotto-slip__summary">
        <span className="text-sm text-[var(--text-secondary)]">ยอดแทงรวม</span>
        <span className="thai-lotto-slip__total">{formatBaht(total)} บาท</span>
      </div>
    </div>
  );
}
