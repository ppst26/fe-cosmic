"use client";

import React from "react";
import type { ProfileUser } from "@/app/types/auth";
import { PROFILE_HUB_STATS_MOCK } from "@/app/data/profileHubMockData";
import { getVipRankTier, VIP_PLAYER_MOCK } from "@/app/data/vipMockData";
import { ProfileHubHeader } from "./ProfileHubHeader";
import { ProfileHubRow } from "./ProfileHubAccordion";
import {
  CrownIcon,
  DiamondGemIcon,
  GiftIcon,
  HistoryIcon,
  ProfileNavIcon,
  PromoTagIcon,
  RefundIcon,
  UsersGroupIcon,
  LogOutIcon,
} from "../ui/Icons";

interface ProfileHubBodyProps {
  profile: ProfileUser;
  onOpenAccountDetail: () => void;
  onOpenTransactions: () => void;
  onOpenLossRebate: () => void;
  onOpenVip: () => void;
  onLogout: () => void;
  /** false เมื่อหัวอยู่ในแถบม่วงของ bottom sheet */
  showHeader?: boolean;
}

const stats = PROFILE_HUB_STATS_MOCK;
const vipRankLabel = getVipRankTier(VIP_PLAYER_MOCK.currentRankId).label;

function formatThb(value: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDiamonds(value: number): string {
  return new Intl.NumberFormat("th-TH").format(value);
}

/**
 * เนื้อหา hub โปรไฟล์ — รายการเมนูแบน (ProfileSlideOverCard)
 */
export function ProfileHubBody({
  profile,
  onOpenAccountDetail,
  onOpenTransactions,
  onOpenLossRebate,
  onOpenVip,
  onLogout,
  showHeader = true,
}: ProfileHubBodyProps) {
  const rowLayout = showHeader ? "default" : "sheet";

  return (
    <div className="profile-hub-body flex flex-col pb-1">
      {showHeader ? <ProfileHubHeader profile={profile} /> : null}

      <nav className="profile-hub-nav flex flex-col" aria-label="เมนูโปรไฟล์">
        <ProfileHubRow
          layout={rowLayout}
          icon={<ProfileNavIcon className="h-5 w-5" />}
          title="ข้อมูลบัญชี"
          showChevron
          onClick={onOpenAccountDetail}
        />
        <ProfileHubRow
          layout={rowLayout}
          icon={<CrownIcon className="h-5 w-5 text-[#ffe66d]" />}
          title="ระดับชั้น VIP"
          showChevron
          onClick={onOpenVip}
          trailing={
            <span className="text-xs font-medium text-[#ffe66d]">{vipRankLabel}</span>
          }
        />
        <ProfileHubRow
          layout={rowLayout}
          icon={<HistoryIcon className="h-5 w-5" />}
          title="รายการฝากถอน"
          showChevron
          onClick={onOpenTransactions}
        />
        <ProfileHubRow
          layout={rowLayout}
          icon={<DiamondGemIcon className="h-5 w-5" />}
          title="เพชรของฉัน"
          trailing={
            <span className="text-sm font-medium tabular-nums text-[var(--text-secondary)]">
              {formatDiamonds(stats.diamonds)}
            </span>
          }
        />
        <ProfileHubRow
          layout={rowLayout}
          icon={<RefundIcon className="h-5 w-5" />}
          title="โบนัสยอดเสีย"
          showChevron
          onClick={onOpenLossRebate}
          trailing={
            <span className="text-sm font-medium tabular-nums text-[var(--text-secondary)]">
              {formatThb(stats.lossBonusThb)}
            </span>
          }
        />
        <ProfileHubRow
          layout={rowLayout}
          icon={<UsersGroupIcon className="h-5 w-5" />}
          title="ยอด Affiliate"
          trailing={
            <span className="text-sm font-medium tabular-nums text-[var(--text-secondary)]">
              {formatThb(stats.affiliateBalanceThb)}
            </span>
          }
        />
        <ProfileHubRow
          layout={rowLayout}
          icon={<PromoTagIcon className="h-5 w-5" />}
          title="โปรโมชั่นที่ใช้อยู่"
          trailing={
            <span className="max-w-[46%] truncate text-xs font-medium text-[var(--text-secondary)]">
              {stats.activePromotionLabel}
            </span>
          }
        />
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="profile-hub-logout mt-2 flex w-full items-center gap-3 rounded-[var(--radius-control)] px-1 py-2.5 text-left text-sm font-medium transition-colors"
      >
        <LogOutIcon className="h-5 w-5 shrink-0" />
        ออกจากระบบ
      </button>
    </div>
  );
}
