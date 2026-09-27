"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { CashbackPageContent } from "@/app/components/cashback/CashbackPageContent";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";
import type { CashbackTabId } from "@/app/data/cashbackMockData";

/**
 * อ่าน query ?tab=loss สำหรับแท็บเริ่มต้น
 */
function CashbackPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabParam = searchParams.get("tab");
  const initialTab: CashbackTabId = tabParam === "loss" ? "loss" : "play";

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

      <main className="mobile-standalone-main pt-4">
        <CashbackPageContent initialTab={initialTab} />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}

/**
 * หน้าคืนยอด (/cashback) — แท็บเล่น / เสีย
 */
export default function CashbackPage() {
  return (
    <Suspense fallback={null}>
      <CashbackPageInner />
    </Suspense>
  );
}
