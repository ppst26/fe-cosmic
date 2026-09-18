"use client";

import React from "react";
import type { YikiBetEntry, YikiSettlementTypeId, YikiSettlementType } from "@/app/types/yiki";
import { formatBaht } from "../lotteryUtils";

interface YikiPricePanelProps {
  entries: YikiBetEntry[];
  settlementTypes: Record<YikiSettlementTypeId, YikiSettlementType>;
  /** รายการที่กำลังแก้ไขราคาอยู่ — ไฮไลต์กรอบและเป็นเป้าหมายของชิปราคาใน YikiPriceControls */
  selectedEntryId: string | null;
  onSelectEntry: (entryId: string) => void;
  onAmountChange: (entryId: string, amount: number) => void;
  onRemove: (entryId: string) => void;
}

/** แปลงค่าจาก input เป็นจำนวนเต็มบาท (ว่าง = 0) */
function parseAmount(raw: string): number {
  const digits = raw.replace(/\D/g, "").slice(0, 7);
  return digits ? Number(digits) : 0;
}

/**
 * รายการโพยในขั้นใส่ราคา — จัดกลุ่มตามผลการจ่ายเหมือน YikiSlip แต่แต่ละแถวใส่ราคาได้
 * คลิกแถว (หรือโฟกัสช่องราคา) เพื่อเลือกเป็นเป้าหมายของชิปราคาด่วนใน YikiPriceControls
 * ใช้ใน YikiBetBoard แทน YikiSlip ในคอลัมน์โพยหลังกด "ใส่ราคา"
 */
export function YikiPricePanel({
  entries,
  settlementTypes,
  selectedEntryId,
  onSelectEntry,
  onAmountChange,
  onRemove,
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

  return (
    <div className="yiki-slip">
      <div className="yiki-slip__head">{entries.length} รายการ</div>

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
              <div className="yiki-slip-rows">
                {groupEntries.map((entry, index) => {
                  const inputId = `yiki-amount-${entry.id}`;
                  const payout = entry.amount ? formatBaht(entry.amount * settlementType.payoutRate) : "—";
                  return (
                    // คลิกทั้งแถวเป็นทางลัดเลือก — คีย์บอร์ดเข้าถึงได้ผ่านการโฟกัสช่องราคา <input> ด้านในอยู่แล้ว
                    <div
                      key={entry.id}
                      onClick={() => onSelectEntry(entry.id)}
                      className={`yiki-price-row${entry.id === selectedEntryId ? " is-selected" : ""}`}
                    >
                      <span className="yiki-price-row__index">{index + 1}.</span>
                      <span className="yiki-price-row__number">{entry.number}</span>
                      <span className="thai-lotto-amount thai-lotto-amount--sm yiki-price-row__input">
                        <input
                          id={inputId}
                          inputMode="numeric"
                          placeholder="ใส่ราคา"
                          value={entry.amount || ""}
                          onFocus={() => onSelectEntry(entry.id)}
                          onChange={(event) => onAmountChange(entry.id, parseAmount(event.target.value))}
                          className="thai-lotto-amount__input"
                        />
                      </span>
                      <span className="yiki-price-row__rate">x{settlementType.payoutRate}</span>
                      <span className="yiki-price-row__payout">{payout}</span>
                      <button
                        type="button"
                        className="yiki-slip__remove"
                        onClick={(event) => {
                          event.stopPropagation();
                          onRemove(entry.id);
                        }}
                        aria-label={`ลบ ${settlementType.label} ${entry.number}`}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M4 6h12M8 6V4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V6m-7 0 .6 9.4a1 1 0 0 0 1 .9h5.8a1 1 0 0 0 1-.9L15 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
