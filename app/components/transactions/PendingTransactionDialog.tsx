"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import type { PendingTransactionPayload } from "@/app/data/pendingTransactionMockData";
import { CloseIcon, CopyIcon } from "../ui/Icons";
import { COSMIC_BTN_PRIMARY } from "../ui/cosmicButtonClasses";
import { responsiveSheetCloseButtonClass } from "../ui/responsiveSheetDialog";
import { ModalDesktopTitleBlock } from "../ui/ModalTitleLeadingIcon";

interface PendingTransactionDialogProps {
  payload: PendingTransactionPayload | null;
  onClose: () => void;
}

/**
 * Dialog รายการรอดำเนินการ — ฝาก/ถอน (mock)
 */
export function PendingTransactionDialog({ payload, onClose }: PendingTransactionDialogProps) {
  const open = payload !== null;
  const [copiedRef, setCopiedRef] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setCopiedRef(false);
      onClose();
    }
  };

  const handleCopyRef = async () => {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload.referenceCopyValue);
      setCopiedRef(true);
      window.setTimeout(() => setCopiedRef(false), 2000);
    } catch {
      /* clipboard ไม่พร้อม */
    }
  };

  if (!payload) {
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="cosmic-dialog-overlay fixed inset-0 z-[80] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        />
        <Dialog.Content
          aria-describedby="pending-tx-desc"
          className="cosmic-modal-shell fixed left-1/2 top-1/2 z-[85] w-[min(calc(100vw-1.5rem),400px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden px-5 pb-5 pt-4 text-[var(--text-primary)] shadow-[0_24px_56px_rgba(0,0,0,0.65),0_4px_16px_rgba(0,0,0,0.3)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200"
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
            {payload.kind === "deposit" ? (
              <PendingDepositGraphic className="mb-3 h-24 w-24" />
            ) : (
              <PendingWithdrawGraphic className="mb-3 h-24 w-24" />
            )}
            <ModalDesktopTitleBlock
              titleIconId="transactions"
              className="items-center justify-center"
              title={
                <Dialog.Title className="text-lg font-medium sm:text-xl">{payload.title}</Dialog.Title>
              }
              subtitle={
                <p id="pending-tx-desc" className="mt-1 text-sm text-[var(--text-secondary)]">
                  {payload.subtitle}
                </p>
              }
            />
          </div>

          <p className="mt-6 text-center text-4xl font-medium tracking-tight text-[var(--text-primary)] sm:text-[2.75rem]">
            <span className="text-[var(--icon-active)]">฿</span> {payload.amountDisplay}
          </p>

          <hr className="my-5 border-[var(--border-subtle)]/45" />

          <dl className="space-y-3 text-sm">
            {payload.rows.map((row) => {
              const isRef = row.label === "เลขอ้างอิง";
              return (
                <div key={row.label} className="flex items-start justify-between gap-3">
                  <dt className="shrink-0 text-[var(--text-muted)]">{row.label}</dt>
                  <dd className="flex min-w-0 items-center justify-end gap-1.5 text-right font-medium text-[var(--text-primary)]">
                    <span className="truncate">{row.value}</span>
                    {isRef && (
                      <button
                        type="button"
                        onClick={handleCopyRef}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)]/50 text-[var(--icon-default)] hover:border-[var(--border-active)]/50 hover:text-[var(--icon-active)]"
                        aria-label="คัดลอกเลขอ้างอิง"
                      >
                        <CopyIcon className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
          {copiedRef && (
            <p className="mt-2 text-right text-xs text-[var(--success)]" role="status">
              คัดลอกเลขอ้างอิงแล้ว
            </p>
          )}

          <Dialog.Close asChild>
            <button
              type="button"
              className={`${COSMIC_BTN_PRIMARY} mt-6 flex h-12 w-full items-center justify-center text-base`}
            >
              เรียบร้อย
            </button>
          </Dialog.Close>

          <Link
            href={payload.historyHref}
            onClick={onClose}
            className="mt-4 block text-center text-sm font-medium text-[var(--text-primary)] underline underline-offset-4"
          >
            ดูประวัติรายการ
          </Link>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PendingDepositGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <ellipse cx="48" cy="78" rx="28" ry="8" fill="#000" opacity="0.35" />
      <rect x="22" y="36" width="52" height="38" rx="10" fill="#5b21b6" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="22" y="42" width="52" height="8" rx="2" fill="#4c1d95" />
      <circle cx="48" cy="24" r="14" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
      <path d="M48 18v12M42 24h12" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
      <circle cx="68" cy="68" r="10" fill="#312e81" stroke="#fde047" strokeWidth="1.5" />
      <path d="M68 64v5l2 2" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="68" cy="64" r="1.5" fill="#fde047" />
    </svg>
  );
}

function PendingWithdrawGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <ellipse cx="48" cy="78" rx="28" ry="8" fill="#000" opacity="0.35" />
      <path d="M28 38 48 28 68 38 V58 C68 68 48 76 48 76 C48 76 28 68 28 58 Z" fill="#6d28d9" stroke="#c4b5fd" strokeWidth="1.5" />
      <path d="M58 48 H78 L74 44 M78 48 74 52" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="68" cy="62" r="10" fill="#312e81" stroke="#fde047" strokeWidth="1.5" />
      <path d="M68 58v5l2 2" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="68" cy="58" r="1.5" fill="#fde047" />
    </svg>
  );
}
