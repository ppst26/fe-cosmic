import { CASHBACK_LOSS_PANEL_MOCK, CASHBACK_PLAY_PANEL_MOCK, CASHBACK_TABS } from "@/app/data/cashbackMockData";
import {
  LOSS_REBATE_HISTORY_MOCK,
  LOSS_REBATE_MONTH_OPTIONS,
  LOSS_REBATE_SUMMARY_MOCK,
  LOSS_REBATE_TERMS,
} from "@/app/data/lossRebateMockData";

export function fetchCashbackPanels() {
  return { tabs: CASHBACK_TABS, play: CASHBACK_PLAY_PANEL_MOCK, loss: CASHBACK_LOSS_PANEL_MOCK };
}

export function fetchLossRebate() {
  return {
    summary: LOSS_REBATE_SUMMARY_MOCK,
    months: LOSS_REBATE_MONTH_OPTIONS,
    terms: LOSS_REBATE_TERMS,
    history: LOSS_REBATE_HISTORY_MOCK,
  };
}
