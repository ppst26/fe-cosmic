"use client";

import React from "react";
import { ChevronRightIcon } from "../ui/Icons";

export function PromoHubPillLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#1a1240]/80 px-3 py-1.5 text-[11px] font-bold text-[var(--text-primary)] sm:text-xs">
      {label}
      <ChevronRightIcon className="h-3.5 w-3.5" />
    </span>
  );
}

export function promoCardButtonClass(extra?: string) {
  return [
    "cosmic-inset-card relative w-full overflow-hidden text-left transition-colors",
    "cursor-pointer hover:bg-[var(--surface-selected)]/15 active:scale-[0.995]",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}
