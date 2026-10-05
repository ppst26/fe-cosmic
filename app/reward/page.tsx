"use client";

import React from "react";
import { RewardStandaloneShell } from "@/app/components/reward/RewardStandaloneShell";
import { RewardHubPageContent } from "@/app/components/reward/RewardHubPageContent";

/**
 * ศูนย์สุ่มของรางวัล — /reward
 */
export default function RewardHubPage() {
  return (
    <RewardStandaloneShell title="สุ่มของรางวัล" backHref="/">
      <RewardHubPageContent />
    </RewardStandaloneShell>
  );
}
