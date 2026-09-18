"use client";

import React from "react";
import type { YikiBetEntry, YikiSettlementTypeId, YikiSettlementType } from "@/app/types/yiki";

interface YikiSlipProps {
  entries: YikiBetEntry[];
  settlementTypes: Record<YikiSettlementTypeId, YikiSettlementType>;
  canUndo: boolean;
  onRemove: (entryId: string) => void;
  onUndo: () => void;
  onClearAll: () => void;
}

/**
 * โพย — จัดกลุ่มตามผลการจ่ายจริง (เช่น "วิ่งบน", "2 ตัวบน") ยังไม่มีราคาจนกว่าจะกด "ใส่ราคา"
 * ใช้ใน YikiBetBoard (คอลัมน์ซ้าย) — mini toolbar ล่างสุด: เอารายการล่าสุดออก / ล้างทั้งหมด
 */
export function YikiSlip({ entries, settlementTypes, canUndo, onRemove, onUndo, onClearAll }: YikiSlipProps) {
  // จัดกลุ่มตามลำดับที่พบครั้งแรก ให้ประเภทที่เพิ่งกดอยู่ด้านบนของกลุ่มเดิมไม่กระโดดตำแหน่ง
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

      {entries.length === 0 ? (
        <p className="yiki-slip__empty">ยังไม่มีข้อมูล กรุณาใส่เลข ที่ต้องการแทง</p>
      ) : (
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
                  {groupEntries.map((entry) => (
                    <div key={entry.id} className="yiki-slip__row">
                      <span className="yiki-slip__number">{entry.number}</span>
                      <span className="yiki-slip__rate">x{settlementType.payoutRate}</span>
                      <button
                        type="button"
                        className="yiki-slip__remove"
                        onClick={() => onRemove(entry.id)}
                        aria-label={`ลบ ${settlementType.label} ${entry.number}`}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {entries.length > 0 ? (
        <div className="yiki-slip__toolbar">
          <button
            type="button"
            className="yiki-slip__tool-btn"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="เอารายการล่าสุดออก"
          >
            <UndoIcon />
          </button>
          <button
            type="button"
            className="yiki-slip__tool-btn"
            onClick={onClearAll}
            aria-label="ล้างโพยทั้งหมด"
          >
            <TrashIcon />
          </button>
        </div>
      ) : null}
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

function UndoIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M6.5 5 3 8.5 6.5 12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 8.5h8.5a4 4 0 1 1 0 8H8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
