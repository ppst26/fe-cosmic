"use client";

import React, { Suspense } from "react";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { LotterySlipsPageContent } from "@/app/components/lottery/LotterySlipsPageContent";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { LoadingState } from "@/app/components/ui/StatusState";

/**
 * โพยทั้งหมด (/lottery/slips) — แท็บ "กำลังดำเนินการ" / "ประวัติ" (เก็บย้อนหลัง 30 วัน) + ตัวกรอง
 * ต้อง login (proxy.ts) · ตัวกรองอยู่ใน query string จึงต้องห่อ Suspense ให้ useSearchParams
 */
export default function LotterySlipsListPage() {
  const { t } = useLotteryI18n();

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: t("slips.title"), backHref: "/lottery" }}
      mainClassName="lottery-slips-page mx-auto max-w-[var(--content-max)] pb-8 lg:mx-0 lg:max-w-none"
    >
      <Suspense fallback={<LoadingState label={t("slips.loading")} />}>
        <LotterySlipsPageContent />
      </Suspense>
    </LobbyDesktopPageShell>
  );
}
