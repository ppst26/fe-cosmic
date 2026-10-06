"use client";

import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import type { HallOfFameRow, HallOfFameTabId } from "../../types/lobby";
import { SectionIcon } from "../ui/SectionIcon";
import {
  createHallOfFameRow,
} from "../../data/hallOfFameGenerator";
import { HALL_OF_FAME_ROW_LIMIT, HALL_OF_FAME_TICK_MS } from "@/lib/uiConstants";

const TAB_LABELS: { id: HallOfFameTabId; label: string }[] = [
  { id: "latest-winner", label: "Latest Winner" },
  { id: "top-win-multiple", label: "Top Win Multiple" },
];

interface HallOfFameProps {
  datasets: Record<HallOfFameTabId, HallOfFameRow[]>;
}

const payoutFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** จัดรูปแบบยอดชนะ THB (+80,060.00฿) */
function formatPayoutThb(amount: number): string {
  return `+${payoutFormatter.format(amount)}฿`;
}

function HallOfFameGameThumb({ row }: { row: HallOfFameRow }) {
  const toneClass = row.coverTone ? `cover-tone-${row.coverTone}` : "cover-tone-indigo";

  if (row.coverSrc) {
    return (
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[var(--radius-control)] bg-[var(--surface-mid)]">
        <Image
          src={row.coverSrc}
          alt=""
          fill
          sizes="40px"
          className="object-cover object-center"
        />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] ${toneClass} text-[var(--icon-default)]`}
    >
      <SectionIcon id={row.gameIcon} className="h-5 w-5" />
    </span>
  );
}

/** เวลาให้แถวเก่าเลื่อนลงและแถวล่างสุดออกก่อนตัดทิ้ง (ms) */
const ROW_SETTLE_MS = 700;

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * HallOfFame (Top Performance) — 2 แท็บ · ตารางเต็มความกว้าง · ธีม Cosmicbet
 * ถูกเรียกใช้ใน app/page.tsx (โฮม lobby มือถือ + desktop)
 */
export function HallOfFame({ datasets }: HallOfFameProps) {
  const [activeTab, setActiveTab] = useState<HallOfFameTabId>("latest-winner");
  const panelId = useId();
  const isLatestWinner = activeTab === "latest-winner";
  const valueColumnLabel = isLatestWinner ? "Payout" : "Multiple";

  /** แถวของแต่ละแท็บ — เริ่มจาก datasets (เหมือนกันทั้ง SSR/client) แล้วสุ่มเพิ่มบนสุดทุก 5 วินาที */
  const [rowsByTab, setRowsByTab] = useState<Record<HallOfFameTabId, HallOfFameRow[]>>(() => ({
    "latest-winner": (datasets["latest-winner"] ?? []).slice(0, HALL_OF_FAME_ROW_LIMIT),
    "top-win-multiple": (datasets["top-win-multiple"] ?? []).slice(0, HALL_OF_FAME_ROW_LIMIT),
  }));
  const rows = rowsByTab[activeTab];

  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const rowEls = useRef(new Map<string, HTMLTableRowElement>());
  const prevTops = useRef(new Map<string, number>());
  const prevTab = useRef(activeTab);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    const onChange = () => {
      reducedMotion.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // ทุก 5 วินาที: สุ่มแถวใหม่ใส่บนสุดของทั้งสองแท็บ (หยุดเมื่อแท็บเบราว์เซอร์ซ่อน)
  useEffect(() => {
    let settle: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      if (document.hidden) return;
      setRowsByTab((prev) => ({
        "latest-winner": [
          createHallOfFameRow("latest-winner", prev["latest-winner"][0]),
          ...prev["latest-winner"],
        ],
        "top-win-multiple": [
          createHallOfFameRow("top-win-multiple", prev["top-win-multiple"][0]),
          ...prev["top-win-multiple"],
        ],
      }));
      // ตัดแถวที่เกินหลังเลื่อนเสร็จ
      clearTimeout(settle);
      settle = setTimeout(() => {
        setRowsByTab((prev) => ({
          "latest-winner": prev["latest-winner"].slice(0, HALL_OF_FAME_ROW_LIMIT),
          "top-win-multiple": prev["top-win-multiple"].slice(0, HALL_OF_FAME_ROW_LIMIT),
        }));
      }, ROW_SETTLE_MS);
    };
    const id = setInterval(tick, HALL_OF_FAME_TICK_MS);
    return () => {
      clearInterval(id);
      clearTimeout(settle);
    };
  }, []);

  /** ตรึงความสูง tbody = ความสูงของ 8 แถวแรก — แถวที่ 9 (กำลังออก) ถูกตัดซ่อน ไม่ดัน layout ด้านล่าง */
  const syncBodyHeight = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;
    const list = body.querySelectorAll<HTMLTableRowElement>("tr[data-hof-row]");
    const last = list[Math.min(HALL_OF_FAME_ROW_LIMIT, list.length) - 1];
    if (!last) return;
    body.style.height = `${last.offsetTop + last.offsetHeight}px`;
  }, []);

  // FLIP: แถวเดิมเลื่อนลงนุ่ม ๆ · แถวใหม่ fade + ลอยลงจากด้านบน
  useLayoutEffect(() => {
    const tabChanged = prevTab.current !== activeTab;
    prevTab.current = activeTab;
    const animate = !tabChanged && !reducedMotion.current && prevTops.current.size > 0;

    const next = new Map<string, number>();
    rowEls.current.forEach((el, id) => {
      const top = el.offsetTop;
      next.set(id, top);
      if (!animate) return;
      const before = prevTops.current.get(id);
      if (before === undefined) {
        el.animate(
          [
            { opacity: 0, transform: "translate3d(0,-28px,0) scale(0.97)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 600, easing: EASE_OUT, delay: 120, fill: "backwards" },
        );
      } else if (before !== top) {
        el.animate(
          [{ transform: `translate3d(0,${before - top}px,0)` }, { transform: "none" }],
          { duration: 600, easing: EASE_OUT },
        );
      }
    });
    prevTops.current = next;
    syncBodyHeight();
  }, [rows, activeTab, syncBodyHeight]);

  useEffect(() => {
    window.addEventListener("resize", syncBodyHeight);
    return () => window.removeEventListener("resize", syncBodyHeight);
  }, [syncBodyHeight]);

  return (
    <section
      className="hall-of-fame mt-10 w-full min-w-0 sm:mt-12"
      aria-labelledby="top-performance-title"
    >
      <div className="hall-of-fame__head mb-3 flex items-center">
        <h2
          id="top-performance-title"
          className="text-[18px] font-medium tracking-tight text-[var(--text-primary)] leading-[1.4] sm:text-[20px]"
        >
          Top Performance
        </h2>
      </div>

      <div className="hall-of-fame__toolbar mt-4 flex flex-wrap items-center justify-between gap-3">
        <div
          className="hall-of-fame__tabs inline-flex max-w-full flex-wrap items-center gap-2"
          role="tablist"
          aria-label="เลือกตาราง Top Performance"
        >
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
                className={`hall-of-fame__tab-btn cosmic-type-chip-tab min-h-9 whitespace-nowrap px-4 py-[0.45rem] sm:min-h-10 sm:px-[1.1rem] ${selected ? "is-active" : ""}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`${panelId}-panel`}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-${activeTab}`}
        className="hall-of-fame__table-band hall-of-fame__table-band--borderless hall-of-fame__table-band--with-time relative mt-4 -mx-[var(--page-gutter)] w-[calc(100%+2*var(--page-gutter))] max-w-none pt-1 pb-0 lg:mx-0 lg:w-full"
      >
        <div className="hall-of-fame-table-wrap px-[var(--page-gutter)] lg:px-0">
          <table className="hall-of-fame-table block w-full min-w-0 border-collapse text-left text-sm">
            <thead className="block">
              <tr className="hall-of-fame-table__head-row grid items-center gap-x-[0.65rem] text-[11.5px] font-medium uppercase tracking-wider text-[var(--text-secondary)] sm:text-xs">
                <th
                  scope="col"
                  className="hall-of-fame-table__th hall-of-fame-table__th--game pt-[0.35rem] px-0 pb-2"
                >
                  Game
                </th>
                <th
                  scope="col"
                  className="hall-of-fame-table__th hall-of-fame-table__th--player pt-[0.35rem] px-0 pb-2"
                >
                  Player
                </th>
                <th
                  scope="col"
                  className="hall-of-fame-table__th hall-of-fame-table__th--time pt-[0.35rem] px-0 pb-2"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="hall-of-fame-table__th hall-of-fame-table__th--value pt-[0.35rem] px-0 pb-2 text-right"
                >
                  {valueColumnLabel}
                </th>
              </tr>
            </thead>
            <tbody
              ref={bodyRef}
              className="hall-of-fame-table__body hall-of-fame-table__body--live relative mt-2 flex flex-col gap-2"
            >
              {rows.length === 0 ? (
                <tr className="hall-of-fame-table__row hall-of-fame-table__row--empty">
                  <td
                    className="hall-of-fame-table__empty py-8 text-center text-sm text-[var(--text-muted)]"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    ยังไม่มีรายการ
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    data-hof-row
                    ref={(node) => {
                      if (node) rowEls.current.set(row.id, node);
                      else rowEls.current.delete(row.id);
                    }}
                    className="hall-of-fame-table__row glass-card glass-card--hof-row grid items-center gap-x-[0.65rem]"
                  >
                    <td className="hall-of-fame-table__td hall-of-fame-table__td--game py-[0.2rem] px-0">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <HallOfFameGameThumb row={row} />
                        <span className="line-clamp-2 text-xs font-medium leading-snug text-[var(--text-primary)] sm:text-sm">
                          {row.gameName}
                        </span>
                      </div>
                    </td>
                    <td className="hall-of-fame-table__td hall-of-fame-table__td--player py-[0.2rem] px-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="hall-of-fame-table__avatar cosmic-type-caption inline-flex h-7 w-7 shrink-0 items-center justify-center font-medium text-text-primary"
                          aria-hidden="true"
                        >
                          {row.playerMasked.charAt(0).toUpperCase()}
                        </span>
                        <span className="block truncate text-xs tabular-nums text-[var(--text-secondary)] sm:text-sm">
                          {row.playerMasked}
                        </span>
                      </div>
                    </td>
                    <td className="hall-of-fame-table__td hall-of-fame-table__td--time py-[0.2rem] px-0">
                      <span className="block truncate text-xs tabular-nums text-[var(--text-secondary)] sm:text-[13px]">
                        {row.wonAtLabel ?? "—"}
                      </span>
                    </td>
                    <td className="hall-of-fame-table__td hall-of-fame-table__td--value py-[0.2rem] px-0 text-right">
                      {isLatestWinner && row.payout != null ? (
                        <span className="hall-of-fame-table__payout text-xs font-medium tabular-nums sm:text-sm">
                          {formatPayoutThb(row.payout)}
                        </span>
                      ) : null}
                      {!isLatestWinner && row.winMultiple != null ? (
                        <span className="hall-of-fame-table__coef-pill inline-flex items-center justify-end min-w-[2.75rem] px-[0.45rem] py-[0.2rem] text-xs font-medium tabular-nums sm:text-sm">
                          x{row.winMultiple}
                        </span>
                      ) : null}
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
