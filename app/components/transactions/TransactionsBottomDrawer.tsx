"use client";

import React, { useState } from "react";
import { Dialog } from "radix-ui";
import type { TransactionKind } from "@/app/types/transaction";
import { TransactionsPageContent } from "./TransactionsPageContent";
import { CloseIcon } from "../ui/Icons";
import {
  responsiveSheetCloseButtonClass,
  responsiveSheetContentClass,
  responsiveSheetOverlayClass,
} from "../ui/responsiveSheetDialog";
import { useAuth } from "../auth/AuthProvider";
import { ModalDesktopTitleBlock } from "../ui/ModalTitleLeadingIcon";

interface TransactionsBottomDrawerProps {
  isOpen: boolean;
  initialKind: TransactionKind;
  onClose: () => void;
}

/**
 * Bottom sheet ประวัติธุรกรรม — tab ฝาก / ถอน เท่านั้น
 * ถูก mount ใน TransactionsProvider
 */
export function TransactionsBottomDrawer({
  isOpen,
  initialKind,
  onClose,
}: TransactionsBottomDrawerProps) {
  const { isAuthenticated } = useAuth();
  const [userKind, setUserKind] = useState<TransactionKind | null>(null);
  const activeKind = userKind ?? initialKind;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setUserKind(null);
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={responsiveSheetOverlayClass("z-[60]")} />

        <Dialog.Content
          aria-describedby={undefined}
          className={responsiveSheetContentClass(
            "z-[60] max-h-[min(92dvh,720px)] flex-col overflow-hidden",
            { variant: "wide" },
          )}
        >
          <Dialog.Close asChild>
            <button
              type="button"
              className={responsiveSheetCloseButtonClass("absolute right-3 top-4 z-20")}
              aria-label="ปิดรายการธุรกรรม"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </Dialog.Close>

          <div className="flex min-h-0 flex-1 flex-col px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-14 sm:px-5">
            <ModalDesktopTitleBlock
              titleIconId="transactions"
              title={
                <Dialog.Title className="cosmic-type-sheet-title text-2xl sm:text-2xl">
                  รายการธุรกรรม
                </Dialog.Title>
              }
              subtitle={<p className="cosmic-type-sheet-desc mt-1">ฝากและถอนของคุณ</p>}
            />

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <TransactionsPageContent
                embedded
                activeKind={activeKind}
                onSelectKind={setUserKind}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
