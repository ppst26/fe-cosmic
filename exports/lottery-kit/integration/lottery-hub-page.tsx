"use client";

import { LotteryHubContent } from "@/app/components/lottery/LotteryHubContent";
import { LotteryRouteShell } from "@/app/components/layout/LotteryRouteShell";

/** Hub หวย standalone — /lottery (ไม่ผูก HomeLobbyPage) */
export default function LotteryHubPage() {
  return (
    <LotteryRouteShell
      subHeader={{ title: "หวย", backHref: "/" }}
      mainClassName="lottery-page-main pb-8"
    >
      <LotteryHubContent />
    </LotteryRouteShell>
  );
}
