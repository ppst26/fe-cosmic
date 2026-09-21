"use client";

import React, { useMemo } from "react";
import { LotterySlipToolbar } from "./LotterySlipToolbar";
import { formatLotteryDigitsDisplay } from "./lotteryUtils";

/** รายการในโพยขั้นเลือกเลข — ใช้ร่วมทุกตลาดหวย */
export interface LotteryBetSlipPickEntry {
  id: string;
  number: string;
  groupKey: string;
}

/** หัวข้อกลุ่มในโพย (ประเภทแทง / ผลจ่าย) */
export interface LotteryBetSlipGroupInfo {
  label: string;
  payoutRate: number;
}

interface LotteryBetSlipProps {
  entries: LotteryBetSlipPickEntry[];
  resolveGroup: (groupKey: string) => LotteryBetSlipGroupInfo | undefined;
  emptyMessage: string;
  titleId?: string;
  onRemove: (entryId: string) => void;
  onClearAll: () => void;
  canUndo?: boolean;
  onUndo?: () => void;
}

/**
 * โพยขั้นเลือกเลข — มาตรฐานเดียวทุกตลาด (ยึด UI หวยรัฐบาล)
 * ใช้ใน ThaiLottoBetSlip · YikiSlip และหน้าแทงหวยอื่นที่ใช้เลย์เอาต์ lottery-play
 */
export function LotteryBetSlip({
  entries,
  resolveGroup,
  emptyMessage,
  titleId = "lottery-bet-slip-title",
  onRemove,
  onClearAll,
  canUndo = false,
  onUndo,
}: LotteryBetSlipProps) {
  const grouped = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, LotteryBetSlipPickEntry[]>();
    for (const entry of entries) {
      if (!map.has(entry.groupKey)) {
        map.set(entry.groupKey, []);
        order.push(entry.groupKey);
      }
      map.get(entry.groupKey)!.push(entry);
    }
    return { order, map };
  }, [entries]);

  return (
    <section
      className="lottery-panel lottery-bet-slip lottery-bet-slip--pick-only flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 md:p-5"
      aria-labelledby={titleId}
    >
      <div className="lottery-bet-slip__head">
        <h2 id={titleId} className="lottery-bet-slip__head-count">
          {entries.length} รายการ
        </h2>
      </div>

      {entries.length === 0 ? (
        <p className="lottery-bet-slip__empty">{emptyMessage}</p>
      ) : (
        <div className="lottery-bet-slip__list">
          {grouped.order.map((groupKey) => {
            const groupEntries = grouped.map.get(groupKey)!;
            const group = resolveGroup(groupKey);
            const label = group?.label ?? groupKey;
            const payoutRate = group?.payoutRate ?? 0;
            return (
              <section
                key={groupKey}
                className="lottery-bet-slip__group flex flex-col gap-1 min-w-0"
                aria-label={label}
              >
                <div className="lottery-bet-slip__group-head flex items-center justify-between px-2 py-[0.35rem]">
                  <span>{label}</span>
                  <span>{groupEntries.length} รายการ</span>
                </div>
                <ul className="lottery-bet-slip__rows flex flex-col gap-1 m-0 p-0">
                  {groupEntries.map((entry) => (
                    <li
                      key={entry.id}
                      className="lottery-bet-slip__row flex items-center gap-[0.35rem] py-[0.3rem] pr-[0.35rem] pl-2"
                    >
                      <span className="lottery-bet-slip__number flex-1 min-w-0 whitespace-nowrap">
                        {formatLotteryDigitsDisplay(entry.number)}
                      </span>
                      <span className="lottery-bet-slip__rate shrink-0">x{payoutRate}</span>
                      <button
                        type="button"
                        className="lottery-bet-slip__remove grid shrink-0 place-items-center w-[1.75rem] h-[1.75rem]"
                        onClick={() => onRemove(entry.id)}
                        aria-label={`ลบ ${label} ${entry.number}`}
                      >
                        <TrashIcon />
                      </button>
                    </li>
                  ))}
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
