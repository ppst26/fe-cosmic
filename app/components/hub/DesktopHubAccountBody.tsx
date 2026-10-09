"use client";

import React from "react";
import { useLogoutConfirm } from "@/app/hooks/useLogoutConfirm";
import { ProfileSheetBody } from "@/app/components/profile/ProfileSheetBody";
import { useProfile } from "@/app/hooks/api/account";
import { useDesktopHubModal } from "./DesktopHubModalProvider";
import { useVipModal } from "@/app/components/vip/VipModalProvider";
import { ErrorState, LoadingState } from "@/app/components/ui/StatusState";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * เนื้อหา hub ข้อมูลบัญชี — โปรไฟล์จาก useProfile ใน DesktopHubModal
 */
export function DesktopHubAccountBody() {
  const { closeHub, openHub } = useDesktopHubModal();
  const { openLogoutConfirm, LogoutConfirmDialog } = useLogoutConfirm(closeHub);
  const { openVipModal } = useVipModal();
  const { data: profile, status, refresh, setData: setProfile } = useProfile();
  const t = useT("auth");
  const tCommon = useT("common");

  if (!profile) {
    if (status === "error") {
      return (
        <ErrorState
          title={t("account.failed")}
          description={t("account.retryHint")}
          primaryAction={{ label: tCommon("retry"), onClick: refresh }}
        />
      );
    }
    return <LoadingState label={t("account.loading")} />;
  }

  return (
    <>
      <ProfileSheetBody
        profile={profile}
        onLogout={openLogoutConfirm}
        onProfileUpdated={setProfile}
        onOpenTransactions={() => openHub("transactions")}
        onOpenVip={() => {
          closeHub();
          openVipModal();
        }}
      />
      <LogoutConfirmDialog />
    </>
  );
}
