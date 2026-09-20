"use client";

import React from "react";

interface LotteryNumberPadProps {
  digits: number;
  value: string;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

const PAD_DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * ช่องแสดงเลขตามจำนวนหลัก + แป้นตัวเลข 0–9
 * ใช้ร่วมกันใน ThaiLottoBetBoard และ YikiBetBoard — ครบหลักแล้วผู้เรียกเพิ่มลงโพยเอง
 */
export function LotteryNumberPad({
  digits,
  value,
  onDigit,
  onBackspace,
  onClear,
}: LotteryNumberPadProps) {
  return (
    <div className="lottery-number-pad flex flex-col gap-1.5">
      <div className="thai-lotto-slots" aria-live="polite" aria-label={`เลขที่กรอก ${value || "ว่าง"}`}>
        {Array.from({ length: digits }, (_, index) => {
          const char = value[index];
          const isNext = index === value.length;
          return (
            <span
              key={index}
              className={`thai-lotto-slot${char ? " is-filled" : ""}${isNext ? " is-next" : ""}`}
              aria-hidden="true"
            >
              {char ?? ""}
            </span>
          );
        })}
      </div>

      <div className="thai-lotto-pad">
        {PAD_DIGITS.map((digit) => (
          <button key={digit} type="button" className="thai-lotto-pad__key" onClick={() => onDigit(digit)}>
            {digit}
          </button>
        ))}
        <button
          type="button"
          className="thai-lotto-pad__key thai-lotto-pad__key--muted"
          onClick={onClear}
          disabled={!value}
        >
          ล้าง
        </button>
        <button type="button" className="thai-lotto-pad__key" onClick={() => onDigit("0")}>
          0
        </button>
        <button
          type="button"
          className="thai-lotto-pad__key thai-lotto-pad__key--muted"
          onClick={onBackspace}
          disabled={!value}
          aria-label="ลบตัวเลขล่าสุด"
        >
          <BackspaceIcon />
        </button>
      </div>
    </div>
  );
}

function BackspaceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path
        d="M8.5 5H20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8.5L3 12l5.5-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m11 9.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
