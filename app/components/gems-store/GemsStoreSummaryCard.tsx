"use client";

import Image from "next/image";
import type { GemsStoreData } from "@/lib/api/gemsStore";
import { useT } from "@/lib/i18n/I18nProvider";
import { HistoryIcon } from "@/app/components/ui/Icons";
import { cn } from "@/lib/utils";
import { formatGemsBalance } from "@/lib/format";
import { valueClass } from "@/lib/semanticValue";

interface GemsStoreSummaryCardProps {
  gemsBalance: number;
  /** ข้อมูลร้านค้าที่โหลดแล้ว (โควตา · ข้อความรีเซ็ต · อัตราแลก) */
  store: Pick<GemsStoreData, "quota" | "resetNotice" | "rateLabel">;
  className?: string;
}

/**
 * การ์ดยอดเพชรด้านบนร้านค้า — เพชรกลางบน · ยอด · label · โควตากลาง
 * ใช้ใน GemsStorePageContent.tsx
 */
export function GemsStoreSummaryCard({ gemsBalance, store, className }: GemsStoreSummaryCardProps) {
  const t = useT("rewards");
  const { quota, resetNotice, rateLabel } = store;
  const { dailyUsed, dailyLimit, weeklyUsed, weeklyLimit } = quota;

  return (
    <aside
      className={cn("gems-store-summary flex flex-col gap-2 px-0.5 py-1 sm:px-1 sm:py-1.5", className)}
      aria-label={t("gemsStore.summary.balanceLabel")}
    >
      <div className="flex flex-col items-center gap-1 px-1 pt-0.5 text-center sm:gap-1.5">
        <div
          className="gems-store-summary__gem relative h-[4.25rem] w-[4.25rem] shrink-0 sm:h-[4.75rem] sm:w-[4.75rem]"
          aria-hidden="true"
        >
          <Image
            src="/assets/gems/diamond.avif"
            alt=""
            fill
            sizes="(max-width: 640px) 68px, 76px"
            className="object-contain drop-shadow-[0_0_20px_rgba(119,71,229,0.5)]"
          />
        </div>
        <p
          className={valueClass("accent", "text-[1.75rem] leading-none sm:text-[2rem]")}
          aria-label={t("gemsStore.summary.balanceAria", { amount: formatGemsBalance(gemsBalance) })}
        >
          {formatGemsBalance(gemsBalance)}
        </p>
        <p className="text-sm font-medium text-[var(--text-primary)] sm:text-base">{t("gemsStore.summary.balanceLabel")}</p>

        <div
          className="gems-store-summary__quota mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[var(--text-primary)] sm:gap-x-5 sm:text-[13px]"
        >
          <p className="flex items-center gap-1.5">
            <GemsQuotaCalendarIcon className="h-3.5 w-3.5 shrink-0 text-[var(--icon-active)]" />
            <span>
              {t("gemsStore.summary.today")}{" "}
              <span className="font-medium tabular-nums">{dailyUsed}/{dailyLimit}</span>
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <HistoryIcon className="h-3.5 w-3.5 shrink-0 text-[var(--icon-active)]" />
            <span>
              {t("gemsStore.summary.thisWeek")}{" "}
              <span className="font-medium tabular-nums">{weeklyUsed}/{weeklyLimit}</span>
            </span>
          </p>
        </div>
      </div>

      <p className="text-center text-[10px] leading-snug text-[var(--text-muted)] sm:text-[11px]">
        {resetNotice}
        <span className="mx-0.5 opacity-40" aria-hidden="true">·</span>
        {rateLabel}
      </p>
    </aside>
  );
}

function GemsQuotaCalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 4V2M17 4V2M4 9h16M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
