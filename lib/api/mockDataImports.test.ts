import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import test from "node:test";

/**
 * ตัวกันถอยหลัง (ratchet): UI ต้องไม่ import app/data/*MockData ตรง — ต้องผ่าน lib/api + hook ใน app/hooks/api/*
 * เพื่อให้เปลี่ยนเป็น API จริงได้โดยแก้ที่ lib/api ที่เดียว
 *
 * ส่วนใหญ่ของรายการด้านล่างเป็น config คงที่/ฟังก์ชัน lookup (BOTTOM_NAV_DATA · footer · ไอคอนเพชร · rank helper) ที่ไม่ได้มาจาก backend —
 * ข้อมูลจาก backend ที่ย้ายแล้ว: ตารางสิทธิ์ VIP (useVipBenefits) · แคตตาล็อกหวย (useLotteryCatalog)
 * ที่ยังเหลือ: getThaiLottoDrawByRoundId (ถ้า backend กำหนดรอบ) · buildPending*Payload (ดู docs/api/backend-integration.md §11)
 *
 * ALLOWED_LEGACY = ไฟล์ที่ยัง import ตรงอยู่ (หนี้ที่ต้องย้าย) — ห้ามเพิ่มรายการใหม่ ให้ลบออกเมื่อย้ายแล้ว
 * (เทสต์จะล้มถ้ารายการที่อยู่ในนี้ไม่ import แล้ว เพื่อให้ลิสต์ลดลงเรื่อย ๆ)
 */
const ALLOWED_LEGACY: readonly string[] = [
  "app/[lang]/cashback/page.tsx",
  "app/[lang]/event/page.tsx",
  "app/[lang]/gems-store/page.tsx",
  "app/[lang]/missions/check-in/page.tsx",
  "app/[lang]/profile/account/page.tsx",
  "app/[lang]/promotions/[id]/page.tsx",
  "app/[lang]/promotions/page.tsx",
  "app/[lang]/referral/page.tsx",
  "app/[lang]/transactions/page.tsx",
  "app/[lang]/vip/page.tsx",
  "app/components/activities/ActivityHubShared.tsx",
  "app/components/game/CategoryProviderGamesPage.tsx",
  "app/components/gems-store/GemsRedeemConfirmDialog.tsx",
  "app/components/gems-store/GemsRedeemSuccessDialog.tsx",
  "app/components/gems-store/GemsStorePageContent.tsx",
  "app/components/home/HomeDesktopPeekCarousel.tsx",
  "app/components/home/HomeLobbyPage.tsx",
  "app/components/layout/CosmicFooter.tsx",
  "app/components/layout/Header.tsx",
  "app/components/layout/LobbyDesktopHubMenuStack.tsx",
  "app/components/layout/LobbyDesktopPageShell.tsx",
  "app/components/layout/LobbyDesktopRightMenuGrid.tsx",
  "app/components/layout/LobbyDesktopSidebar.tsx",
  "app/components/layout/MenuDrawerWalletCards.tsx",
  "app/components/lottery/LotteryPlayRoundList.tsx",
  "app/components/lottery/LotteryResultsPage.tsx",
  "app/components/lottery/thai/ThaiGovernmentPlayPage.tsx",
  "app/components/notifications/NotificationCenterPanel.tsx",
  "app/components/notifications/NotificationPopoverFooter.tsx",
  "app/components/profile/ProfileAccountTabs.tsx",
  "app/components/profile/ProfileBankAccountCard.tsx",
  "app/components/profile/ProfileHubBody.tsx",
  "app/components/profile/ProfileHubHeader.tsx",
  "app/components/reward/FreespinsPageContent.tsx",
  "app/components/reward/LuckyBoxRedeemPanel.tsx",
  "app/components/reward/RandomCardRedeemPanel.tsx",
  "app/components/reward/RewardHubShortcutRow.tsx",
  "app/components/reward/RewardHubSummaryCard.tsx",
  "app/components/reward/RewardPointsBar.tsx",
  "app/components/reward/RewardStandaloneShell.tsx",
  "app/components/transactions/PendingTransactionProvider.tsx",
  "app/components/transactions/TransactionsPageContent.tsx",
  "app/components/vip/VipBenefitsComparisonTable.tsx",
  "app/components/vip/VipMaintainRankPanel.tsx",
  "app/components/vip/VipMyLevelBenefitsCard.tsx",
  "app/components/vip/VipPageContent.tsx",
  "app/components/vip/VipRankCarousel.tsx",
  "app/components/vip/VipRankEmblem.tsx",
  "app/components/vip/VipRankLevelUpCard.tsx",
];

const ROOT = process.cwd();
const SCAN_DIRS = ["app/components", "app/[lang]", "app/hooks"];
const IMPORT_RE = /from\s+["']@\/app\/data\/[A-Za-z0-9_]*MockData["']/;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [full] : [];
  });
}

function importers(): string[] {
  return SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)))
    .filter((file) => IMPORT_RE.test(readFileSync(file, "utf8")))
    .map((file) => relative(ROOT, file).split(sep).join("/"))
    .sort();
}

test("UI does not import *MockData directly (except the legacy list)", () => {
  const found = importers();
  const added = found.filter((f) => !ALLOWED_LEGACY.includes(f));
  assert.deepEqual(added, [], `ไฟล์ใหม่ import app/data/*MockData ตรง — ย้ายไปผ่าน lib/api + app/hooks/api/*:\n${added.join("\n")}`);
  const stale = ALLOWED_LEGACY.filter((f) => !found.includes(f));
  assert.deepEqual(stale, [], `ลบออกจาก ALLOWED_LEGACY (ย้ายแล้ว):\n${stale.join("\n")}`);
});
