"use client";

import React from "react";
import {
  type WheelBenefitCard,
} from "@/app/data/luckyWheelMockData";
import { fetchWheel } from "@/lib/api/wheel";

interface LuckyWheelIntroColumnProps {
  embedded?: boolean;
}

/**
 * คอลัมน์ซ้ายหน้าวงล้อ — หัวข้อ การ์ดสิทธิประโยชน์ 3 ใบ และคำโปรย
 * ใช้ใน LuckyWheelPageContent
 */
export function LuckyWheelIntroColumn({ embedded = false }: LuckyWheelIntroColumnProps) {
  const wheel = fetchWheel();
  return (
    <div className="lucky-wheel-intro flex min-h-0 flex-col gap-5 lg:self-center">
      {!embedded ? (
        <header className="lucky-wheel-intro__hero">
          <span className="lucky-wheel-intro__crown" aria-hidden="true">
            <CrownIcon className="h-9 w-9 lg:h-10 lg:w-10" />
          </span>
          <h1 className="lucky-wheel-intro__title">
            <span className="lucky-wheel-intro__title-line">หมุนวันนี้</span>
            <span className="lucky-wheel-intro__title-line lucky-wheel-intro__title-line--accent">
              ลุ้นรางวัลใหญ่
            </span>
          </h1>
          <p className="lucky-wheel-intro__lead">
            <span className="block">{wheel.introLead[0]}</span>
            <span className="block">{wheel.introLead[1]}</span>
          </p>
        </header>
      ) : (
        <header className="lucky-wheel-intro__hero lucky-wheel-intro__hero--compact">
          <h2 className="text-base font-medium text-[var(--text-primary)] sm:text-lg">หมุนลุ้นรางวัล</h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">เลือกวิธีหมุนและจำนวนครั้งด้านขวา</p>
        </header>
      )}

      <ul className="lucky-wheel-benefits grid grid-cols-3 gap-2" aria-label="สิทธิประโยชน์">
        {wheel.benefits.map((card) => (
          <li key={card.id} className="h-full">
            <BenefitCard card={card} />
          </li>
        ))}
      </ul>

      <p className="lucky-wheel-intro__tagline">
        <q>{wheel.tagline}</q>
      </p>
    </div>
  );
}

function BenefitCard({ card }: { card: WheelBenefitCard }) {
  return (
    <article className="lucky-wheel-benefit cosmic-inset-card h-full">
      <span className="lucky-wheel-benefit__icon" aria-hidden="true">
        <BenefitIcon iconId={card.iconId} />
      </span>
      <h3 className="lucky-wheel-benefit__title text-xs sm:text-[13px]">
        <span className="block">{card.titleLines[0]}</span>
        <span className="block">{card.titleLines[1]}</span>
      </h3>
    </article>
  );
}

function BenefitIcon({ iconId }: { iconId: WheelBenefitCard["iconId"] }) {
  switch (iconId) {
    case "prize":
      return <GemOutlineIcon className="h-6 w-6" />;
    case "check-in":
      return <TicketIcon className="h-6 w-6" />;
    case "crown":
      return <CrownIcon className="h-6 w-6" />;
    default:
      return null;
  }
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 18h16v2H4v-2ZM6 8l3 4 3-6 3 6 3-4 2 8H4l2-8Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

function GemOutlineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 4 19 10 15 20 9 20 5 10Z" strokeLinejoin="round" />
    </svg>
  );
}

function TicketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path
        d="M6 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
