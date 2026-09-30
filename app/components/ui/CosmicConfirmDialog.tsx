"use client";

import React, { useId } from "react";
import { Dialog } from "radix-ui";
import { cn } from "@/lib/utils";

export type CosmicConfirmVariant = "neutral" | "warning" | "destructive";

export interface CosmicConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: CosmicConfirmVariant;
  title: string;
  description?: string;
  /** ไอคอนหรือองค์ประกอบด้านบน (เช่น LogOutIcon) */
  intentIcon?: React.ReactNode;
  summary?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  confirmDisabled?: boolean;
  dismissible?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

/**
 * Confirm modal โฟกัส ~400px — พื้น gradient เทา→ม่วงเข้ม (confirm-dialog.css)
 * ใช้กับยืนยันออกจากระบบ ล้างโพย ฯลฯ
 */
export function CosmicConfirmDialog({
  open,
  onOpenChange,
  variant = "neutral",
  title,
  description,
  intentIcon,
  summary,
  confirmLabel = "ยืนยัน",
  cancelLabel = "ยกเลิก",
  loading = false,
  confirmDisabled = false,
  dismissible = true,
  onConfirm,
  onCancel,
}: CosmicConfirmDialogProps) {
  const descriptionId = useId();

  const handleOpenChange = (next: boolean) => {
    if (!next && !dismissible && loading) return;
    if (!next) onCancel?.();
    onOpenChange(next);
  };

  const handleConfirm = () => {
    void onConfirm();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="cosmic-dialog-overlay fixed inset-0 z-[75]" />
        <Dialog.Content
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            "cosmic-confirm-dialog fixed left-1/2 top-1/2 z-[76] w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2 outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200",
          )}
          onPointerDownOutside={(event) => {
            if (!dismissible || loading) event.preventDefault();
          }}
          onEscapeKeyDown={(event) => {
            if (!dismissible || loading) event.preventDefault();
          }}
        >
          <div className="cosmic-confirm-dialog__body">
            {intentIcon ? (
              <div
                className={cn(
                  "cosmic-confirm-dialog__intent",
                  variant === "warning" && "cosmic-confirm-dialog__intent--warning",
                  variant === "destructive" && "cosmic-confirm-dialog__intent--destructive",
                  variant === "neutral" && "cosmic-confirm-dialog__intent--neutral",
                )}
                aria-hidden="true"
              >
                {intentIcon}
              </div>
            ) : null}

            <Dialog.Title className="cosmic-confirm-dialog__title">{title}</Dialog.Title>

            {description ? (
              <Dialog.Description id={descriptionId} className="cosmic-confirm-dialog__description">
                {description}
              </Dialog.Description>
            ) : null}

            {summary ? <div className="cosmic-confirm-dialog__summary">{summary}</div> : null}
          </div>

          <div className="cosmic-confirm-dialog__footer">
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={loading}
                className="cosmic-confirm-dialog__btn cosmic-confirm-dialog__btn-cancel"
              >
                {cancelLabel}
              </button>
            </Dialog.Close>
            <button
              type="button"
              disabled={loading || confirmDisabled}
              onClick={handleConfirm}
              className={cn(
                "cosmic-confirm-dialog__btn cosmic-confirm-dialog__btn-confirm",
                variant === "destructive" && "cosmic-confirm-dialog__btn-confirm--destructive",
              )}
            >
              {loading ? "กำลังดำเนินการ…" : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
