"use client";

import React from "react";
import { RewardStandaloneShell } from "@/app/components/reward/RewardStandaloneShell";
import { RandomCardPageContent } from "@/app/components/reward/RandomCardPageContent";
import { useT } from "@/lib/i18n/I18nProvider";

/** แลกการ์ดสุ่ม — /reward/random-card */
export default function RandomCardPage() {
  const t = useT("rewards");
  return (
    <RewardStandaloneShell title={t("randomCard.pageTitle")}>
      <RandomCardPageContent />
    </RewardStandaloneShell>
  );
}
