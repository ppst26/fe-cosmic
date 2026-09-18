"use client";

import React from "react";
import { Dialog } from "radix-ui";
import { getPromotionDetail, type PromotionDetailId } from "@/app/data/promotionDetailMockData";
import { CloseIcon } from "../ui/Icons";
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
            className="cosmic-modal-shell fixed left-1/2 top-1/2 z-[80] flex max-h-[min(92dvh,680px)] w-[min(calc(100vw-1.25rem),420px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden text-[var(--text-primary)] shadow-[0_22px_48px_rgba(0,0,0,0.55)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200"
          >
            <div className="relative shrink-0 px-3 pb-2 pt-3">
              <div className="mx-auto flex max-w-[92%] justify-center">
                <div
                  className="relative w-full max-w-[280px] px-6 py-2.5 text-center"
                  style={{
                    background: "linear-gradient(180deg, #6d28d9 0%, #4c1d95 55%, #3b0764 100%)",
                    clipPath: "polygon(6% 0, 94% 0, 100% 100%, 0 100%)",
                    boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                  }}
                >
                  <Dialog.Title className="text-sm font-extrabold tracking-wide text-white sm:text-base">
                    รายละเอียดโปรโมชั่น
                  </Dialog.Title>
                </div>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1240]/90 text-[var(--icon-default)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--icon-active)]"
                  aria-label="ปิดรายละเอียดโปรโมชั่น"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-1 [scrollbar-width:thin] [scrollbar-color:rgba(124,58,237,0.45)_transparent]">
              <PromotionDetailPanel content={content} variant="modal" />
            </div>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
