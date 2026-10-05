"use client";

import React from "react";
import { RewardStandaloneShell } from "@/app/components/reward/RewardStandaloneShell";
import { FreespinsPageContent } from "@/app/components/reward/FreespinsPageContent";

/** แลกฟรีสปิน/ชิป — /reward/freespins */
export default function FreespinsPage() {
  return (
    <RewardStandaloneShell title="ฟรีสปิน / ชิป">
      <FreespinsPageContent />
    </RewardStandaloneShell>
  );
}
