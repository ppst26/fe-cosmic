import React from "react";
import { JackpotWinner } from "../../types/lobby";
import { CardsIcon, FootballIcon, SlotMachineIcon } from "./Icons";

interface JackpotWinnerCardProps {
  winner: JackpotWinner;
}

/**
 * ไอคอนประเภท Jackpot ตามหมวด
 */
function JackpotCategoryIcon({ category }: { category: JackpotWinner["category"] }) {
  const className = "h-8 w-8 text-[var(--icon-default)]";
  switch (category) {
    case "casino":
      return <CardsIcon className={className} />;
    case "sports":
      return <FootballIcon className={className} />;
    case "slots":
      return <SlotMachineIcon className={className} />;
    default:
      return <CardsIcon className={className} />;
  }
}

/**
 * JackpotWinnerCard — icon, ชื่อผู้ใช้, ยอดเงิน, หมวด/เกม
 * ถูกเรียกใช้โดย JackpotSection.tsx
 */
export function JackpotWinnerCard({ winner }: JackpotWinnerCardProps) {
  const amountText = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(winner.amount);

  return (
    <article className="surface flex min-w-0 flex-col items-center rounded-[var(--radius-panel)] px-2 py-3 text-center sm:px-3 sm:py-4">
      <JackpotCategoryIcon category={winner.category} />
      <p className="mt-2 w-full truncate text-[11px] font-semibold text-[var(--text-secondary)]">
        {winner.maskedUsername}
      </p>
      <p className="mt-1 text-sm font-bold tabular-nums leading-tight text-[var(--text-primary)] sm:text-base">
        {amountText} {winner.currency}
      </p>
      <p className="mt-2 text-[10px] font-semibold text-[var(--icon-default)]">{winner.categoryLabel}</p>
      <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[var(--text-muted)]">
        {winner.gameName}
      </p>
      <p className="mt-0.5 truncate text-[9px] text-[var(--text-muted)]">{winner.providerName}</p>
    </article>
  );
}
