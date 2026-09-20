"use client";

import React, { useCallback, useMemo } from "react";
import type { ThaiLottoBetEntry, ThaiLottoBetType, ThaiLottoBetTypeId } from "@/app/types/lottery";
import { LotteryBetSlip } from "../LotteryBetSlip";

interface ThaiLottoBetSlipProps {
  entries: ThaiLottoBetEntry[];
  betTypes: ThaiLottoBetType[];
  onRemove: (entryId: string) => void;
  onClearAll: () => void;
  canUndo?: boolean;
  onUndo?: () => void;
}

/**
 * โพยหวยรัฐบาล — ห่อ LotteryBetSlip มาตรฐาน
 * ใช้ใน ThaiLottoBetBoard
 */
export function ThaiLottoBetSlip({
  entries,
  betTypes,
  onRemove,
  onClearAll,
  canUndo = false,
  onUndo,
}: ThaiLottoBetSlipProps) {
  const typeById = useMemo(
    () => new Map<ThaiLottoBetTypeId, ThaiLottoBetType>(betTypes.map((type) => [type.id, type])),
    [betTypes],
  );

  const resolveGroup = useCallback(
    (groupKey: string) => {
      const type = typeById.get(groupKey as ThaiLottoBetTypeId);
      if (!type) return undefined;
      return { label: type.label, payoutRate: type.payoutRate };
    },
    [typeById],
  );

  const pickEntries = entries.map((entry) => ({
    id: entry.id,
    number: entry.number,
    groupKey: entry.typeId,
  }));

  return (
    <LotteryBetSlip
      entries={pickEntries}
      resolveGroup={resolveGroup}
      emptyMessage="เลือกประเภทแล้วกดเลขเพื่อเพิ่มลงโพย"
      titleId="thai-lotto-bet-slip-title"
      onRemove={onRemove}
      onClearAll={onClearAll}
      canUndo={canUndo}
      onUndo={onUndo}
    />
  );
}
