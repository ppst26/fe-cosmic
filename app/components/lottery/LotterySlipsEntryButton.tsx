"use client";

import React from "react";
import Link from "@/lib/i18n/navigation";
import { useLotterySlipFirstPage } from "@/app/hooks/api/lotterySlips";
import { PromoTicketIcon } from "../ui/Icons";
import { COSMIC_BTN_GLASS_PILL_SM } from "../ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";
import { useLotteryI18n } from "./useLotteryI18n";

/**
 * ปุ่ม "โพยของฉัน" บนหัวหน้าแรกหวย (/lottery) — ไปหน้ารายการโพย /lottery/slips
 * ป้ายตัวเลข = จำนวนโพยที่กำลังดำเนินการ (เฉพาะผู้ใช้ที่ login · ผู้เยี่ยมชมกดแล้ว proxy พาไปเปิด login)
 * ใช้ cache key เดียวกับแท็บ "กำลังดำเนินการ" ของหน้าโพย → กดเข้าไปแล้วรายการขึ้นทันที
 */
export function LotterySlipsEntryButton({ className }: { className?: string }) {
  const { t } = useLotteryI18n();
  const pending = useLotterySlipFirstPage(
    { scope: "pending", market: "", result: "", range: "" },
    () => ({ scope: "pending" }),
  );
  const count = pending.data?.summary.count ?? 0;

  return (
    <Link
      href="/lottery/slips"
      className={cn(COSMIC_BTN_GLASS_PILL_SM, "relative inline-flex shrink-0 items-center gap-1.5 no-underline", className)}
      aria-label={count > 0 ? t("hub.mySlipsPendingAria", { count }) : t("hub.mySlipsAria")}
    >
      <PromoTicketIcon className="h-4 w-4" />
      <span>{t("hub.mySlips")}</span>
      {count > 0 ? (
        <span
          className="absolute -right-1.5 -top-1.5 grid h-[1.125rem] min-w-[1.125rem] place-items-center rounded-full bg-[var(--action-solid)] px-1 text-[0.6875rem] font-medium leading-none tabular-nums text-white shadow-[0_0_0_2px_var(--surface-solid-outer)]"
          aria-hidden="true"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
