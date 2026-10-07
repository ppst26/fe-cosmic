"use client";

import React, { useState } from "react";
import { useToast } from "@/context/ToastContext";
import type { ProfileUser } from "@/app/types/auth";
import { getVipRankTier } from "@/app/data/vipMockData";
import { useVipPlayer } from "@/app/hooks/api/member";
import { ProfileAccountFieldRow, ProfileAccountNavRow } from "./ProfileAccountFieldRow";
import { ProfileBankAccountCard } from "./ProfileBankAccountCard";
import { ProfileReferralInviteCard } from "./ProfileReferralInviteCard";
import { ProfileAccountAvatarSection } from "./ProfileAccountAvatarSection";
import { LogOutIcon } from "../ui/Icons";
import { COSMIC_BTN_LOGOUT } from "../ui/cosmicButtonClasses";
import { TabPanelTransition } from "@/app/components/ui/TabPanelTransition";
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
  /** เปิด modal ประวัติธุรกรรมแยก — แสดงแถวนำทางเมื่อส่งมา */
  onOpenTransactions?: () => void;
  onProfileUpdated?: (profile: ProfileUser) => void;
  compact?: boolean;
}

/**
 * หน้าข้อมูลบัญชี — แท็บข้อมูลส่วนตัว / บัญชีธนาคาร + ชวนเพื่อน (ProfileSheetBody)
 */
export function ProfileAccountTabs({
  profile,
  onLogout,
  onOpenVip,
  onOpenTransactions,
  onProfileUpdated,
  compact = false,
}: ProfileAccountTabsProps) {
  const [activeTab, setActiveTab] = useState<ProfileAccountTab>("personal");
  const { showToast } = useToast();
  const vipPlayer = useVipPlayer();
  /** ระดับ VIP — "—" ระหว่างโหลด */
  const vipRankLabel = vipPlayer.data ? getVipRankTier(vipPlayer.data.currentRankId).label : "—";

  const copyMemberId = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("คัดลอกยูสเซอร์เข้าเกมแล้ว", "success", 2500);
    } catch {
      showToast("ไม่สามารถคัดลอกได้", "error");
    }
  };

  return (
    <div
      className={cn(
        "profile-account-tabs flex w-full flex-col",
        compact ? "gap-3" : "gap-4 pb-2",
      )}
    >
      {!compact ? (
        <ProfileAccountAvatarSection
          profile={profile}
          onProfileUpdated={onProfileUpdated}
        />
      ) : null}

      <div className="profile-account-tabs__main flex flex-col gap-3">
        <CosmicLineTabs
          tabs={PROFILE_ACCOUNT_TABS}
          activeId={activeTab}
          onSelect={setActiveTab}
          ariaLabel="ข้อมูลบัญชี"
          columns={2}
        />

        <TabPanelTransition
          tabKey={activeTab}
          order={PROFILE_ACCOUNT_TABS.map((t) => t.id)}
          className="flex flex-col gap-3"
        >
        {activeTab === "personal" ? (
          <div role="tabpanel" className="flex flex-col gap-2">
            <ProfileAccountFieldRow
              label="ยูสเซอร์เข้าเกม"
              value={profile.memberId}
              valueRole="emphasis"
              onCopy={() => void copyMemberId(profile.memberId)}
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
            <ProfileAccountFieldRow label="LINE" value="—" valueRole="muted" />
            {onOpenTransactions ? (
              <ProfileAccountNavRow label="ประวัติธุรกรรม" value="ฝาก · ถอน · เดิมพัน" onClick={onOpenTransactions} />
            ) : null}
            {onOpenVip ? (
              <ProfileAccountNavRow
                label="VIP"
                value={vipRankLabel}
                valueRole="reward"
                onClick={onOpenVip}
              />
            ) : (
              <ProfileAccountFieldRow label="VIP" value={vipRankLabel} valueRole="reward" />
            )}
          </div>
        ) : (
          <div role="tabpanel" className="flex flex-col gap-2">
            <ProfileBankAccountCard profile={profile} embedded />
          </div>
        )}

        {activeTab === "personal" ? <ProfileReferralInviteCard flat /> : null}
        </TabPanelTransition>
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
