"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import type { TransactionKind } from "@/app/types/transaction";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { TransactionsPageContent } from "@/app/components/transactions/TransactionsPageContent";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";
import { useT } from "@/lib/i18n/I18nProvider";
import { useUrlTab } from "@/app/hooks/useUrlTab";

function kindFromSearchParam(value: string | null): TransactionKind {
  if (value === "withdraw" || value === "promotion" || value === "bet") {
    return value;
  }
  return "deposit";
}

/**
 * หน้ารายการธุรกรรม — แทน bottom sheet
 */
function TransactionsPageInner() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useT("transactions");

  /** สลับประเภททันที (state) แล้วค่อยสะท้อนลง URL ด้วย history.replaceState — ไม่รอ navigation */
  const [activeKind, handleSelectKind] = useUrlTab<TransactionKind>("kind", kindFromSearchParam, "deposit");

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="mobile-standalone-page">
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title={t("title")} backHref="/" />

      <main className="mobile-standalone-main pt-4">
        <TransactionsPageContent
          activeKind={activeKind}
          onSelectKind={handleSelectKind}
          isAuthenticated={isAuthenticated}
        />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}

export default function TransactionsPage() {
  const t = useT("transactions");
  return (
    <Suspense
      fallback={
        <div className="mobile-standalone-page mobile-standalone-main py-16 text-center text-sm text-[var(--text-muted)]">
          {t("pageLoading")}
        </div>
      }
    >
      <TransactionsPageInner />
    </Suspense>
  );
}
