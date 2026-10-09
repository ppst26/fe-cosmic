"use client";

import React, { useMemo } from "react";
import { EmptyState } from "@/app/components/ui/StatusState";
import { getLotteryRules } from "@/lib/lottery/rules";
import { LotteryMarketIcon } from "./LotteryMarketIcon";
import { formatBaht } from "./lotteryUtils";
import { useLotteryI18n } from "./useLotteryI18n";
import { valueClass } from "@/lib/semanticValue";

/**
 * เนื้อหาหน้ากติกา / อัตราการจ่าย (/lottery/rules/[marketSlug]) — เปิดจากการ์ดหัวงวดในหน้าแทง
 * แสดงอัตราจ่ายต่อ 1 บาทของแต่ละประเภทการแทง + ยอดแทงต่อรายการ (ข้อมูลจาก lib/lottery/rules.ts)
 */
export function LotteryRulesContent({ marketSlug }: { marketSlug: string }) {
  const { t } = useLotteryI18n();
  const rules = useMemo(() => getLotteryRules(marketSlug), [marketSlug]);

  if (!rules) {
    return (
      <EmptyState
        className="mt-4"
        variant="card"
        title={t("market.notFoundTitle")}
        description={t("market.notFoundDescription")}
        primaryAction={{ label: t("market.viewAll"), href: "/lottery" }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <section className="thai-lotto-draw flex items-center gap-3 p-4" aria-label={t(rules.titleKey)}>
        <LotteryMarketIcon
          marketSlug={rules.slug}
          size="lg"
          fallbackLabel={rules.flagLabel}
          fallbackTone={rules.flagTone}
        />
        <h1 className="thai-lotto-draw__title m-0 min-w-0 flex-1 leading-[1.4]">{t(rules.titleKey)}</h1>
      </section>

      <section className="thai-lotto-panel p-3 sm:p-4" aria-labelledby="lottery-rules-payout">
        <h2 id="lottery-rules-payout" className="thai-lotto-panel__title m-0 mb-1 text-base font-medium">
          {t("rules.payoutHeading")}
        </h2>
        <ul className="m-0 list-none p-0">
          {rules.rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] py-2.5 last:border-b-0"
            >
              <span className="min-w-0 text-[var(--text-primary)]">{t(row.labelKey)}</span>
              <span className={`${valueClass("reward")} shrink-0`}>{t("board.payout", { rate: row.payoutRate })}</span>
            </li>
          ))}
        </ul>
      </section>

      {rules.minBet !== null && rules.maxBet !== null ? (
        <section className="thai-lotto-panel p-3 sm:p-4" aria-labelledby="lottery-rules-limits">
          <h2 id="lottery-rules-limits" className="thai-lotto-panel__title m-0 mb-1 text-base font-medium">
            {t("rules.limitsHeading")}
          </h2>
          <dl className="m-0">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] py-2.5">
              <dt className="text-[var(--text-secondary)]">{t("rules.minBet")}</dt>
              <dd className="m-0 tabular-nums text-[var(--text-primary)]">{formatBaht(rules.minBet)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-[var(--text-secondary)]">{t("rules.maxBet")}</dt>
              <dd className="m-0 tabular-nums text-[var(--text-primary)]">{formatBaht(rules.maxBet)}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </div>
  );
}
