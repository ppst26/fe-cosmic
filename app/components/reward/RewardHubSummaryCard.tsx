"use client";

import React from "react";
import Image from "next/image";
import { useWallet } from "@/app/hooks/api/account";
import { fetchGemsStore } from "@/lib/api/gemsStore";
import { HeaderWalletAssetIcon } from "@/app/components/layout/HeaderWalletAssetIcon";
import { cn } from "@/lib/utils";
import { formatRewardPoints, formatHeaderWalletBalance } from "@/lib/format";

/**
 * การ์ดยอดเครดิต · พอยท์ — หัวหน้า /reward
 */
export function RewardHubSummaryCard({
  pointsBalance,
  className,
}: {
  pointsBalance: number;
  className?: string;
}) {
  const wallet = useWallet();
  const gems = fetchGemsStore();

  return (
    <aside
      className={cn("reward-hub-summary mx-3 rounded-2xl px-4 py-3.5 sm:mx-4", className)}
      aria-label="ยอดเครดิตและพอยท์"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-[var(--text-secondary)]">เครดิตทั้งหมด</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xl font-medium tabular-nums text-white sm:text-2xl">
            <HeaderWalletAssetIcon className="h-6 w-6 shrink-0 object-contain" />
            {wallet.data ? formatHeaderWalletBalance(wallet.data.amount) : "—"}
            <span className="text-sm font-normal text-[var(--text-secondary)]">฿</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--border-subtle)]/60 bg-[var(--surface-base)]/50 px-2.5 py-1.5">
          <Image
            src={gems.gemAsset}
            alt=""
            width={22}
            height={22}
            className="h-[22px] w-[22px] object-contain"
          />
          <span className="text-sm font-medium tabular-nums text-[var(--accent-highlight)]">
            {formatRewardPoints(pointsBalance)}
          </span>
        </div>
      </div>
    </aside>
  );
}
