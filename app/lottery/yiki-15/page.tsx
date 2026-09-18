"use client";

import React, { useMemo } from "react";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { YikiRoundList } from "@/app/components/lottery/yiki/YikiRoundList";
import { generateYikiRounds } from "@/app/data/yikiMockData";

/**
 * รายการรอบแทงหวยยี่กี 15 นาที (/lottery/yiki-15)
 */
export default function Yiki15RoundListPage() {
  const rounds = useMemo(() => generateYikiRounds(), []);

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: "หวยยี่กี 15 นาที", backHref: "/lottery" }}
      mainClassName="mx-auto max-w-[var(--content-max)] lg:mx-0 lg:max-w-none"
    >
      <YikiRoundList rounds={rounds} basePath="/lottery/yiki-15" />
    </LobbyDesktopPageShell>
  );
}
