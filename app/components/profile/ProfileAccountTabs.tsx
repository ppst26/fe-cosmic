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
import { useT } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";

const PROFILE_ACCOUNT_TABS: { id: ProfileAccountTab; labelKey: MessageKey<"profile"> }[] = [
  { id: "personal", labelKey: "account.tabs.personal" },
  { id: "bank", labelKey: "account.tabs.bank" },
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
  const t = useT("profile");
  const tabs = PROFILE_ACCOUNT_TABS.map((tab) => ({ id: tab.id, label: t(tab.labelKey) }));
  const vipPlayer = useVipPlayer();
  /** ระดับ VIP — "—" ระหว่างโหลด */
  const vipRankLabel = vipPlayer.data ? getVipRankTier(vipPlayer.data.currentRankId).label : "—";

  const copyMemberId = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(t("account.gameUserCopied"), "success", 2500);
    } catch {
      showToast(t("account.copyFailed"), "error");
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
          tabs={tabs}
          activeId={activeTab}
          onSelect={setActiveTab}
          ariaLabel={t("account.title")}
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
              label={t("account.gameUser")}
              value={profile.memberId}
              valueRole="emphasis"
              onCopy={() => void copyMemberId(profile.memberId)}
              copyLabel={t("account.copyGameUser")}
            />
            <ProfileAccountFieldRow
              label={t("account.password")}
              value="••••••"
              onEdit={() => {
                /* TODO: เปลี่ยนรหัสผ่าน */
              }}
              editLabel={t("account.changePassword")}
            />
            <ProfileAccountFieldRow label="LINE" value="—" valueRole="muted" />
            {onOpenTransactions ? (
              <ProfileAccountNavRow
                label={t("account.transactionHistory")}
                value={t("account.transactionHistoryHint")}
                onClick={onOpenTransactions}
              />
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
        {t("logout")}
      </button>
    </div>
  );
}
