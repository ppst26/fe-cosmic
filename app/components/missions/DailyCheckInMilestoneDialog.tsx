"use client";

import React from "react";
import { Dialog } from "radix-ui";
import Image from "next/image";
import { COSMIC_BTN_PRIMARY } from "@/app/components/ui/cosmicButtonClasses";
import { CloseIcon } from "@/app/components/ui/Icons";
import { responsiveSheetCloseButtonClass } from "@/app/components/ui/responsiveSheetDialog";
import { cn } from "@/lib/utils";
import { valueClass } from "@/lib/semanticValue";
import { useT } from "@/lib/i18n/I18nProvider";

export interface DailyCheckInMilestoneDialogProps {
  open: boolean;
  /** เช็คอินครบกี่วันถึงรับได้ (7 / 14 / 21 / 28) */
  milestoneDay: number;
  gemsReward: number;
  /** จำนวนวันที่เช็คอินแล้วในรอบ */
  checkedInCount: number;
  /** รับรางวัลขั้นนี้ไปแล้ว */
  claimed: boolean;
  onClaim: () => void;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog รางวัลเช็คอินสะสม — เปิดจากการกดขั้นในกล่อง «รางวัลเช็คอินสะสม» (DailyCheckInCard)
 * ครบวันแล้ว → ปุ่มรับรางวัล · ยังไม่ครบ → แสดงความคืบหน้า + ปุ่มปิดใช้งาน · รับแล้ว → ปุ่มปิดใช้งาน
 */
export function DailyCheckInMilestoneDialog({
  open,
  milestoneDay,
  gemsReward,
  checkedInCount,
  claimed,
  onClaim,
  onOpenChange,
}: DailyCheckInMilestoneDialogProps) {
  const t = useT("rewards");
  const done = Math.min(checkedInCount, milestoneDay);
  const daysLeft = Math.max(0, milestoneDay - checkedInCount);
  const canClaim = !claimed && daysLeft === 0;
  const progressPercent = Math.round((done / milestoneDay) * 100);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="cosmic-dialog-overlay fixed inset-0 z-[80] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby="daily-check-in-milestone-desc"
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
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_35%,rgb(119_71_229/0.45)_0%,rgb(26_20_42/0.95)_72%)] shadow-[0_0_24px_rgba(119,71,229,0.35)]"
              aria-hidden="true"
            >
              <div className="relative h-9 w-9">
                <Image
                  src="/assets/check-in/diamonds.avif"
                  alt=""
                  fill
                  sizes="36px"
                  className="object-contain drop-shadow-[0_0_12px_rgba(119,71,229,0.65)]"
                />
              </div>
            </div>

            <Dialog.Title className="mt-4 text-lg font-medium text-[var(--text-primary)]">
              {t("checkIn.milestoneDialog.title", { days: milestoneDay })}
            </Dialog.Title>

            <p id="daily-check-in-milestone-desc" className="mt-1.5 text-base font-medium">
              <span className={valueClass("accent")}>{t("checkIn.milestoneGems", { amount: gemsReward })}</span>
            </p>

            <div className="mt-4 w-full">
              <div className="h-2.5 overflow-hidden rounded-full border border-white/8 bg-black/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7747e5] to-[#5b8cff] transition-[width] duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-sm tabular-nums text-[var(--text-secondary)]">
                {t("checkIn.milestoneDialog.progress", { done, total: milestoneDay })}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={!canClaim}
            onClick={onClaim}
            className={cn(
              COSMIC_BTN_PRIMARY,
              "mt-6 flex h-12 w-full items-center justify-center text-base",
              !canClaim && "!border-white/8 !bg-[var(--surface-elevated)] !text-[var(--text-muted)] !shadow-none",
            )}
          >
            {claimed
              ? t("checkIn.milestoneDialog.claimed")
              : canClaim
                ? t("checkIn.milestoneDialog.claim")
                : t("checkIn.milestoneDialog.daysLeft", { count: daysLeft })}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
