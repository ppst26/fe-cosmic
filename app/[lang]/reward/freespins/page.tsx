"use client";

import React from "react";
import { RewardStandaloneShell } from "@/app/components/reward/RewardStandaloneShell";
import { FreespinsPageContent } from "@/app/components/reward/FreespinsPageContent";
import { useT } from "@/lib/i18n/I18nProvider";

/** แลกฟรีสปิน/ชิป — /reward/freespins */
export default function FreespinsPage() {
  const t = useT("rewards");
  return (
    <RewardStandaloneShell title={t("freespins.title")}>
      <FreespinsPageContent />
    </RewardStandaloneShell>
  );
}
