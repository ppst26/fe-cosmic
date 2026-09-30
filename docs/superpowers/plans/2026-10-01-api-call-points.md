# API Call Points Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ให้ข้อมูลที่ backend จะส่งทีหลังถูกเรียกผ่าน `lib/api/` โดยฟังก์ชันอ่านคืน mock ชุดเดิมทันที และฟังก์ชันส่งยังหน่วงเวลาเท่าเดิม เพื่อให้รูปกับข้อความบนจอไม่เปลี่ยน

**Architecture:** `lib/api/endpoints.ts` เป็นแผนที่อย่างเดียว ไม่คืนข้อมูล ไฟล์โดเมนใน `lib/api/` อ่านจาก `app/data/*MockData.ts` แล้วคืนค่าเดิม คอมโพเนนต์ที่วันนี้ import ค่า mock มาวาดเองเปลี่ยนมาเรียกฟังก์ชันเหล่านี้ตอน render การจัดรูปแบบตัวเลขและโครงนำทางยังอยู่ที่ไฟล์เดิม

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, pnpm, `node:test` ผ่าน `pnpm dlx tsx --test`

## Global Constraints

- ฟังก์ชัน `fetch*` เป็น synchronous เรียกตอน render ห้ามใส่ `useEffect` สถานะโหลด หรือ skeleton ใหม่
- ฟังก์ชัน `submit*` คืน `Promise` ของ `{ ok: true }` หรือ `{ ok: false, error: string }` และหน่วงเวลาเท่าของเดิม
- path รูปยังมาจาก object ที่ฟังก์ชันคืน ห้ามย้ายไฟล์ออกจาก `public/`
- ไม่สร้าง route ใหม่ใน `app/api/` และไม่ใส่ `NEXT_PUBLIC_API_URL`
- ไม่ย้าย `lib/auth/client.ts`, `PromotionsCatalogProvider`, `lib/lottery/submitBetSlip.ts`, `lib/lottery/fetchLotterySlip.ts`
- ไม่หุ้ม `BOTTOM_NAV_DATA`, `CATEGORIES_DATA`, `HEADER_DESKTOP_NAV`, `DESKTOP_RIGHT_MENU_TILES`, `MENU_DIALOG_SECTIONS`, ไอคอนเมนู และ `footerMockData.ts`
- ฟังก์ชันจัดรูปแบบอย่าง `formatDepositAmount` ยัง import จาก `app/data/`
- ชื่อไฟล์สลิปฝากยังอยู่แค่ในแผง ไม่ส่งเข้า `submitDeposit`

---

### Task 1: Endpoint map

**Files:**
- Create: `lib/api/endpoints.ts`
- Test: `lib/api/endpoints.test.ts`

**Interfaces:**
- Consumes: ไม่มี
- Produces: `EndpointDef`, `ENDPOINTS` ที่คีย์เป็นชื่อฟังก์ชันในสเปกทุกตัว (`fetchDepositMethods` จนถึง `fetchThaiLottoBoard` รวม `submitDeposit`, `submitWithdraw`, `submitCoupon`)

- [ ] **Step 1: Write the failing test**

สร้าง `lib/api/endpoints.test.ts`

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { ENDPOINTS } from "./endpoints";

test("endpoint map lists the deposit contract", () => {
  assert.deepEqual(ENDPOINTS.fetchDepositMethods, {
    method: "GET",
    path: "/api/deposit/methods",
    auth: true,
    client: "fetchDepositMethods",
  });
  assert.equal(ENDPOINTS.submitCoupon.method, "POST");
  assert.equal(ENDPOINTS.submitCoupon.path, "/api/coupons/redeem");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm dlx tsx --test lib/api/endpoints.test.ts`
Expected: FAIL เพราะหา `./endpoints` ไม่เจอ

- [ ] **Step 3: Write the map**

สร้าง `lib/api/endpoints.ts` ตามนี้ทุกแถว ห้ามละชื่อฟังก์ชัน

```ts
/**
 * แผนที่จุดเรียก — agent ต่อ backend โดยแก้เฉพาะฟังก์ชันใน lib/api/
 * ชนิดข้อมูลที่คืนต้องตรงของเดิม path รูปต้องมากับข้อมูลที่คืน
 * ห้ามใส่หน้าโหลดในรอบที่เปลี่ยนจาก mock เป็น HTTP
 * ปุ่มนำทาง ไอคอนเมนู และฟุตเตอร์ไม่ใช่ endpoint
 */

export interface EndpointDef {
  method: "GET" | "POST";
  path: string;
  auth: boolean;
  client: string;
}

export const ENDPOINTS = {
  fetchDepositMethods: { method: "GET", path: "/api/deposit/methods", auth: true, client: "fetchDepositMethods" },
  fetchDepositBankAccount: { method: "GET", path: "/api/deposit/bank-account", auth: true, client: "fetchDepositBankAccount" },
  fetchDepositQuickAmounts: { method: "GET", path: "/api/deposit/quick-amounts", auth: true, client: "fetchDepositQuickAmounts" },
  submitDeposit: { method: "POST", path: "/api/deposit", auth: true, client: "submitDeposit" },
  fetchWithdrawAccount: { method: "GET", path: "/api/withdraw/account", auth: true, client: "fetchWithdrawAccount" },
  fetchWithdrawBalance: { method: "GET", path: "/api/withdraw/balance", auth: true, client: "fetchWithdrawBalance" },
  fetchWithdrawQuickAmounts: { method: "GET", path: "/api/withdraw/quick-amounts", auth: true, client: "fetchWithdrawQuickAmounts" },
  submitWithdraw: { method: "POST", path: "/api/withdraw", auth: true, client: "submitWithdraw" },
  submitCoupon: { method: "POST", path: "/api/coupons/redeem", auth: true, client: "submitCoupon" },
  fetchVipPlayer: { method: "GET", path: "/api/vip/player", auth: true, client: "fetchVipPlayer" },
  fetchVipRanks: { method: "GET", path: "/api/vip/ranks", auth: false, client: "fetchVipRanks" },
  fetchVipBenefits: { method: "GET", path: "/api/vip/benefits", auth: false, client: "fetchVipBenefits" },
  fetchReferralOverview: { method: "GET", path: "/api/referral/overview", auth: true, client: "fetchReferralOverview" },
  fetchReferralUsers: { method: "GET", path: "/api/referral/users", auth: true, client: "fetchReferralUsers" },
  fetchReferralEarnings: { method: "GET", path: "/api/referral/earnings", auth: true, client: "fetchReferralEarnings" },
  fetchCashbackPanels: { method: "GET", path: "/api/cashback", auth: true, client: "fetchCashbackPanels" },
  fetchLossRebate: { method: "GET", path: "/api/cashback/loss-rebate", auth: true, client: "fetchLossRebate" },
  fetchCheckIn: { method: "GET", path: "/api/missions/check-in", auth: true, client: "fetchCheckIn" },
  fetchGemsStore: { method: "GET", path: "/api/gems-store", auth: true, client: "fetchGemsStore" },
  fetchWheel: { method: "GET", path: "/api/wheel", auth: true, client: "fetchWheel" },
  fetchTransactions: { method: "GET", path: "/api/transactions", auth: true, client: "fetchTransactions" },
  fetchPendingTransaction: { method: "GET", path: "/api/transactions/pending", auth: true, client: "fetchPendingTransaction" },
  fetchActivities: { method: "GET", path: "/api/activities", auth: false, client: "fetchActivities" },
  fetchProfileHubStats: { method: "GET", path: "/api/profile/hub-stats", auth: true, client: "fetchProfileHubStats" },
  fetchWalletBalance: { method: "GET", path: "/api/wallet/balance", auth: true, client: "fetchWalletBalance" },
  fetchSignUpOptions: { method: "GET", path: "/api/auth/sign-up-options", auth: false, client: "fetchSignUpOptions" },
  fetchMenuTicketCount: { method: "GET", path: "/api/menu/ticket-count", auth: true, client: "fetchMenuTicketCount" },
  fetchHomeBanners: { method: "GET", path: "/api/lobby/banners", auth: false, client: "fetchHomeBanners" },
  fetchHomeHighlights: { method: "GET", path: "/api/lobby/highlights", auth: false, client: "fetchHomeHighlights" },
  fetchHomeGames: { method: "GET", path: "/api/lobby/games", auth: false, client: "fetchHomeGames" },
  fetchHomeProviders: { method: "GET", path: "/api/lobby/providers", auth: false, client: "fetchHomeProviders" },
  fetchHomeFeatureActions: { method: "GET", path: "/api/lobby/feature-actions", auth: false, client: "fetchHomeFeatureActions" },
  fetchHomeTournaments: { method: "GET", path: "/api/lobby/tournaments", auth: false, client: "fetchHomeTournaments" },
  fetchLobbyAnnouncements: { method: "GET", path: "/api/lobby/announcements", auth: false, client: "fetchLobbyAnnouncements" },
  fetchHallOfFame: { method: "GET", path: "/api/lobby/hall-of-fame", auth: false, client: "fetchHallOfFame" },
  fetchDesktopPlayerPanel: { method: "GET", path: "/api/lobby/desktop-player", auth: true, client: "fetchDesktopPlayerPanel" },
  fetchLotteryCatalog: { method: "GET", path: "/api/lottery/catalog", auth: false, client: "fetchLotteryCatalog" },
  fetchLotteryHub: { method: "GET", path: "/api/lottery/hub", auth: false, client: "fetchLotteryHub" },
  fetchLotteryMarkets: { method: "GET", path: "/api/lottery/markets", auth: false, client: "fetchLotteryMarkets" },
  fetchLotteryPlayRounds: { method: "GET", path: "/api/lottery/markets/:slug/rounds", auth: false, client: "fetchLotteryPlayRounds" },
  fetchYikiBoard: { method: "GET", path: "/api/lottery/yiki/board", auth: false, client: "fetchYikiBoard" },
  fetchThaiLottoBoard: { method: "GET", path: "/api/lottery/thai/board", auth: false, client: "fetchThaiLottoBoard" },
} as const satisfies Record<string, EndpointDef>;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm dlx tsx --test lib/api/endpoints.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/api/endpoints.ts lib/api/endpoints.test.ts
git commit -m "feat(api): add endpoint map for future backend wiring"
```

---

### Task 2: Deposit read and submit

**Files:**
- Create: `lib/api/deposit.ts`
- Test: `lib/api/deposit.test.ts`
- Modify: `app/components/deposit/DepositBottomSheet.tsx`

**Interfaces:**
- Consumes: `ENDPOINTS.submitDeposit` ไม่ถูกเรียกในรันไทม์ ใช้แค่เป็นเอกสาร
- Produces:
  - `fetchDepositMethods(): DepositMethodOption[]`
  - `fetchDepositBankAccount(): DepositBankAccountMock`
  - `fetchDepositQuickAmounts(): { amounts: number[]; defaultAmount: number }`
  - `submitDeposit(input: { amount: number; methodId: DepositMethodId }): Promise<{ ok: true }>`

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  DEPOSIT_BANK_ACCOUNT_MOCK,
  DEPOSIT_DEFAULT_AMOUNT,
  DEPOSIT_METHOD_OPTIONS,
  DEPOSIT_QUICK_AMOUNTS,
} from "@/app/data/depositMockData";
import {
  fetchDepositBankAccount,
  fetchDepositMethods,
  fetchDepositQuickAmounts,
  submitDeposit,
} from "./deposit";

test("deposit reads return the current mock", () => {
  assert.deepEqual(fetchDepositMethods(), DEPOSIT_METHOD_OPTIONS);
  assert.deepEqual(fetchDepositBankAccount(), DEPOSIT_BANK_ACCOUNT_MOCK);
  assert.deepEqual(fetchDepositQuickAmounts(), {
    amounts: DEPOSIT_QUICK_AMOUNTS,
    defaultAmount: DEPOSIT_DEFAULT_AMOUNT,
  });
});

test("submitDeposit resolves ok after the existing delay", async () => {
  const started = Date.now();
  const result = await submitDeposit({ amount: 500, methodId: "bank" });
  assert.deepEqual(result, { ok: true });
  assert.ok(Date.now() - started >= 500);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm dlx tsx --test lib/api/deposit.test.ts`
Expected: FAIL เพราะหา `./deposit` ไม่เจอ

- [ ] **Step 3: Implement deposit client**

```ts
import {
  DEPOSIT_BANK_ACCOUNT_MOCK,
  DEPOSIT_DEFAULT_AMOUNT,
  DEPOSIT_METHOD_OPTIONS,
  DEPOSIT_QUICK_AMOUNTS,
  type DepositMethodId,
} from "@/app/data/depositMockData";

/** ช่องทางฝาก — คืนรายการ mock ทันที */
export function fetchDepositMethods() {
  return DEPOSIT_METHOD_OPTIONS;
}

/** บัญชีรับโอน — คืนการ์ดบัญชี mock ทันที */
export function fetchDepositBankAccount() {
  return DEPOSIT_BANK_ACCOUNT_MOCK;
}

/** ยอดด่วนและยอดเริ่มต้นของแผงฝาก */
export function fetchDepositQuickAmounts() {
  return {
    amounts: DEPOSIT_QUICK_AMOUNTS,
    defaultAmount: DEPOSIT_DEFAULT_AMOUNT,
  };
}

/** ยืนยันฝาก — หน่วง 500ms เท่าแผงเดิม ชื่อสลิปไม่เข้าฟังก์ชันนี้ */
export function submitDeposit(_input: { amount: number; methodId: DepositMethodId }) {
  return new Promise<{ ok: true }>((resolve) => {
    setTimeout(() => resolve({ ok: true }), 500);
  });
}
```

- [ ] **Step 4: Point the deposit sheet at the client**

ใน `DepositBottomSheet.tsx` เอาค่า mock สี่ตัวออกจาก import คง `formatDepositAmount`, `formatDepositTransferAmount`, `type DepositMethodId`

เรียกฟังก์ชันในฟังก์ชันที่เคยอ่านค่านนั้น โดยไม่เปลี่ยน JSX รอบ ๆ

```ts
const quick = fetchDepositQuickAmounts();
const [amount, setAmount] = useState(quick.defaultAmount);
const [amountInput, setAmountInput] = useState(String(quick.defaultAmount));
```

`resetFlow` ใช้ `quick.defaultAmount` แทน `DEPOSIT_DEFAULT_AMOUNT`

`DepositMethodsStep` บรรทัดแรกของฟังก์ชัน: `const methods = fetchDepositMethods();` แล้ว `.map` ที่ `methods`

จุด `const bank = DEPOSIT_BANK_ACCOUNT_MOCK` ทั้งสองที่ และ `clipboard.writeText(DEPOSIT_BANK_ACCOUNT_MOCK.accountNumberCopy)` เปลี่ยนเป็น `fetchDepositBankAccount()`

`DEPOSIT_QUICK_AMOUNTS.map` เปลี่ยนเป็น `fetchDepositQuickAmounts().amounts.map`

`handleConfirmDeposit` เป็น async และแทน `setTimeout` 500ms ด้วย

```ts
await submitDeposit({ amount, methodId: "bank" });
setSubmitting(false);
onCompleted?.(amount);
onClose();
```

เส้นทางยืนยันที่มีอยู่มีแค่ธนาคาร จึงส่ง `methodId: "bank"`

- [ ] **Step 5: Run test and typecheck**

Run: `pnpm dlx tsx --test lib/api/deposit.test.ts`
Expected: PASS

Run: `pnpm exec tsc --noEmit`
Expected: ไม่มี error

- [ ] **Step 6: Commit**

```bash
git add lib/api/deposit.ts lib/api/deposit.test.ts app/components/deposit/DepositBottomSheet.tsx
git commit -m "feat(api): read deposit mock through lib/api"
```

---

### Task 3: Withdraw read and submit

**Files:**
- Create: `lib/api/withdraw.ts`
- Test: `lib/api/withdraw.test.ts`
- Modify: `app/components/withdraw/WithdrawBottomSheet.tsx`

**Interfaces:**
- Consumes: ไม่มีจาก Task 2
- Produces:
  - `fetchWithdrawAccount(): WithdrawUserBankMock`
  - `fetchWithdrawBalance(): number`
  - `fetchWithdrawQuickAmounts(): { amounts: number[]; defaultAmount: number }`
  - `submitWithdraw(input: { amount: number }): Promise<{ ok: true }>`

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  WITHDRAW_AVAILABLE_BALANCE,
  WITHDRAW_DEFAULT_AMOUNT,
  WITHDRAW_QUICK_AMOUNTS,
  WITHDRAW_USER_BANK_MOCK,
} from "@/app/data/withdrawMockData";
import {
  fetchWithdrawAccount,
  fetchWithdrawBalance,
  fetchWithdrawQuickAmounts,
  submitWithdraw,
} from "./withdraw";

test("withdraw reads return the current mock", () => {
  assert.deepEqual(fetchWithdrawAccount(), WITHDRAW_USER_BANK_MOCK);
  assert.equal(fetchWithdrawBalance(), WITHDRAW_AVAILABLE_BALANCE);
  assert.deepEqual(fetchWithdrawQuickAmounts(), {
    amounts: WITHDRAW_QUICK_AMOUNTS,
    defaultAmount: WITHDRAW_DEFAULT_AMOUNT,
  });
});

test("submitWithdraw resolves ok after 500ms", async () => {
  const started = Date.now();
  assert.deepEqual(await submitWithdraw({ amount: 100 }), { ok: true });
  assert.ok(Date.now() - started >= 500);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm dlx tsx --test lib/api/withdraw.test.ts`
Expected: FAIL เพราะหา `./withdraw` ไม่เจอ

- [ ] **Step 3: Implement withdraw client**

```ts
import {
  WITHDRAW_AVAILABLE_BALANCE,
  WITHDRAW_DEFAULT_AMOUNT,
  WITHDRAW_QUICK_AMOUNTS,
  WITHDRAW_USER_BANK_MOCK,
} from "@/app/data/withdrawMockData";

/** บัญชีรับเงินถอน */
export function fetchWithdrawAccount() {
  return WITHDRAW_USER_BANK_MOCK;
}

/** ยอดที่ถอนได้ */
export function fetchWithdrawBalance() {
  return WITHDRAW_AVAILABLE_BALANCE;
}

/** ยอดด่วนและยอดเริ่มต้นของแผงถอน */
export function fetchWithdrawQuickAmounts() {
  return {
    amounts: WITHDRAW_QUICK_AMOUNTS,
    defaultAmount: WITHDRAW_DEFAULT_AMOUNT,
  };
}

/** ยืนยันถอน — หน่วง 500ms เท่าแผงเดิม */
export function submitWithdraw(_input: { amount: number }) {
  return new Promise<{ ok: true }>((resolve) => {
    setTimeout(() => resolve({ ok: true }), 500);
  });
}
```

- [ ] **Step 4: Point the withdraw sheet at the client**

คง `formatWithdrawAmount` และ `formatWithdrawMoney` จาก `withdrawMockData`

ใน `WithdrawBottomSheet` ใช้

```ts
const quick = fetchWithdrawQuickAmounts();
const bank = fetchWithdrawAccount();
const available = fetchWithdrawBalance();
```

แทน `WITHDRAW_DEFAULT_AMOUNT`, `WITHDRAW_USER_BANK_MOCK`, `WITHDRAW_AVAILABLE_BALANCE`

ชิปยอดด่วนใช้ `quick.amounts` ค่าเริ่มต้นและ `resetFlow` ใช้ `quick.defaultAmount` เพดานถอนใช้ `available`

`handleConfirm` เป็น async แทน `setTimeout` ด้วย `await submitWithdraw({ amount })` แล้วยัง `setSubmitting(false)`, `onCompleted?.(amount)`, `onClose()` ตามเดิม เงื่อนไข `amount <= 0` หรือเกินยอดยัง return ก่อนเรียก submit

- [ ] **Step 5: Run test and typecheck**

Run: `pnpm dlx tsx --test lib/api/withdraw.test.ts`
Expected: PASS

Run: `pnpm exec tsc --noEmit`
Expected: ไม่มี error

- [ ] **Step 6: Commit**

```bash
git add lib/api/withdraw.ts lib/api/withdraw.test.ts app/components/withdraw/WithdrawBottomSheet.tsx
git commit -m "feat(api): read withdraw mock through lib/api"
```

---

### Task 4: Coupon redeem

**Files:**
- Create: `lib/api/coupon.ts`
- Test: `lib/api/coupon.test.ts`
- Modify: `app/components/coupon/CouponRedeemBottomSheet.tsx`

**Interfaces:**
- Consumes: ไม่มี
- Produces: `submitCoupon(code: string): Promise<{ ok: true; message: string } | { ok: false; error: string }>`

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { submitCoupon } from "./coupon";

test("known coupon codes succeed with the existing message", async () => {
  const result = await submitCoupon("COSMIC100");
  assert.deepEqual(result, {
    ok: true,
    message: "แลกเครดิตฟรีสำเร็จ — ยอดจะเข้ากระเป๋าในไม่กี่นาที (mock)",
  });
});

test("unknown coupon codes fail with the existing message", async () => {
  const result = await submitCoupon("NOPE");
  assert.deepEqual(result, {
    ok: false,
    error: "รหัสคูปองไม่ถูกต้องหรือหมดอายุแล้ว",
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm dlx tsx --test lib/api/coupon.test.ts`
Expected: FAIL เพราะหา `./coupon` ไม่เจอ

- [ ] **Step 3: Implement coupon client**

```ts
const VALID_CODES = new Set(["COSMIC100", "FREEGEMS", "WELCOME50"]);

const SUCCESS_MESSAGE = "แลกเครดิตฟรีสำเร็จ — ยอดจะเข้ากระเป๋าในไม่กี่นาที (mock)";
const ERROR_MESSAGE = "รหัสคูปองไม่ถูกต้องหรือหมดอายุแล้ว";

/** แลกคูปอง — หน่วง 600ms แล้วคืนข้อความชุดเดิม */
export function submitCoupon(code: string) {
  return new Promise<{ ok: true; message: string } | { ok: false; error: string }>((resolve) => {
    setTimeout(() => {
      if (VALID_CODES.has(code)) {
        resolve({ ok: true, message: SUCCESS_MESSAGE });
        return;
      }
      resolve({ ok: false, error: ERROR_MESSAGE });
    }, 600);
  });
}
```

- [ ] **Step 4: Point the coupon sheet at the client**

ลบ `MOCK_VALID_CODES` ออกจาก `CouponRedeemBottomSheet.tsx`

`handleSubmit` ยังเช็คโค้ดว่างด้วยข้อความ `กรุณากรอกรหัสคูปอง` ก่อนเรียก submit จากนั้น

```ts
setSubmitting(true);
const result = await submitCoupon(normalized);
setSubmitting(false);
if (result.ok) {
  setSuccess(result.message);
  setCode("");
  return;
}
setError(result.error);
```

ลบ `window.setTimeout` 600ms ออกจากคอมโพเนนต์

- [ ] **Step 5: Run test and typecheck**

Run: `pnpm dlx tsx --test lib/api/coupon.test.ts`
Expected: PASS ทั้งสองเคส (ใช้เวลาประมาณ 1.2 วินาที)

Run: `pnpm exec tsc --noEmit`
Expected: ไม่มี error

- [ ] **Step 6: Commit**

```bash
git add lib/api/coupon.ts lib/api/coupon.test.ts app/components/coupon/CouponRedeemBottomSheet.tsx
git commit -m "feat(api): redeem coupons through lib/api"
```

---

### Task 5: Member-zone readers

**Files:**
- Create: `lib/api/vip.ts`, `lib/api/referral.ts`, `lib/api/cashback.ts`, `lib/api/checkIn.ts`, `lib/api/gemsStore.ts`, `lib/api/wheel.ts`, `lib/api/transactions.ts`, `lib/api/activities.ts`, `lib/api/profile.ts`
- Test: `lib/api/member.test.ts`
- Modify: ไฟล์คอมโพเนนต์ใน Step 4 ของงานนี้เท่านั้น

**Interfaces:**
- Consumes: ไม่มี
- Produces: ฟังก์ชันในตารางโซนสมาชิกของสเปก ชื่อและค่าที่คืนตรงกับด้านล่าง

- [ ] **Step 1: Write the failing test**

`lib/api/member.test.ts` ตรวจอย่างน้อยหนึ่งค่าต่อไฟล์ว่าตรง mock

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { VIP_PLAYER_MOCK } from "@/app/data/vipMockData";
import { REFERRAL_MOCK_REF_CODE } from "@/app/data/referralMockData";
import { CASHBACK_PLAY_PANEL_MOCK } from "@/app/data/cashbackMockData";
import { DAILY_CHECKIN_INITIAL } from "@/app/data/dailyCheckInMockData";
import { GEMS_STORE_BALANCE_MOCK } from "@/app/data/gemsStoreMockData";
import { ACTIVITIES_HUB_ITEMS } from "@/app/data/activitiesHubMockData";
import { PROFILE_HUB_STATS_MOCK } from "@/app/data/profileHubMockData";
import { MOCK_MAIN_WALLET_BALANCE } from "@/app/data/walletMockData";
import { MENU_DIALOG_TICKET_COUNT_MOCK } from "@/app/data/menuMockData";
import { fetchVipPlayer } from "./vip";
import { fetchReferralOverview } from "./referral";
import { fetchCashbackPanels } from "./cashback";
import { fetchCheckIn } from "./checkIn";
import { fetchGemsStore } from "./gemsStore";
import { fetchWheel } from "./wheel";
import { fetchTransactions } from "./transactions";
import { fetchActivities } from "./activities";
import { fetchMenuTicketCount, fetchProfileHubStats, fetchWalletBalance } from "./profile";

test("member readers return the current mocks", () => {
  assert.equal(fetchVipPlayer(), VIP_PLAYER_MOCK);
  assert.equal(fetchReferralOverview().refCode, REFERRAL_MOCK_REF_CODE);
  assert.equal(fetchCashbackPanels().play, CASHBACK_PLAY_PANEL_MOCK);
  assert.equal(fetchCheckIn().days, DAILY_CHECKIN_INITIAL);
  assert.equal(fetchGemsStore().balance, GEMS_STORE_BALANCE_MOCK);
  assert.equal(fetchActivities(), ACTIVITIES_HUB_ITEMS);
  assert.equal(fetchProfileHubStats(), PROFILE_HUB_STATS_MOCK);
  assert.equal(fetchWalletBalance().amount, MOCK_MAIN_WALLET_BALANCE);
  assert.equal(fetchMenuTicketCount(), MENU_DIALOG_TICKET_COUNT_MOCK);
  assert.ok(fetchWheel());
  assert.ok(fetchTransactions());
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm dlx tsx --test lib/api/member.test.ts`
Expected: FAIL เพราะโมดูลยังไม่มี

- [ ] **Step 3: Implement the readers**

แต่ละไฟล์คืนค่าจาก mock ทันที ฟังก์ชันคำนวณแรงค์และฟังก์ชัน format ยังไม่ย้าย

`lib/api/vip.ts`

```ts
import {
  VIP_BENEFIT_COMPARISON_ROWS,
  VIP_BENEFIT_COMPARISON_VALUES,
  VIP_PLAYER_MOCK,
  VIP_RANK_TIERS,
  VIP_RANK_VIDEO,
} from "@/app/data/vipMockData";

export function fetchVipPlayer() {
  return VIP_PLAYER_MOCK;
}

export function fetchVipRanks() {
  return { tiers: VIP_RANK_TIERS, videos: VIP_RANK_VIDEO };
}

export function fetchVipBenefits() {
  return { rows: VIP_BENEFIT_COMPARISON_ROWS, values: VIP_BENEFIT_COMPARISON_VALUES };
}
```

`lib/api/referral.ts`

```ts
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
```

`lib/api/cashback.ts`

```ts
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
```

`lib/api/checkIn.ts`

```ts
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
```

`lib/api/gemsStore.ts` — `fetchGemsStore()` คืน `{ balance: GEMS_STORE_BALANCE_MOCK, quota: GEMS_STORE_REDEEM_QUOTA_MOCK, packages: GEMS_STORE_PACKAGES, terms: GEMS_STORE_TERMS, gemAsset: GEMS_STORE_GEM_ASSET, coinAssets: GEMS_STORE_COIN_ASSETS, rateLabel: GEMS_STORE_EXCHANGE_RATE_LABEL, resetNotice: GEMS_STORE_RESET_NOTICE }`

`lib/api/wheel.ts`

```ts
import {
  LUCKY_WHEEL_BENEFITS,
  LUCKY_WHEEL_GEMS_PER_SPIN,
  LUCKY_WHEEL_HISTORY,
  LUCKY_WHEEL_HISTORY_PAGE_SIZE,
  LUCKY_WHEEL_HISTORY_TOTAL_PAGES,
  LUCKY_WHEEL_INITIAL_GEMS,
  LUCKY_WHEEL_INITIAL_TICKETS,
  LUCKY_WHEEL_INTRO_LEAD,
  LUCKY_WHEEL_LIVE_WINNERS,
  LUCKY_WHEEL_PRIZE_HISTORY,
  LUCKY_WHEEL_SEGMENTS,
  LUCKY_WHEEL_TAGLINE,
  LUCKY_WHEEL_TERMS,
  LUCKY_WHEEL_TICKETS_PER_SPIN,
} from "@/app/data/luckyWheelMockData";

export function fetchWheel() {
  return {
    segments: LUCKY_WHEEL_SEGMENTS,
    benefits: LUCKY_WHEEL_BENEFITS,
    introLead: LUCKY_WHEEL_INTRO_LEAD,
    tagline: LUCKY_WHEEL_TAGLINE,
    terms: LUCKY_WHEEL_TERMS,
    liveWinners: LUCKY_WHEEL_LIVE_WINNERS,
    prizeHistory: LUCKY_WHEEL_PRIZE_HISTORY,
    history: LUCKY_WHEEL_HISTORY,
    historyPageSize: LUCKY_WHEEL_HISTORY_PAGE_SIZE,
    historyTotalPages: LUCKY_WHEEL_HISTORY_TOTAL_PAGES,
    gemsPerSpin: LUCKY_WHEEL_GEMS_PER_SPIN,
    ticketsPerSpin: LUCKY_WHEEL_TICKETS_PER_SPIN,
    initialGems: LUCKY_WHEEL_INITIAL_GEMS,
    initialTickets: LUCKY_WHEEL_INITIAL_TICKETS,
  };
}
```

`lib/api/transactions.ts`

```ts
import {
  MOCK_BET_TRANSACTIONS,
  MOCK_DEPOSIT_TRANSACTIONS,
  MOCK_PROMOTION_TRANSACTIONS,
  MOCK_WITHDRAW_TRANSACTIONS,
  TRANSACTION_KIND_TABS,
} from "@/app/data/transactionsMockData";
import {
  buildPendingDepositPayload,
  buildPendingWithdrawPayload,
} from "@/app/data/pendingTransactionMockData";

export function fetchTransactions() {
  return {
    tabs: TRANSACTION_KIND_TABS,
    deposit: MOCK_DEPOSIT_TRANSACTIONS,
    withdraw: MOCK_WITHDRAW_TRANSACTIONS,
    promotion: MOCK_PROMOTION_TRANSACTIONS,
    bet: MOCK_BET_TRANSACTIONS,
  };
}

export function fetchPendingTransaction() {
  return { buildPendingDepositPayload, buildPendingWithdrawPayload };
}
```

`lib/api/activities.ts` — `fetchActivities()` คืน `ACTIVITIES_HUB_ITEMS` เท่านั้น แท็บหมวด `ACTIVITY_HUB_CATEGORY_TABS` ยัง import จากไฟล์ mock ได้

`lib/api/profile.ts`

```ts
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
```

`getSignUpBankById` และ `signUpCoverToneClass` ยังอยู่ที่ `signupMockData.ts` เพราะเป็นตัวช่วยแสดงผลจาก id ที่ผู้ใช้เลือกแล้ว

- [ ] **Step 4: Switch component imports**

เปลี่ยนเฉพาะค่าที่ฟังก์ชันใหม่คืน คง type และฟังก์ชัน format / `getVipRankTier` / `getSignUpBankById`

| File | เปลี่ยนจาก | เป็น |
|------|------------|------|
| `app/components/vip/VipPageContent.tsx` | `VIP_PLAYER_MOCK`, `VIP_RANK_TIERS` | `fetchVipPlayer()`, `fetchVipRanks().tiers` |
| `app/components/vip/VipModalDesktopLayout.tsx` | `VIP_RANK_TIERS` | `fetchVipRanks().tiers` |
| `app/components/vip/VipRankCarousel.tsx` | ลิสต์แรงค์จาก mock | `fetchVipRanks().tiers` |
| `app/components/vip/VipRankEmblem.tsx` | `getVipRankVideoSrc` ถ้าอ่าน map ตรง | ยังใช้ `getVipRankVideoSrc` ได้ เพราะเป็นตัวช่วย คงไว้ |
| `app/components/vip/VipBenefitsComparisonTable.tsx` | แถวและค่าตาราง | `fetchVipBenefits()` |
| `app/components/vip/VipMobileTabPanels.tsx` | ค่าผู้เล่นหรือตารางที่ import เป็นค่า | ฟังก์ชัน fetch ที่ตรงชนิดนั้น |
| `app/components/vip/VipProgressAndMissions.tsx` | `VIP_PLAYER_MOCK` | `fetchVipPlayer()` |
| `app/components/profile/ProfileHubBody.tsx` | `PROFILE_HUB_STATS_MOCK`, `VIP_PLAYER_MOCK` | `fetchProfileHubStats()`, `fetchVipPlayer()` |
| `app/components/profile/ProfileAccountTabs.tsx` | `VIP_PLAYER_MOCK` | `fetchVipPlayer()` |
| `app/components/referral/ReferralPageContent.tsx` | ค่าภาพรวม | `fetchReferralOverview()` |
| `app/components/referral/ReferralOverviewSections.tsx` | ค่าภาพรวม | `fetchReferralOverview()` |
| `app/components/referral/ReferralDesktopHubLayout.tsx` | ค่าภาพรวม | `fetchReferralOverview()` |
| `app/components/referral/ReferralUsersPanel.tsx` | `REFERRAL_USERS_MOCK` | `fetchReferralUsers()` |
| `app/components/referral/ReferralEarningPanel.tsx` | สรุปและประวัติ | `fetchReferralEarnings()` |
| `app/components/profile/ProfileReferralInviteCard.tsx` | โค้ดชวนเพื่อน | `fetchReferralOverview().refCode` |
| `app/referral/page.tsx` | `REFERRAL_MOCK_REF_CODE` | `fetchReferralOverview().refCode` คง `BOTTOM_NAV_DATA` |
| `app/components/cashback/CashbackPageContent.tsx` | แผง play/loss | `fetchCashbackPanels()` คง `type CashbackTabId` |
| `app/components/cashback/CashbackLossRebateExtraSections.tsx` | คืนยอดเสีย | `fetchLossRebate()` คงฟังก์ชัน format |
| `app/components/missions/DailyCheckInCard.tsx` | วัน ไมล์สโตน เงื่อนไข | `fetchCheckIn()` |
| `app/components/missions/DailyCheckInDesktopLayout.tsx` | ชุดเดียวกัน | `fetchCheckIn()` |
| `app/components/gems-store/GemsStorePageContent.tsx` | ยอด แพ็กเกจ เงื่อนไข รูป | `fetchGemsStore()` คง `formatGemsBalance` |
| `app/components/gems-store/GemsStoreSummaryCard.tsx` | ยอดและรูป | `fetchGemsStore()` |
| `app/components/wheel/LuckyWheelPageContent.tsx` | ค่า `LUCKY_WHEEL_*` ที่ใช้วาด | ฟิลด์ชื่อเดียวกันใน `fetchWheel()` เช่น `segments`, `terms`, `initialGems` คง `formatGemsBalance` |
| `app/components/wheel/LuckyWheelIntroColumn.tsx` | intro, benefits, tagline | `fetchWheel().introLead`, `.benefits`, `.tagline` |
| `app/components/wheel/LuckyWheelLiveWinners.tsx` | `LUCKY_WHEEL_LIVE_WINNERS` | `fetchWheel().liveWinners` |
| `app/components/wheel/LuckyWheelPrizeHistory.tsx` | ประวัติและขนาดหน้า | `fetchWheel().prizeHistory`, `.historyPageSize`, `.historyTotalPages` |
| `app/components/wheel/LuckyWheelWalletPanel.tsx` | เรตเพชรและตั๋ว | `fetchWheel().gemsPerSpin`, `.ticketsPerSpin` |
| `app/components/transactions/TransactionsPageContent.tsx` | ลิสต์ธุรกรรม | `fetchTransactions()` คงตัวกรองและ format ที่อยู่ในไฟล์ mock |
| `app/components/transactions/PendingTransactionProvider.tsx` | `buildPendingDepositPayload` / withdraw | `fetchPendingTransaction()` |
| `app/components/activities/ActivitiesMobileHub.tsx` | `ACTIVITIES_HUB_ITEMS` | `fetchActivities()` คง `type ActivityHubItem` |
| `app/components/activities/ActivitiesDesktopHubLayout.tsx` | `ACTIVITIES_HUB_ITEMS` | `fetchActivities()` |
| `app/components/activities/ActivityHubShared.tsx` | ลิสต์กิจกรรม | `fetchActivities()` |
| `app/components/layout/Header.tsx` | `MOCK_MAIN_WALLET_BALANCE`, `HEADER_WALLET_ICON_SRC` | `fetchWalletBalance()` คง `HEADER_DESKTOP_NAV` |
| `app/components/layout/HeaderWalletAssetIcon.tsx` | `HEADER_WALLET_ICON_SRC` | `fetchWalletBalance().iconSrc` |
| `app/components/layout/LobbyDesktopTopBar.tsx` | ยอดกระเป๋า | `fetchWalletBalance()` |
| `app/components/layout/MenuDrawerWalletCards.tsx` | `MENU_DIALOG_TICKET_COUNT_MOCK` และยอด/เพชร | `fetchMenuTicketCount()`, `fetchWalletBalance()`, `fetchGemsStore()` |
| `app/components/auth/SignUpBottomDrawer.tsx` | `SIGNUP_BANKS`, `SIGNUP_CHANNELS` | `fetchSignUpOptions().banks`, `.channels` |

เรียกฟังก์ชันในตัวคอมโพเนนต์ที่วาดค่านั้น ไม่ใส่ state โหลด

- [ ] **Step 5: Run test and typecheck**

Run: `pnpm dlx tsx --test lib/api/member.test.ts`
Expected: PASS

Run: `pnpm exec tsc --noEmit`
Expected: ไม่มี error

- [ ] **Step 6: Commit**

```bash
git add lib/api/vip.ts lib/api/referral.ts lib/api/cashback.ts lib/api/checkIn.ts lib/api/gemsStore.ts lib/api/wheel.ts lib/api/transactions.ts lib/api/activities.ts lib/api/profile.ts lib/api/member.test.ts app/components app/referral/page.tsx
git commit -m "feat(api): read member hub mocks through lib/api"
```

---

### Task 6: Lobby readers

**Files:**
- Create: `lib/api/lobby.ts`
- Test: `lib/api/lobby.test.ts`
- Modify: `app/components/home/WelcomeBanner.tsx`, `app/components/home/HomeLobbyPage.tsx`, `app/components/home/HomeDesktopHeroRow.tsx`, `app/components/home/HomeDesktopPeekCarousel.tsx`, `app/components/layout/Header.tsx`

**Interfaces:**
- Consumes: ไม่มี
- Produces: `fetchHomeBanners`, `fetchHomeHighlights`, `fetchHomeGames`, `fetchHomeProviders`, `fetchHomeFeatureActions`, `fetchHomeTournaments`, `fetchLobbyAnnouncements`, `fetchHallOfFame`, `fetchDesktopPlayerPanel`

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { WELCOME_BANNER_SLIDES, POPULAR_HIGHLIGHTS_DATA } from "@/app/data/lobbyMockData";
import { LOBBY_ANNOUNCEMENT_MESSAGES } from "@/app/data/lobbyAnnouncementMockData";
import { HALL_OF_FAME_DATA } from "@/app/data/hallOfFameMockData";
import { DESKTOP_PLAYER_PANEL_MOCK } from "@/app/data/desktopLobbyMockData";
import {
  fetchDesktopPlayerPanel,
  fetchHallOfFame,
  fetchHomeBanners,
  fetchHomeHighlights,
  fetchLobbyAnnouncements,
} from "./lobby";

test("lobby readers return the current mocks", () => {
  assert.equal(fetchHomeBanners().welcomeSlides, WELCOME_BANNER_SLIDES);
  assert.equal(fetchHomeHighlights().highlights, POPULAR_HIGHLIGHTS_DATA);
  assert.equal(fetchLobbyAnnouncements(), LOBBY_ANNOUNCEMENT_MESSAGES);
  assert.equal(fetchHallOfFame(), HALL_OF_FAME_DATA);
  assert.equal(fetchDesktopPlayerPanel(), DESKTOP_PLAYER_PANEL_MOCK);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm dlx tsx --test lib/api/lobby.test.ts`
Expected: FAIL เพราะหา `./lobby` ไม่เจอ

- [ ] **Step 3: Implement lobby client**

```ts
import { DESKTOP_PLAYER_PANEL_MOCK } from "@/app/data/desktopLobbyMockData";
import { HALL_OF_FAME_DATA } from "@/app/data/hallOfFameMockData";
import { LOBBY_ANNOUNCEMENT_MESSAGES } from "@/app/data/lobbyAnnouncementMockData";
import {
  FEATURE_ACTIONS_DATA,
  GAME_SECTIONS_DATA,
  HOME_DESKTOP_PEEK_BANNER_SIZE,
  HOME_DESKTOP_PEEK_CAROUSEL_DATA,
  HOME_LOBBY_TOURNAMENT_ITEMS,
  HOME_PRO_BANNER_ASSETS,
  HOME_SLOTS_PROVIDER_ITEMS,
  INTRO_STATS_DATA,
  MAIN_HOME_BANNER_SRC,
  POPULAR_HIGHLIGHTS_DATA,
  PROMO_CAROUSEL_DATA,
  PROVIDERS_DATA,
  WELCOME_BANNER_SLIDES,
} from "@/app/data/lobbyMockData";

export function fetchHomeBanners() {
  return {
    welcomeSlides: WELCOME_BANNER_SLIDES,
    promoCarousel: PROMO_CAROUSEL_DATA,
    peek: HOME_DESKTOP_PEEK_CAROUSEL_DATA,
    peekSize: HOME_DESKTOP_PEEK_BANNER_SIZE,
    mainSrc: MAIN_HOME_BANNER_SRC,
    proAssets: HOME_PRO_BANNER_ASSETS,
  };
}

export function fetchHomeHighlights() {
  return { highlights: POPULAR_HIGHLIGHTS_DATA, intro: INTRO_STATS_DATA };
}

export function fetchHomeGames() {
  return { sections: GAME_SECTIONS_DATA, slotProviders: HOME_SLOTS_PROVIDER_ITEMS };
}

export function fetchHomeProviders() {
  return PROVIDERS_DATA;
}

export function fetchHomeFeatureActions() {
  return FEATURE_ACTIONS_DATA;
}

export function fetchHomeTournaments() {
  return HOME_LOBBY_TOURNAMENT_ITEMS;
}

export function fetchLobbyAnnouncements() {
  return LOBBY_ANNOUNCEMENT_MESSAGES;
}

export function fetchHallOfFame() {
  return HALL_OF_FAME_DATA;
}

export function fetchDesktopPlayerPanel() {
  return DESKTOP_PLAYER_PANEL_MOCK;
}
```

- [ ] **Step 4: Switch home and header data reads**

`WelcomeBanner.tsx` ใช้ `fetchHomeBanners().welcomeSlides`

`HomeLobbyPage.tsx` ใช้ฟิลด์จาก `fetchHomeBanners`, `fetchHomeGames`, `fetchHomeProviders`, `fetchHomeFeatureActions`, `fetchHomeTournaments`, `fetchHomeHighlights` และ `fetchLobbyAnnouncements()` แทนค่าที่ import จาก mock คง `BOTTOM_NAV_DATA` กับ `CATEGORIES_DATA`

`HomeDesktopHeroRow.tsx` ใช้ `fetchHomeBanners()`

`HomeDesktopPeekCarousel.tsx` ใช้ `fetchHomeBanners().peekSize` เฉพาะค่าข้อมูล ขนาดที่เป็นค่าคงที่ของเลย์เอาต์ถ้าไม่ได้มาจาก mock ให้คงไว้

`Header.tsx` ใช้ `fetchDesktopPlayerPanel()` แทน `DESKTOP_PLAYER_PANEL_MOCK` คง `HEADER_DESKTOP_NAV`

`HomeLobbyPage.tsx` ส่ง `datasets={fetchHallOfFame()}` แทน `HALL_OF_FAME_DATA`

- [ ] **Step 5: Run test and typecheck**

Run: `pnpm dlx tsx --test lib/api/lobby.test.ts`
Expected: PASS

Run: `pnpm exec tsc --noEmit`
Expected: ไม่มี error

- [ ] **Step 6: Commit**

```bash
git add lib/api/lobby.ts lib/api/lobby.test.ts app/components/home app/components/layout/Header.tsx
git commit -m "feat(api): read lobby mocks through lib/api"
```

---

### Task 7: Lottery content readers

**Files:**
- Create: `lib/api/lotteryContent.ts`
- Test: `lib/api/lotteryContent.test.ts`
- Modify: ไฟล์หวยใน Step 4 ที่ยัง import ค่า mock ตรง ไม่แตะ `lib/lottery/submitBetSlip.ts` และ `lib/lottery/fetchLotterySlip.ts`

**Interfaces:**
- Consumes: ไม่มี
- Produces:
  - `fetchLotteryCatalog(): LotteryCatalogEntry[]`
  - `fetchLotteryHub(): { featured: typeof LOTTERY_FEATURED_ITEMS; grid: typeof LOTTERY_GRID_ITEMS; latest: typeof LOTTERY_LATEST_RESULTS }`
  - `fetchLotteryMarkets(): LotteryMarketConfig[]`
  - `fetchLotteryPlayRounds(slug: string, from?: Date)` ส่งต่อ `getLotteryPlayRounds`
  - `fetchYikiBoard()` คืน `{ groups: YIKI_GROUPS, betTypes: YIKI_BET_TYPES, settlement: YIKI_SETTLEMENT_TYPES }`
  - `fetchThaiLottoBoard()` คืน `{ groups: THAI_LOTTO_GROUPS, betTypes: THAI_LOTTO_BET_TYPES, lastResult: THAI_LOTTO_LAST_RESULT }`

- [ ] **Step 1: Write the failing test**

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm dlx tsx --test lib/api/lotteryContent.test.ts`
Expected: FAIL เพราะหา `./lotteryContent` ไม่เจอ

- [ ] **Step 3: Implement lottery content client**

ฟังก์ชันส่งต่ออาร์กิวเมนต์ของ `getLotteryPlayRounds`, `getLotteryCatalogEntry` ไม่ย้ายเข้าไฟล์นี้ ให้หน้าที่ยังเรียก `getLotteryCatalogEntry(slug)` ใช้ `fetchLotteryCatalog().find` เฉพาะจุดที่ต้องการทั้งลิสต์ จุดที่เรียกตัวช่วยรายตัวคงเรียกตัวช่วยนั้นได้ เพราะสเปกให้ฟังก์ชันสุ่มรอบยังอยู่ที่ mock

```ts
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

export function fetchLotteryCatalog() {
  return LOTTERY_CATALOG_ENTRIES;
}

export function fetchLotteryHub() {
  return {
    featured: LOTTERY_FEATURED_ITEMS,
    grid: LOTTERY_GRID_ITEMS,
    latest: LOTTERY_LATEST_RESULTS,
  };
}

export function fetchLotteryMarkets() {
  return LOTTERY_MARKETS;
}

export function fetchLotteryPlayRounds(slug: string, from?: Date) {
  return getLotteryPlayRounds(slug, from);
}

export function fetchYikiBoard() {
  return { groups: YIKI_GROUPS, betTypes: YIKI_BET_TYPES, settlement: YIKI_SETTLEMENT_TYPES };
}

export function fetchThaiLottoBoard() {
  return {
    groups: THAI_LOTTO_GROUPS,
    betTypes: THAI_LOTTO_BET_TYPES,
    lastResult: THAI_LOTTO_LAST_RESULT,
  };
}
```

- [ ] **Step 4: Switch lottery screens that render those lists**

`LotteryHubContent.tsx` ใช้ `fetchLotteryHub()`

`LotteryMarketShell.tsx` ใช้ `fetchLotteryCatalog()`

`LotteryMarketRoundsView.tsx` ใช้ `fetchLotteryPlayRounds` และ `fetchThaiLottoBoard().lastResult` แทน `THAI_LOTTO_LAST_RESULT` คง `getLotteryCatalogEntry` ได้

`LotteryYikiPlayBoard.tsx` ใช้ `fetchYikiBoard()`

`app/lottery/thai-government/[roundId]/page.tsx` ใช้ `fetchThaiLottoBoard()` สำหรับ groups กับ bet types คง `getThaiLottoDrawByRoundId`

`useLotteryBetSubmit.ts` ใช้ `fetchYikiBoard().settlement` และ `fetchThaiLottoBoard().betTypes`

`lib/lottery/resolvePlayRound.ts` ยังเรียกตัวช่วยรอบจาก mock ได้ เพราะเป็นการหาหนึ่งรอบ ไม่ใช่ลิสต์ที่สเปกสั่งให้ย้ายทั้งก้อน ถ้าไฟล์นั้น import `LOTTERY_MARKETS` ทั้งก้อน ให้เปลี่ยนเป็น `fetchLotteryMarkets()`

- [ ] **Step 5: Run test and typecheck**

Run: `pnpm dlx tsx --test lib/api/lotteryContent.test.ts lib/api/endpoints.test.ts lib/api/deposit.test.ts lib/api/withdraw.test.ts lib/api/coupon.test.ts lib/api/member.test.ts lib/api/lobby.test.ts`
Expected: PASS

Run: `pnpm exec tsc --noEmit`
Expected: ไม่มี error

- [ ] **Step 6: Commit**

```bash
git add lib/api/lotteryContent.ts lib/api/lotteryContent.test.ts app/components/lottery app/lottery app/hooks/useLotteryBetSubmit.ts
git commit -m "feat(api): read lottery content mocks through lib/api"
```
