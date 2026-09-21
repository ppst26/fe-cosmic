"use client";

import React from "react";
import { Dialog } from "radix-ui";
import type { LotteryBetDialogState } from "@/app/hooks/useLotteryBetSubmit";
import { COSMIC_BTN_PRIMARY } from "../ui/cosmicButtonClasses";
import { CloseIcon } from "../ui/Icons";

interface LotteryBetResultDialogProps {
  state: LotteryBetDialogState | null;
  onClose: () => void;
}

/**
 * Dialog แจ้งส่งโพยไม่สำเร็จ — สำเร็จไปหน้าสรุปโพยแทน
 */
export function LotteryBetResultDialog({ state, onClose }: LotteryBetResultDialogProps) {
  const open = state !== null;

  const handleOpenChange = (next: boolean) => {
    if (!next) onClose();
  };

  if (!state) {
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="cosmic-dialog-overlay fixed inset-0 z-[80] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        />
        <Dialog.Content
          aria-describedby="lottery-bet-result-desc"
          className="lottery-bet-result-dialog cosmic-modal-shell fixed left-1/2 top-1/2 z-[85] w-[min(calc(100vw-1.5rem),380px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden px-5 pb-5 pt-4 text-[var(--text-primary)] shadow-[0_22px_48px_rgba(0,0,0,0.55)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200"
        >
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[var(--icon-default)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--icon-active)]"
              aria-label="ปิด"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </Dialog.Close>

          <div className="flex flex-col items-center pt-2 text-center">
            <span
              className="lottery-bet-result-dialog__icon is-error flex h-14 w-14 items-center justify-center"
              aria-hidden="true"
            >
              <CloseIcon className="h-6 w-6" />
            </span>
            <Dialog.Title className="mt-3 text-lg font-medium">ส่งโพยไม่สำเร็จ</Dialog.Title>
            <p id="lottery-bet-result-desc" className="mt-1 text-sm text-[var(--text-secondary)]">
              {state.message}
            </p>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              className={`${COSMIC_BTN_PRIMARY} mt-6 flex h-12 w-full items-center justify-center text-base`}
            >
              เรียบร้อย
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
