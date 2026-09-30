import {
  REFERRAL_COMMISSION_TIERS,
  REFERRAL_EARNING_HISTORY_MOCK,
  REFERRAL_EARNING_PERIOD_OPTIONS,
  REFERRAL_EARNING_SUMMARY_MOCK,
  REFERRAL_FEATURE_CHECKS,
  REFERRAL_MOCK_REF_CODE,
  REFERRAL_STATS_MOCK,
  REFERRAL_STEPS,
  REFERRAL_USERS_MOCK,
} from "@/app/data/referralMockData";

export function fetchReferralOverview() {
  return {
    refCode: REFERRAL_MOCK_REF_CODE,
    stats: REFERRAL_STATS_MOCK,
    tiers: REFERRAL_COMMISSION_TIERS,
    checks: REFERRAL_FEATURE_CHECKS,
    steps: REFERRAL_STEPS,
  };
}

export function fetchReferralUsers() {
  return REFERRAL_USERS_MOCK;
}

export function fetchReferralEarnings() {
  return {
    summary: REFERRAL_EARNING_SUMMARY_MOCK,
    history: REFERRAL_EARNING_HISTORY_MOCK,
    periods: REFERRAL_EARNING_PERIOD_OPTIONS,
  };
}
