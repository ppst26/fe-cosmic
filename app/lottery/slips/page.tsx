"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { formatBaht, formatLotterySlipDateTime } from "@/app/components/lottery/lotteryUtils";
import { fetchLotterySlips } from "@/lib/lottery/fetchLotterySlip";
import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";

/**
 * รายการโพยที่ส่งแล้ว (mock) — /lottery/slips
 */
export default function LotterySlipsListPage() {
  const [slips, setSlips] = useState<LotterySubmittedSlip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchLotterySlips().then((data) => {
      setSlips(data);
      setLoading(false);
    });
  }, []);

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: "โพยทั้งหมด", backHref: "/lottery" }}
      mainClassName="mx-auto max-w-[var(--content-max)] pb-8 lg:mx-0 lg:max-w-none"
    >
      {loading ? (
        <p className="py-12 text-center text-sm text-[var(--text-secondary)]">กำลังโหลด…</p>
      ) : slips.length === 0 ? (
        <p className="py-12 text-center text-sm text-[var(--text-secondary)]">ยังไม่มีโพยที่ส่ง</p>
      ) : (
        <ul className="lottery-slips-list">
          {slips.map((slip) => (
            <li key={slip.id}>
              <Link href={`/lottery/slips/${slip.id}`} className="lottery-slips-list__card glass-card--soft">
                <div className="lottery-slips-list__row">
                  <span className="lottery-slips-list__id">โพย #{slip.shortId}</span>
                  <span className="lottery-slips-list__status">ส่งโพยแล้ว</span>
                </div>
                <p className="lottery-slips-list__meta">{slip.drawLabel}</p>
                <p className="lottery-slips-list__meta">ซื้อ {formatLotterySlipDateTime(slip.purchasedAt)}</p>
                <p className="lottery-slips-list__stake">เดิมพัน {formatBaht(slip.totalStake)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </LobbyDesktopPageShell>
  );
}
