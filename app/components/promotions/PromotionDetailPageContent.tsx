"use client";

import React from "react";
import type { PromotionDetailId } from "@/app/types/promotions";
import { usePromotionDetail } from "@/app/hooks/api/promotions";
import { EmptyState } from "../ui/StatusState";
import { ResourceGate } from "../ui/ResourceGate";
import { PromotionDetailPanel } from "./PromotionDetailPanel";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * เนื้อหาหน้ารายละเอียดโปรโมชั่น (/promotions/[id]) — โหลดจาก GET /api/promotions/[id] ผ่าน useApi (cache ตาม id)
 * แทน PromotionDetailModal เดิม
 */
export function PromotionDetailPageContent({ id }: { id: string }) {
  const t = useT("promotions");
  const detail = usePromotionDetail(id as PromotionDetailId);

  if (detail.data === null && detail.error?.status === 404) {
    return <EmptyState title={t("detail.notFound")} description={t("detail.notFoundDesc")} />;
  }

  return (
    <ResourceGate
      resource={detail}
      loadingLabel={t("detail.loading")}
      errorTitle={t("detail.notFound")}
    >
      {(content) => (
        <div className="promo-detail-page">
          <PromotionDetailPanel content={content} variant="page" />
        </div>
      )}
    </ResourceGate>
  );
}
