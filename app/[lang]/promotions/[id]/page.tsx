"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { PromotionDetailPageContent } from "@/app/components/promotions/PromotionDetailPageContent";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * หน้ารายละเอียดโปรโมชั่น (/promotions/[id]) — standalone page แทน modal เดิม
 */
export default function PromotionDetailPage() {
  const t = useT("promotions");
  const params = useParams<{ id: string }>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mobile-standalone-page">
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title={t("detail.title")} backHref="/promotions" />

      <main className="mobile-standalone-main pt-4 pb-8">
        <PromotionDetailPageContent id={decodeURIComponent(params.id)} />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
