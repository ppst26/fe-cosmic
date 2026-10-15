"use client";

import React from "react";
import { Dialog } from "radix-ui";
import Image from "next/image";
import { COSMIC_BTN_PRIMARY } from "@/app/components/ui/cosmicButtonClasses";
import { CloseIcon } from "@/app/components/ui/Icons";
import { responsiveSheetCloseButtonClass } from "@/app/components/ui/responsiveSheetDialog";

import { valueClass } from "@/lib/semanticValue";
import { useT } from "@/lib/i18n/I18nProvider";
import { useFormat } from "@/lib/i18n/useFormat";

export interface DailyCheckInClaimSuccessDialogProps {
  open: boolean;
  credits: number;
  onOpenChange: (open: boolean) => void;
}

/**
 * แจ้งรับรางวัลเช็คอินสำเร็จ — เปิดจาก DailyCheckInCard หลังกดรับ
 */
export function DailyCheckInClaimSuccessDialog({
  open,
  credits,
  onOpenChange,
}: DailyCheckInClaimSuccessDialogProps) {
  const t = useT("rewards");
  const fmt = useFormat();
  const rewardLabel = fmt.gems(credits);
  const descAfter = t("checkIn.success.descAfter");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="cosmic-dialog-overlay fixed inset-0 z-[80] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        />
        <Dialog.Content
          aria-describedby="daily-check-in-claim-success-desc"
          className="cosmic-modal-shell fixed left-1/2 top-1/2 z-[85] w-[min(calc(100vw-1.5rem),380px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden px-5 pb-5 pt-4 text-[var(--text-primary)] shadow-[0_24px_56px_rgba(0,0,0,0.65),0_4px_16px_rgba(0,0,0,0.3)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200"
        >
          <Dialog.Close asChild>
            <button
              type="button"
              className={responsiveSheetCloseButtonClass("absolute right-3 top-3")}
              aria-label={t("actions.close")}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </Dialog.Close>

          <div className="flex flex-col items-center pt-2 text-center">
            <div className="relative h-16 w-16" aria-hidden="true">
              <Image
                src="/assets/check-in/diamond.avif"
                alt=""
                fill
                sizes="64px"
                className="object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
              />
            </div>

            <Dialog.Title className="mt-4 text-lg font-medium text-[var(--text-primary)]">
              {t("checkIn.success.title")}
            </Dialog.Title>
            <p
              id="daily-check-in-claim-success-desc"
              className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]"
            >
              {t("checkIn.success.descBefore")} <span className={valueClass("accent")}>{rewardLabel}</span>
              {descAfter ? ` ${descAfter}` : null}
            </p>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              className={`${COSMIC_BTN_PRIMARY} mt-6 flex h-12 w-full items-center justify-center text-base`}
            >
              {t("actions.ok")}
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
