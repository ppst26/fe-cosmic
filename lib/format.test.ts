import assert from "node:assert/strict";
import test from "node:test";
import {
  formatBaht,
  formatCashbackCurrency,
  formatDateTimeShort,
  formatGemsAmount,
  formatHeaderWalletBalance,
  formatMoney,
  formatPercent,
  formatReferralCount,
  formatVipCompactAmount,
  formatVipMissionStatus,
  formatWonAt,
} from "./format";

/** ล็อกผลลัพธ์ให้ตรงกับ formatter เดิมใน app/data/*MockData.ts ก่อนย้าย */
test("number and money formats", () => {
  assert.equal(formatMoney(1234.5), "1,234.50");
  assert.equal(formatBaht(1234.5), new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 2 }).format(1234.5));
  assert.equal(formatCashbackCurrency(50), "฿ 50.00");
  assert.equal(formatPercent(0.5), "0.5%");
  assert.equal(formatPercent(12.345), "12.35%");
  assert.equal(formatReferralCount(1200), "1,200 คน");
  assert.equal(formatGemsAmount(1500), "1,500 Gems");
});

test("header wallet balance rounds to a whole number", () => {
  assert.equal(formatHeaderWalletBalance(12450.6), "12,451");
  assert.equal(formatHeaderWalletBalance(999), "999");
});

test("vip compact amount switches to ล้าน from one million", () => {
  assert.equal(formatVipCompactAmount(950_000), "950,000");
  assert.equal(formatVipCompactAmount(1_500_000), "1.5 ล้าน");
  assert.equal(formatVipCompactAmount(25_400_000), "25 ล้าน");
  assert.equal(
    formatVipMissionStatus({ progress: 1200, target: 5000, unit: "เทิร์น" } as Parameters<typeof formatVipMissionStatus>[0]),
    "1,200 / 5,000 เทิร์น",
  );
});

test("date formats", () => {
  const iso = new Date(2026, 8, 14, 18, 32).toISOString();
  assert.equal(formatDateTimeShort(iso, " • "), "14/09/2026 • 18:32");
  assert.equal(formatWonAt(new Date(2026, 0, 5, 7, 8, 9)), "05/01/2026 07:08:09");
});
