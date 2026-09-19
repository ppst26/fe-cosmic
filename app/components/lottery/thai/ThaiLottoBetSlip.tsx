"use client";

import React from "react";
import type { ThaiLottoBetEntry, ThaiLottoBetType, ThaiLottoBetTypeId } from "@/app/types/lottery";
import { COSMIC_BTN_PRIMARY } from "@/app/components/ui/cosmicButtonClasses";
import { formatBaht } from "../lotteryUtils";

interface ThaiLottoBetSlipProps {
  entries: ThaiLottoBetEntry[];
  betTypes: ThaiLottoBetType[];
  defaultAmount: number;
  minBet: number;
  maxBet: number;
  isClosed: boolean;
  onDefaultAmountChange: (amount: number) => void;
  onApplyAmountToAll: () => void;
  onAmountChange: (entryId: string, amount: number) => void;
  onRemove: (entryId: string) => void;
  onClearAll: () => void;
  /** ยังไม่มี API แทงจริง — ถ้าไม่ส่งมา ปุ่มยืนยันจะถูกปิดไว้ */
  onSubmit?: (entries: ThaiLottoBetEntry[]) => void;
}

/** แปลงค่าจาก input เป็นจำนวนเต็มบาท (ว่าง = 0) */
function parseAmount(raw: string): number {
  const digits = raw.replace(/\D/g, "").slice(0, 7);
  return digits ? Number(digits) : 0;
}

/**
 * โพยแทง — ราคาเริ่มต้น · รายการเลข · ยอดรวม · ปุ่มยืนยัน
 * ใช้ใน ThaiLottoBetBoard (มือถืออยู่ใต้แป้นเลข / จอใหญ่เป็นคอลัมน์ขวา sticky)
 */
export function ThaiLottoBetSlip({
  entries,
  betTypes,
  defaultAmount,
  minBet,
  maxBet,
  isClosed,
  onDefaultAmountChange,
  onApplyAmountToAll,
  onAmountChange,
  onRemove,
  onClearAll,
  onSubmit,
}: ThaiLottoBetSlipProps) {
  const typeById = new Map<ThaiLottoBetTypeId, ThaiLottoBetType>(
    betTypes.map((type) => [type.id, type]),
  );
  const isAmountValid = (amount: number) => amount >= minBet && amount <= maxBet;
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const hasInvalid = entries.some((entry) => !isAmountValid(entry.amount));
  const canSubmit = Boolean(onSubmit) && !isClosed && entries.length > 0 && !hasInvalid;

  return (
    <section className="thai-lotto-panel thai-lotto-slip" aria-labelledby="thai-lotto-slip-title">
      <div className="thai-lotto-panel__head">
        <h2 id="thai-lotto-slip-title" className="thai-lotto-panel__title">
          โพยของฉัน
          <span className="thai-lotto-slip__count">{entries.length}</span>
        </h2>
        {entries.length > 0 ? (
          <button type="button" className="thai-lotto-slip__text-btn" onClick={onClearAll}>
            ล้างทั้งหมด
          </button>
        ) : null}
      </div>

      <div className="thai-lotto-slip__default">
        <label htmlFor="thai-lotto-default-amount" className="thai-lotto-slip__default-label">
          ราคาต่อรายการ
        </label>
        <div className="thai-lotto-amount">
          <input
            id="thai-lotto-default-amount"
            inputMode="numeric"
            value={defaultAmount || ""}
            onChange={(event) => onDefaultAmountChange(parseAmount(event.target.value))}
            className="thai-lotto-amount__input"
          />
          <span className="thai-lotto-amount__unit">บาท</span>
        </div>
        <button
          type="button"
          className="thai-lotto-slip__text-btn"
          onClick={onApplyAmountToAll}
          disabled={entries.length === 0 || !isAmountValid(defaultAmount)}
        >
          ใช้กับทุกรายการ
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="thai-lotto-slip__empty">เลือกประเภทแล้วกดเลขเพื่อเพิ่มลงโพย</p>
      ) : (
        <ul className="thai-lotto-slip__list">
          {entries.map((entry) => {
            const type = typeById.get(entry.typeId);
            const invalid = !isAmountValid(entry.amount);
            const inputId = `thai-lotto-amount-${entry.id}`;
            return (
              <li key={entry.id} className="thai-lotto-slip__row">
                <span className="thai-lotto-slip__number">{entry.number}</span>
                <span className="thai-lotto-slip__info min-w-0">
                  <label htmlFor={inputId} className="thai-lotto-slip__type">
                    {type?.label}
                  </label>
                  <span className="thai-lotto-slip__payout">
                    ชนะได้ {formatBaht(entry.amount * (type?.payoutRate ?? 0))}
                  </span>
                </span>
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
                <button
                  type="button"
                  className="thai-lotto-slip__remove"
                  onClick={() => onRemove(entry.id)}
                  aria-label={`ลบ ${type?.label ?? ""} ${entry.number}`}
                >
                  <CloseIcon />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {hasInvalid ? (
        <p className="thai-lotto-slip__error" role="alert">
          ราคาต่อรายการต้องอยู่ระหว่าง {formatBaht(minBet)}–{formatBaht(maxBet)} บาท
        </p>
      ) : null}

      <div className="thai-lotto-slip__summary">
        <span className="text-sm text-[var(--text-secondary)]">ยอดแทงรวม</span>
        <span className="thai-lotto-slip__total">{formatBaht(total)} บาท</span>
      </div>

      <button
        type="button"
        className={`${COSMIC_BTN_PRIMARY} cosmic-cta-primary--lg min-h-12 w-full text-base`}
        disabled={!canSubmit}
        onClick={() => onSubmit?.(entries)}
      >
        {isClosed ? "ปิดรับแทงแล้ว" : "ยืนยันการแทง"}
      </button>
    </section>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
      <path d="m4 4 8 8m0-8-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
