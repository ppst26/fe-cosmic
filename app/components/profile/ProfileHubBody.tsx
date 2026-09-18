"use client";

import React, { useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { PROFILE_HUB_STATS_MOCK } from "@/app/data/profileHubMockData";
import { getVipRankTier, VIP_PLAYER_MOCK } from "@/app/data/vipMockData";
import { ProfileHubHeader } from "./ProfileHubHeader";
import { ProfileHubAccordion, ProfileHubRow } from "./ProfileHubAccordion";
import {
  CrownIcon,
  DiamondGemIcon,
  GiftIcon,
  HistoryIcon,
  ProfileNavIcon,
  PromoTagIcon,
  RefundIcon,
  UsersGroupIcon,
  WalletCryptoIcon,
  LogOutIcon,
} from "../ui/Icons";

interface ProfileHubBodyProps {
  profile: ProfileUser;
  onOpenAccountDetail: () => void;
  onOpenTransactions: () => void;
  onOpenLossRebate: () => void;
  onOpenVip: () => void;
  onLogout: () => void;
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
 * การ์ด hub โปรไฟล์ — หัว + accordion 3 กลุ่ม
 */
export function ProfileHubBody({
  profile,
  onOpenAccountDetail,
  onOpenTransactions,
  onOpenLossRebate,
  onOpenVip,
  onLogout,
}: ProfileHubBodyProps) {
  const [expanded, setExpanded] = useState({
    account: true,
    finance: false,
    privileges: false,
  });

  const toggle = (key: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="profile-hub-body flex flex-col gap-2 pb-1">
      <ProfileHubHeader profile={profile} />

      <ProfileHubAccordion
        title="บัญชีของฉัน"
        headerIcon={<ProfileNavIcon className="h-4 w-4" />}
        expanded={expanded.account}
        onToggle={() => toggle("account")}
      >
        <ProfileHubRow
          icon={<ProfileNavIcon className="h-4 w-4" />}
          title="ข้อมูลบัญชี"
          showChevron
          onClick={onOpenAccountDetail}
        />
        <ProfileHubRow
          icon={<CrownIcon className="h-4 w-4 text-[#ffe66d]" />}
          title="ระดับชั้น VIP"
          showChevron
          onClick={onOpenVip}
          trailing={
            <span className="text-xs font-extrabold text-[#ffe66d]">{vipRankLabel}</span>
          }
        />
      </ProfileHubAccordion>

      <ProfileHubAccordion
        title="การเงิน"
        headerIcon={<WalletCryptoIcon className="h-4 w-4" />}
        expanded={expanded.finance}
        onToggle={() => toggle("finance")}
      >
        <ProfileHubRow
          icon={<HistoryIcon className="h-4 w-4" />}
          title="รายการฝากถอน"
          showChevron
          onClick={onOpenTransactions}
        />
        <ProfileHubRow
          icon={<DiamondGemIcon className="h-4 w-4" />}
          title="เพชรของฉัน"
          trailing={
            <span className="text-sm font-bold tabular-nums text-[var(--text-primary)]">
              {formatDiamonds(stats.diamonds)}
            </span>
          }
        />
        <ProfileHubRow
          icon={<RefundIcon className="h-4 w-4" />}
          title="โบนัสยอดเสีย"
          showChevron
          onClick={onOpenLossRebate}
          trailing={
            <span className="text-sm font-bold tabular-nums text-[var(--text-primary)]">
              {formatThb(stats.lossBonusThb)}
            </span>
          }
        />
      </ProfileHubAccordion>

      <ProfileHubAccordion
        title="สิทธิพิเศษ"
        headerIcon={<GiftIcon className="h-4 w-4" />}
        expanded={expanded.privileges}
        onToggle={() => toggle("privileges")}
      >
        <ProfileHubRow
          icon={<UsersGroupIcon className="h-4 w-4" />}
          title="ยอด Affiliate"
          trailing={
            <span className="text-sm font-bold tabular-nums text-[var(--text-primary)]">
              {formatThb(stats.affiliateBalanceThb)}
            </span>
          }
        />
        <ProfileHubRow
          icon={<PromoTagIcon className="h-4 w-4" />}
          title="โปรโมชั่นที่ใช้อยู่"
          trailing={
            <span className="max-w-[42%] truncate rounded-full bg-[var(--surface-selected)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--border-active)]">
              {stats.activePromotionLabel}
            </span>
          }
        />
      </ProfileHubAccordion>

      <button
        type="button"
        onClick={onLogout}
        className="profile-hub-logout mt-1 flex w-fit items-center gap-1.5 px-0.5 py-1 text-xs font-semibold text-[#e8c547] transition-opacity hover:opacity-85"
      >
        <LogOutIcon className="h-3.5 w-3.5" />
        ออกจากระบบ
      </button>
    </div>
  );
}
