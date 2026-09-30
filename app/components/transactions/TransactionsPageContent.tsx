"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { TransactionKind } from "@/app/types/transaction";
import {
  countPromotionClaims,
  filterTransactionsByDateRange,
  getTransactionsByKind,
  sumBetStakeTotal,
  sumBetWinLossTotal,
  sumCompletedDepositAmount,
  sumCompletedWithdrawAmount,
  TRANSACTION_BET_PAGE_SIZE,
  TRANSACTION_KIND_TABS,
} from "@/app/data/transactionsMockData";
import { getDefaultTransactionDateRange } from "@/app/lib/transactionDateUtils";
import { TransactionKindTabs } from "./TransactionKindTabs";
import { TransactionDateFilter } from "./TransactionDateFilter";
import { TransactionHistoryTable } from "./TransactionHistoryTable";
import { TransactionHistoryPagination } from "./TransactionHistoryPagination";
import { COSMIC_PANEL_GLASS } from "../ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";

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
  const defaultRange = useMemo(() => getDefaultTransactionDateRange(), []);

  const [draftFrom, setDraftFrom] = useState(defaultRange.from);
  const [draftTo, setDraftTo] = useState(defaultRange.to);
  const [appliedFrom, setAppliedFrom] = useState(defaultRange.from);
  const [appliedTo, setAppliedTo] = useState(defaultRange.to);
  const [betPage, setBetPage] = useState(1);

  const allItems = isAuthenticated ? getTransactionsByKind(activeKind) : [];
  const items = useMemo(
    () => filterTransactionsByDateRange(allItems, appliedFrom, appliedTo),
    [allItems, appliedFrom, appliedTo],
  );

  useEffect(() => {
    setBetPage(1);
  }, [activeKind, appliedFrom, appliedTo]);

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
            กรุณาเข้าสู่ระบบเพื่อดูรายการธุรกรรม
          </p>
        ) : (
          <>
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
                <span>ยอดฝากทั้งหมด :</span>
                <span className="font-medium tabular-nums text-[var(--success)]">
                  {formatMoney(sumCompletedDepositAmount(items))} ฿
                </span>
              </div>
            ) : null}

            {activeKind === "withdraw" ? (
              <div className="tx-history-summary">
                <span>ยอดถอนทั้งหมด :</span>
                <span className="font-medium tabular-nums text-[var(--success)]">
                  {formatMoney(sumCompletedWithdrawAmount(items))} ฿
                </span>
              </div>
            ) : null}

            {activeKind === "promotion" ? (
              <div className="tx-history-summary">
                <span>จำนวนการรับโปรโมชั่น :</span>
                <span className="font-medium tabular-nums text-[var(--success)]">
                  {countPromotionClaims(items)}
                </span>
              </div>
            ) : null}

            {activeKind === "bet" ? (
              <div className="flex flex-col gap-2 pt-1">
                <div className="tx-history-summary">
                  <span>ยอดวิน/ลอสรวม :</span>
                  <span
                    className={cn(
                      "font-medium tabular-nums",
                      sumBetWinLossTotal(items) < 0
                        ? "text-[var(--destructive)]"
                        : "text-[var(--success)]",
                    )}
                  >
                    {formatMoney(sumBetWinLossTotal(items))} ฿
                  </span>
                </div>
                <div className="tx-history-summary">
                  <span>ยอดเดิมพันรวม :</span>
                  <span className="font-medium tabular-nums text-[var(--success)]">
                    {formatMoney(sumBetStakeTotal(items))} ฿
                  </span>
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
