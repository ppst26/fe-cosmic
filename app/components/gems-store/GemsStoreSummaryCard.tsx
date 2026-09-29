import {
  GEMS_STORE_EXCHANGE_RATE_LABEL,
  GEMS_STORE_REDEEM_QUOTA_MOCK,
  GEMS_STORE_RESET_NOTICE,
  formatGemsBalance,
} from "@/app/data/gemsStoreMockData";
import { HistoryIcon } from "@/app/components/ui/Icons";
import { COSMIC_PANEL_GLASS } from "@/app/components/ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";

interface GemsStoreSummaryCardProps {
  gemsBalance: number;
  className?: string;
}

/**
 * การ์ดยอดเพชรด้านบนร้านค้า — หัวซ้าย · ยอดขวาบน · โควตา · ข้อความรีเซ็ต
 * ใช้ใน GemsStorePageContent.tsx
 */
export function GemsStoreSummaryCard({ gemsBalance, className }: GemsStoreSummaryCardProps) {
  const { dailyUsed, dailyLimit, weeklyUsed, weeklyLimit } = GEMS_STORE_REDEEM_QUOTA_MOCK;

  return (
    <aside
      className={cn("flex flex-col gap-3 px-3.5 py-3 sm:px-4 sm:py-3.5", COSMIC_PANEL_GLASS, className)}
      aria-label="เพชรคงเหลือ"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 pr-1">
          <p className="text-sm font-medium text-[var(--text-primary)] sm:text-base">เพชรคงเหลือ</p>
          <p className="mt-0.5 text-xs leading-snug text-[var(--text-secondary)] sm:text-[13px]">
            แลกเพชรเป็นเครดิตและรางวัล
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-2xl font-medium tabular-nums leading-none text-[var(--accent-highlight)] sm:text-[1.75rem]">
            {formatGemsBalance(gemsBalance)}
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">เพชร</p>
        </div>
      </div>

      <div className="h-px w-full bg-[var(--border-subtle)]/55" aria-hidden="true" />

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <p className="flex min-w-0 items-center gap-2 text-xs text-[var(--text-primary)] sm:text-[13px]">
          <GemsQuotaCalendarIcon className="h-4 w-4 shrink-0 text-[var(--icon-active)]" />
          <span className="truncate">
            วันนี้{" "}
            <span className="font-medium tabular-nums text-[var(--text-primary)]">
              {dailyUsed}/{dailyLimit}
            </span>
          </span>
        </p>
        <p className="flex min-w-0 items-center justify-end gap-2 text-right text-xs text-[var(--text-primary)] sm:justify-start sm:text-left sm:text-[13px]">
          <HistoryIcon className="h-4 w-4 shrink-0 text-[var(--icon-active)]" />
          <span className="truncate">
            สัปดาห์นี้{" "}
            <span className="font-medium tabular-nums text-[var(--text-primary)]">
              {weeklyUsed}/{weeklyLimit}
            </span>
          </span>
        </p>
      </div>

      <p className="cosmic-type-sheet-desc text-center">
        {GEMS_STORE_RESET_NOTICE}
        <span className="mx-1 opacity-40" aria-hidden="true">·</span>
        {GEMS_STORE_EXCHANGE_RATE_LABEL}
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
