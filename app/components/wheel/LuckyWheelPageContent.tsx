"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "@/lib/i18n/navigation";
// สไตล์วงล้อโหลดเฉพาะหน้า /wheel — ไม่อยู่ใน globals.css แล้ว (ใช้ที่นี่ที่เดียว)
import "@/app/styles/lucky-wheel.css";
import { useWheel } from "@/app/hooks/api/member";
import type { WheelData } from "@/lib/api/wheel";
import { ResourceGate } from "../ui/ResourceGate";
import { ArrowLeftIcon } from "../ui/Icons";
import { CosmicFortuneWheel } from "./CosmicFortuneWheel";
import { resolveWheelTheme } from "@/lib/domain/wheelTheme";
import { LuckyWheelLiveWinners } from "./LuckyWheelLiveWinners";
import { LuckyWheelPrizeHistory } from "./LuckyWheelPrizeHistory";
import { CosmicStackedActionButton } from "../ui/CosmicStackedActionButton";
import { formatGemsBalance } from "@/lib/format";
import type { WheelPrizeHistoryRow, WheelSegment, WheelSpinMethod } from "@/app/types/reward";
import { valueClass } from "@/lib/semanticValue";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * หน้าเล่นวงล้อพารวย — โหลดข้อมูลวงล้อแล้วส่งให้ LuckyWheelPlay (state เริ่มต้นมาจากข้อมูลที่โหลดแล้ว)
 */
export function LuckyWheelPageContent({ embedded = false }: { embedded?: boolean }) {
  const t = useT("rewards");
  const wheel = useWheel();
  return (
    <ResourceGate resource={wheel} loadingLabel={t("wheel.loading")} errorTitle={t("wheel.loadError")}>
      {(data) => <LuckyWheelPlay wheel={data} embedded={embedded} />}
    </ResourceGate>
  );
}

/**
 * ตัวเล่นวงล้อพารวย — รองรับ Mobile-first layout ตรงตาม mockup
 */
function LuckyWheelPlay({ wheel, embedded }: { wheel: WheelData; embedded: boolean }) {
  const t = useT("rewards");
  const segmentDeg = 360 / wheel.segments.length;
  /** เวลาหมุนจากธีม — ใช้ทั้ง transition ของวงและจังหวะประกาศผล */
  const spinDurationMs = resolveWheelTheme(wheel.theme).spinDurationMs;
  const [gemsBalance, setGemsBalance] = useState(wheel.initialGems);
  const [ticketCount, setTicketCount] = useState(wheel.initialTickets);
  const [spinMethod, setSpinMethod] = useState<WheelSpinMethod>("ticket");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<string | null>(null);
  const [recentHistoryRows, setRecentHistoryRows] = useState<WheelPrizeHistoryRow[]>([]);

  const currentGemsCost = wheel.gemsPerSpin;
  const currentTicketCost = wheel.ticketsPerSpin;

  const canAfford =
    spinMethod === "gems"
      ? gemsBalance >= currentGemsCost
      : ticketCount >= currentTicketCost && ticketCount > 0;

  const handleSpin = useCallback(() => {
    if (spinning || !canAfford) return;

    const targetIndex = Math.floor(Math.random() * wheel.segments.length);
    const segment: WheelSegment = wheel.segments[targetIndex];
    const extraTurns = 5 * 360;
    const targetAngle = 360 - targetIndex * segmentDeg - segmentDeg / 2;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = (targetAngle - currentMod + 360) % 360;
    const nextRotation = rotation + extraTurns + delta;

    if (spinMethod === "gems") {
      setGemsBalance((b) => Math.max(0, b - currentGemsCost));
    } else {
      setTicketCount((t) => Math.max(0, t - currentTicketCost));
    }

    setSpinning(true);
    setRotation(nextRotation);

    window.setTimeout(() => {
      setSpinning(false);
      setLastWin(t("wheel.winMessage", { prize: segment.label }));
      const row: WheelPrizeHistoryRow = {
        id: `ph-${Date.now()}`,
        atLabel: t("wheel.justNow"),
        prizeKind: segment.kind,
        prizeName: t(`wheel.prizeKind.${segment.kind}`),
        amount: segment.label.replace(/[^\d.]/g, "") || "—",
        method: spinMethod,
      };
      setRecentHistoryRows((prev) => [row, ...prev].slice(0, 5));
    }, spinDurationMs);
  }, [t, spinDurationMs, canAfford, currentGemsCost, currentTicketCost, rotation, segmentDeg, spinMethod, spinning, wheel.segments]);

  return (
    <div className={`lucky-wheel-page ${embedded ? "lucky-wheel-page--embedded" : ""}`}>
      {/* 1. Header — ย้อนกลับ + หัวข้อกลาง */}
      <div className="w-full px-1 py-1 sm:px-2">
        <div className="relative flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-start text-white hover:text-white/80 active:scale-90 transition-transform cursor-pointer"
            aria-label={t("wheel.backHome")}
          >
            <ArrowLeftIcon className="h-6 w-6 text-white" />
          </Link>
          <div className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center text-center">
            <h1 className="text-base font-medium leading-tight text-white sm:text-lg">{t("wheel.title")}</h1>
            <p className="hidden text-xs text-[var(--text-secondary)] sm:block sm:text-[13px]">
              {t("wheel.subtitle")}
            </p>
          </div>
          <div className="h-10 w-10 shrink-0" aria-hidden="true" />
        </div>
      </div>

      {/* 2–4. วงล้อกลาง · desktop ตารางซ้าย–ขวา */}
      <div
        className={cn(
          "lucky-wheel-page__stage w-full",
          "lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,26rem)_minmax(0,15rem)] lg:items-center lg:justify-center lg:gap-x-5",
          "xl:grid-cols-[17rem_minmax(0,28rem)_17rem] xl:gap-x-6",
        )}
      >
        <aside className="hidden min-w-0 self-center lg:block">
          <LuckyWheelPrizeHistory extraRows={recentHistoryRows} variant="sidebar" />
        </aside>

        <div className="flex min-w-0 w-full flex-col items-center">
        <div className="relative flex w-full max-w-[380px] flex-col items-center justify-center pt-2 sm:max-w-[420px]">
          <div className="mb-2 flex w-full items-center justify-between gap-3 px-0.5 sm:px-1">
            <Link
              href="/gems-store"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-purple-500/30 bg-[#150d2c]/90 px-3 text-white shadow-[0_0_12px_rgba(168,85,247,0.15)] transition-all hover:border-purple-400/60 hover:bg-[#1d123d] active:scale-95"
              aria-label={t("wheel.gemsBalanceAria")}
            >
              <GoldGemIcon className="h-3.5 w-3.5 shrink-0 text-sky-400" />
              <span className={valueClass("accent", "text-xs tracking-tight text-white")}>
                {formatGemsBalance(gemsBalance)}
              </span>
            </Link>
            <div
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-purple-500/30 bg-[#150d2c]/90 px-3 text-white shadow-[0_0_12px_rgba(168,85,247,0.15)]"
              aria-label={t("wheel.ticketsAria")}
            >
              <GoldTicketIcon className="h-3.5 w-3.5 shrink-0 text-purple-400" />
              <span className="text-xs font-medium tabular-nums tracking-tight text-white">{ticketCount}</span>
            </div>
          </div>
          <CosmicFortuneWheel
            segments={wheel.segments}
            rotationDeg={rotation}
            spinning={spinning}
            onCenterClick={handleSpin}
            centerDisabled={!canAfford}
            theme={wheel.theme}
          />

          {/* Indicator dots 2 จุด ใต้วงล้อ */}
          <div className="mt-2 flex items-center justify-center gap-1.5" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
          </div>
        </div>

        {/* 3. แท็บเลือกวิธีหมุน — surface solid เทา + segment แบบคืนยอด */}
        <div
          role="tablist"
          aria-label={t("wheel.methodTabsAria")}
          className={cn(
            "cosmic-segment-track cosmic-segment-track--glass-white my-3.5 grid w-full max-w-[380px] grid-cols-2 gap-1.5 p-1.5 sm:max-w-[420px]",
            "border-[var(--border-subtle)] bg-[var(--surface-solid-inner)] shadow-none [backdrop-filter:none] [-webkit-backdrop-filter:none]",
          )}
        >
          {(
            [
              { id: "gems" as const, label: t("wheel.methodGems", { cost: wheel.gemsPerSpin.toFixed(2) }) },
              { id: "ticket" as const, label: t("wheel.methodTicket", { cost: wheel.ticketsPerSpin }) },
            ] as const
          ).map((tab) => {
            const isActive = spinMethod === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSpinMethod(tab.id)}
                className={cn(
                  "cosmic-segment-btn min-h-9 px-3 py-2 text-xs font-medium sm:text-sm",
                  isActive ? "is-active" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4. ปุ่มหมุนใหญ่ — สีตรงธีม Cosmicbet (ม่วงนีออน Action Gradient) */}
        <div className="flex w-full max-w-[340px] flex-col items-center">
          <CosmicStackedActionButton
            type="button"
            disabled={spinning}
            dimmed={!canAfford}
            className="w-full"
            title={spinning ? t("wheel.spinning") : t("wheel.spinNow")}
            subtitle={
              spinMethod === "ticket"
                ? t("wheel.useTickets", { count: wheel.ticketsPerSpin })
                : t("wheel.useGems", { amount: wheel.gemsPerSpin.toFixed(2) })
            }
            onClick={() => {
              if (!canAfford) {
                if (spinMethod === "ticket") setSpinMethod("gems");
                return;
              }
              handleSpin();
            }}
          />

          {/* ข้อความช่วยเหลือใต้ปุ่ม — ธีม Cosmicbet */}
          {spinMethod === "ticket" && ticketCount <= 0 ? (
            <button
              type="button"
              onClick={() => setSpinMethod("gems")}
              className="mt-2.5 text-xs font-medium text-purple-300 underline decoration-purple-400/40 underline-offset-4 transition-colors hover:text-purple-200 hover:decoration-purple-300 cursor-pointer"
            >
              {t("wheel.noTickets")}
            </button>
          ) : spinMethod === "gems" && gemsBalance < currentGemsCost ? (
            <Link
              href="/gems-store"
              className="mt-2.5 text-xs font-medium text-purple-300 underline decoration-purple-400/40 underline-offset-4 transition-colors hover:text-purple-200 hover:decoration-purple-300"
            >
              {t("wheel.notEnoughGems")}
            </Link>
          ) : (
            <span className="mt-2.5 text-xs text-[var(--text-secondary)]">{t("wheel.hint")}</span>
          )}

          {lastWin ? (
            <div className={valueClass("reward", "mt-2 text-center text-xs animate-fade-in")} role="status">
              {lastWin}
            </div>
          ) : null}
        </div>
        </div>

        <aside className="hidden min-w-0 self-center lg:block">
          <LuckyWheelLiveWinners variant="sidebar" />
        </aside>
      </div>

      {/* มือถือ — ตารางใต้วงล้อ */}
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 pt-4 lg:hidden">
        <LuckyWheelPrizeHistory extraRows={recentHistoryRows} />
        <LuckyWheelLiveWinners />
      </div>

      <p className="pt-2 text-center text-xs text-[var(--text-secondary)]">
        {t("wheel.sampleNote")}
      </p>
    </div>
  );
}

function GoldGemIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2 3 9l9 13 9-13-9-7ZM6.4 9l5.6-4.35L17.6 9H6.4Z" />
    </svg>
  );
}

function GoldTicketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V7Zm5 3a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2H9Z" />
    </svg>
  );
}
