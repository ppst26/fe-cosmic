# Semantic Value Colors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ใส่ระบบสี semantic ให้ตัวเลข/เปอร์เซ็นต์/สถานะทั้งโปรเจกต์ผ่าน tokens + CSS utilities + `lib/semanticValue.ts` แล้ว migrate ทุก surface ตาม spec `docs/superpowers/specs/2026-10-08-semantic-value-colors-design.md`

**Architecture:** กำหนด `--value-*` และ `--warning` / `--value-reward-fg` ใน `tokens.css`; สร้าง `cosmic-value` / `cosmic-value--{role}` ใน `base.css`; logic รวมศูนย์ที่ `lib/semanticValue.ts` (คืน `ValueRole` + class string `cosmic-value cosmic-value--*`); component เปลี่ยนจาก `text-[var(--success)]` แบบกระจายไปใช้ helper/class; legacy VIP CSS variables ชี้ alias ไป `--value-*` จน TSX ไม่อ้างโดยตรง

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, pnpm, `tsx --test` สำหรับ unit tests ใน `lib/`

## Global Constraints

- **Scope:** ทุกหน้าและทุก surface (lobby, standalone, hub modals, lottery, deposit/withdraw, play) — hub ต้องใช้ role เดียวกับ standalone สำหรับ module เดียวกัน
- **Font weight:** สูงสุด **500** (`font-medium`) — ห้าม `font-semibold` / `font-bold` เพื่อเน้นตัวเลข
- **Tabular nums:** ค่าตัวเลขใช้ `tabular-nums` (ผ่าน `cosmic-value`)
- **No glow / no gradient text** บนตัวเลข; reward ใช้ solid `--value-reward-fg`
- **สีใน TSX:** อ้าง `cosmic-value--*` หรือ helper — **ห้าม** hex และห้าม `text-emerald-*` / `text-red-*` สำหรับค่า
- **Progress bar fills** (VIP deposit/turnover) ไม่เปลี่ยนในแผนนี้ — เปลี่ยนเฉพาะสีตัวเลข
- **Open questions (ตัดสินในแผน):** `--warning: #e8b339`; ยอดเดิมพันรวมท้ายตาราง → **neutral**; payout ใหญ่ (HoF) → `cosmic-value cosmic-value--reward` + ขนาดจาก parent (`text-lg` / `text-xl`) ไม่เพิ่ม class hero แยก

---

## File map (created / touched)

| File | Responsibility |
| :--- | :--- |
| `app/styles/tokens.css` | `--warning`, `--value-*`, legacy VIP aliases |
| `app/styles/base.css` | `@layer components` → `.cosmic-value`, `.cosmic-value--*` |
| `lib/semanticValue.ts` | Role types + mappers → class strings |
| `lib/semanticValue.test.ts` | Unit tests for mappers |
| `design.md` | § Semantic values |
| `.cursor/rules/design-system.mdc` + `agent/rules/design-system.mdc` | สรุป 1 ย่อหน้า |
| `.cursor/skills/ui-qa-checklist/SKILL.md` + `agent/skills/...` | +1 checklist item |
| `app/styles/vip-page.css` | ชี้ metric complete / benefit value ไป tokens ใหม่ |
| Domain components | ดู Tasks 2–6 |

---

### Task 1: Foundation — tokens, CSS utilities, helpers, docs

**Files:**
- Modify: `app/styles/tokens.css` (หลัง `--success`)
- Modify: `app/styles/base.css` (`@layer components`)
- Create: `lib/semanticValue.ts`
- Create: `lib/semanticValue.test.ts`
- Modify: `design.md` (§ ใหม่หลัง Typography หรือ §4 ต่อท้าย)
- Modify: `.cursor/rules/design-system.mdc`
- Modify: `agent/rules/design-system.mdc`

**Interfaces:**
- Consumes: spec §3–4
- Produces:
  - CSS vars `--warning`, `--value-reward-fg`, `--value-emphasis` … `--value-accent`
  - Classes `cosmic-value`, `cosmic-value--emphasis` … `cosmic-value--accent`
  - `export type ValueRole = "emphasis" | "neutral" | "muted" | "success" | "danger" | "warning" | "reward" | "accent"`
  - `export function valueRoleClass(role: ValueRole): string`
  - `export function cnValue(...classes: string[]): string` (optional thin wrapper: `cn("cosmic-value", valueRoleClass(role), extra)`)

- [ ] **Step 1: Add tokens in `app/styles/tokens.css`**

หลัง `--success: #41d995;` (หรือบรรทัดเดียวกับ success ในไฟล์จริง) เพิ่ม:

```css
  --warning: #e8b339;
  --value-reward-fg: #f0c14b;
  --value-emphasis: var(--text-primary);
  --value-neutral: var(--text-secondary);
  --value-muted: var(--text-muted);
  --value-success: var(--success);
  --value-danger: var(--destructive);
  --value-warning: var(--warning);
  --value-reward: var(--value-reward-fg);
  --value-accent: var(--accent-primary);
```

อัปเดต legacy VIP (คงชื่อเดิมชั่วคราว):

```css
  --vip-benefit-value: var(--value-reward);
  --vip-benefit-value-muted: var(--value-muted);
  --vip-benefit-value-success: var(--value-success);
  --vip-level-up-percent: var(--value-emphasis);
  --vip-rank-metric-complete: var(--value-success);
```

- [ ] **Step 2: Add utilities in `app/styles/base.css` inside `@layer components`**

```css
  .cosmic-value {
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }

  .cosmic-value--emphasis { color: var(--value-emphasis); }
  .cosmic-value--neutral { color: var(--value-neutral); }
  .cosmic-value--muted { color: var(--value-muted); }
  .cosmic-value--success { color: var(--value-success); }
  .cosmic-value--danger { color: var(--value-danger); }
  .cosmic-value--warning { color: var(--value-warning); }
  .cosmic-value--reward { color: var(--value-reward); }
  .cosmic-value--accent { color: var(--value-accent); }
```

- [ ] **Step 3: Create `lib/semanticValue.ts`**

```ts
import type { TransactionStatus } from "@/app/types/transaction";
import { cn } from "@/lib/utils";

export type ValueRole =
  | "emphasis"
  | "neutral"
  | "muted"
  | "success"
  | "danger"
  | "warning"
  | "reward"
  | "accent";

const ROLE_CLASS: Record<ValueRole, string> = {
  emphasis: "cosmic-value--emphasis",
  neutral: "cosmic-value--neutral",
  muted: "cosmic-value--muted",
  success: "cosmic-value--success",
  danger: "cosmic-value--danger",
  warning: "cosmic-value--warning",
  reward: "cosmic-value--reward",
  accent: "cosmic-value--accent",
};

/** คืน class โทนค่า — ใส่คู่กับ `cosmic-value` */
export function valueRoleClass(role: ValueRole): string {
  return ROLE_CLASS[role];
}

export function valueClass(role: ValueRole, extra?: string): string {
  return cn("cosmic-value", valueRoleClass(role), extra);
}

export function transactionStatusValueRole(status: TransactionStatus): ValueRole {
  switch (status) {
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "danger";
  }
}

export function transactionStatusValueClass(status: TransactionStatus, extra?: string): string {
  return valueClass(transactionStatusValueRole(status), extra);
}

export function moneyDeltaRole(amount: number): ValueRole {
  if (amount > 0) return "success";
  if (amount < 0) return "danger";
  return "neutral";
}

export function signedMoneyValueClass(amount: number, extra?: string): string {
  return valueClass(moneyDeltaRole(amount), extra);
}

const MUTED_DISPLAY = new Set(["—", "-", "–", ""]);

/** สิทธิ VIP / ตารางเปรียบเทียบ */
export function vipBenefitDisplayRole(rowId: string, display: string): ValueRole {
  const normalized = display.trim();
  if (MUTED_DISPLAY.has(normalized)) return "muted";
  if (normalized.includes("✓") || normalized.includes("✔")) return "success";
  if (rowId === "diamond-deposit") return "accent";
  if (/%/.test(normalized) || rowId === "cashback" || rowId === "rolling") return "reward";
  return "emphasis";
}

export function vipBenefitValueClass(rowId: string, display: string, extra?: string): string {
  return valueClass(vipBenefitDisplayRole(rowId, display), extra);
}

/** วันคงเหลือรักษาระดับ VIP */
export function vipMaintainDaysRole(daysRemaining: number): ValueRole {
  if (daysRemaining <= 0) return "warning";
  return "emphasis";
}

export function vipMaintainDaysClass(daysRemaining: number, extra?: string): string {
  return valueClass(vipMaintainDaysRole(daysRemaining), extra);
}
```

- [ ] **Step 4: Create `lib/semanticValue.test.ts`**

```ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  moneyDeltaRole,
  transactionStatusValueRole,
  vipBenefitDisplayRole,
  vipMaintainDaysRole,
  valueRoleClass,
} from "./semanticValue";

describe("semanticValue", () => {
  it("maps transaction status", () => {
    assert.equal(transactionStatusValueRole("completed"), "success");
    assert.equal(transactionStatusValueRole("pending"), "warning");
    assert.equal(transactionStatusValueRole("failed"), "danger");
  });

  it("maps money delta", () => {
    assert.equal(moneyDeltaRole(10), "success");
    assert.equal(moneyDeltaRole(-1), "danger");
    assert.equal(moneyDeltaRole(0), "neutral");
  });

  it("maps vip benefit rows", () => {
    assert.equal(vipBenefitDisplayRole("cashback", "0.5%"), "reward");
    assert.equal(vipBenefitDisplayRole("diamond-deposit", "+5%"), "accent");
    assert.equal(vipBenefitDisplayRole("vip-manager", "—"), "muted");
    assert.equal(vipBenefitDisplayRole("fast-withdraw", "✓"), "success");
  });

  it("maps maintain days", () => {
    assert.equal(vipMaintainDaysRole(0), "warning");
    assert.equal(vipMaintainDaysRole(3), "emphasis");
  });

  it("exposes role classes", () => {
    assert.equal(valueRoleClass("reward"), "cosmic-value--reward");
  });
});
```

- [ ] **Step 5: Run tests**

Run: `pnpm test`
Expected: PASS (รวม `lib/semanticValue.test.ts`)

- [ ] **Step 6: Run typecheck**

Run: `pnpm typecheck`
Expected: exit 0

- [ ] **Step 7: Document in `design.md`**

เพิ่มหัวข้อ **Semantic values (ตัวเลข / สถานะ)** — คัดลอกตาราง role จาก spec §3 + นโยบาย default + ชื่อ class `cosmic-value--*` + ชี้ `lib/semanticValue.ts`

- [ ] **Step 8: Sync `design-system.mdc` (`.cursor` + `agent`)**

เพิ่ม bullet: ค่าตัวเลขใช้ `cosmic-value` + role; ห้าม hex ใน TSX; ดู `design.md` § Semantic values

- [ ] **Step 9: Commit Task 1** (เมื่อผู้ใช้สั่ง commit)

```bash
git add app/styles/tokens.css app/styles/base.css lib/semanticValue.ts lib/semanticValue.test.ts design.md .cursor/rules/design-system.mdc agent/rules/design-system.mdc
git commit -m "feat(design): add semantic value color tokens and helpers"
```

---

### Task 2: Phase 1 — VIP (page + modal)

**Files:**
- Modify: `app/components/vip/VipMyLevelBenefitsCard.tsx`
- Modify: `app/components/vip/VipRankLevelUpCard.tsx`
- Modify: `app/components/vip/VipMaintainRankPanel.tsx`
- Modify: `app/components/vip/VipRankProgressMetric.tsx`
- Modify: `app/components/vip/VipBenefitsComparisonTable.tsx`
- Modify: `app/components/vip/VipRankCarousel.tsx`
- Modify: `app/styles/vip-page.css` (ถ้ายังอ้างสีเก่าโดยตรง)

**Interfaces:**
- Consumes: `valueClass`, `vipBenefitValueClass`, `vipMaintainDaysClass` from `lib/semanticValue.ts`
- Produces: VIP stack ใช้ reward/accent/muted/success/emphasis/warning ตาม spec

- [ ] **Step 1: `VipMyLevelBenefitsCard.tsx`**

ลบ `benefitValueTone()` แทนด้วย `vipBenefitValueClass(row.id, value)` บน `<p>` ค่า; ลบ class `vip-my-level-benefits__value--muted|--success` ถ้าไม่จำเป็น (หรือให้ CSS map ไป `--value-*`)

- [ ] **Step 2: `VipRankLevelUpCard.tsx`**

เปลี่ยน `vip-level-up-card__percent` เป็น `valueClass("emphasis", "vip-level-up-card__percent shrink-0 text-2xl ...")` (คงขนาดเดิม)

- [ ] **Step 3: `VipMaintainRankPanel.tsx`**

`vip-maintain-rank-panel__days` → `vipMaintainDaysClass(maintain.daysRemaining, "vip-maintain-rank-panel__days block text-2xl ...")`

- [ ] **Step 4: `VipRankProgressMetric.tsx`**

- ค่า progress/target: `valueClass("neutral", "vip-rank-metric__values ...")` สำหรับตัวเลข; หรือแยก span progress = emphasis, `/ target` = neutral ตามความหมาย
- foot ครบแล้ว: คง `vip-rank-metric__complete` แต่สีจาก `--value-success` ใน CSS

- [ ] **Step 5: `VipBenefitsComparisonTable.tsx` + `VipRankCarousel.tsx`**

แทน `text-[var(--success)]` / benefit value ด้วย helper เดียวกับ benefits card

- [ ] **Step 6: Visual QA**

เปิด `/vip` มือถือ + hub VIP modal: % สิทธิทอง (reward), +5% accent, 73% emphasis, 0 วัน warning, ครบแล้วเขียว

- [ ] **Step 7: Commit Task 2**

```bash
git add app/components/vip app/styles/vip-page.css
git commit -m "feat(vip): apply semantic value colors to rank stack"
```

---

### Task 3: Phase 1 — Transactions + hub mirror

**Files:**
- Modify: `app/components/transactions/TransactionHistoryTable.tsx`
- Modify: `app/components/transactions/TransactionsPageContent.tsx`
- Modify: `app/components/transactions/PendingTransactionDialog.tsx` (ถ้ามียอด/สถานะ)
- Verify: `app/components/hub/DesktopHubTransactionsBody.tsx` (ไม่ fork สี — ใช้ `TransactionsPageContent` อยู่แล้ว)

**Interfaces:**
- Consumes: `transactionStatusValueClass`, `signedMoneyValueClass`, `valueClass`
- Produces: สถานะ pending → **warning** (เปลี่ยนจาก secondary); สรุปยอดแยก role

- [ ] **Step 1: `TransactionHistoryTable.tsx`**

ลบ `statusClass()` local → `transactionStatusValueClass(status)`; คอลัมน์ win/loss ใช้ `signedMoneyValueClass`; ยอดเดิมพันธรรมดา → `valueClass("neutral")`

- [ ] **Step 2: `TransactionsPageContent.tsx`**

สรุปท้ายตาราง:
- ยอดฝาก/ถอนสำเร็จรวม → `valueClass("success")` ถ้าเป็นยอด “ได้รับจริง”
- ยอดเดิมพันรวม → `valueClass("neutral")`
- กำไร/ขาดทุนรวม → `signedMoneyValueClass(total)`

- [ ] **Step 3: Run `pnpm test` + manual `/transactions?kind=bet`**

- [ ] **Step 4: Commit Task 3**

```bash
git add app/components/transactions
git commit -m "feat(transactions): semantic colors for status and totals"
```

---

### Task 4: Phase 1 — Header wallet

**Files:**
- Modify: `app/components/layout/HeaderWalletChip.tsx`
- Modify: `app/components/layout/MenuDrawerWalletCards.tsx`
- Modify: `app/components/layout/MenuDrawerMobileToolbar.tsx` (ถ้ามียอด)

**Interfaces:**
- Consumes: `valueClass("emphasis")`, `valueClass("accent")` สำหรับ gems/points ถ้าแยก

- [ ] **Step 1: ยอดเครดิตหลัก → `valueClass("emphasis", "...")` แทน `text-white` บนตัวเลข**

- [ ] **Step 2: แต้มรอง (gems/diamond) ถ้ามี → `accent`**

- [ ] **Step 3: Commit Task 4**

```bash
git add app/components/layout/HeaderWalletChip.tsx app/components/layout/MenuDrawerWalletCards.tsx app/components/layout/MenuDrawerMobileToolbar.tsx
git commit -m "feat(header): semantic emphasis for wallet amounts"
```

---

### Task 5: Phase 2 — Money loops (deposit, withdraw, cashback, referral, gems)

**Files:**
- Modify: `app/components/deposit/DepositBottomSheet.tsx`
- Modify: `app/components/withdraw/WithdrawBottomSheet.tsx`
- Modify: `app/components/cashback/CashbackPageContent.tsx`
- Modify: `app/components/cashback/CashbackLossRebateExtraSections.tsx`
- Modify: `app/components/referral/ReferralDesktopHubLayout.tsx`
- Modify: `app/components/referral/ReferralEarningPanel.tsx`
- Modify: `app/components/referral/ReferralOverviewSections.tsx`
- Modify: `app/components/referral/ReferralPageContent.tsx`
- Modify: `app/components/gems-store/GemsStoreSummaryCard.tsx`
- Modify: `app/components/gems-store/GemsRedeemConfirmDialog.tsx`
- Modify: `app/components/gems-store/GemsStorePageContent.tsx`
- Modify: `app/loss-rebate/page.tsx` content components ถ้าแยกไฟล์

- [ ] **Step 1: Grep ในโฟลเดอร์เหล่านี้**

Run: `rg "text-\\[var\\(--(success|destructive|accent|icon-active)" app/components/deposit app/components/withdraw app/components/cashback app/components/referral app/components/gems-store`

- [ ] **Step 2: แทนตาม mapping**

| บริบท | Role |
| :--- | :--- |
| ยอดเงินหลัก | emphasis |
| โบนัส / cashback % / รับคืน | reward |
| gems / แต้ม promo | accent |
| ข้อผิดพลาดยอด | danger |

- [ ] **Step 3: `pnpm build` (optional) หรือ `pnpm typecheck`**

- [ ] **Step 4: Commit Task 5**

```bash
git add app/components/deposit app/components/withdraw app/components/cashback app/components/referral app/components/gems-store app/loss-rebate
git commit -m "feat(money): semantic value colors across deposit and rewards"
```

---

### Task 6: Phase 3 — Engagement (wheel, check-in, reward, HoF)

**Files:**
- Modify: `app/components/wheel/LuckyWheelPageContent.tsx`
- Modify: `app/components/wheel/LuckyWheelPrizeHistory.tsx`
- Modify: `app/components/wheel/LuckyWheelLiveWinners.tsx`
- Modify: `app/components/missions/DailyCheckInCard.tsx`
- Modify: `app/components/missions/DailyCheckInDesktopLayout.tsx`
- Modify: `app/components/reward/RewardPointsBar.tsx`
- Modify: `app/components/reward/RewardHubSummaryCard.tsx`
- Modify: `app/components/reward/*RedeemPanel.tsx` (lucky-box, random-card ฯลฯ)
- Modify: `app/components/home/HallOfFame.tsx`
- Modify: `app/styles/hall-of-fame.css`, `app/styles/lucky-wheel.css` (ถ้ามีสี value แยก)

- [ ] **Step 1: Payout / รางวัลเงิน → `valueClass("reward", ...)`**

- [ ] **Step 2: แต้มคงเหลือ → `accent` หรือ `emphasis` ตามชนิด (gems=accent, คะแนนทั่วไป=emphasis)**

- [ ] **Step 3: Commit Task 6**

```bash
git add app/components/wheel app/components/missions app/components/reward app/components/home/HallOfFame.tsx app/styles/hall-of-fame.css app/styles/lucky-wheel.css
git commit -m "feat(engagement): reward accent on payouts and points"
```

---

### Task 7: Phase 4 — Lottery

**Files:**
- Modify: `app/components/lottery/LotteryLatestResultsTable.tsx`
- Modify: `app/components/lottery/LotteryPlayRoundList.tsx`
- Modify: `app/components/lottery/thai/*`, `yiki/*` bet boards (ยอดรวม, อัตราจ่าย)
- Modify: slip summary components under `app/components/lottery/` หรือ `app/lottery/slips`
- Modify: `app/styles/lottery.css` (เฉพาะสีตัวเลข ไม่ refactor layout)

- [ ] **Step 1: Grep**

Run: `rg "tabular-nums|text-\\[var\\(--success" app/components/lottery app/styles/lottery.css`

- [ ] **Step 2: ยอดแทงรวม neutral/emphasis; ถูกรางวัล success; ขาดทุนถ้ามี danger**

- [ ] **Step 3: Commit Task 7**

```bash
git add app/components/lottery app/styles/lottery.css
git commit -m "feat(lottery): semantic value colors on stakes and results"
```

---

### Task 8: Phase 5 — Sweep + profile + activities + QA checklist

**Files:**
- Modify: `app/components/profile/ProfileSummaryCard.tsx`, `ProfileHubBody.tsx`, `ProfileHubHeader.tsx`, `ProfileAccountTabs.tsx`
- Modify: `app/components/activities/ActivityHubShared.tsx`
- Modify: `app/components/home/MostOnlineProviderCard.tsx` (online count → neutral)
- Modify: `app/components/ui/GameCard.tsx` (ถ้ามี RTP)
- Modify: `app/components/promotions/*`, `app/event/*` ตาม grep
- Modify: `.cursor/skills/ui-qa-checklist/SKILL.md` + `agent/skills/ui-qa-checklist/SKILL.md`
- Modify: `docs/superpowers/specs/2026-10-08-semantic-value-colors-design.md` → Status: Implemented

**Interfaces:**
- Consumes: all helpers
- Produces: repo-wide consistency per spec §8

- [ ] **Step 1: Repo grep gate**

Run:
```bash
rg "text-(emerald|green|red)-[0-9]" app/components --glob "*.tsx"
rg "text-\\[var\\(--success\\)\\]" app/components --glob "*.tsx"
```
แก้ทุกจุดที่เป็นค่าตัวเลข (ยกเว้น toast/icon ที่ไม่ใช่ value)

- [ ] **Step 2: เพิ่มใน ui-qa-checklist**

`- [ ] ตัวเลข/สถานะใช้ cosmic-value + role จาก design.md § Semantic values (ไม่ใช้สี Tailwind สด)`

- [ ] **Step 3: อัปเดต spec status + `pnpm test` + `pnpm lint`**

- [ ] **Step 4: Commit Task 8**

```bash
git add app/components profile activities home promotions event .cursor/skills agent/skills docs/superpowers/specs/2026-10-08-semantic-value-colors-design.md
git commit -m "chore(ui): sweep semantic value colors and QA checklist"
```

---

### Task 9 (optional): Tailwind `@theme` bridge

**Files:**
- Modify: `app/globals.css` (`@theme` block)

- [ ] **Step 1: Map `--color-value-success` etc. to `--value-*`**

- [ ] **Step 2: Migrate 1–2 component เป็นตัวอย่าง `text-value-success` ถ้าต้องการ**

- [ ] **Step 3: Commit** — เฉพาะเมื่อทีมต้องการ utility Tailwind; ไม่บังคับในเฟสแรก

---

## Spec coverage self-review

| Spec § | Task |
| :--- | :--- |
| §3 Roles & policy | Task 1 tokens + helper logic |
| §4 Layers | Task 1 CSS + TS; Task 9 optional Tailwind |
| §5 Inventory | Tasks 2–8 ครบโดเมน |
| §6 Phases 0–5 | Tasks 1–8 |
| §7 Hard rules | Global Constraints + ไม่แตะ progress gradient |
| §8 Acceptance | Task 8 grep + QA checklist |
| §9 Open questions | Resolved in Global Constraints |

## Execution handoff

Plan saved to `docs/superpowers/plans/2026-10-08-semantic-value-colors.md`.

**เลือกวิธีรัน:**

1. **Subagent-Driven (แนะนำ)** — หนึ่ง task ต่อ subagent + review ระหว่าง task  
2. **Inline** — ทำในเซสชันนี้ตาม Task 1→8 พร้อม checkpoint

พีพีอยากให้แพรเริ่มแบบไหน?
