"use client";

import React from "react";
import Image from "next/image";
import { Dialog } from "radix-ui";
import { fetchGemsStore } from "@/lib/api/gemsStore";
import { cn } from "@/lib/utils";
import { formatGemsBalance } from "@/lib/format";
import type { GemsStorePackage } from "@/app/types/reward";

function formatCreditAmount(value: number): string {
  return new Intl.NumberFormat("th-TH").format(value);
}

export interface GemsRedeemConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pkg: GemsStorePackage | null;
  gemsBalance: number;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
}

/**
 * ยืนยันแลกเพชรเป็นเครดิต — เปิดจาก GemsStorePageContent ก่อนหักยอด
 */
export function GemsRedeemConfirmDialog({
  open,
  onOpenChange,
  pkg,
  gemsBalance,
  loading = false,
  onConfirm,
}: GemsRedeemConfirmDialogProps) {
  const gemAsset = fetchGemsStore().gemAsset;
  const credits = pkg?.credits ?? 0;
  const gemsCost = pkg?.gemsCost ?? 0;
  const balanceAfter = gemsBalance - gemsCost;

  const handleConfirm = () => {
    void onConfirm();
  };

  return (
    <Dialog.Root open={open && pkg != null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="cosmic-dialog-overlay fixed inset-0 z-[75]" />
        <Dialog.Content
          className={cn(
            "cosmic-confirm-dialog gems-redeem-confirm-dialog fixed left-1/2 top-1/2 z-[76] w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2 outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200",
          )}
          onPointerDownOutside={(event) => {
            if (loading) event.preventDefault();
          }}
          onEscapeKeyDown={(event) => {
            if (loading) event.preventDefault();
          }}
        >
          {pkg ? (
            <>
              <div className="gems-redeem-confirm-dialog__body">
                <div className="gems-redeem-confirm-dialog__panel">
                  <div className="gems-redeem-confirm-dialog__head">
                    <div className="gems-redeem-confirm-dialog__head-copy min-w-0">
                      <Dialog.Title className="gems-redeem-confirm-dialog__title">
                        เครดิต {formatCreditAmount(credits)}
                      </Dialog.Title>
                      <p className="gems-redeem-confirm-dialog__subtitle">
                        ใช้ {formatGemsBalance(gemsCost)} เพชร แลกเป็น เครดิต {formatCreditAmount(credits)}
                      </p>
                    </div>
                    <div className="gems-redeem-confirm-dialog__reward shrink-0 text-right">
                      <p className="gems-redeem-confirm-dialog__reward-amount">
                        +{formatCreditAmount(credits)}
                      </p>
                      <p className="gems-redeem-confirm-dialog__reward-label">เครดิต</p>
                    </div>
                  </div>

                  <div className="gems-redeem-confirm-dialog__divider" role="presentation" />

                  <dl className="gems-redeem-confirm-dialog__rows">
                    <div className="gems-redeem-confirm-dialog__row">
                      <dt className="gems-redeem-confirm-dialog__row-label">
                        <span className="gems-redeem-confirm-dialog__gem-icon" aria-hidden="true">
                          <Image src={gemAsset} alt="" fill sizes="18px" className="object-contain" />
                        </span>
                        เพชรที่ใช้
                      </dt>
                      <dd className="gems-redeem-confirm-dialog__row-value tabular-nums">
                        {formatGemsBalance(gemsCost)}
                      </dd>
                    </div>
                    <div className="gems-redeem-confirm-dialog__row">
                      <dt className="gems-redeem-confirm-dialog__row-label">
                        <span className="gems-redeem-confirm-dialog__gem-icon" aria-hidden="true">
                          <Image src={gemAsset} alt="" fill sizes="18px" className="object-contain" />
                        </span>
                        คงเหลือหลังแลก
                      </dt>
                      <dd className="gems-redeem-confirm-dialog__row-value tabular-nums">
                        {formatGemsBalance(balanceAfter)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="cosmic-confirm-dialog__footer">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    disabled={loading}
                    className="cosmic-confirm-dialog__btn cosmic-confirm-dialog__btn-cancel"
                  >
                    ยกเลิก
                  </button>
                </Dialog.Close>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleConfirm}
                  className="cosmic-confirm-dialog__btn cosmic-confirm-dialog__btn-confirm"
                >
                  {loading ? "กำลังดำเนินการ…" : "ยืนยัน"}
                </button>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
