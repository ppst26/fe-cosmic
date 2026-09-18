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
    <div className="yiki-type-grid" role="radiogroup" aria-label="ประเภทการแทง">
      {betTypes.map((betType) => {
        const isActive = betType.id === activeTypeId;
        return (
          <button
            key={betType.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(betType.id)}
            className={`yiki-type-chip${isActive ? " is-active" : ""}`}
          >
            <span className="yiki-type-chip__label">{betType.label}</span>
            <span className="yiki-type-chip__rate">x{formatRate(betType, settlementTypes)}</span>
          </button>
        );
      })}
    </div>
  );
}
