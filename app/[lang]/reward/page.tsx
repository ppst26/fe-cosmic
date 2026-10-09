"use client";

import React from "react";
import { RewardStandaloneShell } from "@/app/components/reward/RewardStandaloneShell";
import { RewardHubPageContent } from "@/app/components/reward/RewardHubPageContent";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * ศูนย์สุ่มของรางวัล — /reward
 */
export default function RewardHubPage() {
  const t = useT("rewards");
  return (
    <RewardStandaloneShell title={t("hub.title")} backHref="/">
      <RewardHubPageContent />
    </RewardStandaloneShell>
  );
}
