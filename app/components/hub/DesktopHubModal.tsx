"use client";

import React from "react";
import { Dialog } from "radix-ui";
import { PromotionsHubPageContent } from "@/app/components/promotions/PromotionsHubPageContent";
import { CashbackPageContent } from "@/app/components/cashback/CashbackPageContent";
import { GemsStorePageContent } from "@/app/components/gems-store/GemsStorePageContent";
import { ReferralPageContent } from "@/app/components/referral/ReferralPageContent";
import { CloseIcon } from "@/app/components/ui/Icons";
import { DesktopHubAccountBody } from "./DesktopHubAccountBody";
import { DesktopHubTransactionsBody } from "./DesktopHubTransactionsBody";
import { LuckyWheelPageContent } from "@/app/components/wheel/LuckyWheelPageContent";
import { DailyCheckInPageContent } from "@/app/components/missions/DailyCheckInPageContent";
import type { DesktopHubId, OpenHubOptions } from "./hubModalRegistry";
import { HUB_MODAL_TITLES } from "./hubModalRegistry";

interface DesktopHubModalProps {
  hubId: DesktopHubId | null;
  options: OpenHubOptions | undefined;
  onClose: () => void;
}

/**
 * Modal กลางจอ desktop — แสดงเนื้อหา hub ตาม registry
 */
export function DesktopHubModal({ hubId, options, onClose }: DesktopHubModalProps) {
  const isOpen = hubId != null;
  const title = hubId ? HUB_MODAL_TITLES[hubId] : "";

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[65] bg-black/75 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />

        <Dialog.Content
          aria-describedby={undefined}
          className="cosmic-modal-shell cosmic-modal-shell--hub fixed left-1/2 top-1/2 z-[70] flex max-h-[min(90dvh,800px)] w-[min(92vw,720px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden bg-[var(--surface-mid)] text-[var(--text-primary)] shadow-[0_0_32px_rgba(119,112,183,0.2),0_24px_48px_rgba(0,0,0,0.55)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200"
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-3">
            <Dialog.Title className="text-lg font-extrabold tracking-tight text-[var(--text-primary)]">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] text-[var(--icon-default)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                aria-label="ปิด"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-[var(--page-gutter)] pb-4 pt-3">
            {hubId === "promotions" ? <PromotionsHubPageContent embedded /> : null}
            {hubId === "cashback" ? (
              <CashbackPageContent
                key={`cashback-${options?.cashbackTab ?? "play"}`}
                embedded
                initialTab={options?.cashbackTab ?? "play"}
              />
            ) : null}
            {hubId === "gems-store" ? <GemsStorePageContent embedded /> : null}
            {hubId === "account" ? <DesktopHubAccountBody /> : null}
            {hubId === "referral" ? <ReferralPageContent embedded /> : null}
            {hubId === "transactions" ? (
              <DesktopHubTransactionsBody
                key={`tx-${options?.transactionKind ?? "deposit"}`}
                initialKind={options?.transactionKind ?? "deposit"}
              />
            ) : null}
            {hubId === "wheel" ? (
              <div className="cosmic-bg-shell -mx-[var(--page-gutter)] px-[var(--page-gutter)]">
                <LuckyWheelPageContent embedded />
              </div>
            ) : null}
            {hubId === "check-in" ? <DailyCheckInPageContent embedded /> : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
