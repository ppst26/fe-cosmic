"use client";

import React, { useState } from "react";

interface LotteryNumberGridProps {
  digits: number;
  /** เลขที่อยู่ในโพยแล้ว (ของประเภทที่เลือกอยู่) — แสดงเป็นปุ่ม active */
  selectedNumbers: Set<string>;
  disabled?: boolean;
  onToggle: (number: string) => void;
}

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * แผงเลขให้กดเลือก — วิ่ง 0–9 · 2 ตัว 00–99 · 3 ตัวเลือกหลักร้อยก่อนแล้วกด 00–99
 * กดซ้ำเพื่อเอาออกจากโพย · ใช้ร่วมกันใน ThaiLottoBetBoard และ YikiBetBoard (แท็บ "เลือกจากแผงเลข" / "ชุดตัวเลข")
 */
export function LotteryNumberGrid({
  digits,
  selectedNumbers,
  disabled = false,
  onToggle,
}: LotteryNumberGridProps) {
  const [hundred, setHundred] = useState("0");
  const prefix = digits === 3 ? hundred : "";
  const numbers =
    digits === 1 ? DIGITS : DIGITS.flatMap((tens) => DIGITS.map((units) => `${prefix}${tens}${units}`));

  /** จำนวนเลขที่เลือกไว้ในแต่ละหลักร้อย — ใช้แสดง badge บนปุ่มหลักร้อย */
  const countInHundred = (value: string) =>
    [...selectedNumbers].filter((number) => number.length === 3 && number.startsWith(value)).length;

  return (
    <div className="flex flex-col gap-3">
      {digits === 3 ? (
        <div className="flex flex-col gap-2">
          <span className="thai-lotto-grid__caption" id="thai-lotto-hundred-label">
            หลักร้อย
          </span>
          <div className="thai-lotto-hundreds" role="group" aria-labelledby="thai-lotto-hundred-label">
            {DIGITS.map((value) => {
              const count = countInHundred(value);
              const isActive = value === hundred;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`${value}00–${value}99${count ? ` เลือกแล้ว ${count}` : ""}`}
                  onClick={() => setHundred(value)}
                  className={`thai-lotto-hundreds__btn${isActive ? " is-active" : ""}`}
                >
                  {value}00
                  {count > 0 ? <span className="thai-lotto-hundreds__dot" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div
        className={`thai-lotto-grid${digits === 1 ? " thai-lotto-grid--run" : ""}`}
        role="group"
        aria-label="แผงเลข"
      >
        {numbers.map((number) => {
          const isSelected = selectedNumbers.has(number);
          return (
            <button
              key={number}
              type="button"
              aria-pressed={isSelected}
              disabled={disabled}
              onClick={() => onToggle(number)}
              className={`thai-lotto-grid__btn${isSelected ? " is-active" : ""}`}
            >
              {number}
            </button>
          );
        })}
      </div>
    </div>
  );
}
