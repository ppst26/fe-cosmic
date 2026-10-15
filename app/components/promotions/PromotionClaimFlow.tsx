"use client";

import React, { useState } from "react";
import { Dialog } from "radix-ui";
import type { PromotionDetailContent } from "@/app/types/promotions";
import { CosmicConfirmDialog } from "@/app/components/ui/CosmicConfirmDialog";
import { COSMIC_BTN_PRIMARY } from "@/app/components/ui/cosmicButtonClasses";
import { CheckIcon, CloseIcon } from "@/app/components/ui/Icons";
import { responsiveSheetCloseButtonClass } from "@/app/components/ui/responsiveSheetDialog";
import { useRequireAuthAction } from "@/app/hooks/useRequireAuthAction";
import { claimPromotion, useMyPromotions } from "@/lib/promotions/myPromotions";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * ปุ่มรับโปรโมชั่น → confirm → alert รับสำเร็จ — ใช้ท้าย PromotionDetailPanel
 * (mock: ยังไม่มี API รับโปร — เก็บสถานะ "รับแล้ว" ไว้ใน state ของหน้า)
 */
export function PromotionClaimFlow({ content }: { content: PromotionDetailContent }) {
  const t = useT("promotions");
  const tRewards = useT("rewards");
  const { runWithAuth } = useRequireAuthAction();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const claimed = useMyPromotions().some((item) => item.id === content.id);

  const title = content.bannerTitle;

  return (
    <div className="promotion-claim-flow flex justify-center">
      <button
        type="button"
        disabled={claimed}
        className={`${COSMIC_BTN_PRIMARY} btn-primary--sm !h-9 flex items-center justify-center !px-5 !text-sm disabled:cursor-not-allowed disabled:opacity-60`}
        onClick={() => runWithAuth(true, () => setConfirmOpen(true))}
      >
        {claimed ? t("detail.claim.claimed") : t("detail.claim.button")}
      </button>

      <CosmicConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("detail.claim.confirm.title")}
        description={t("detail.claim.confirm.description", { title })}
        onConfirm={() => {
          setConfirmOpen(false);
          claimPromotion(content.id, title);
          setSuccessOpen(true);
        }}
      />

      <Dialog.Root open={successOpen} onOpenChange={setSuccessOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="cosmic-dialog-overlay fixed inset-0 z-[80] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content
            aria-describedby="promotion-claim-success-desc"
            className="cosmic-modal-shell fixed left-1/2 top-1/2 z-[85] w-[min(calc(100vw-1.5rem),380px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden px-5 pb-6 pt-4 text-[var(--text-primary)] shadow-[0_24px_56px_rgba(0,0,0,0.65),0_4px_16px_rgba(0,0,0,0.3)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200"
          >
            <Dialog.Close asChild>
              <button
                type="button"
                className={responsiveSheetCloseButtonClass("absolute right-3 top-3")}
                aria-label={tRewards("actions.close")}
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </Dialog.Close>

            <div className="flex flex-col items-center pt-2 text-center">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)] text-white"
                aria-hidden="true"
              >
                <CheckIcon className="h-8 w-8" />
              </span>
              <Dialog.Title className="mt-4 text-lg font-medium text-[var(--text-primary)]">
                {t("detail.claim.success.title")}
              </Dialog.Title>
              <p id="promotion-claim-success-desc" className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                {t("detail.claim.success.description", { title })}
              </p>
            </div>

          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
