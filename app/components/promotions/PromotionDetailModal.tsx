"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import type { PromotionDetailContent, PromotionDetailId } from "@/app/types/promotions";
import { CloseIcon } from "../ui/Icons";
import { responsiveSheetCloseButtonClass } from "../ui/responsiveSheetDialog";
import { PromotionDetailPanel } from "./PromotionDetailPanel";
import { usePromotionsCatalog } from "./PromotionsCatalogProvider";

interface PromotionDetailModalProps {
  detailId: PromotionDetailId | null;
  onClose: () => void;
}

/**
 * Modal รายละเอียดโปรโมชั่น — โหลดจาก GET /api/promotions/[id]
 */
export function PromotionDetailModal({ detailId, onClose }: PromotionDetailModalProps) {
  const open = detailId !== null;
  const { fetchDetail, getCachedDetail } = usePromotionsCatalog();
  /** ผลโหลดล่าสุดผูกกับ id — content / loading คำนวณตอน render ไม่ต้อง sync state ใน effect */
  const [fetched, setFetched] = useState<{
    id: PromotionDetailId;
    content: PromotionDetailContent | null;
  } | null>(null);

  const cached = detailId ? getCachedDetail(detailId) : null;

  useEffect(() => {
    if (!detailId || getCachedDetail(detailId)) return;

    let cancelled = false;
    fetchDetail(detailId)
      .catch(() => null)
      .then((detail) => {
        if (!cancelled) setFetched({ id: detailId, content: detail });
      });

    return () => {
      cancelled = true;
    };
  }, [detailId, fetchDetail, getCachedDetail]);

  const content = cached ?? (fetched?.id === detailId ? fetched.content : null);
  const loading = detailId !== null && !cached && fetched?.id !== detailId;

  const handleOpenChange = (next: boolean) => {
    if (!next) onClose();
  };

  const showPanel = content && !loading;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="cosmic-dialog-overlay fixed inset-0 z-[65] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        />

        {open && (
          <Dialog.Content
            aria-describedby={undefined}
            className="promo-detail-modal cosmic-modal-shell fixed left-1/2 top-1/2 z-[80] flex -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden text-[var(--text-primary)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200"
          >
            <div className="promo-detail-modal__header">
              <Dialog.Title className="sr-only">
                {content?.bannerTitle ?? "รายละเอียดโปรโมชั่น"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className={responsiveSheetCloseButtonClass()}
                  aria-label="ปิดรายละเอียดโปรโมชั่น"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="promo-detail-modal__scroll">
              {loading && !content ? (
                <p className="px-4 py-10 text-center text-sm text-[var(--text-secondary)]">
                  กำลังโหลดรายละเอียด…
                </p>
              ) : null}
              {showPanel ? <PromotionDetailPanel content={content} variant="modal" /> : null}
              {!loading && !content ? (
                <p className="px-4 py-10 text-center text-sm text-[var(--text-secondary)]">
                  ไม่พบรายละเอียดโปรโมชั่น
                </p>
              ) : null}
            </div>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
