"use client";

import React, { useMemo, useState } from "react";
import type {
  LotterySlipListQuery,
  LotterySlipResult,
  LotterySlipScope,
  LotterySubmittedSlip,
} from "@/app/types/lotterySlip";
import { useLotterySlipFirstPage, usePrefetchLotterySlipTab, type LotterySlipFilterKey } from "@/app/hooks/api/lotterySlips";
import { useUrlParams } from "@/app/hooks/useUrlParams";
import { fetchLotterySlipPage } from "@/lib/lottery/fetchLotterySlip";
import { lotteryPlayMarketMeta } from "@/lib/lottery/resolvePlayRound";
import { SLIP_HISTORY_DAYS, slipHistoryCutoff } from "@/lib/lottery/slipFilters";
import {
  SLIP_RANGE_IDS,
  formatDateOnly,
  parseDateOnly,
  resolveSlipRange,
  slipRangeToken,
  type SlipRangeId,
} from "@/lib/lottery/slipRange";
import { signedMoneyValueClass } from "@/lib/semanticValue";
import { cn } from "@/lib/utils";
import { CosmicLineTabs } from "../ui/CosmicLineTabs";
import { CosmicSelectField } from "../ui/CosmicSelectField";
import { COSMIC_CHOICE_BTN } from "../ui/cosmicButtonClasses";
import { ResourceGate } from "../ui/ResourceGate";
import { EmptyState } from "../ui/StatusState";
import { TabPanelTransition } from "../ui/TabPanelTransition";
import { TransactionDateRangeDialog } from "../transactions/TransactionDateRangeDialog";
import { LotterySlipCard, formatSignedBaht } from "./LotterySlipCard";
import { formatBaht } from "./lotteryUtils";
import { useLotteryI18n } from "./useLotteryI18n";

const DEFAULTS = { tab: "pending", market: "", result: "", range: "30d", from: "", to: "" } as const;
type ParamKey = keyof typeof DEFAULTS;

const TAB_ORDER = ["pending", "history"] as const;
const RESULTS: readonly LotterySlipResult[] = ["won", "lost", "void"];
const PAGE_SIZE = 20;
/** ค่าของตัวเลือก "ทั้งหมด" ใน dropdown — Select ของ Radix ใช้ค่าว่าง "" เป็นตัวเลือกไม่ได้ (จะแสดงช่องว่าง) · ใน URL/state ยังเป็น "" */
const ALL = "all";

/** ค่าจาก URL ที่ไม่รู้จัก → default (กัน ?market=… ที่แต่งมา) */
function sanitize(key: ParamKey, raw: string): string {
  switch (key) {
    case "tab":
      return raw === "history" ? "history" : "pending";
    case "market":
      return /^[a-z0-9-]{1,40}$/.test(raw) ? raw : "";
    case "result":
      return (RESULTS as readonly string[]).includes(raw) ? raw : "";
    case "range":
      return (SLIP_RANGE_IDS as readonly string[]).includes(raw) ? raw : DEFAULTS.range;
    case "from":
    case "to":
      return parseDateOnly(raw) ? raw : "";
  }
}

function mergeById(...lists: LotterySubmittedSlip[][]): LotterySubmittedSlip[] {
  const seen = new Set<string>();
  const out: LotterySubmittedSlip[] = [];
  for (const list of lists) {
    for (const slip of list) {
      if (!seen.has(slip.id)) {
        seen.add(slip.id);
        out.push(slip);
      }
    }
  }
  return out;
}

/**
 * เนื้อหาหน้ารายการโพย (/lottery/slips) — แท็บ "กำลังดำเนินการ" / "ประวัติ" + ตัวกรอง + สรุป + โหลดเพิ่ม
 * ตัวกรอง/แท็บอยู่ใน URL (?tab=history&market=…&result=…&range=7d) · แท็บอีกฝั่งโหลดรอไว้ (สลับแล้วขึ้นทันที)
 * spec: docs/superpowers/specs/2026-10-10-lottery-slips-design.md
 */
export function LotterySlipsPageContent() {
  const { t, shortDate } = useLotteryI18n();
  const [params, setParams] = useUrlParams<ParamKey>(DEFAULTS, sanitize);
  const [now] = useState(() => new Date());
  const [pickerOpen, setPickerOpen] = useState(false);

  const scope: LotterySlipScope = params.tab === "history" ? "history" : "pending";
  const range = params.range as SlipRangeId;
  const result = scope === "history" ? params.result : "";

  const filter: LotterySlipFilterKey = {
    scope,
    market: params.market,
    result,
    range: scope === "history" ? slipRangeToken(range, params.from, params.to) : "",
  };

  const buildQuery = (): LotterySlipListQuery =>
    scope === "pending"
      ? { scope, market: params.market || undefined }
      : {
          scope,
          market: params.market || undefined,
          result: (result as LotterySlipResult) || undefined,
          ...resolveSlipRange(range, params.from, params.to, new Date()),
        };

  const first = useLotterySlipFirstPage(filter, buildQuery);

  const otherScope: LotterySlipScope = scope === "pending" ? "history" : "pending";
  usePrefetchLotterySlipTab(
    { scope: otherScope, market: "", result: "", range: otherScope === "history" ? "30d" : "" },
    () => ({ scope: otherScope }),
  );

  /* ── หน้าถัดไป (โหลดเพิ่ม) — ผูกกับ filter ปัจจุบัน เปลี่ยนตัวกรองแล้วทิ้งของเก่า ── */
  const filterId = JSON.stringify(filter);
  const [extra, setExtra] = useState<{ id: string; slips: LotterySubmittedSlip[]; cursor: string | null } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState(false);
  const activeExtra = extra && extra.id === filterId ? extra : null;
  const cursor = activeExtra ? activeExtra.cursor : (first.data?.nextCursor ?? null);
  const slips = mergeById(first.data?.slips ?? [], activeExtra?.slips ?? []);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    setMoreError(false);
    const res = await fetchLotterySlipPage({ ...buildQuery(), cursor, limit: PAGE_SIZE });
    setLoadingMore(false);
    if (!res.ok) {
      setMoreError(true);
      return;
    }
    setExtra((prev) => ({
      id: filterId,
      slips: [...(prev && prev.id === filterId ? prev.slips : []), ...res.data.slips],
      cursor: res.data.nextCursor,
    }));
  };

  /* ── ตัวเลือกตัวกรอง ── */
  const marketOptions = useMemo(() => {
    const slugs = new Set(first.data?.summary.markets ?? []);
    if (params.market) slugs.add(params.market);
    return [
      { value: ALL, label: t("slips.filters.allMarkets") },
      ...[...slugs].map((slug) => ({ value: slug, label: t(lotteryPlayMarketMeta(slug).titleKey) })),
    ];
  }, [first.data?.summary.markets, params.market, t]);

  const resultOptions = useMemo(
    () => [
      { value: ALL, label: t("slips.filters.allResults") },
      ...RESULTS.map((value) => ({ value, label: t(`slips.status.${value}`) })),
    ],
    [t],
  );

  const tabs = useMemo(
    () => [
      { id: "pending", label: t("slips.tabs.pending") },
      { id: "history", label: t("slips.tabs.history") },
    ],
    [t],
  );

  const rangeLabels: Record<SlipRangeId, string> = {
    today: t("slips.filters.today"),
    "7d": t("slips.filters.days7"),
    "30d": t("slips.filters.days30"),
    custom: t("slips.filters.custom"),
  };

  const pickerBounds = useMemo(() => {
    const min = slipHistoryCutoff(now);
    return { min: new Date(min.getFullYear(), min.getMonth(), min.getDate()), max: now };
  }, [now]);
  const customFrom = parseDateOnly(params.from) ?? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const customTo = parseDateOnly(params.to) ?? now;

  const filtersActive =
    Boolean(params.market) || (scope === "history" && (Boolean(result) || range !== DEFAULTS.range));
  const clearFilters = () => setParams({ market: "", result: "", range: DEFAULTS.range, from: "", to: "" });

  return (
    <div className="flex flex-col gap-3 pt-2">
      <CosmicLineTabs
        tabs={tabs}
        activeId={scope}
        onSelect={(id) => setParams({ tab: id })}
        ariaLabel={t("slips.tabs.aria")}
        columns={2}
      />

      {/* ตัวกรอง */}
      <div className="flex flex-col gap-2" role="group" aria-label={t("slips.filters.aria")}>
        {/* dropdown กว้างครึ่งเดียว (แท็บกำลังดำเนินการมีแค่ "ตลาด" อยู่คอลัมน์ซ้าย) */}
        <div className="grid grid-cols-2 gap-2">
          <CosmicSelectField
            variant="solid"
            value={params.market || ALL}
            onValueChange={(value) => setParams({ market: value === ALL ? "" : value })}
            options={marketOptions}
            aria-label={t("slips.filters.market")}
            triggerClassName="w-full"
          />
          {scope === "history" ? (
            <CosmicSelectField
              variant="solid"
              value={result || ALL}
              onValueChange={(value) => setParams({ result: value === ALL ? "" : value })}
              options={resultOptions}
              aria-label={t("slips.filters.result")}
              triggerClassName="w-full"
            />
          ) : null}
        </div>

        {scope === "history" ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap gap-2" role="group" aria-label={t("slips.filters.range")}>
              {SLIP_RANGE_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={range === id}
                  onClick={() => (id === "custom" ? setPickerOpen(true) : setParams({ range: id, from: "", to: "" }))}
                  className={cn(COSMIC_CHOICE_BTN, "min-h-9 px-3 text-sm", range === id && "is-active")}
                >
                  {rangeLabels[id]}
                </button>
              ))}
            </div>
            {range === "custom" && parseDateOnly(params.from) && parseDateOnly(params.to) ? (
              <p className="m-0 text-xs tabular-nums text-[var(--text-secondary)]">
                {shortDate(customFrom.toISOString(), false)} – {shortDate(customTo.toISOString(), false)}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <TabPanelTransition tabKey={scope} order={TAB_ORDER}>
        <ResourceGate resource={first} loadingLabel={t("slips.loading")} errorTitle={t("slips.loadError")}>
          {(data) => (
            <div className="flex flex-col gap-3">
              <div
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-[var(--text-secondary)]"
                aria-live="polite"
              >
                <span className="tabular-nums">
                  {t("slips.summary.count", { count: data.summary.count })} ·{" "}
                  {t("slips.summary.stake", { amount: formatBaht(data.summary.totalStake) })}
                </span>
                {data.summary.totalWinLoss !== null ? (
                  <span className="tabular-nums">
                    {t("slips.summary.net")}{" "}
                    <span className={signedMoneyValueClass(data.summary.totalWinLoss, "font-medium")}>
                      {formatSignedBaht(data.summary.totalWinLoss)}
                    </span>
                  </span>
                ) : null}
              </div>

              {slips.length === 0 ? (
                filtersActive ? (
                  <EmptyState
                    variant="card"
                    title={t("slips.emptyFiltered")}
                    primaryAction={{ label: t("slips.clearFilters"), onClick: clearFilters }}
                  />
                ) : scope === "pending" ? (
                  <EmptyState
                    variant="card"
                    title={t("slips.emptyPending.title")}
                    description={t("slips.emptyPending.description")}
                    primaryAction={{ label: t("slips.goPlay"), href: "/lottery" }}
                  />
                ) : (
                  <EmptyState
                    variant="card"
                    title={t("slips.emptyHistory.title")}
                    description={t("slips.emptyHistory.description", { days: SLIP_HISTORY_DAYS })}
                  />
                )
              ) : (
                <ul className="lottery-slips-list m-0 flex list-none flex-col gap-[0.65rem] p-0">
                  {slips.map((slip) => (
                    <li key={slip.id}>
                      <LotterySlipCard slip={slip} now={now} />
                    </li>
                  ))}
                </ul>
              )}

              {cursor ? (
                <div className="flex flex-col items-center gap-2">
                  {moreError ? (
                    <p className="m-0 text-sm text-[var(--text-secondary)]" role="alert">
                      {t("slips.loadMoreError")}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void loadMore()}
                    disabled={loadingMore}
                    className={cn(COSMIC_CHOICE_BTN, "min-h-11 w-full text-sm")}
                  >
                    {loadingMore ? t("slips.loadingMore") : t("slips.loadMore")}
                  </button>
                </div>
              ) : null}

              {scope === "history" ? (
                <p className="m-0 text-center text-xs text-[var(--text-muted)]">
                  {t("slips.retentionNote", { days: SLIP_HISTORY_DAYS })}
                </p>
              ) : null}
            </div>
          )}
        </ResourceGate>
      </TabPanelTransition>

      <TransactionDateRangeDialog
        open={pickerOpen}
        from={customFrom}
        to={customTo}
        minDate={pickerBounds.min}
        maxDate={pickerBounds.max}
        onOpenChange={setPickerOpen}
        onConfirm={(from, to) => setParams({ range: "custom", from: formatDateOnly(from), to: formatDateOnly(to) })}
      />
    </div>
  );
}
