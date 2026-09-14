"use client";

import React, { useId, useState } from "react";
import { HallOfFameRow, HallOfFameTabId } from "../../types/lobby";
import { DollarBadgeIcon, HallOfFameEmblemIcon } from "../ui/Icons";
import { SectionIcon } from "../ui/SectionIcon";

const TAB_LABELS: { id: HallOfFameTabId; label: string }[] = [
  { id: "live-bets", label: "Live Bets" },
  { id: "high-rollers", label: "High Rollers" },
  { id: "lucky-wins", label: "Lucky Wins" },
];

interface HallOfFameProps {
  datasets: Record<HallOfFameTabId, HallOfFameRow[]>;
}

/**
 * HallOfFame — tabs + ตาราง GAME / PAYOUT ใช้ icon แทน thumbnail
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function HallOfFame({ datasets }: HallOfFameProps) {
  const [activeTab, setActiveTab] = useState<HallOfFameTabId>("live-bets");
  const panelId = useId();
  const rows = datasets[activeTab] ?? [];

  const payoutFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <section className="mt-10 w-full min-w-0 sm:mt-12" aria-labelledby="hall-of-fame-title">
      <div className="mb-3 flex items-center gap-2">
        <HallOfFameEmblemIcon className="h-7 w-7 shrink-0" />
        <h2 id="hall-of-fame-title" className="text-lg font-bold text-[var(--text-primary)] sm:text-xl">
          Hall of Fame
        </h2>
      </div>

      <div
        className="rounded-[var(--radius-panel)] bg-[var(--surface-mid)] p-3 sm:p-4"
        role="region"
        aria-label="Hall of Fame"
      >
        <div className="flex gap-1 rounded-[var(--radius-control)] bg-[#121127] p-1" role="tablist" aria-label="เลือกประเภท Hall of Fame">
          {TAB_LABELS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${panelId}-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${panelId}-panel`}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[40px] flex-1 rounded-[var(--radius-control)] px-1 text-[10px] font-bold transition-colors sm:text-xs ${
                  selected ? "text-white" : "text-[var(--text-muted)] hover:bg-[#19183b] hover:text-[var(--text-secondary)]"
                }`}
                style={selected ? { background: "var(--category-active-gradient)" } : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          id={`${panelId}-panel`}
          role="tabpanel"
          aria-labelledby={`${panelId}-tab-${activeTab}`}
          className="mt-3 overflow-hidden rounded-[var(--radius-control)] bg-[#121127]/80"
        >
          <table className="w-full min-w-0 border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#121127] text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                <th scope="col" className="px-3 py-2.5">
                  Game
                </th>
                <th scope="col" className="px-3 py-2.5 text-right">
                  Payout
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-3 py-8 text-center text-sm text-[var(--text-muted)]">
                    ยังไม่มีรายการ
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`min-h-[52px] ${
                      index % 2 === 0 ? "bg-[#121127]/60" : "bg-[#19183b]/40"
                    }`}
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-[#232145] text-[var(--icon-default)]">
                          <SectionIcon id={row.gameIcon} className="h-5 w-5" />
                        </span>
                        <span className="truncate font-semibold text-[var(--text-primary)]">{row.gameName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="inline-flex items-center gap-1 rounded-[var(--radius-control)] bg-[#0f3d2e] px-2.5 py-1 text-xs font-bold tabular-nums text-[#41d995]">
                        <DollarBadgeIcon className="h-3.5 w-3.5" />$ {payoutFormatter.format(row.payout)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
