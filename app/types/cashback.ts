/* ── จาก app/data/cashbackMockData.ts ── */

export type CashbackTabId = "play" | "loss";

export interface CashbackPanelMock {
  title: string;
  subtitle: string;
  claimableThb: number;
  statusHint: string;
  ratePercent: number;
  minThb: number;
  maxPerClaimThb: number;
  cycleLabel: string;
  canClaim: boolean;
  claimButtonLabel: string;
}

/* ── จาก app/data/lossRebateMockData.ts ── */

export interface LossRebateSummaryMock {
  rebateReadyThb: number;
  exampleRatePercent: number;
  calculationPeriodLabel: string;
  statusLabel: string;
  eligibleNetLossThb: number;
  rebateRatePercent: number;
  rebateBonusThb: number;
  isReadyToClaim: boolean;
}

export interface LossRebateMonthOption {
  id: string;
  label: string;
}

export interface LossRebateHistoryRow {
  id: string;
  monthId: string;
  periodLabel: string;
  netLossThb: number;
  bonusThb: number;
  receivedAt: string;
}
