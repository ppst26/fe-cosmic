import assert from "node:assert/strict";
import test from "node:test";
import { getVipRankImageSrc } from "./vipMockData";

test("rank image from the API wins and is used as sent", () => {
  assert.equal(getVipRankImageSrc("vip3", "https://cdn.example.com/rank/silver-v9.webp"), "https://cdn.example.com/rank/silver-v9.webp");
  assert.equal(getVipRankImageSrc("vip3", "  /uploads/vip3.png?v=7 "), "/uploads/vip3.png?v=7");
});

test("without an API value it falls back to the bundled image with a cache-bust", () => {
  assert.equal(getVipRankImageSrc("vip3"), "/rank/silver.webp?v=2");
  assert.equal(getVipRankImageSrc("vip3", ""), "/rank/silver.webp?v=2");
  assert.equal(getVipRankImageSrc("vip3", null), "/rank/silver.webp?v=2");
});
