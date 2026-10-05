"use client";

import React from "react";
import { RewardStandaloneShell } from "@/app/components/reward/RewardStandaloneShell";
import { LuckyBoxPageContent } from "@/app/components/reward/LuckyBoxPageContent";

/** แลกกล่องสุ่ม — /reward/lucky-box */
export default function LuckyBoxPage() {
  return (
    <RewardStandaloneShell title="แลกกล่องสุ่ม">
      <LuckyBoxPageContent />
    </RewardStandaloneShell>
  );
}
