"use client";

import React from "react";
import { RewardStandaloneShell } from "@/app/components/reward/RewardStandaloneShell";
import { LuckyBoxPageContent } from "@/app/components/reward/LuckyBoxPageContent";
import { useT } from "@/lib/i18n/I18nProvider";

/** แลกกล่องสุ่ม — /reward/lucky-box */
export default function LuckyBoxPage() {
  const t = useT("rewards");
  return (
    <RewardStandaloneShell title={t("luckyBox.pageTitle")}>
      <LuckyBoxPageContent />
    </RewardStandaloneShell>
  );
}
