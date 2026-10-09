"use client";

import React from "react";
import { ChevronRightIcon } from "../ui/Icons";
import { COSMIC_BTN_GLASS_PILL } from "../ui/cosmicButtonClasses";

export function PromoHubPillLabel({ label }: { label: string }) {
  return (
    <span
      className={`${COSMIC_BTN_GLASS_PILL} pointer-events-none inline-flex items-center gap-0.5 px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] sm:text-[13px]`}
    >
      {label}
      <ChevronRightIcon className="h-3.5 w-3.5" />
    </span>
  );
}

/** การ์ดโปรโมชัน / กิจกรรม — soft glass + gradient ชั้นใน */
export function promoCardButtonClass(extra?: string) {
  return [
    "glass-card--soft relative block w-full overflow-hidden rounded-[var(--radius-panel)] text-left",
    "cursor-pointer transition-[transform,box-shadow] duration-[var(--motion-fast)] active:scale-[0.995]",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}
