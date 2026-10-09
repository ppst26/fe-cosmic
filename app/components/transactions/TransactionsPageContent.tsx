"use client";

import React, { useMemo, useState } from "react";
import type { TransactionKind } from "@/app/types/transaction";
import { TRANSACTION_KIND_TABS } from "@/app/data/transactionsMockData";
import { useTransactions } from "@/app/hooks/api/transactions";
import { ErrorState, LoadingState } from "../ui/StatusState";
import { getDefaultTransactionDateRange } from "@/app/lib/transactionDateUtils";
import { TabPanelTransition } from "@/app/components/ui/TabPanelTransition";
import { TransactionKindTabs } from "./TransactionKindTabs";
import { TransactionDateFilter } from "./TransactionDateFilter";
import { TransactionHistoryTable } from "./TransactionHistoryTable";
import { TransactionHistoryPagination } from "./TransactionHistoryPagination";
import { COSMIC_PANEL_GLASS } from "../ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";
import { signedMoneyValueClass, valueClass } from "@/lib/semanticValue";
import {
  countPromotionClaims,
  sumBetStakeTotal,
  sumBetWinLossTotal,
  sumCompletedDepositAmount,
  sumCompletedWithdrawAmount,
} from "@/lib/domain/transactions";
import { TRANSACTION_BET_PAGE_SIZE } from "@/lib/uiConstants";
import { useT } from "@/lib/i18n/I18nProvider";

interface TransactionsPageContentProps {
  activeKind: TransactionKind;
  onSelectKind: (kind: TransactionKind) => void;
  isAuthenticated: boolean;
  embedded?: boolean;
}

/**
 * เนื้อหาหน้ารายการธุรกรรม — แท็บ · ฟิลเตอร์วันที่ · ตาราง ( /transactions · hub )
 */
export function TransactionsPageContent({
  activeKind,
  onSelectKind,
  isAuthenticated,
  embedded = false,
}: TransactionsPageContentProps) {
  const t = useT("transactions");
  const defaultRange = useMemo(() => getDefaultTransactionDateRange(), []);

  const [draftFrom, setDraftFrom] = useState(defaultRange.from);
  const [draftTo, setDraftTo] = useState(defaultRange.to);
  const [appliedFrom, setAppliedFrom] = useState(defaultRange.from);
  const [appliedTo, setAppliedTo] = useState(defaultRange.to);
  const [betPage, setBetPage] = useState(1);

  /** server กรองตามประเภท + ช่วงวันที่ (mock กรองใน lib/api) */
  const transactions = useTransactions(activeKind, appliedFrom, appliedTo);
  const items = useMemo(() => transactions.data ?? [], [transactions.data]);

  /** เปลี่ยนแท็บหรือช่วงวันที่ → กลับหน้า 1 (ปรับ state ระหว่าง render แทน effect) */
  const pageResetKey = `${activeKind}|${appliedFrom.getTime()}|${appliedTo.getTime()}`;
  const [prevPageResetKey, setPrevPageResetKey] = useState(pageResetKey);
  if (prevPageResetKey !== pageResetKey) {
    setPrevPageResetKey(pageResetKey);
    setBetPage(1);
  }

  const betTotalPages = Math.max(1, Math.ceil(items.length / TRANSACTION_BET_PAGE_SIZE));
  const betPageSafe = Math.min(Math.max(1, betPage), betTotalPages);

  const tableItems = useMemo(() => {
    if (activeKind !== "bet") return items;
    const start = (betPageSafe - 1) * TRANSACTION_BET_PAGE_SIZE;
    return items.slice(start, start + TRANSACTION_BET_PAGE_SIZE);
  }, [activeKind, items, betPageSafe]);

  const handleClear = () => {
    const next = getDefaultTransactionDateRange();
    setDraftFrom(next.from);
    setDraftTo(next.to);
    setAppliedFrom(next.from);
    setAppliedTo(next.to);
  };

  const handleSearch = () => {
    setAppliedFrom(draftFrom);
    setAppliedTo(draftTo);
  };

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const shellClass = cn(
    "flex flex-col gap-4",
    embedded && `${COSMIC_PANEL_GLASS} px-3.5 py-4 sm:px-4`,
  );

  return (
    <div className="flex flex-col gap-4">
      <section className={shellClass}>
        <TransactionKindTabs
          tabs={TRANSACTION_KIND_TABS}
          activeKind={activeKind}
          onSelect={onSelectKind}
        />

        <TransactionDateFilter
          draftFrom={draftFrom}
          draftTo={draftTo}
          onDraftChange={(from, to) => {
            setDraftFrom(from);
            setDraftTo(to);
          }}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {!isAuthenticated ? (
          <p className="py-10 text-center text-sm text-[var(--text-muted)]">
            {t("loginRequired")}
          </p>
        ) : transactions.status === "error" && !transactions.data ? (
          <ErrorState
            title={t("loadError")}
            description={transactions.error?.message}
            primaryAction={{ label: t("retry"), onClick: transactions.refresh }}
          />
        ) : !transactions.data ? (
          <LoadingState label={t("loading")} />
        ) : (
          <TabPanelTransition
            tabKey={activeKind}
            className="flex flex-col gap-4"
          >
            <TransactionHistoryTable kind={activeKind} items={tableItems} />

            {activeKind === "bet" ? (
              <TransactionHistoryPagination
                page={betPageSafe}
                totalPages={betTotalPages}
                onPageChange={setBetPage}
              />
            ) : null}

            {activeKind === "deposit" ? (
              <div className="tx-history-summary">
                <span>{t("summary.depositTotal")}</span>
                <span className={valueClass("success", "font-medium")}>
                  {formatMoney(sumCompletedDepositAmount(items))} ฿
                </span>
              </div>
            ) : null}

            {activeKind === "withdraw" ? (
              <div className="tx-history-summary">
                <span>{t("summary.withdrawTotal")}</span>
                <span className={valueClass("success", "font-medium")}>
                  {formatMoney(sumCompletedWithdrawAmount(items))} ฿
                </span>
              </div>
            ) : null}

            {activeKind === "promotion" ? (
              <div className="tx-history-summary">
                <span>{t("summary.promotionClaims")}</span>
                <span className={valueClass("emphasis", "font-medium")}>
                  {countPromotionClaims(items)}
                </span>
              </div>
            ) : null}

            {activeKind === "bet" ? (
              <div className="flex flex-col gap-2 pt-1">
                <div className="tx-history-summary">
                  <span>{t("summary.winLossTotal")}</span>
                  <span className={signedMoneyValueClass(sumBetWinLossTotal(items), "font-medium")}>
                    {formatMoney(sumBetWinLossTotal(items))} ฿
                  </span>
                </div>
                <div className="tx-history-summary">
                  <span>{t("summary.stakeTotal")}</span>
                  <span className={valueClass("neutral", "font-medium")}>
                    {formatMoney(sumBetStakeTotal(items))} ฿
                  </span>
                </div>
              </div>
            ) : null}
          </TabPanelTransition>
        )}
      </section>
    </div>
  );
}
