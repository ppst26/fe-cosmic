"use client";

import React from "react";
import type { YikiBetType, YikiSettlementTypeId, YikiSettlementType } from "@/app/types/yiki";

interface YikiTypeChipsProps {
  betTypes: YikiBetType[];
  settlementTypes: Record<YikiSettlementTypeId, YikiSettlementType>;
  activeTypeId: string;
  onSelect: (typeId: string) => void;
}

/** อัตราจ่ายที่แสดงบนปุ่ม — ปุ่มรวม (เช่น 3 ตัวบน + โต๊ด) โชว์อัตราของทุกผลที่ครอบคลุม คั่นด้วย "/" */
function formatRate(betType: YikiBetType, settlementTypes: Record<YikiSettlementTypeId, YikiSettlementType>) {
  return betType.settlementTypeIds.map((id) => settlementTypes[id].payoutRate).join(" / ");
}

/**
 * ปุ่มเลือกประเภทการแทง — เลือกได้ทีละปุ่มต่อกลุ่ม (ไม่ใช่ multi-select แบบหวยรัฐบาลไทย)
 * ใช้ใน YikiBetBoard
 */
export function YikiTypeChips({ betTypes, settlementTypes, activeTypeId, onSelect }: YikiTypeChipsProps) {
  return (
    <div
      className="yiki-type-grid grid grid-cols-2 gap-2"
      role="radiogroup"
      aria-label="ประเภทการแทง"
    >
      {betTypes.map((betType) => {
        const isActive = betType.id === activeTypeId;
        return (
          <button
            key={betType.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(betType.id)}
            className={`yiki-type-chip flex flex-row flex-nowrap items-center gap-[0.35rem] min-w-0 min-h-8 px-2 py-1 text-left${isActive ? " is-active" : ""}`}
          >
            <span className="yiki-type-chip__label flex-1 min-w-0 truncate">{betType.label}</span>
            <span className="yiki-type-chip__rate shrink-0 whitespace-nowrap">
              x{formatRate(betType, settlementTypes)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
