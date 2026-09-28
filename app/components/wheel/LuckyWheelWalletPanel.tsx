"use client";

import React from "react";
import Link from "next/link";
import {
  LUCKY_WHEEL_GEMS_PER_SPIN,
  LUCKY_WHEEL_TICKETS_PER_SPIN,
  type WheelSpinMethod,
} from "@/app/data/luckyWheelMockData";
import { formatGemsBalance } from "@/app/data/gemsStoreMockData";

interface LuckyWheelWalletPanelProps {
  gemsBalance: number;
  ticketCount: number;
  spinMethod: WheelSpinMethod;
  onSpinMethodChange: (method: WheelSpinMethod) => void;
  spinQty: number;
  onSpinQtyChange: (qty: number) => void;
  onSpin: () => void;
  spinning: boolean;
  canSpin: boolean;
  totalCostLabel: string;
}

/**
 * คอลัมน์กระเป๋าและควบคุมการหมุน — ใช้ใน LuckyWheelPageContent
 */
export function LuckyWheelWalletPanel({
  gemsBalance,
  ticketCount,
  spinMethod,
  onSpinMethodChange,
  spinQty,
  onSpinQtyChange,
  onSpin,
  spinning,
  canSpin,
  totalCostLabel,
}: LuckyWheelWalletPanelProps) {
  const maxByBalance =
    spinMethod === "gems"
      ? Math.max(1, Math.floor(gemsBalance / LUCKY_WHEEL_GEMS_PER_SPIN))
      : Math.max(0, ticketCount);

  const clampQty = (next: number) => {
    const capped = Math.min(99, Math.max(1, next));
    if (spinMethod === "ticket" && ticketCount <= 0) return 1;
    if (spinMethod === "ticket") return Math.min(capped, ticketCount);
    return Math.min(capped, maxByBalance);
  };

  return (
    <aside
      className="lucky-wheel-wallet lucky-wheel-surface-glass cosmic-inset-card lg:self-center"
      aria-label="กระเป๋าและการหมุน"
    >
      <div className="lucky-wheel-wallet__head">
        <div className="flex items-center gap-2">
          <WalletIcon className="h-5 w-5 text-[var(--icon-active)]" />
          <h2 className="text-sm font-medium text-[var(--text-primary)]">กระเป๋าของคุณ</h2>
        </div>
        <Link href="/transactions" className="lucky-wheel-wallet__link text-xs font-medium">
          ประวัติ
        </Link>
      </div>

      <div className="lucky-wheel-wallet__balances">
        <div className="lucky-wheel-wallet__balance-tile">
          <p className="lucky-wheel-wallet__balance-label">เพชร</p>
          <p className="lucky-wheel-wallet__balance-value tabular-nums">{formatGemsBalance(gemsBalance)}</p>
          <Link href="/gems-store" className="lucky-wheel-wallet__mini-cta">
            + เติมเพชร
          </Link>
        </div>
        <div className="lucky-wheel-wallet__balance-tile">
          <p className="lucky-wheel-wallet__balance-label">ตั๋วหมุน</p>
          <p className="lucky-wheel-wallet__balance-value tabular-nums">
            {ticketCount} <span className="text-sm font-medium text-[var(--text-secondary)]">ใบ</span>
          </p>
          <button type="button" className="lucky-wheel-wallet__mini-cta lucky-wheel-wallet__mini-cta--muted">
            รับเพิ่ม
          </button>
        </div>
      </div>

      <div className="lucky-wheel-wallet__section">
        <p className="lucky-wheel-wallet__section-title">เลือกวิธีหมุน</p>
        <div className="lucky-wheel-wallet__methods" role="radiogroup" aria-label="วิธีหมุน">
          <MethodOption
            selected={spinMethod === "gems"}
            onSelect={() => onSpinMethodChange("gems")}
            title="ใช้เพชร"
            detail={`${LUCKY_WHEEL_GEMS_PER_SPIN.toFixed(2)} / ครั้ง`}
          />
          <MethodOption
            selected={spinMethod === "ticket"}
            onSelect={() => onSpinMethodChange("ticket")}
            title="ใช้ตั๋ว"
            detail={`${LUCKY_WHEEL_TICKETS_PER_SPIN} ใบ / ครั้ง`}
            disabled={ticketCount <= 0}
          />
        </div>
      </div>

      <div className="lucky-wheel-wallet__section">
        <p className="lucky-wheel-wallet__section-title">จำนวนครั้ง</p>
        <div className="lucky-wheel-wallet__stepper">
          <button
            type="button"
            className="lucky-wheel-wallet__stepper-btn"
            aria-label="ลดจำนวน"
            disabled={spinning || spinQty <= 1}
            onClick={() => onSpinQtyChange(clampQty(spinQty - 1))}
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={99}
            value={spinQty}
            onChange={(e) => onSpinQtyChange(clampQty(Number(e.target.value) || 1))}
            className="lucky-wheel-wallet__stepper-input tabular-nums"
            aria-label="จำนวนครั้งที่หมุน"
            disabled={spinning}
          />
          <button
            type="button"
            className="lucky-wheel-wallet__stepper-btn"
            aria-label="เพิ่มจำนวน"
            disabled={spinning || (spinMethod === "ticket" ? spinQty >= ticketCount : spinQty >= maxByBalance)}
            onClick={() => onSpinQtyChange(clampQty(spinQty + 1))}
          >
            +
          </button>
          <button
            type="button"
            className="lucky-wheel-wallet__stepper-max"
            disabled={spinning || maxByBalance <= 0}
            onClick={() => onSpinQtyChange(clampQty(maxByBalance))}
          >
            MAX
          </button>
        </div>
      </div>

      <button
        type="button"
        className="lucky-wheel-wallet__spin-cta"
        disabled={!canSpin || spinning}
        onClick={onSpin}
      >
        <span>{spinning ? "กำลังหมุน…" : "หมุนเลย"}</span>
        <span className="lucky-wheel-wallet__spin-cost">{totalCostLabel}</span>
      </button>
    </aside>
  );
}

function MethodOption({
  selected,
  onSelect,
  title,
  detail,
  disabled,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  detail: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={`lucky-wheel-wallet__method ${selected ? "lucky-wheel-wallet__method--selected" : ""}`}
    >
      <span className="lucky-wheel-wallet__method-check" aria-hidden="true">
        {selected ? "✓" : ""}
      </span>
      <span className="lucky-wheel-wallet__method-body">
        <span className="block text-xs font-medium leading-tight text-[var(--text-primary)] sm:text-sm">{title}</span>
        <span className="block text-xs leading-normal text-[var(--text-secondary)]">{detail}</span>
      </span>
    </button>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M4 8a3 3 0 0 1 3-3h11v14H7a3 3 0 0 1-3-3V8Z" strokeLinejoin="round" />
      <path d="M4 8h14M16 12h3" strokeLinecap="round" />
    </svg>
  );
}
