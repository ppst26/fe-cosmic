"use client";

import React, { useMemo } from "react";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCashbackCurrency } from "@/app/data/cashbackMockData";
import { buildReferralLink } from "@/app/data/referralMockData";
import { fetchCashbackPanels } from "@/lib/api/cashback";
import { fetchReferralOverview } from "@/lib/api/referral";
import { useAuth } from "../auth/AuthProvider";
import { useDeposit } from "../deposit/DepositProvider";
import { useWithdraw } from "../withdraw/WithdrawProvider";
import { CopyIcon, DepositNavIcon, WithdrawNavIcon } from "../ui/Icons";
import { MenuItemIcon } from "./MenuItemIcon";
import { cn } from "@/lib/utils";

interface MenuDrawerMobileToolbarProps {
  className?: string;
  onClose: () => void;
  onRequireLogin: () => void;
}

/**
 * แถบฝาก/ถอน · โบนัสคืนยอด · ลิงก์แนะนำ — เมนูมือถือ (RightMenuDrawer)
 */
export function MenuDrawerMobileToolbar({
  className,
  onClose,
  onRequireLogin,
}: MenuDrawerMobileToolbarProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { openDeposit } = useDeposit();
  const { openWithdraw } = useWithdraw();
  const { showToast } = useToast();

  const overview = fetchReferralOverview();
  const cashbackPanels = fetchCashbackPanels();
  const referralLink = buildReferralLink(overview.refCode);

  const playBonusLabel = useMemo(() => {
    if (!isAuthenticated || isLoading) return "—";
    return formatCashbackCurrency(cashbackPanels.play.claimableThb);
  }, [isAuthenticated, isLoading, cashbackPanels.play.claimableThb]);

  const lossBonusLabel = useMemo(() => {
    if (!isAuthenticated || isLoading) return "—";
    return formatCashbackCurrency(cashbackPanels.loss.claimableThb);
  }, [isAuthenticated, isLoading, cashbackPanels.loss.claimableThb]);

  const goCashback = (tab: "play" | "loss") => {
    if (!isAuthenticated) {
      onClose();
      window.setTimeout(() => onRequireLogin(), 0);
      return;
    }
    onClose();
    router.push(tab === "loss" ? "/cashback?tab=loss" : "/cashback");
  };

  const runAuthed = (action: () => void) => {
    if (isLoading) return;
    if (!isAuthenticated) {
      onClose();
      window.setTimeout(() => onRequireLogin(), 0);
      return;
    }
    onClose();
    window.setTimeout(action, 0);
  };

  const copyReferralLink = async () => {
    if (!isAuthenticated) {
      onClose();
      window.setTimeout(() => onRequireLogin(), 0);
      return;
    }
    try {
      await navigator.clipboard.writeText(referralLink);
      showToast("คัดลอกลิงก์แล้ว", "success", 2500);
    } catch {
      showToast("ไม่สามารถคัดลอกลิงก์ได้", "error");
    }
  };

  return (
    <div className={cn("menu-drawer-mobile-toolbar flex w-full min-w-0 max-w-full flex-col gap-2", className)}>
      <div className="menu-drawer-quick-actions grid w-full min-w-0 grid-cols-2 gap-1.5">
        <button
          type="button"
          className="menu-drawer-quick-actions__btn menu-drawer-quick-actions__btn--deposit menu-enter-item"
          style={{ "--menu-enter-i": 0 } as React.CSSProperties}
          onClick={() => runAuthed(() => openDeposit())}
        >
          <DepositNavIcon className="menu-drawer-quick-actions__icon" aria-hidden />
          <span className="menu-drawer-quick-actions__label">ฝากเงิน</span>
        </button>
        <button
          type="button"
          className="menu-drawer-quick-actions__btn menu-drawer-quick-actions__btn--withdraw menu-enter-item"
          style={{ "--menu-enter-i": 1 } as React.CSSProperties}
          onClick={() => runAuthed(() => openWithdraw())}
        >
          <WithdrawNavIcon className="menu-drawer-quick-actions__icon" aria-hidden />
          <span className="menu-drawer-quick-actions__label">ถอนเงิน</span>
        </button>
      </div>

      <div className="menu-drawer-income-duo grid w-full min-w-0 grid-cols-2 gap-0">
        <Link
          href="/cashback"
          className="menu-drawer-income-card menu-enter-item"
          style={{ "--menu-enter-i": 2 } as React.CSSProperties}
          onClick={(event) => {
            event.preventDefault();
            goCashback("play");
          }}
        >
          <span className="menu-drawer-income-card__label">โบนัสยอดเล่น</span>
          <span className="menu-drawer-income-card__value">{playBonusLabel}</span>
          <span className="menu-drawer-income-card__chevron" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
        <Link
          href="/cashback?tab=loss"
          className="menu-drawer-income-card menu-enter-item"
          style={{ "--menu-enter-i": 3 } as React.CSSProperties}
          onClick={(event) => {
            event.preventDefault();
            goCashback("loss");
          }}
        >
          <span className="menu-drawer-income-card__label">โบนัสยอดเสีย</span>
          <span className="menu-drawer-income-card__value">{lossBonusLabel}</span>
          <span className="menu-drawer-income-card__chevron" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>

      <div
        className="menu-drawer-referral-bar menu-enter-item flex w-full min-w-0 max-w-full items-center gap-1.5"
        style={{ "--menu-enter-i": 4 } as React.CSSProperties}
      >
        <MenuItemIcon iconId="referral" variant="asset" className="h-7 w-7 shrink-0 object-contain" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-[var(--text-secondary)]">ลิงก์แนะนำเพื่อน</p>
          <p className="truncate text-xs font-medium text-[var(--text-primary)] tabular-nums">
            {isAuthenticated ? referralLink : "เข้าสู่ระบบเพื่อดูลิงก์"}
          </p>
        </div>
        <button
          type="button"
          className="menu-drawer-referral-bar__copy"
          aria-label="คัดลอกลิงก์แนะนำเพื่อน"
          onClick={() => void copyReferralLink()}
        >
          <CopyIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
