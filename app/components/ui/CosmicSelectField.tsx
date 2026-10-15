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
  /** คงไว้เพื่อ compat — ทุก dropdown ใช้สไตล์ shadcn เดียวกันแล้ว */
  variant?: "glass" | "solid";
};

/**
 * Select แบบ shadcn (Radix) — ใช้แทน <select> native ทุกที่ (list ของ native ไม่รองรับธีม)
 * สไตล์ตาม components/ui/select.tsx · สีมาจาก token (--popover / --accent / --input) ตามธีม
 */
export function CosmicSelectField({
  value,
  onValueChange,
  options,
  id,
  "aria-label": ariaLabel,
  className,
  triggerClassName,
  size = "default",
  disabled,
}: CosmicSelectFieldProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        id={id}
        size={size}
        aria-label={ariaLabel}
        className={cn("min-w-[8.5rem] text-[var(--text-primary)]", triggerClassName, className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className="z-[100] max-h-72 min-w-[var(--radix-select-trigger-width)]"
        position="popper"
        align="start"
        sideOffset={4}
      >
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
