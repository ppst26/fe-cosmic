"use client";

import React from "react";
import { Dialog } from "radix-ui";
import { ResponsiveSheetHeader } from "../ui/ResponsiveSheetHeader";
import {
  RESPONSIVE_SHEET_HANDLE_CLASS,
  responsiveSheetContentClass,
  responsiveSheetOverlayClass,
} from "../ui/responsiveSheetDialog";
import { NotificationCenterPanel } from "./NotificationCenterPanel";

interface NotificationMobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sheet แจ้งเตือนมือถือ — เปิดจากไอคอนกระดิ่งใน Header
 */
export function NotificationMobileSheet({ isOpen, onClose }: NotificationMobileSheetProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={responsiveSheetOverlayClass("z-[75]")} />
        <Dialog.Content
          aria-describedby={undefined}
          className={responsiveSheetContentClass(
            "z-[75] flex max-h-[min(88dvh,640px)] min-h-0 flex-col gap-0 px-4 pb-5 pt-2 sm:px-5",
            { variant: "hubCompact" },
          )}
        >
          <div className={RESPONSIVE_SHEET_HANDLE_CLASS} aria-hidden />
          <ResponsiveSheetHeader
            closeAriaLabel="ปิดการแจ้งเตือน"
            title={
              <Dialog.Title className="cosmic-type-sheet-title text-xl sm:text-2xl">
                การแจ้งเตือน
              </Dialog.Title>
            }
          />
          <div className="min-h-0 flex-1 overflow-y-auto pt-3">
            <NotificationCenterPanel variant="sheet" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
