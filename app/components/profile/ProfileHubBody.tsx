"use client";

import React from "react";
import type { ProfileUser } from "@/app/types/auth";
import { getVipRankTier } from "@/app/data/vipMockData";
import { useProfileHubStats, useVipPlayer } from "@/app/hooks/api/member";
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
import { COSMIC_BTN_LOGOUT } from "../ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";
import { valueClass } from "@/lib/semanticValue";

interface ProfileHubBodyProps {
  profile: ProfileUser;
  onOpenAccountDetail: () => void;
  onOpenTransactions: () => void;
  onOpenLossRebate: () => void;
  onOpenVip: () => void;
  onLogout: () => void;
  /** false เมื่อหัวอยู่ในแถบม่วงของ bottom sheet */
  showHeader?: boolean;
  onProfileUpdated?: (profile: ProfileUser) => void;
}

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
  onProfileUpdated,
}: ProfileHubBodyProps) {
  /** สถิติ / ระดับ VIP — แสดง "—" ระหว่างโหลด (แถวคงความสูงเดิม) */
  const stats = useProfileHubStats().data;
  const vipPlayer = useVipPlayer().data;
  const vipRankLabel = vipPlayer ? getVipRankTier(vipPlayer.currentRankId).label : "—";
  const rowLayout = showHeader ? "default" : "sheet";

  return (
    <div className="profile-hub-body flex flex-col pb-1">
      {showHeader ? (
        <ProfileHubHeader profile={profile} onProfileUpdated={onProfileUpdated} />
      ) : null}

      <nav className="profile-hub-nav flex flex-col gap-0.5" aria-label="เมนูโปรไฟล์">
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
            <span className="text-sm font-medium text-[#ffe66d]">{vipRankLabel}</span>
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
            <span className={valueClass("accent")}>
              {stats ? formatDiamonds(stats.diamonds) : "—"}
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
            <span className={valueClass("reward")}>
              {stats ? formatThb(stats.lossBonusThb) : "—"}
            </span>
          }
        />
        <ProfileHubRow
          layout={rowLayout}
          icon={<UsersGroupIcon className="h-5 w-5" />}
          title="ยอด Affiliate"
          trailing={
            <span className={valueClass("reward")}>
              {stats ? formatThb(stats.affiliateBalanceThb) : "—"}
            </span>
          }
        />
        <ProfileHubRow
          layout={rowLayout}
          icon={<PromoTagIcon className="h-5 w-5" />}
          title="โปรโมชั่นที่ใช้อยู่"
          trailing={
            <span className="max-w-[46%] truncate text-[var(--text-secondary)]">
              {stats ? stats.activePromotionLabel : "—"}
            </span>
          }
        />
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className={cn(COSMIC_BTN_LOGOUT, "profile-hub-logout mt-3")}
      >
        <LogOutIcon className="h-5 w-5 shrink-0" />
        ออกจากระบบ
      </button>
    </div>
  );
}
