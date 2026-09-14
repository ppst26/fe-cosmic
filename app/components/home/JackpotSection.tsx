import React from "react";
import { JackpotWinner } from "../../types/lobby";
import { TrophyIcon } from "../ui/Icons";
import { JackpotWinnerCard } from "../ui/JackpotWinnerCard";

interface JackpotSectionProps {
  title?: string;
  winners: JackpotWinner[];
}

/**
 * JackpotSection — เงินรางวัลระดับตำนาน, grid 3 คอลัมน์บนมือถือ
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function JackpotSection({
  title = "เงินรางวัลระดับตำนาน",
  winners,
}: JackpotSectionProps) {
  return (
    <section className="mt-10 w-full min-w-0 sm:mt-12" aria-labelledby="jackpot-section-title">
      <div className="mb-3 flex items-center gap-2">
        <TrophyIcon className="h-6 w-6 text-[var(--icon-default)]" />
        <h2
          id="jackpot-section-title"
          className="text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-xl"
        >
          {title}
        </h2>
      </div>

      <div className="grid min-w-0 grid-cols-3 gap-2">
        {winners.map((winner) => (
          <JackpotWinnerCard key={winner.id} winner={winner} />
        ))}
      </div>
    </section>
  );
}
