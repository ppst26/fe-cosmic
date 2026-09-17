"use client";

import React from "react";
import type { WheelSegment } from "@/app/data/luckyWheelMockData";

const SEGMENT_COUNT = 8;
const SEGMENT_DEG = 360 / SEGMENT_COUNT;

interface CosmicFortuneWheelProps {
  segments: WheelSegment[];
  rotationDeg: number;
  spinning: boolean;
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
 * วงล้อ 8 ช่อง + ขอบเรืองแสง — หมุนผ่าน rotationDeg
 * ใช้ใน LuckyWheelPageContent
 */
export function CosmicFortuneWheel({ segments, rotationDeg, spinning }: CosmicFortuneWheelProps) {
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
            <radialGradient id="luckyWheelHub" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#5b21b6" />
            </radialGradient>
            <filter id="luckyWheelGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#6366f1" floodOpacity="0.55" />
            </filter>
          </defs>

          <circle
            cx={cx}
            cy={cy}
            r={r + 14}
            fill="none"
            stroke="#818cf8"
            strokeWidth="3"
            opacity="0.35"
          />
          <circle
            cx={cx}
            cy={cy}
            r={r + 8}
            fill="none"
            stroke="#a5b4fc"
            strokeWidth="1.5"
            filter="url(#luckyWheelGlow)"
          />

          {segments.slice(0, SEGMENT_COUNT).map((segment, index) => {
            const start = index * SEGMENT_DEG;
            const end = start + SEGMENT_DEG;
            const mid = start + SEGMENT_DEG / 2;
            const labelPos = polar(cx, cy, r * 0.62, mid);
            const fill = index % 2 === 0 ? "#2e1065" : "#1e1b4b";

            return (
              <g key={segment.id}>
                <path d={wedgePath(cx, cy, r, start, end)} fill={fill} stroke="#6366f1" strokeWidth="0.75" />
                <g transform={`translate(${labelPos.x} ${labelPos.y}) rotate(${mid})`}>
                  {segment.kind === "credit" ? (
                    <CoinStackMini x={-12} y={-18} />
                  ) : (
                    <GemMini x={-8} y={-16} />
                  )}
                  <text
                    y={10}
                    textAnchor="middle"
                    fill="#f5f4fc"
                    fontSize="11"
                    fontWeight="700"
                    style={{ fontFamily: "var(--font-noto-sans-thai), sans-serif" }}
                  >
                    {segment.label}
                  </text>
                </g>
              </g>
            );
          })}

          <circle cx={cx} cy={cy} r={28} fill="url(#luckyWheelHub)" stroke="#c4b5fd" strokeWidth="2" />
          <path
            d="M200 188 L204 198 L196 198 Z M200 212 L204 202 L196 202 Z M188 200 L198 204 L198 196 Z M212 200 L202 204 L202 196 Z"
            fill="#fef9c3"
          />
        </svg>
      </div>
    </div>
  );
}

function CoinStackMini({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="12" cy="14" rx="10" ry="3" fill="#ca8a04" opacity="0.5" />
      <ellipse cx="12" cy="10" rx="10" ry="3.5" fill="#eab308" stroke="#fde047" strokeWidth="0.75" />
      <ellipse cx="12" cy="6" rx="10" ry="3.5" fill="#facc15" stroke="#fef08a" strokeWidth="0.75" />
    </g>
  );
}

function GemMini({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M12 2 L20 8 L16 18 L8 18 L4 8 Z" fill="#7c3aed" stroke="#c4b5fd" strokeWidth="0.75" />
      <path d="M12 2 L16 18 M12 2 L8 18 M4 8 L20 8" stroke="#ddd6fe" strokeWidth="0.5" opacity="0.6" />
    </g>
  );
}
