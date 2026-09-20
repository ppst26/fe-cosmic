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
}: CosmicSelectFieldProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        id={id}
        size={size}
        aria-label={ariaLabel}
        className={cn(
          "cosmic-select__trigger glass-card--soft !h-auto min-w-[8.5rem] gap-2 rounded-[var(--radius-control)] border-0 px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] shadow-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-0 data-[size=sm]:h-auto",
          triggerClassName,
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className="cosmic-select__content z-[var(--z-overlay,80)] min-w-[var(--radix-select-trigger-width)] rounded-[var(--radius-panel)] border border-[var(--glass-border)] bg-[var(--glass-fill-modal)] text-[var(--text-primary)] shadow-[0_16px_40px_rgb(0_0_0_/_0.45)] ring-0"
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
