"use client";

import * as React from "react";
import { cn } from "cn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CosmicSelectOption = {
  value: string;
  label: string;
};

type CosmicSelectFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly CosmicSelectOption[];
  id?: string;
  "aria-label"?: string;
  className?: string;
  triggerClassName?: string;
  size?: "sm" | "default";
  disabled?: boolean;
  /** glass = ค่าเดิม · solid = ทึบไม่ blur (ตาราง / standalone) */
  variant?: "glass" | "solid";
};

/**
 * Select แบบ Radix + glass theme — ใช้แทน <select> native (Windows ไม่รองรับธีม list)
 * ใช้ใน CashbackLossRebateExtraSections และหน้าอื่นที่ต้องเลือกค่าจากรายการ
 */
export function CosmicSelectField({
  value,
  onValueChange,
  options,
  id,
  "aria-label": ariaLabel,
  className,
  triggerClassName,
  size = "sm",
  disabled,
  variant = "glass",
}: CosmicSelectFieldProps) {
  const isSolid = variant === "solid";

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        id={id}
        size={size}
        aria-label={ariaLabel}
        className={cn(
          "cosmic-select__trigger !h-auto min-w-[8.5rem] gap-2 rounded-[var(--radius-control)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] shadow-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-0 data-[size=sm]:h-auto",
          isSolid
            ? "cosmic-select__trigger--solid border"
            : "glass-card--soft border-0",
          triggerClassName,
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className={cn(
          "cosmic-select__content z-[var(--z-overlay,80)] min-w-[var(--radix-select-trigger-width)] rounded-[var(--radius-panel)] text-[var(--text-primary)] ring-0",
          isSolid
            ? "cosmic-select__content--solid"
            : "border border-[var(--glass-border)] bg-[var(--glass-fill-modal)] shadow-[0_16px_40px_rgb(0_0_0_/_0.45)]",
        )}
        position="popper"
        align="end"
        sideOffset={6}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="cosmic-select__item rounded-[var(--radius-control)] py-2 pl-2.5 pr-8 text-xs text-[var(--text-secondary)] focus:bg-transparent focus:text-[var(--text-primary)] data-[state=checked]:text-[var(--text-primary)]"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
