# Typography Scale & Readability Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ยกระดับขนาดตัวอักษรและ Contrast ทั้งระบบ ขจัดฟอนต์ขนาดเล็กกว่า 12px สำหรับภาษาไทยทั้งหมด เพื่อให้อ่านง่าย ชัดเจน สระไม่ตกหล่น และคงความพรีเมียมตามข้อกำหนด Mobile-first

**Architecture:** ปรับปรุงค่า `--text-muted` ใน `tokens.css` ให้อ่านง่ายขึ้นบนพื้นหลังมืด, อัปเดตเอกสาร `design.md` §4, และทยอย Refactor คลาส typography (`text-[...]`, `leading-*`, `text-[var(--text-secondary)]`) ใน Component กลุ่มต่าง ๆ โดยใช้ Tailwind utility classes ตามตาราง Hierarchy ใหม่

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript

## Global Constraints

- **Mobile-First Always:** ออกแบบและจัดวางสำหรับจอมือถือ (375px) เป็นหลัก แล้วรองรับ Desktop อย่างเป็นธรรมชาติ
- **Font Weight Limit:** สูงสุดไม่เกิน 500 (`font-medium`) เสมอ — ห้ามใช้ `font-semibold` หรือ `font-bold` เด็ดขาด
- **Thai Minimum Baseline:** ห้ามใช้ `text-[9.5px]`, `text-[10px]`, `text-[11px]` กับข้อความภาษาไทยทุกจุด (ขั้นต่ำภาษาไทยต้อง 12px / `text-xs` ขึ้นไป)
- **Line-Height Safety:** ข้อความภาษาไทยต้องมี line-height ไม่ต่ำกว่า 1.45 (เช่น `leading-normal` หรือ `leading-[1.45]`) ห้ามใช้ `leading-none` บนภาษาไทยที่มีสระบน-ล่าง
- **Tabular Numbers:** ตัวเลข วันที่ และเวลา ต้องคงคลาส `tabular-nums` เสมอ
- **Separators & Bullets Exemption:** เครื่องหมายตกแต่ง เช่น จุดคั่น `•`, สแลช `/`, หรือ bullet decoration สามารถคง `text-[var(--text-muted)]` ได้
- **Zero Inline Styles:** กำหนดสไตล์ผ่าน Tailwind classes ใน TSX เท่านั้น ห้ามใส่ inline `style={{ fontSize: ... }}`

---

### Task 1: Design Tokens & Documentation Update

**Files:**
- Modify: `app/styles/tokens.css:129-133`
- Modify: `design.md:63-67`
- Modify: `design.md:119-128`

**Interfaces:**
- Consumes: Design spec requirements for `--text-muted` tuning and Typography scale
- Produces: Updated CSS variable `--text-muted: #a8a3c5;` and synced `design.md` guidelines

- [x] **Step 1: Update `--text-muted` token in `app/styles/tokens.css`**

เปลี่ยนค่าตัวแปร `--text-muted` ใน `app/styles/tokens.css` บรรทัดที่ 131:
```css
  --text-primary: #f5f4fc;
  --text-secondary: #b9b5cf;
  --text-muted: #a8a3c5;
  --icon-default: #b9b5df;
```

- [x] **Step 2: Update typography guidelines in `design.md`**

อัปเดตตารางขนาดตัวอักษรใน `design.md` §4 ให้ตรงกับ Hierarchy ใหม่ (เริ่มขั้นต่ำ 12px สำหรับภาษาไทย):
```markdown
| บทบาท | มือถือ | จอใหญ่ | Weight / line-height | คำอธิบาย & การใช้งาน |
| :--- | :--- | :--- | :--- | :--- |
| **Hero / Promo Title** | 24–28px | 32–40px | 500 / 1.25 | แบนเนอร์ หรือ Modal Hero |
| **Section Title** | 18–20px | 20–22px | 500 / 1.35 | หัวข้อส่วน เช่น เกมยอดฮิต |
| **Card / Hub Title** | 16–17px | 17–18px | 500 / 1.35 | ชื่อการ์ด, เมนูด่วน |
| **Body / Input / Label** | 14–15px | 15–16px | 400–500 / 1.45–1.5 | ข้อความเนื้อหาหลัก, ชื่อเกม, ปุ่มกด |
| **Secondary / Caption** | 13–14px | 13–14px | 400–500 / 1.45 | คำอธิบายย่อย, subtitle |
| **Micro / Meta / Badge** *(Min)* | 12px | 12–13px | 500 / 1.4 | **ขั้นต่ำสุดของระบบ** สำหรับวันที่/เวลา/ป้าย |
| **Table Header** | 11.5–12px | 12px | 500 / 1.3 | เฉพาะหัวตารางภาษาอังกฤษ (`uppercase tracking-wider`) |
```

- [x] **Step 3: Run git diff to verify changes**

Run: `git diff app/styles/tokens.css design.md`
Expected: Diff แสดงการแก้ค่า `--text-muted` และตารางใน `design.md` ครบถ้วน

- [x] **Step 4: Commit Task 1**

```bash
git add app/styles/tokens.css design.md
git commit -m "docs(design): update typography baseline and text-muted token"
```

---

### Task 2: Modals & Bottom Sheets Typography Refactoring

**Files:**
- Modify: `app/components/deposit/DepositBottomSheet.tsx`
- Modify: `app/components/withdraw/WithdrawBottomSheet.tsx`
- Modify: `app/components/gems-store/GemsStorePageContent.tsx`
- Modify: `app/components/referral/ReferralPageContent.tsx`
- Modify: `app/components/referral/ReferralOverviewSections.tsx`
- Modify: `app/components/referral/ReferralEarningPanel.tsx`
- Modify: `app/components/referral/ReferralDesktopHubLayout.tsx`
- Modify: `app/components/vip/VipProgressAndMissions.tsx`
- Modify: `app/components/vip/VipRankRequirementsPanel.tsx`
- Modify: `app/components/vip/VipMaintainRankPanel.tsx`
- Modify: `app/components/vip/VipCircularProgress.tsx`

**Interfaces:**
- Consumes: Task 1 tokens
- Produces: Clean, readable modal and bottom sheet content with all Thai hints, labels, and exchange rates >= 12px

- [x] **Step 1: Refactor Deposit & Withdraw Bottom Sheets**

1. ใน `app/components/deposit/DepositBottomSheet.tsx`:
   - ปรับ `text-[10px]` บรรทัด 471 (`ข้อมูลบัญชีเป็นตัวอย่าง`) ให้เป็น `text-xs text-[var(--text-secondary)]`
   - ปรับ `text-[11px]` บรรทัด 368 (`แตะยอดเงินเพื่อแก้ไข`) ให้เป็น `text-[12.5px] text-[var(--text-secondary)]`
   - ปรับ `text-[11px]` บรรทัด 501 (`แนบสลิปหลังโอนเงินเรียบร้อยแล้ว`) ให้เป็น `text-[12.5px] text-[var(--text-secondary)]`
   - ปรับ `text-[11px]` บรรทัด 321 และ 465 (สถานะ success) ให้เป็น `text-xs`

2. ใน `app/components/withdraw/WithdrawBottomSheet.tsx`:
   - ปรับ `text-[11px] text-[var(--text-muted)]` บรรทัด 118 (`โอนเข้าบัญชีของคุณ`) ให้เป็น `text-[13px] text-[var(--text-secondary)]`
   - ปรับ `text-[11px] text-[var(--text-muted)]` บรรทัด 125 (`{bank.holderLabel}`) ให้เป็น `text-[13px] text-[var(--text-secondary)]`
   - ปรับ `text-[11px] text-[var(--text-muted)]` บรรทัด 183 (`แตะยอดเงินเพื่อแก้ไข`) ให้เป็น `text-[12.5px] text-[var(--text-secondary)]`

- [x] **Step 2: Refactor Gems Store & Referral Components**

1. ใน `app/components/gems-store/GemsStorePageContent.tsx`:
   - ปรับ `text-[10px] ... sm:text-[11px]` บรรทัด 75 ให้เป็น `text-xs sm:text-[13px]`
   - ปรับ `text-[9px] ... sm:text-[10px]` บรรทัด 81 (`ยอดตัวอย่าง`) ให้เป็น `text-xs text-[var(--text-secondary)]`
   - ปรับ `text-[11px]` บรรทัด 86 (`{GEMS_STORE_EXCHANGE_RATE_LABEL}`) ให้เป็น `text-[13px] text-[var(--text-secondary)]`
   - ปรับ `text-[10px]` บรรทัด 118 (เลขลำดับ 1, 2, 3) ให้เป็น `text-xs`
   - ปรับ `text-[10px] ... sm:text-xs` บรรทัด 175 ให้เป็น `text-xs sm:text-[13px]`
   - ปรับปุ่มแลกเพชรบรรทัด 188-189 `!text-[10px] sm:!text-xs` ให้เป็น `!text-xs sm:!text-[13px]`

2. ใน `app/components/referral/ReferralPageContent.tsx`:
   - ปรับ `text-[11px] text-[var(--text-muted)]` บรรทัด 171 ให้เป็น `text-xs text-[var(--text-secondary)]`
   - ปรับ `text-[10px] text-[var(--text-muted)]` บรรทัด 185 (`{tier.subtitle}`) และ 187 (`{tier.rateHint}`) ให้เป็น `text-xs text-[var(--text-secondary)]`
   - ปรับ `text-[11px]` บรรทัด 196 ให้เป็น `text-xs`
   - ปรับ `text-[11px] font-medium` บรรทัด 215 (`{step.label}`) ให้เป็น `text-xs sm:text-[13px]`

3. ใน `app/components/referral/ReferralOverviewSections.tsx`, `ReferralEarningPanel.tsx`, `ReferralDesktopHubLayout.tsx`:
   - ปรับคำอธิบายย่อยที่เป็น `text-[10px]` / `text-[11px] text-[var(--text-muted)]` ให้เป็น `text-xs text-[var(--text-secondary)]`

- [x] **Step 3: Refactor VIP Panels**

1. ใน `app/components/vip/VipProgressAndMissions.tsx`:
   - ปรับ `text-[11px] tabular-nums` บรรทัด 36 ให้เป็น `text-xs tabular-nums`
   - ปรับ `text-[11px] text-[var(--text-muted)]` บรรทัด 51 และ 58 ให้เป็น `text-xs sm:text-[13px] text-[var(--text-secondary)]`

2. ใน `app/components/vip/VipRankRequirementsPanel.tsx`:
   - ปรับ `text-[11px]` บรรทัด 106 ให้เป็น `text-xs`
   - ปรับ `text-[11px] leading-snug text-[var(--text-muted)]` บรรทัด 197 ให้เป็น `text-xs leading-normal text-[var(--text-secondary)]`

3. ใน `app/components/vip/VipMaintainRankPanel.tsx`:
   - ปรับ `text-[11px] text-[var(--text-muted)]` บรรทัด 48 (`ตัวเลขตัวอย่าง`) ให้เป็น `text-xs text-[var(--text-secondary)]`

4. ใน `app/components/vip/VipCircularProgress.tsx`:
   - ปรับ `text-[11px] leading-snug text-[var(--text-secondary)]` บรรทัด 87 ให้เป็น `text-xs leading-normal text-[var(--text-secondary)]`

- [x] **Step 4: Verify with TypeScript build check**

Run: `pnpm exec tsc --noEmit`
Expected: Output clean with 0 errors

- [x] **Step 5: Commit Task 2**

```bash
git add app/components/deposit/ app/components/withdraw/ app/components/gems-store/ app/components/referral/ app/components/vip/
git commit -m "refactor(ui): elevate typography baseline in modals and bottom sheets"
```

---

### Task 3: Tables & Data Grids Typography Refactoring

**Files:**
- Modify: `app/components/home/HallOfFame.tsx`
- Modify: `app/components/cashback/CashbackLossRebateExtraSections.tsx`
- Modify: `app/components/transactions/TransactionList.tsx`
- Modify: `app/components/activities/ActivityHubShared.tsx`

**Interfaces:**
- Consumes: Task 1 tokens
- Produces: Legible, neatly aligned table headers and row items with dates/times >= 12px tabular-nums

- [x] **Step 1: Refactor HallOfFame.tsx**

1. ปรับหัวตารางบรรทัด 114:
```tsx
// Before:
<tr className="hall-of-fame-table__head-row grid items-center gap-x-[0.65rem] text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] sm:text-[11px]">
// After:
<tr className="hall-of-fame-table__head-row grid items-center gap-x-[0.65rem] text-[11.5px] font-medium uppercase tracking-wider text-[var(--text-secondary)] sm:text-xs">
```
2. ปรับคอลัมน์เวลาบรรทัด 179:
```tsx
// Before:
<span className="block truncate text-[10px] tabular-nums text-[var(--text-secondary)] sm:text-xs">
// After:
<span className="block truncate text-xs tabular-nums text-[var(--text-secondary)] sm:text-[13px]">
```

- [x] **Step 2: Refactor CashbackLossRebateExtraSections.tsx & TransactionList.tsx**

1. ใน `app/components/cashback/CashbackLossRebateExtraSections.tsx`:
   - ปรับ badge ตัวเลขลำดับบรรทัด 195: จาก `text-[10px]` เป็น `text-xs`
   - ปรับคำอธิบายขั้นตอนบรรทัด 259: จาก `text-[9px] ... sm:text-[10px]` เป็น `text-xs leading-normal text-[var(--text-secondary)]`

2. ใน `app/components/transactions/TransactionList.tsx`:
   - ปรับสกุลเงิน/ป้ายบรรทัด 94: จาก `text-[10px] text-[var(--text-muted)]` เป็น `text-xs text-[var(--text-secondary)]`

- [x] **Step 3: Refactor ActivityHubShared.tsx**

1. ใน `app/components/activities/ActivityHubShared.tsx`:
   - ปรับหัวตารางบรรทัด 203: จาก `text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)] sm:text-[11px]` เป็น `text-[11.5px] font-medium uppercase tracking-wider text-[var(--text-secondary)] sm:text-xs`
   - ปรับปุ่มเคลมกิจกรรมบรรทัด 241: จาก `text-[10px] font-medium leading-tight sm:text-[11px]` เป็น `text-xs font-medium leading-tight sm:text-[13px]`
   - ปรับป้ายลำดับขั้นบรรทัด 345: จาก `text-[10px]` เป็น `text-xs`
   - ปรับคำอธิบายยอดเทิร์นบรรทัด 167 และ 173: จาก `text-[11px] text-[var(--text-secondary)] sm:text-xs` เป็น `text-xs text-[var(--text-secondary)] sm:text-[13px]`
   - ปรับตัวเลขยอดเทิร์นบรรทัด 185: จาก `text-[11px]` เป็น `text-xs`

- [x] **Step 4: Verify with TypeScript build check**

Run: `pnpm exec tsc --noEmit`
Expected: Output clean with 0 errors

- [x] **Step 5: Commit Task 3**

```bash
git add app/components/home/HallOfFame.tsx app/components/cashback/CashbackLossRebateExtraSections.tsx app/components/transactions/TransactionList.tsx app/components/activities/ActivityHubShared.tsx
git commit -m "refactor(ui): elevate table headers, rows and activity grids typography"
```

---

### Task 4: Missions, Daily Check-In & Lucky Wheel Typography Refactoring

**Files:**
- Modify: `app/components/missions/DailyCheckInCard.tsx`
- Modify: `app/components/missions/DailyCheckInDesktopLayout.tsx`
- Modify: `app/components/wheel/LuckyWheelWalletPanel.tsx`
- Modify: `app/components/wheel/LuckyWheelLiveWinners.tsx`
- Modify: `app/components/wheel/LuckyWheelPageContent.tsx`
- Modify: `app/components/wheel/LuckyWheelPrizeHistory.tsx`
- Modify: `app/components/wheel/LuckyWheelIntroColumn.tsx`

**Interfaces:**
- Consumes: Task 1 tokens
- Produces: Legible check-in day labels and rewards (>= 12px), readable live winners stream and wheel wallet details

- [x] **Step 1: Refactor DailyCheckInCard.tsx & DailyCheckInDesktopLayout.tsx**

1. ใน `app/components/missions/DailyCheckInCard.tsx`:
   - ปรับหมายเลขวันที่บรรทัด 229: จาก `text-[11px] sm:text-xs font-medium leading-none mb-1 tabular-nums` เป็น `text-xs sm:text-[13px] font-medium leading-tight mb-1 tabular-nums`
   - ปรับป้ายรางวัลบรรทัด 292: จาก `rounded-md px-1.5 sm:px-2 py-0.5 text-[9.5px] sm:text-[11px] font-medium tabular-nums transition-all whitespace-nowrap` เป็น `rounded-md px-1.5 sm:px-2 py-0.5 text-xs sm:text-[12.5px] font-medium tabular-nums transition-all whitespace-nowrap`
   - ปรับสถานะเช็คอินบรรทัด 343: จาก `text-[9.5px] sm:text-[11px] font-medium whitespace-nowrap` เป็น `text-xs sm:text-[12.5px] font-medium whitespace-nowrap`

2. ใน `app/components/missions/DailyCheckInDesktopLayout.tsx`:
   - ปรับข้อกำหนดเงื่อนไขบรรทัด 100: จาก `text-[11px] leading-snug text-[var(--text-muted)]` เป็น `text-xs leading-normal text-[var(--text-secondary)]`

- [x] **Step 2: Refactor Lucky Wheel Components**

1. ใน `app/components/wheel/LuckyWheelWalletPanel.tsx`:
   - ปรับรายละเอียดกระเป๋าบรรทัด 187: จาก `text-[10px] leading-snug text-[var(--text-muted)]` เป็น `text-xs leading-normal text-[var(--text-secondary)]`

2. ใน `app/components/wheel/LuckyWheelLiveWinners.tsx`:
   - ปรับ badge บรรทัด 24: จาก `text-[10px] font-medium` เป็น `text-xs font-medium`
   - ปรับชื่อผู้ชนะบรรทัด 41: จาก `text-[11px]` เป็น `text-xs sm:text-[13px]`
   - ปรับเวลาผู้ชนะบรรทัด 58: จาก `text-[11px] text-white/40 tabular-nums` เป็น `text-xs text-[var(--text-secondary)] tabular-nums`

3. ใน `app/components/wheel/LuckyWheelPageContent.tsx`:
   - ปรับ subtitle บรรทัด 93 (`หมุนลุ้นรับรางวัลใหญ่ทุกวัน`): จาก `text-[11px]` เป็น `text-xs sm:text-[13px] text-[var(--text-secondary)]`
   - ปรับข้อความบรรทัด 212: จาก `text-[11px]` เป็น `text-xs`
   - ปรับคำโปรยบรรทัด 236 (`หมุนสนุก ลุ้นรับของรางวัลได้ทุกวัน`): จาก `text-[11px] text-white/40` เป็น `text-xs text-[var(--text-secondary)]`
   - ปรับตัวอย่างรางวัลบรรทัด 277 (`ตัวอย่างรางวัลและยอดกระเป๋า`): จาก `text-[10px] text-white/30` เป็น `text-xs text-[var(--text-secondary)]`

4. ใน `app/components/wheel/LuckyWheelPrizeHistory.tsx` & `LuckyWheelIntroColumn.tsx`:
   - ปรับประวัติรางวัลบรรทัด 63, 72: จาก `text-[11px]` เป็น `text-xs`
   - ปรับ benefit title บรรทัด 66: จาก `text-[11px] sm:text-xs` เป็น `text-xs sm:text-[13px]`

- [x] **Step 3: Verify with TypeScript build check**

Run: `pnpm exec tsc --noEmit`
Expected: Output clean with 0 errors

- [x] **Step 4: Commit Task 4**

```bash
git add app/components/missions/ app/components/wheel/
git commit -m "refactor(ui): elevate typography baseline in missions and lucky wheel"
```

---

### Task 5: Game & Provider Cards Typography Refactoring & Final Verification

**Files:**
- Modify: `app/components/slots/ProviderGameGrid.tsx`
- Modify: `app/components/sport/SportProviderCards.tsx`
- Modify: `app/components/casino/CasinoProviderCards.tsx`
- Modify: `app/components/ui/JackpotWinnerCard.tsx`
- Modify: `app/components/promotions/PromotionsHubPageContent.tsx`
- Modify: `app/components/profile/ProfileHubHeader.tsx`

**Interfaces:**
- Consumes: Task 1 tokens
- Produces: Clean, readable cards and grids with zero tiny Thai labels across the entire app

- [x] **Step 1: Refactor ProviderGameGrid & Provider Cards**

1. ใน `app/components/slots/ProviderGameGrid.tsx`:
   - ปรับชื่อเกมบรรทัด 469:
```tsx
// Before:
<p className="mt-1.5 line-clamp-2 min-h-[28px] text-[10px] sm:text-[11.5px] font-medium tracking-tight text-[var(--text-primary)] text-center leading-tight transition-colors group-hover:text-white">
// After:
<p className="mt-1.5 line-clamp-2 min-h-[32px] text-xs sm:text-[13px] font-medium tracking-tight text-[var(--text-primary)] text-center leading-snug transition-colors group-hover:text-white">
```

2. ใน `app/components/sport/SportProviderCards.tsx` & `CasinoProviderCards.tsx`:
   - ปรับชื่อ provider บรรทัด 254 (Sport) และ 323 (Casino):
```tsx
// Before:
<h3 className="line-clamp-2 text-center text-[10px] sm:text-[11.5px] font-medium uppercase leading-tight tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
// After:
<h3 className="line-clamp-2 text-center text-xs sm:text-[13px] font-medium uppercase leading-snug tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
```

- [x] **Step 2: Refactor JackpotWinnerCard & ProfileHubHeader**

1. ใน `app/components/ui/JackpotWinnerCard.tsx`:
   - ปรับชื่อผู้เล่นบรรทัด 39: จาก `text-[11px]` เป็น `text-xs sm:text-[13px]`
   - ปรับหมวดเกมบรรทัด 45: จาก `text-[10px] font-medium text-[var(--icon-default)]` เป็น `text-xs font-medium text-[var(--text-secondary)]`
   - ปรับรายละเอียดบรรทัด 46: จาก `text-[10px] leading-snug text-[var(--text-muted)]` เป็น `text-xs leading-normal text-[var(--text-secondary)]`

2. ใน `app/components/promotions/PromotionsHubPageContent.tsx`:
   - ปรับ subtitle บรรทัด 162: จาก `text-[11px] leading-relaxed text-[var(--text-secondary)] sm:text-xs` เป็น `text-xs leading-relaxed text-[var(--text-secondary)] sm:text-[13px]`

3. ใน `app/components/profile/ProfileHubHeader.tsx`:
   - ปรับ meta บรรทัด 86, 90: จาก `text-[11px]` เป็น `text-xs`
   - ปรับสถานะ verification บรรทัด 102: จาก `text-[10px]` เป็น `text-xs`

- [x] **Step 3: Verification scan for any remaining tiny Thai fonts**

Run: `git grep -E "text-\[(9|9\.5|10|11)px\]" -- "app/components/*.tsx"`
Expected: Remaining matches should ONLY be English uppercase table headers, trademark symbols (™), or non-Thai micro decorative pills. All Thai body, labels, subtitles, and hints are >= 12px.

- [x] **Step 4: Final TypeScript typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: Output clean with 0 errors

- [x] **Step 5: Commit Task 5**

```bash
git add app/components/slots/ app/components/sport/ app/components/casino/ app/components/ui/ app/components/promotions/ app/components/profile/
git commit -m "refactor(ui): elevate game cards typography and finalize baseline"
```
