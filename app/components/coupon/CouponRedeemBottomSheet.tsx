"use client";

import React, { useState } from "react";
import { Dialog } from "radix-ui";
import { PromoTicketIcon } from "../ui/Icons";
import { ResponsiveSheetHeader } from "../ui/ResponsiveSheetHeader";
import { COSMIC_SHEET_FIELD_ROW } from "../ui/cosmicButtonClasses";
import {
  RESPONSIVE_SHEET_HANDLE_CLASS,
  responsiveSheetContentClass,
  responsiveSheetOverlayClass,
} from "../ui/responsiveSheetDialog";
import { COUPON_CODE_MAX_LENGTH, sanitizeCouponCode } from "@/lib/fieldInput";

interface CouponRedeemBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

/** โค้ด mock สำหรับทดสอบแลกในหน้ UI */
const MOCK_VALID_CODES = new Set(["COSMIC100", "FREEGEMS", "WELCOME50"]);

/**
 * Bottom sheet แลกคูปอง — เปิดจากเมนู "คูปอง" ใน RightMenuDrawer
 */
export function CouponRedeemBottomSheet({ isOpen, onClose }: CouponRedeemBottomSheetProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setCode("");
    setError(null);
    setSuccess(null);
    setSubmitting(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const normalized = sanitizeCouponCode(code);
    if (!normalized) {
      setError("กรุณากรอกรหัสคูปอง");
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      if (MOCK_VALID_CODES.has(normalized)) {
        setSuccess("แลกเครดิตฟรีสำเร็จ — ยอดจะเข้ากระเป๋าในไม่กี่นาที (mock)");
        setCode("");
        return;
      }
      setError("รหัสคูปองไม่ถูกต้องหรือหมดอายุแล้ว");
    }, 600);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={responsiveSheetOverlayClass()} />
        <Dialog.Content
          aria-describedby="coupon-redeem-desc"
          className={responsiveSheetContentClass("max-h-[min(85dvh,520px)] overflow-y-auto")}
        >
          <div className={RESPONSIVE_SHEET_HANDLE_CLASS} aria-hidden="true" />

          <ResponsiveSheetHeader
            closeAriaLabel="ปิดหน้าแลกคูปอง"
            titleIconId="coupon"
            titleIconDesktopOnly
            title={<Dialog.Title className="cosmic-type-sheet-title text-xl sm:text-2xl">แลกคูปอง</Dialog.Title>}
            subtitle={
              <p id="coupon-redeem-desc" className="cosmic-type-sheet-desc mt-1">
                โค้ดสำหรับแลกเครดิตฟรี
              </p>
            }
          />

          <div className="flex flex-col items-center pt-1 text-center">
            <CouponTicketsGraphic className="mb-3 h-24 w-40 sm:h-28 sm:w-44" />
          </div>

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <p
                className="rounded-[var(--radius-control)] bg-[var(--surface-selected)] px-3 py-2 text-sm text-[var(--destructive)]"
                role="alert"
              >
                {error}
              </p>
            )}
            {success && (
              <p
                className="rounded-[var(--radius-control)] bg-[#0f3d2e]/80 px-3 py-2 text-sm text-[var(--success)]"
                role="status"
              >
                {success}
              </p>
            )}

            <div className="space-y-1.5">
              <label htmlFor="coupon-code" className="cosmic-type-sheet-label">
                รหัสคูปอง
              </label>
              <div className={COSMIC_SHEET_FIELD_ROW}>
                <PromoTicketIcon className="h-5 w-5 shrink-0 text-[var(--border-active)]" />
                <input
                  id="coupon-code"
                  type="text"
                  autoComplete="off"
                  value={code}
                  maxLength={COUPON_CODE_MAX_LENGTH}
                  onChange={(event) => setCode(sanitizeCouponCode(event.target.value))}
                  placeholder="กรอกโค้ดคูปอง"
                  className="min-w-0 flex-1 bg-transparent text-sm uppercase outline-none placeholder:normal-case placeholder:text-[var(--text-muted)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="cosmic-sheet-submit"
            >
              {submitting ? "กำลังตรวจสอบ..." : "แลกเครดิตฟรี"}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CouponTicketsGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 96" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="couponTicketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-highlight)" />
          <stop offset="100%" stopColor="var(--accent-primary)" />
        </linearGradient>
      </defs>
      <ellipse cx="118" cy="72" rx="10" ry="6" fill="#facc15" opacity="0.9" />
      <ellipse cx="134" cy="64" rx="7" ry="4" fill="#fde047" opacity="0.85" />
      <g transform="rotate(-12 52 48)">
        <rect x="18" y="28" width="72" height="40" rx="6" fill="url(#couponTicketGrad)" stroke="var(--accent-highlight)" strokeWidth="1.5" />
        <circle cx="18" cy="48" r="6" fill="#121127" />
        <circle cx="90" cy="48" r="6" fill="#121127" />
        <path d="M36 40h12v16H36zM54 40h12v16H54z" fill="#ede9fe" opacity="0.5" />
        <path d="M42 44 48 52 42 60" stroke="#fde047" strokeWidth="2" fill="none" />
      </g>
      <g transform="rotate(10 88 40)">
        <rect x="72" y="22" width="68" height="38" rx="6" fill="url(#couponTicketGrad)" stroke="var(--accent-muted)" strokeWidth="1.5" opacity="0.95" />
        <circle cx="72" cy="41" r="5.5" fill="#121127" />
        <circle cx="140" cy="41" r="5.5" fill="#121127" />
        <path
          d="M92 36l4 4-4 4-4-4 4-4Zm12 0l4 4-4 4-4-4 4-4Zm-6 10l4 4-4 4-4-4 4-4Z"
          fill="#fde047"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}
