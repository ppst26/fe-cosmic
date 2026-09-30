import { LOTTERY_CATALOG_ENTRIES } from "@/app/data/lotteryCatalogMockData";
import {
  LOTTERY_FEATURED_ITEMS,
  LOTTERY_GRID_ITEMS,
  LOTTERY_LATEST_RESULTS,
} from "@/app/data/lotteryHubMockData";
import { LOTTERY_MARKETS } from "@/app/data/lotteryMarketsMockData";
import { getLotteryPlayRounds } from "@/app/data/lotteryRoundsMockData";
import { THAI_LOTTO_BET_TYPES, THAI_LOTTO_GROUPS, THAI_LOTTO_LAST_RESULT } from "@/app/data/thaiLottoMockData";
import { YIKI_BET_TYPES, YIKI_GROUPS, YIKI_SETTLEMENT_TYPES } from "@/app/data/yikiMockData";

/** อ่านแคตตาล็อกหวยจาก mock — จุดเดียวก่อนเปลี่ยนเป็น API */
export function fetchLotteryCatalog() {
  return LOTTERY_CATALOG_ENTRIES;
}

/** ข้อมูลหน้า hub หวย (featured / grid / ผลล่าสุด) */
export function fetchLotteryHub() {
  return {
    featured: LOTTERY_FEATURED_ITEMS,
    grid: LOTTERY_GRID_ITEMS,
    latest: LOTTERY_LATEST_RESULTS,
  };
}

/** รายการตลาดหวยทั้งหมด */
export function fetchLotteryMarkets() {
  return LOTTERY_MARKETS;
}

/** รายการรอบเล่นตาม slug — ส่งต่อ getLotteryPlayRounds */
export function fetchLotteryPlayRounds(slug: string, from?: Date) {
  return getLotteryPlayRounds(slug, from);
}

/** กระดานยี่กี */
export function fetchYikiBoard() {
  return { groups: YIKI_GROUPS, betTypes: YIKI_BET_TYPES, settlement: YIKI_SETTLEMENT_TYPES };
}

/** กระดานหวยรัฐบาลไทย */
export function fetchThaiLottoBoard() {
  return {
    groups: THAI_LOTTO_GROUPS,
    betTypes: THAI_LOTTO_BET_TYPES,
    lastResult: THAI_LOTTO_LAST_RESULT,
  };
}
