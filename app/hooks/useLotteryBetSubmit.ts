"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { submitLotteryBetSlip } from "@/lib/lottery/submitBetSlip";
import { THAI_LOTTO_BET_TYPES } from "@/app/data/thaiLottoMockData";
import { YIKI_SETTLEMENT_TYPES } from "@/app/data/yikiMockData";
import type { SubmitLotteryBetRequest } from "@/app/types/lotteryBetApi";

export type LotteryBetDialogState = { kind: "error"; message: string };

export interface LotteryBetRoundMeta {
  drawLabel: string;
  drawCloseAt: string;
  continuePlayHref: string;
}

/**
 * ส่งโพย mock — สำเร็จแล้วไปหน้าสรุปโพย · ผิดพลาดเปิด dialog
 */
export function useLotteryBetSubmit(continuePlayHref?: string) {
  const router = useRouter();
  const [dialog, setDialog] = useState<LotteryBetDialogState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeDialog = useCallback(() => setDialog(null), []);

  const submit = useCallback(
    async (payload: SubmitLotteryBetRequest): Promise<boolean> => {
      setIsSubmitting(true);
      try {
        const result = await submitLotteryBetSlip({
          ...payload,
          continuePlayHref: payload.continuePlayHref ?? continuePlayHref,
        });
        if (result.ok) {
          const playHref = encodeURIComponent(
            payload.continuePlayHref ?? continuePlayHref ?? "/lottery",
          );
          router.push(`/lottery/slips/${result.slipId}?continue=${playHref}`);
          return true;
        }
        setDialog({ kind: "error", message: result.error });
        return false;
      } catch {
        setDialog({ kind: "error", message: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์" });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [continuePlayHref, router],
  );

  return { submit, dialog, closeDialog, isSubmitting };
}

/** ผูกส่งโพยหวยรัฐบาลไทยกับ roundId จาก URL */
export function useThaiGovernmentBetSubmit(roundId: string, meta: LotteryBetRoundMeta) {
  const { submit, dialog, closeDialog, isSubmitting } = useLotteryBetSubmit(meta.continuePlayHref);

  const onSubmit = useCallback(
    async (entries: { typeId: string; number: string; amount: number }[]) =>
      submit({
        market: "thai-government",
        roundId,
        drawLabel: meta.drawLabel,
        drawCloseAt: meta.drawCloseAt,
        continuePlayHref: meta.continuePlayHref,
        lines: entries.map((entry) => {
          const type = THAI_LOTTO_BET_TYPES.find((item) => item.id === entry.typeId);
          return {
            typeKey: entry.typeId,
            typeLabel: type?.label,
            number: entry.number,
            amount: entry.amount,
            payoutRate: type?.payoutRate,
          };
        }),
      }),
    [meta.continuePlayHref, meta.drawCloseAt, meta.drawLabel, roundId, submit],
  );

  return { onSubmit, dialog, closeDialog, isSubmitting };
}

/** ผูกส่งโพยยี่กี/ตลาดหวยที่ใช้ YikiBetBoard */
export function useYikiStyleBetSubmit(market: string, roundId: string, meta: LotteryBetRoundMeta) {
  const { submit, dialog, closeDialog, isSubmitting } = useLotteryBetSubmit(meta.continuePlayHref);

  const onSubmit = useCallback(
    async (entries: { settlementTypeId: string; number: string; amount: number | null }[]) =>
      submit({
        market,
        roundId,
        drawLabel: meta.drawLabel,
        drawCloseAt: meta.drawCloseAt,
        continuePlayHref: meta.continuePlayHref,
        lines: entries.map((entry) => {
          const settlement = YIKI_SETTLEMENT_TYPES[entry.settlementTypeId as keyof typeof YIKI_SETTLEMENT_TYPES];
          return {
            typeKey: entry.settlementTypeId,
            typeLabel: settlement?.label,
            number: entry.number,
            amount: entry.amount ?? 0,
            payoutRate: settlement?.payoutRate,
          };
        }),
      }),
    [market, meta.continuePlayHref, meta.drawCloseAt, meta.drawLabel, roundId, submit],
  );

  return { onSubmit, dialog, closeDialog, isSubmitting };
}
