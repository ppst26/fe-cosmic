"use client";

import React from "react";
import { Dialog } from "radix-ui";
import { getPromotionDetail, type PromotionDetailId } from "@/app/data/promotionDetailMockData";
import { CloseIcon } from "../ui/Icons";
import { COSMIC_BTN_GLASS_ICON } from "../ui/cosmicButtonClasses";
import { PromotionDetailPanel } from "./PromotionDetailPanel";

interface PromotionDetailModalProps {
  detailId: PromotionDetailId | null;
  onClose: () => void;
}

/**
 * Modal รายละเอียดโปรโมชั่น — เปิดจากปุ่ม「ดูรายละเอียด」ในหน้า /promotions (มือถือ / หน้าเต็ม)
 */
export function PromotionDetailModal({ detailId, onClose }: PromotionDetailModalProps) {
  const open = detailId !== null;
  const content = detailId ? getPromotionDetail(detailId) : null;

  const handleOpenChange = (next: boolean) => {
    if (!next) onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="cosmic-dialog-overlay fixed inset-0 z-[65] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        />

        {content && (
          <Dialog.Content
            aria-describedby={undefined}
            className="promo-detail-modal cosmic-modal-shell fixed left-1/2 top-1/2 z-[80] flex max-h-[min(92dvh,680px)] w-[min(calc(100vw-1.25rem),420px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden text-[var(--text-primary)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200"
          >
            <div className="promo-detail-modal__header">
              <Dialog.Title className="promo-detail-modal__title">รายละเอียดโปรโมชั่น</Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className={`${COSMIC_BTN_GLASS_ICON} shrink-0 text-[var(--icon-active)]`}
                  aria-label="ปิดรายละเอียดโปรโมชั่น"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="promo-detail-modal__scroll">
              <PromotionDetailPanel content={content} variant="modal" />
            </div>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
