import { PROFILE_HUB_STATS_MOCK } from "@/app/data/profileHubMockData";
import { MENU_DIALOG_TICKET_COUNT_MOCK } from "@/app/data/menuMockData";
import { SIGNUP_BANKS, SIGNUP_CHANNELS } from "@/app/data/signupMockData";
import { HEADER_WALLET_ICON_SRC, MOCK_MAIN_WALLET_BALANCE } from "@/app/data/walletMockData";

export function fetchProfileHubStats() {
  return PROFILE_HUB_STATS_MOCK;
}

export function fetchWalletBalance() {
  return { amount: MOCK_MAIN_WALLET_BALANCE, iconSrc: HEADER_WALLET_ICON_SRC };
}

export function fetchSignUpOptions() {
  return { banks: SIGNUP_BANKS, channels: SIGNUP_CHANNELS };
}

export function fetchMenuTicketCount() {
  return MENU_DIALOG_TICKET_COUNT_MOCK;
}
