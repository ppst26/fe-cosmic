"use client";

import React, { useId } from "react";
import type { WheelSegment } from "@/app/data/luckyWheelMockData";

const SEGMENT_COUNT = 8;
const SEGMENT_DEG = 360 / SEGMENT_COUNT;

interface CosmicFortuneWheelProps {
  segments: WheelSegment[];
  rotationDeg: number;
  spinning: boolean;
  onCenterClick?: () => void;
  centerDisabled?: boolean;
}

/** แปลงมุมเป็น x,y รอบวง */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** path ช่องวงล้อ */
function wedgePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
}

/**
 * วงล้อ 8 ช่อง — สีจากธีม Cosmicbet (ไม่ใช้สี mock ทอง/ดำ)
 * ใช้ใน LuckyWheelPageContent
 */
export function CosmicFortuneWheel({
  segments,
  rotationDeg,
  spinning,
  onCenterClick,
  centerDisabled,
}: CosmicFortuneWheelProps) {
  const uid = useId().replace(/:/g, "");
  const hubGradId = `wheelHub-${uid}`;
  const cx = 200;
  const cy = 200;
  const r = 168;

  return (
    <div className="lucky-wheel__stage">
      <div className="lucky-wheel__pointer" aria-hidden="true" />
      <div
        className="lucky-wheel__disc"
        style={{
          transform: `rotate(${rotationDeg}deg)`,
          transition: spinning
            ? "transform 4.2s cubic-bezier(0.12, 0.85, 0.18, 1)"
            : "none",
        }}
      >
        <svg viewBox="0 0 400 400" className="lucky-wheel__svg" aria-hidden="true">
          <defs>
            <radialGradient id={hubGradId} cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="var(--surface-selected)" />
              <stop offset="100%" stopColor="var(--surface-mid)" />
            </radialGradient>
          </defs>

          <circle
            cx={cx}
            cy={cy}
            r={r + 12}
            fill="none"
            className="lucky-wheel__rim"
            strokeWidth="2"
          />

          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (360 / 24) * i;
            const dot = polar(cx, cy, r + 10, angle);
            return (
              <circle
                key={`dot-${i}`}
                cx={dot.x}
                cy={dot.y}
                r={2.2}
                className="lucky-wheel__rim-dot"
              />
            );
          })}

          {segments.slice(0, SEGMENT_COUNT).map((segment, index) => {
            const start = index * SEGMENT_DEG;
            const end = start + SEGMENT_DEG;
            const mid = start + SEGMENT_DEG / 2;
            const labelPos = polar(cx, cy, r * 0.64, mid);

            return (
              <g key={segment.id}>
                <path
                  d={wedgePath(cx, cy, r, start, end)}
                  className={index % 2 === 0 ? "lucky-wheel__slice lucky-wheel__slice--a" : "lucky-wheel__slice lucky-wheel__slice--b"}
                />
                <g transform={`translate(${labelPos.x} ${labelPos.y}) rotate(${mid})`}>
                  <text
                    y={4}
                    textAnchor="middle"
                    className="lucky-wheel__slice-label"
                  >
                    {segment.label}
                  </text>
                </g>
              </g>
            );
          })}

          <circle cx={cx} cy={cy} r={36} fill={`url(#${hubGradId})`} className="lucky-wheel__hub-ring" />
        </svg>
      </div>

      <button
        type="button"
        className="lucky-wheel__hub-btn"
        disabled={centerDisabled || spinning}
        onClick={onCenterClick}
        aria-label="หมุนวงล้อ"
      >
        SPIN
      </button>

      <p className="lucky-wheel__caption">หมุนวงล้อเพื่อรับรางวัลสุดพิเศษ</p>
    </div>
  );
}
