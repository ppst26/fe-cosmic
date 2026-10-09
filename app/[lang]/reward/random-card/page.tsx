"use client";

import React from "react";
import { RewardStandaloneShell } from "@/app/components/reward/RewardStandaloneShell";
import { RandomCardPageContent } from "@/app/components/reward/RandomCardPageContent";

/** แลกการ์ดสุ่ม — /reward/random-card */
export default function RandomCardPage() {
  return (
    <RewardStandaloneShell title="แลกการ์ดสุ่ม">
      <RandomCardPageContent />
    </RewardStandaloneShell>
  );
}
