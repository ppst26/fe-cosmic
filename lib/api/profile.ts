import { PROFILE_HUB_STATS_MOCK } from "@/app/data/profileHubMockData";
import { MENU_DIALOG_TICKET_COUNT_MOCK } from "@/app/data/menuMockData";
import { SIGNUP_BANKS, SIGNUP_CHANNELS } from "@/app/data/signupMockData";
import { MOCK_MAIN_WALLET_BALANCE } from "@/app/data/walletMockData";
import type { ApiResult } from "./http";

/** ยอดเครดิตหลัก — สัญญา GET /api/wallet/balance */
export interface WalletBalance {
  amount: number;
}

export function fetchProfileHubStats() {
  return PROFILE_HUB_STATS_MOCK;
}

/**
 * ยอดเครดิตหลัก — อ่านผ่าน WalletProvider (useWallet) เท่านั้น
 * ต่อ backend: return apiFetch<WalletBalance>("/api/wallet/balance")
 */
export async function fetchWalletBalance(): Promise<ApiResult<WalletBalance>> {
  return { ok: true, status: 200, data: { amount: MOCK_MAIN_WALLET_BALANCE } };
}

export function fetchSignUpOptions() {
  return { banks: SIGNUP_BANKS, channels: SIGNUP_CHANNELS };
}

export function fetchMenuTicketCount() {
  return MENU_DIALOG_TICKET_COUNT_MOCK;
}
