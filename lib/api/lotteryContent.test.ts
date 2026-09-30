import assert from "node:assert/strict";
import test from "node:test";
import { LOTTERY_CATALOG_ENTRIES } from "@/app/data/lotteryCatalogMockData";
import { LOTTERY_FEATURED_ITEMS } from "@/app/data/lotteryHubMockData";
import { getLotteryPlayRounds } from "@/app/data/lotteryRoundsMockData";
import { fetchLotteryCatalog, fetchLotteryHub, fetchLotteryPlayRounds } from "./lotteryContent";

test("lottery content readers return the current mocks", () => {
  assert.equal(fetchLotteryCatalog(), LOTTERY_CATALOG_ENTRIES);
  assert.equal(fetchLotteryHub().featured, LOTTERY_FEATURED_ITEMS);
  const from = new Date("2026-10-01T00:00:00.000Z");
  assert.deepEqual(fetchLotteryPlayRounds("thai-government", from), getLotteryPlayRounds("thai-government", from));
});
