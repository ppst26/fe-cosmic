"use client";

import React, { useMemo } from "react";
import { YikiBetBoard } from "./yiki/YikiBetBoard";
import { LotteryBetResultDialog } from "./LotteryBetResultDialog";
import { fetchYikiBoard } from "@/lib/api/lotteryContent";
import { lotteryPlayMarketMeta, resolveLotteryPlayRound } from "@/lib/lottery/resolvePlayRound";
import { useYikiStyleBetSubmit } from "@/app/hooks/useLotteryBetSubmit";

interface LotteryYikiPlayBoardProps {
  marketSlug: string;
  roundId: string;
  backHref: string;
  onStepChange: (step: "pick" | "price") => void;
}

/**
 * กระดานแทงยี่กี/หวยหุ้น — UI เดียวกับหวยรัฐบาล · resolve รอบจาก slug+id
 */
export function LotteryYikiPlayBoard({
  marketSlug,
  roundId,
  backHref,
  onStepChange,
}: LotteryYikiPlayBoardProps) {
  const yikiBoard = fetchYikiBoard();
  const playRound = useMemo(
    () => resolveLotteryPlayRound(marketSlug, roundId),
    [marketSlug, roundId],
  );
  const marketMeta = useMemo(() => lotteryPlayMarketMeta(marketSlug), [marketSlug]);
  const round = playRound
    ? { id: playRound.id, label: playRound.label, closeAt: playRound.closeAt }
    : null;

  const betMeta = playRound
    ? {
        drawLabel: playRound.label,
        drawCloseAt: playRound.closeAt,
        continuePlayHref: `${backHref}/${roundId}`,
      }
    : { drawLabel: "", drawCloseAt: "", continuePlayHref: backHref };

  const { onSubmit, dialog, closeDialog, isSubmitting } = useYikiStyleBetSubmit(
    marketSlug,
    roundId,
    betMeta,
  );

  if (!round) {
    return <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ไม่พบรอบที่เลือก</p>;
  }

  return (
    <>
      <YikiBetBoard
        round={round}
        groups={yikiBoard.groups}
        betTypes={yikiBoard.betTypes}
        settlementTypes={yikiBoard.settlement}
        backHref={backHref}
        marketTitle={marketMeta.title}
        flagLabel={marketMeta.flagLabel}
        flagTone={marketMeta.flagTone}
        marketSlug={marketSlug}
        onStepChange={onStepChange}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
      <LotteryBetResultDialog state={dialog} onClose={closeDialog} />
    </>
  );
}
