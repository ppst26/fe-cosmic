"use client";

import React, { useMemo } from "react";
import { EmptyState } from "@/app/components/ui/StatusState";
import { useParams } from "next/navigation";
import { LotteryPlayPageShell } from "@/app/components/lottery/LotteryPlayPageShell";
import { ThaiLottoBetBoard } from "@/app/components/lottery/thai/ThaiLottoBetBoard";
import { LotteryBetResultDialog } from "@/app/components/lottery/LotteryBetResultDialog";
import { useThaiLottoBoard } from "@/app/hooks/api/lottery";
import { LoadingState } from "@/app/components/ui/StatusState";
import { getThaiLottoDrawByRoundId } from "@/app/data/lotteryRoundsMockData";
import { useThaiGovernmentBetSubmit } from "@/app/hooks/useLotteryBetSubmit";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";

/**
 * Step 3 — แทงหวยรัฐบาลไทยตามรอบที่เลือก
 */
export default function ThaiGovernmentLotteryPlayPage() {
  const { t, roundLabel } = useLotteryI18n();
  const thaiBoard = useThaiLottoBoard().data;
  const urlParams = useParams();
  const roundId = (urlParams?.roundId as string) || "";
  const draw = useMemo(() => getThaiLottoDrawByRoundId(roundId), [roundId]);
  const betMeta = draw
    ? {
        drawLabel: roundLabel(draw.drawLabel),
        drawCloseAt: draw.closeAt,
        continuePlayHref: `/lottery/thai-government/${roundId}`,
      }
    : null;
  const { onSubmit, dialog, closeDialog, isSubmitting } = useThaiGovernmentBetSubmit(
    roundId,
    betMeta ?? { drawLabel: "", drawCloseAt: "", continuePlayHref: "/lottery/thai-government" },
  );

  return (
    <LotteryPlayPageShell
      title={t("markets.thaiGovernment")}
      backHref="/lottery/thai-government"
      mainClassName="mx-auto max-w-[var(--content-max)] lg:mx-0 lg:max-w-none"
    >
      {({ onStepChange }) =>
        draw && !thaiBoard ? (
          <LoadingState label={t("board.loading")} />
        ) : draw && thaiBoard ? (
          <>
            <ThaiLottoBetBoard
              draw={draw}
              groups={thaiBoard.groups}
              betTypes={thaiBoard.betTypes}
              backHref="/lottery/thai-government"
              onStepChange={onStepChange}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
            />
            <LotteryBetResultDialog state={dialog} onClose={closeDialog} />
          </>
        ) : (
          <EmptyState
            className="mt-4"
            variant="card"
            title={t("board.roundNotFoundTitle")}
            description={t("board.roundNotFoundOther")}
            primaryAction={{ label: t("board.viewAllRounds"), href: "/lottery/thai-government" }}
          />
        )
      }
    </LotteryPlayPageShell>
  );
}
