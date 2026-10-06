"use client";

import React from "react";
import { Dialog } from "radix-ui";
import Image from "next/image";
import { formatCheckInCredits } from "@/app/data/dailyCheckInMockData";
import { COSMIC_BTN_PRIMARY } from "@/app/components/ui/cosmicButtonClasses";
import { CloseIcon } from "@/app/components/ui/Icons";
import { responsiveSheetCloseButtonClass } from "@/app/components/ui/responsiveSheetDialog";

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
  const rewardLabel = formatCheckInCredits(credits);

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
              aria-label="ปิด"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </Dialog.Close>

          <div className="flex flex-col items-center pt-2 text-center">
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_35%,rgb(119_71_229/0.45)_0%,rgb(26_20_42/0.95)_72%)] shadow-[0_0_24px_rgba(119,71,229,0.35)]"
              aria-hidden="true"
            >
              <div className="relative h-9 w-9">
                <Image
                  src="/assets/check-in/diamond.avif"
                  alt=""
                  fill
                  sizes="36px"
                  className="object-contain drop-shadow-[0_0_12px_rgba(119,71,229,0.65)]"
                />
              </div>
            </div>

            <Dialog.Title className="mt-4 text-lg font-medium text-[var(--text-primary)]">
              รับรางวัลเรียบร้อยแล้ว
            </Dialog.Title>
            <p
              id="daily-check-in-claim-success-desc"
              className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]"
            >
              คุณได้รับ <span className="font-medium text-[#c4b5fd]">{rewardLabel}</span> แล้ว
            </p>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              className={`${COSMIC_BTN_PRIMARY} mt-6 flex h-12 w-full items-center justify-center text-base`}
            >
              ตกลง
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
