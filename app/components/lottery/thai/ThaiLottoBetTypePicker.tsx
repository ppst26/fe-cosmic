"use client";

import React from "react";
import type {
  ThaiLottoBetType,
  ThaiLottoBetTypeId,
  ThaiLottoDigitGroup,
} from "@/app/types/lottery";

interface ThaiLottoBetTypePickerProps {
  groups: { id: ThaiLottoDigitGroup; label: string }[];
  betTypes: ThaiLottoBetType[];
  activeGroup: ThaiLottoDigitGroup;
  selectedTypeIds: ThaiLottoBetTypeId[];
  onGroupChange: (group: ThaiLottoDigitGroup) => void;
  onToggleType: (typeId: ThaiLottoBetTypeId) => void;
}

/**
 * เลือกกลุ่มหลัก (3 ตัว / 2 ตัว / เลขวิ่ง) แล้วเลือกประเภทการแทงได้หลายแบบในกลุ่มเดียวกัน
 * ใช้ใน ThaiLottoBetBoard
 */
export function ThaiLottoBetTypePicker({
  groups,
  betTypes,
  activeGroup,
  selectedTypeIds,
  onGroupChange,
  onToggleType,
}: ThaiLottoBetTypePickerProps) {
  const groupTypes = betTypes.filter((type) => type.group === activeGroup);

  return (
    <div className="flex flex-col gap-3">
      <div className="cosmic-segment-track grid grid-cols-3 gap-1" role="group" aria-label="จำนวนหลัก">
        {groups.map((group) => {
          const isActive = group.id === activeGroup;
          return (
            <button
              key={group.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onGroupChange(group.id)}
              className={`cosmic-segment-btn min-h-11 text-sm ${
                isActive ? "is-active" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      <div className="thai-lotto-type-grid" role="group" aria-label="ประเภทการแทง">
        {groupTypes.map((type) => {
          const isSelected = selectedTypeIds.includes(type.id);
          return (
            <button
              key={type.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggleType(type.id)}
              className={`thai-lotto-type-chip${isSelected ? " is-active" : ""}`}
            >
              <span className="thai-lotto-type-chip__check" aria-hidden="true">
                {isSelected ? <CheckIcon /> : null}
              </span>
              <span className="thai-lotto-type-chip__label">{type.label}</span>
              <span className="thai-lotto-type-chip__rate">จ่าย {type.payoutRate}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden>
      <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
