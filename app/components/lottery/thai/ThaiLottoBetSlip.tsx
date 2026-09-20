"use client";

import React, { useMemo } from "react";
import type { ThaiLottoBetEntry, ThaiLottoBetType, ThaiLottoBetTypeId } from "@/app/types/lottery";
import { LotterySlipToolbar } from "../LotterySlipToolbar";
import { formatLotteryDigitsDisplay } from "../lotteryUtils";

interface ThaiLottoBetSlipProps {
  entries: ThaiLottoBetEntry[];
  betTypes: ThaiLottoBetType[];
  onRemove: (entryId: string) => void;
  onClearAll: () => void;
  canUndo?: boolean;
  onUndo?: () => void;
}

/**
 * โพยขั้นเลือกเลข — เลข · อัตรา · ลบ (ราคาอยู่ขั้นใส่ราคาแยก)
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
  const typeById = new Map<ThaiLottoBetTypeId, ThaiLottoBetType>(
    betTypes.map((type) => [type.id, type]),
  );

  const groupedEntries = useMemo(() => {
    const order: ThaiLottoBetTypeId[] = [];
    const map = new Map<ThaiLottoBetTypeId, ThaiLottoBetEntry[]>();
    for (const entry of entries) {
      if (!map.has(entry.typeId)) {
        map.set(entry.typeId, []);
        order.push(entry.typeId);
      }
      map.get(entry.typeId)!.push(entry);
    }
    return { order, map };
  }, [entries]);

  return (
    <section
      className="thai-lotto-panel thai-lotto-slip thai-lotto-slip--pick-only"
      aria-labelledby="thai-lotto-slip-title"
    >
      <div className="thai-lotto-slip__head">
        <h2 id="thai-lotto-slip-title" className="thai-lotto-slip__head-count">
          {entries.length} รายการ
        </h2>
      </div>

      {entries.length === 0 ? (
        <p className="thai-lotto-slip__empty">เลือกประเภทแล้วกดเลขเพื่อเพิ่มลงโพย</p>
      ) : (
        <div className="thai-lotto-slip__list">
          {groupedEntries.order.map((typeId) => {
            const groupEntries = groupedEntries.map.get(typeId)!;
            const type = typeById.get(typeId);
            return (
              <section key={typeId} className="thai-lotto-slip__group" aria-label={type?.label}>
                <div className="thai-lotto-slip__group-head">
                  <span>{type?.label}</span>
                  <span>{groupEntries.length} รายการ</span>
                </div>
                <ul className="thai-lotto-slip__rows">
                  {groupEntries.map((entry) => {
                    const payoutRate = type?.payoutRate ?? 0;
                    return (
                      <li key={entry.id} className="thai-lotto-slip__row">
                        <span className="thai-lotto-slip__number">
                          {formatLotteryDigitsDisplay(entry.number)}
                        </span>
                        <span className="thai-lotto-slip__rate">x{payoutRate}</span>
                        <button
                          type="button"
                          className="thai-lotto-slip__remove"
                          onClick={() => onRemove(entry.id)}
                          aria-label={`ลบ ${type?.label ?? ""} ${entry.number}`}
                        >
                          <TrashIcon />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <LotterySlipToolbar
        visible={entries.length > 0}
        canUndo={canUndo}
        onUndo={() => onUndo?.()}
        onClearAll={onClearAll}
      />
    </section>
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
