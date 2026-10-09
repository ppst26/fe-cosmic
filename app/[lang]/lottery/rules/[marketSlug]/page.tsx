"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { LotteryRulesContent } from "@/app/components/lottery/LotteryRulesContent";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * หน้ากติกา / อัตราการจ่ายหวย (/lottery/rules/[marketSlug]) — เปิดจากการ์ดหัวงวดในหน้าแทง
 */
export default function LotteryRulesPage() {
  const t = useT("lottery");
  const params = useParams<{ marketSlug: string }>();
  const marketSlug = decodeURIComponent(params.marketSlug ?? "");

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: t("market.rules"), backHref: marketSlug ? `/lottery/${marketSlug}` : "/lottery" }}
      mainClassName="mx-auto max-w-[var(--content-max)] px-2 pb-8 pt-3 sm:px-2.5 lg:mx-0 lg:max-w-none lg:px-0"
    >
      <LotteryRulesContent marketSlug={marketSlug} />
    </LobbyDesktopPageShell>
  );
}
