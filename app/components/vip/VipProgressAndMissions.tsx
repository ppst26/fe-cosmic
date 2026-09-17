"use client";

import React from "react";
import type { VipPlayerState } from "@/app/types/vip";
import {
  formatVipAmount,
  formatVipMissionStatus,
  getVipTurnoverTarget,
} from "@/app/data/vipMockData";
import { VipCircularProgress } from "./VipCircularProgress";

interface VipProgressAndMissionsProps {
  player: VipPlayerState;
  missionsTitle?: string;
  missionsSubtitle?: string;
}

/**
 * แถบเทิร์น + วงกลมภารกิจ — ใช้ร่วมแท็บระดับของฉัน / แร็งค์
 */
export function VipProgressAndMissions({
  player,
  missionsTitle = "ภารกิจเลื่อนระดับ",
  missionsSubtitle = "ทำภารกิจให้ครบตามเป้าหมาย",
}: VipProgressAndMissionsProps) {
  const turnoverTarget = getVipTurnoverTarget(player.currentRankId);
  const turnoverPct = Math.min(
    100,
    turnoverTarget > 0 ? (player.turnoverProgress / turnoverTarget) * 100 : 0,
  );
  const turnoverRemaining = Math.max(0, turnoverTarget - player.turnoverProgress);

  return (
    <>
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-[11px] tabular-nums">
          <span className="text-[var(--text-secondary)]">
            เทิร์น {formatVipAmount(player.turnoverProgress)} / {formatVipAmount(turnoverTarget)}
          </span>
          <span className="font-bold text-[#f5c542]">{Math.round(turnoverPct)}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-hover)]">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{
              width: `${turnoverPct}%`,
              background: "linear-gradient(90deg, #9b87ff 0%, #c4b5fd 45%, #f5c542 100%)",
            }}
          />
        </div>
        <p className="text-center text-[11px] text-[var(--text-muted)]">
          อีก {formatVipAmount(turnoverRemaining)} เทิร์นเพื่อเลื่อนระดับ
        </p>
      </div>

      <div className="w-full pt-4">
        <h3 className="text-sm font-extrabold">{missionsTitle}</h3>
        <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{missionsSubtitle}</p>
        <div className="mt-3 flex gap-2">
          {player.missions.map((mission) => (
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
      </div>
    </>
  );
}
