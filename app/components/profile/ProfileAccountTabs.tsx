"use client";

import React, { useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { getVipRankTier } from "@/app/data/vipMockData";
import { fetchVipPlayer } from "@/lib/api/vip";
import { ProfileAccountFieldRow, ProfileAccountNavRow } from "./ProfileAccountFieldRow";
import { ProfileBankAccountCard } from "./ProfileBankAccountCard";
import { ProfileReferralInviteCard } from "./ProfileReferralInviteCard";
import { ProfileMenuRow } from "./ProfileMenuCard";
import { LogOutIcon, SupportHeadsetIcon } from "../ui/Icons";
import { COSMIC_BTN_LOGOUT } from "../ui/cosmicButtonClasses";
import { CosmicLineTabs } from "../ui/CosmicLineTabs";
import { cn } from "@/lib/utils";

const PROFILE_ACCOUNT_TABS: { id: ProfileAccountTab; label: string }[] = [
  { id: "personal", label: "ข้อมูลส่วนตัว" },
  { id: "bank", label: "บัญชีธนาคาร" },
];

type ProfileAccountTab = "personal" | "bank";

interface ProfileAccountTabsProps {
  profile: ProfileUser;
  onLogout: () => void;
  onOpenVip?: () => void;
  compact?: boolean;
}

const vipRankLabel = getVipRankTier(fetchVipPlayer().currentRankId).label;

/**
 * หน้าข้อมูลบัญชี — แท็บข้อมูลส่วนตัว / บัญชีธนาคาร + ชวนเพื่อน (ProfileSheetBody)
 */
export function ProfileAccountTabs({
  profile,
  onLogout,
  onOpenVip,
  compact = false,
}: ProfileAccountTabsProps) {
  const [activeTab, setActiveTab] = useState<ProfileAccountTab>("personal");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyText = async (field: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      /* clipboard ไม่พร้อม */
    }
  };

  return (
    <div
      className={cn(
        "profile-account-tabs flex w-full flex-col",
        compact ? "gap-3" : "gap-4 pb-2",
      )}
    >
      <div className="profile-account-tabs__main flex flex-col gap-3">
        <CosmicLineTabs
          tabs={PROFILE_ACCOUNT_TABS}
          activeId={activeTab}
          onSelect={setActiveTab}
          ariaLabel="ข้อมูลบัญชี"
          columns={2}
        />

        {copiedField ? (
          <p className="text-center text-xs text-[var(--success)]" role="status">คัดลอกแล้ว</p>
        ) : null}

        {activeTab === "personal" ? (
          <div role="tabpanel" className="flex flex-col gap-2">
            <ProfileAccountFieldRow
              label="ยูสเซอร์เข้าเกม"
              value={profile.memberId}
              onCopy={() => void copyText("memberId", profile.memberId)}
              copyLabel="คัดลอกยูสเซอร์เข้าเกม"
            />
            <ProfileAccountFieldRow
              label="รหัสผ่าน"
              value="••••••"
              onEdit={() => {
                /* TODO: เปลี่ยนรหัสผ่าน */
              }}
              editLabel="เปลี่ยนรหัสผ่าน"
            />
            <ProfileAccountFieldRow label="LINE" value="—" />
            {onOpenVip ? (
              <ProfileAccountNavRow label="VIP" value={vipRankLabel} onClick={onOpenVip} />
            ) : (
              <ProfileAccountFieldRow label="VIP" value={vipRankLabel} />
            )}
          </div>
        ) : (
          <div role="tabpanel" className="flex flex-col gap-2">
            <ProfileBankAccountCard profile={profile} embedded />
          </div>
        )}

        {activeTab === "personal" ? <ProfileReferralInviteCard flat /> : null}

        <section className="border-t border-[var(--border-subtle)]/45 pt-1">
          <ProfileMenuRow
            icon={<SupportHeadsetIcon className="h-5 w-5" />}
            title="ติดต่อฝ่ายบริการ"
            href="mailto:support@cosmicbet.example"
          />
        </section>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className={
          compact
            ? "flex w-fit items-center gap-1.5 py-1 text-xs font-medium text-[var(--destructive)] hover:opacity-85"
            : cn(COSMIC_BTN_LOGOUT, "mt-2")
        }
      >
        <LogOutIcon className={compact ? "h-3.5 w-3.5" : "h-5 w-5"} />
        ออกจากระบบ
      </button>
    </div>
  );
}
