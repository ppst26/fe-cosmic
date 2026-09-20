"use client";

import React from "react";
import type { VipPlayerState, VipRankId } from "@/app/types/vip";
import {
  formatVipAmount,
  formatVipMissionStatus,
  getVipRankMultiplier,
  getVipRankViewStatus,
  getVipRequirementRankForFocus,
  getVipRequirementsForRank,
  getVipScaledMissions,
  getVipRankTier,
} from "@/app/data/vipMockData";
import { LockIcon } from "../ui/Icons";
import { VipCircularProgress } from "./VipCircularProgress";

interface VipRankRequirementsPanelProps {
  player: VipPlayerState;
  /** แรงค์ที่กำลังดูใน carousel หรือแรงค์ปัจจุบันในแท็บระดับของฉัน */
  focusRankId: VipRankId;
  sectionTitle?: string;
  sectionSubtitle?: string;
  /** desktop VIP modal — แยกคอลัมน์เทิร์น / ภารกิจ */
  sections?: "all" | "turnover" | "missions";
}

/**
 * แถบเทิร์น + เงื่อนไข — แรงค์ปัจจุบันใช้วงกลม / locked·cleared ใช้รายการ
 */
export function VipRankRequirementsPanel({
  player,
  focusRankId,
  sectionTitle = "เงื่อนไขการเลื่อนระดับ",
  sectionSubtitle = "ทำครบทุกข้อเพื่อเลื่อนแรงค์",
  sections = "all",
}: VipRankRequirementsPanelProps) {
  const showTurnover = sections === "all" || sections === "turnover";
  const showMissions = sections === "all" || sections === "missions";
  const status = getVipRankViewStatus(focusRankId, player.currentRankId);
  const isLocked = status === "locked";
  const isCleared = status === "cleared";
  const isActive = status === "active";
  const requirementRankId = getVipRequirementRankForFocus(focusRankId, player);
  const req = getVipRequirementsForRank(requirementRankId);
  const missions = getVipScaledMissions(player, requirementRankId).map((m) =>
    isCleared ? { ...m, progress: m.target } : m,
  );
  const reqTier = getVipRankTier(requirementRankId);

  const turnoverProgress =
    status === "locked" ? 0 : status === "cleared" ? req.turnoverTarget : player.turnoverProgress;
  const turnoverPct =
    req.turnoverTarget > 0
      ? Math.min(100, (turnoverProgress / req.turnoverTarget) * 100)
      : 0;
  const turnoverRemaining = Math.max(0, req.turnoverTarget - turnoverProgress);

  return (
    <div className={isLocked ? "opacity-85" : undefined}>
      {isLocked && (
        <div className="cosmic-inset-card mb-3 flex items-center gap-2 px-3 py-2">
          <LockIcon className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          <p className="text-[11px] leading-snug text-[var(--text-muted)]">
            แรงค์ {getVipRankTier(focusRankId).label} — เป้าสะสมทวีคูณ ×
            {getVipRankMultiplier(focusRankId)} จากฐาน Silver
          </p>
        </div>
      )}

      {isLocked && (
        <p className="mb-3 text-center text-[11px] text-[var(--text-muted)]">
          ถึง{" "}
          <span className="font-medium text-[var(--text-secondary)]">
            {getVipRankTier(focusRankId).label}
          </span>{" "}
          ได้เมื่อเลื่อนจากแรงค์ก่อนหน้า
        </p>
      )}

      {showTurnover ? (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-[11px] tabular-nums">
          <span
            className={
              isLocked ? "text-[var(--text-muted)]" : "text-[var(--text-secondary)]"
            }
          >
            เทิร์น {formatVipAmount(turnoverProgress)} / {formatVipAmount(req.turnoverTarget)}
          </span>
          {!isLocked && (
            <span className={`font-medium ${isCleared ? "text-[var(--success)]" : "text-[#f5c542]"}`}>
              {isCleared ? "ครบ" : `${Math.round(turnoverPct)}%`}
            </span>
          )}
          {isLocked && (
            <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
              ล็อก
            </span>
          )}
        </div>
        <div
          className={`h-2.5 overflow-hidden rounded-full ${
            isLocked ? "bg-[var(--surface-hover)]/50" : "bg-[var(--surface-hover)]"
          }`}
        >
          <div
            className={`h-full rounded-full transition-[width] duration-500 ${
              isLocked ? "w-0 bg-[var(--text-muted)]/30" : ""
            } ${isCleared && !isLocked ? "bg-[var(--success)]/80" : ""}`}
            style={
              isLocked
                ? undefined
                : isCleared
                  ? { width: "100%" }
                  : {
                      width: `${turnoverPct}%`,
                      background:
                        "var(--vip-progress-gradient)",
                    }
            }
          />
        </div>
        <p className="text-center text-[11px] text-[var(--text-muted)]">
          {isLocked
            ? `เป้าเทิร์น ${formatVipAmount(req.turnoverTarget)} สำหรับ ${reqTier.label}`
            : isCleared
              ? "บรรลุเงื่อนไขเทิร์นของแรงค์นี้แล้ว"
              : `อีก ${formatVipAmount(turnoverRemaining)} เทิร์นเพื่อเลื่อนระดับ`}
        </p>
      </div>
      ) : null}

      {showMissions ? (
      <div className={`w-full ${showTurnover ? "pt-4" : ""}`}>
        <h3
          className={`text-sm font-medium ${isLocked ? "text-[var(--text-muted)]" : ""}`}
        >
          {sectionTitle}
        </h3>
        <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{sectionSubtitle}</p>

        {isActive ? (
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            {missions.map((mission) => (
              <VipCircularProgress
                key={mission.id}
                progress={mission.progress}
                target={mission.target}
                label={mission.label}
                statusText={formatVipMissionStatus(mission)}
                iconKind={mission.icon}
              />
            ))}
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {missions.map((mission) => {
              const done = !isLocked && mission.progress >= mission.target;
              return (
                <li
                  key={mission.id}
                  className={`cosmic-inset-card flex items-center justify-between gap-2 px-2.5 py-2 ${
                    isLocked
                      ? "text-[var(--text-muted)]"
                      : done
                        ? "vip-mission-row--done text-[var(--text-primary)]"
                        : "text-[var(--text-primary)]"
                  }`}
                >
                  <span className="text-xs font-medium">{mission.label}</span>
                  <span className="shrink-0 text-[11px] tabular-nums text-[var(--text-secondary)]">
                    {isLocked
                      ? `0 / ${formatVipAmount(mission.target)} ${mission.unit}`
                      : formatVipMissionStatus(mission)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {isLocked && (
          <p className="mt-2 text-center text-[10px] text-[var(--text-muted)]/90">
            ตัวเลขทวีคูนตามแรงค์ — ฐาน Silver ×1 · Gold ×2 · Platinum ×4 · …
          </p>
        )}
      </div>
      ) : null}
    </div>
  );
}
