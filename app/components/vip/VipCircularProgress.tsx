"use client";

import React from "react";
import { DepositNavIcon, GamepadIcon } from "../ui/Icons";

const SIZE = 76;
const STROKE = 5;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

function MissionCenterIcon({ kind }: { kind: "login" | "deposit" | "play" }) {
  if (kind === "deposit") {
    return <DepositNavIcon className="h-5 w-5 text-[var(--icon-active)]" />;
  }
  if (kind === "play") {
    return <GamepadIcon className="h-5 w-5 text-[var(--icon-active)]" />;
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--icon-active)]" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M9.5 14.5 11 16l3.5-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface VipCircularProgressProps {
  progress: number;
  target: number;
  label: string;
  statusText: string;
  iconKind: "login" | "deposit" | "play";
}

/**
 * Progress วงกลมภารกิจ VIP — ใช้ใน VipModal แท็บระดับของฉัน
 */
export function VipCircularProgress({
  progress,
  target,
  label,
  statusText,
  iconKind,
}: VipCircularProgressProps) {
  const pct = target > 0 ? Math.min(100, (progress / target) * 100) : 0;
  const offset = C - (pct / 100) * C;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const gradId = React.useId().replace(/:/g, "");

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90" aria-hidden="true">
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE}
          />
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-500"
          />
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--accent-highlight)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <MissionCenterIcon kind={iconKind} />
        </div>
      </div>
      <p className="text-center text-xs font-medium text-[var(--text-primary)]">{label}</p>
      <p className="text-center text-[11px] leading-snug text-[var(--text-secondary)]">{statusText}</p>
    </div>
  );
}
