"use client";

import React, { useCallback } from "react";
import type { YikiBetEntry, YikiSettlementTypeId, YikiSettlementType } from "@/app/types/yiki";
import { LotteryBetSlip } from "../LotteryBetSlip";

interface YikiSlipProps {
  entries: YikiBetEntry[];
  settlementTypes: Record<YikiSettlementTypeId, YikiSettlementType>;
  canUndo: boolean;
  onRemove: (entryId: string) => void;
  onUndo: () => void;
  onClearAll: () => void;
}

/**
 * โพยยี่กี/หวยหุ้น — ห่อ LotteryBetSlip มาตรฐานเดียวกับหวยรัฐบาล
 * ใช้ใน YikiBetBoard
 */
export function YikiSlip({
  entries,
  settlementTypes,
  canUndo,
  onRemove,
  onUndo,
  onClearAll,
}: YikiSlipProps) {
  const resolveGroup = useCallback(
    (groupKey: string) => {
      const settlementType = settlementTypes[groupKey as YikiSettlementTypeId];
      if (!settlementType) return undefined;
      return { label: settlementType.label, payoutRate: settlementType.payoutRate };
    },
    [settlementTypes],
  );

  const pickEntries = entries.map((entry) => ({
    id: entry.id,
    number: entry.number,
    groupKey: entry.settlementTypeId,
  }));

  return (
    <LotteryBetSlip
      entries={pickEntries}
      resolveGroup={resolveGroup}
      emptyMessage="ยังไม่มีข้อมูล กรุณาใส่เลขที่ต้องการแทง"
      titleId="yiki-bet-slip-title"
      onRemove={onRemove}
      onClearAll={onClearAll}
      canUndo={canUndo}
      onUndo={onUndo}
    />
  );
}
