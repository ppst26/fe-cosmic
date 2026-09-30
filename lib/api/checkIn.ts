import {
  CUMULATIVE_CHECKIN_MILESTONES,
  DAILY_CHECKIN_INITIAL,
  DAILY_CHECKIN_TERMS,
} from "@/app/data/dailyCheckInMockData";

export function fetchCheckIn() {
  return {
    days: DAILY_CHECKIN_INITIAL,
    milestones: CUMULATIVE_CHECKIN_MILESTONES,
    terms: DAILY_CHECKIN_TERMS,
  };
}
