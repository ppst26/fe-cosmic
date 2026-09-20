"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { TransactionKind } from "@/app/types/transaction";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { TransactionsPageContent } from "@/app/components/transactions/TransactionsPageContent";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";

function kindFromSearchParam(value: string | null): TransactionKind {
  return value === "withdraw" ? "withdraw" : "deposit";
}

function transactionsHref(kind: TransactionKind): string {
  return kind === "withdraw" ? "/transactions?kind=withdraw" : "/transactions";
}

/**
 * หน้ารายการธุรกรรม — แทน bottom sheet
 */
function TransactionsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const kindParam = searchParams.get("kind");
  const activeKind = kindFromSearchParam(kindParam);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSelectKind = (kind: TransactionKind) => {
    router.replace(transactionsHref(kind), { scroll: false });
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="mobile-standalone-page">
      <Header />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="รายการธุรกรรม" backHref="/" />

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
  return (
    <Suspense
      fallback={
        <div className="mobile-standalone-page mobile-standalone-main py-16 text-center text-sm text-[var(--text-muted)]">
          กำลังโหลด...
        </div>
      }
    >
      <TransactionsPageInner />
    </Suspense>
  );
}
