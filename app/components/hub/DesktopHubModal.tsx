"use client";

import React from "react";
import { Dialog } from "radix-ui";
import { ActivitiesHubPageContent } from "@/app/components/activities/ActivitiesHubPageContent";
import { PromotionsHubPageContent } from "@/app/components/promotions/PromotionsHubPageContent";
import { CashbackPageContent } from "@/app/components/cashback/CashbackPageContent";
import { GemsStorePageContent } from "@/app/components/gems-store/GemsStorePageContent";
import { ReferralPageContent } from "@/app/components/referral/ReferralPageContent";
import { CloseIcon } from "@/app/components/ui/Icons";
import { ResponsiveSheetHeader } from "@/app/components/ui/ResponsiveSheetHeader";
import {
  RESPONSIVE_SHEET_HANDLE_CLASS,
  responsiveSheetContentClass,
  responsiveSheetOverlayClass,
} from "@/app/components/ui/responsiveSheetDialog";
import { DesktopHubAccountBody } from "./DesktopHubAccountBody";
import { DesktopHubTransactionsBody } from "./DesktopHubTransactionsBody";
import { DailyCheckInPageContent } from "@/app/components/missions/DailyCheckInPageContent";
import { DailyCheckInCard } from "@/app/components/missions/DailyCheckInCard";
import type { DesktopHubId, OpenHubOptions } from "./hubModalRegistry";
import {
  HUB_MODAL_TITLES,
  getHubSheetSize,
  isResponsiveSheetHub,
} from "./hubModalRegistry";

interface DesktopHubModalProps {
  hubId: DesktopHubId | null;
  options: OpenHubOptions | undefined;
  onClose: () => void;
}

/**
 * เนื้อหา hub ตาม id — ใช้ทั้ง modal แบบเดิมและ responsive sheet
 */
function HubModalBody({
  hubId,
  options,
}: {
  hubId: DesktopHubId;
  options: OpenHubOptions | undefined;
}) {
  return (
    <>
      {hubId === "promotions" ? <PromotionsHubPageContent embedded /> : null}
      {hubId === "activities" ? <ActivitiesHubPageContent embedded /> : null}
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
      {hubId === "check-in" ? <DailyCheckInPageContent embedded /> : null}
    </>
  );
}

/**
 * Modal hub บน desktop — สิทธิพิเศษใช้ responsive sheet แบบคูปอง · บัญชี/ธุรกรรมใช้ shell hub เดิม
 */
export function DesktopHubModal({ hubId, options, onClose }: DesktopHubModalProps) {
  const isOpen = hubId != null;
  const title = hubId ? HUB_MODAL_TITLES[hubId] : "";

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const sheetVariant = hubId
    ? getHubSheetSize(hubId) === "wide"
      ? "hubWide"
      : getHubSheetSize(hubId) === "hubCompact"
        ? "hubCompact"
        : "hub"
    : "default";

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {hubId && (
          <>
            <Dialog.Overlay className={responsiveSheetOverlayClass()} />
            <Dialog.Content
              aria-describedby={undefined}
              className={responsiveSheetContentClass(
                `vip-modal${hubId === "check-in" ? " !p-0 overflow-hidden" : ""}${hubId === "gems-store" ? " gems-store-modal-surface" : ""}`,
                { variant: sheetVariant },
              )}
            >
              <div className={RESPONSIVE_SHEET_HANDLE_CLASS} aria-hidden="true" />

              {hubId === "check-in" ? (
                <>
                  <Dialog.Title className="sr-only">เช็คอินรายวัน</Dialog.Title>
                  <DailyCheckInCard onClose={onClose} />
                </>
              ) : (
                <>
                  <ResponsiveSheetHeader
                    closeAriaLabel="ปิด"
                    titleAlign="start"
                    className="responsive-sheet-header--hub responsive-sheet-header--hub-shell"
                    title={
                      <Dialog.Title className="text-2xl font-medium tracking-tight lg:text-[1.625rem]">
                        {title}
                      </Dialog.Title>
                    }
                  />

                  <div className="cosmic-modal-shell--hub min-h-0 flex-1 overflow-y-auto pb-4 pt-1">
                    <HubModalBody hubId={hubId} options={options} />
                  </div>
                </>
              )}
            </Dialog.Content>
          </>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
