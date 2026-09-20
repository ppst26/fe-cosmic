"use client";

import React, { useRef } from "react";
import { formatLotteryDigitsDisplay } from "./lotteryUtils";

export interface LotteryPriceSlipEntry {
  id: string;
  number: string;
  payoutRate: number;
  amount: number;
}

export interface LotteryPriceSlipGroup {
  key: string;
  label: string;
  entries: LotteryPriceSlipEntry[];
}

interface LotteryPriceSlipPanelProps {
  groups: LotteryPriceSlipGroup[];
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
 * รายการโพยขั้นใส่ราคา/ส่งโพย — จัดกลุ่มตามประเภท · แถวเลข · ป้ายใส่ราคา · อัตรา · ช่องบาท · ลบ
 * ใช้ใน YikiBetBoard · ThaiLottoBetBoard (ขั้น price) และตลาดหวยอื่นที่ใช้ flow เดียวกัน
 */
export function LotteryPriceSlipPanel({
  groups,
  selectedEntryId,
  onSelectEntry,
  onAmountChange,
  onRemove,
}: LotteryPriceSlipPanelProps) {
  const totalCount = groups.reduce((sum, group) => sum + group.entries.length, 0);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const focusAmount = (entryId: string) => {
    onSelectEntry(entryId);
    requestAnimationFrame(() => inputRefs.current[entryId]?.focus());
  };

  return (
    <div className="lottery-price-slip">
      <div className="lottery-price-slip__head">{totalCount} รายการ</div>

      <div className="lottery-price-slip__list">
        {groups.map((group) => (
          <section key={group.key} className="lottery-price-slip__group" aria-label={group.label}>
            <div className="lottery-price-slip__group-head">
              <span>{group.label}</span>
              <span>{group.entries.length} รายการ</span>
            </div>
            <ul className="lottery-price-slip__rows">
              {group.entries.map((entry) => {
                const inputId = `lottery-price-amount-${entry.id}`;
                const isSelected = entry.id === selectedEntryId;
                return (
                  <li
                    key={entry.id}
                    className={`lottery-price-row${isSelected ? " is-selected" : ""}`}
                    onClick={() => onSelectEntry(entry.id)}
                  >
                    <span className="lottery-price-row__number">
                      {formatLotteryDigitsDisplay(entry.number)}
                    </span>
                    <button
                      type="button"
                      className="lottery-price-row__tag"
                      onClick={(event) => {
                        event.stopPropagation();
                        focusAmount(entry.id);
                      }}
                    >
                      ใส่ราคา
                    </button>
                    <span className="lottery-price-row__rate">x{entry.payoutRate}</span>
                    <span className="thai-lotto-amount thai-lotto-amount--sm lottery-price-row__amount">
                      <input
                        ref={(node) => {
                          inputRefs.current[entry.id] = node;
                        }}
                        id={inputId}
                        inputMode="numeric"
                        value={entry.amount || ""}
                        aria-label={`ราคา ${group.label} ${entry.number}`}
                        onFocus={() => onSelectEntry(entry.id)}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => onAmountChange(entry.id, parseAmount(event.target.value))}
                        className="thai-lotto-amount__input"
                      />
                    </span>
                    <button
                      type="button"
                      className="lottery-price-row__remove"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemove(entry.id);
                      }}
                      aria-label={`ลบ ${group.label} ${entry.number}`}
                    >
                      <TrashIcon />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
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
