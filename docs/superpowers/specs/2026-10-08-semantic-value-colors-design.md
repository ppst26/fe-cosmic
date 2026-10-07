# Design Spec: Semantic Value Colors (System-wide)

- **Date:** 2026-10-08
- **Status:** Implemented (2026-10-08)
- **Scope:** **ทุกหน้าและทุก surface** ของโปรเจกต์ Cosmicbet (lobby, standalone, hub modals, lottery, deposit/withdraw sheets, play, dashboard/debug ถ้ามีค่าตัวเลข)

---

## 1. Problem Statement

ตัวเลข เปอร์เซ็นต์ สถานะ และยอดเงินใช้สีไม่สม่ำเสมอ:

- VIP: `--vip-benefit-value` (ขาว), metric complete → `--success`
- ธุรกรรม: สถานะมี semantic แต่สรุปยอดรวมเป็น `--success` ทั้งก้อน
- Referral / cashback: `--accent-highlight`, `--icon-active`, `--text-primary` สลับกัน
- Hall of Fame / wheel: payout บางจุดอิง gold บางจุดขาว
- หลาย component ใส่ `text-[var(--success)]` / hex / Tailwind สีสดโดยตรง

ผู้เล่นต้องอ่าน **ความหมาย** จากสีได้เร็ว และทีม dev ต้องมี **role เดียว** ทั้ง repo

---

## 2. Goals & Non-Goals

### Goals

- กำหนด **semantic roles** สำหรับ “ค่า” (ไม่ใช่แค่ label หรือพื้นการ์ด)
- Token กลางใน `app/styles/tokens.css` + utility ใน `app/styles/base.css`
- Helper ใน `lib/semanticValue.ts` (หรือ `lib/domain/*`) สำหรับ enum / delta
- ครอบคลุม **มือถือ + desktop hub** ด้วยกฎเดียวกัน
- สอดคล้อง `design.md`: solid UI, `tabular-nums`, font weight ≤ 500, ไม่ glow รอบตัวเลข

### Non-Goals

- ไม่เปลี่ยน palette ม่วงหลัก / CTA gradient
- ไม่บังคับ `<ValueDisplay>` wrapper ทุกจุดในเฟสแรก
- ไม่ refactor สีพื้นการ์ด / border ใน spec นี้

---

## 3. Semantic Roles (Value Intent)

หนึ่ง role = หนึ่งความหมายทั่วโปรเจกต์. Component เลือก role จาก **ความหมายของข้อมูล** ไม่จากขนาดฟอนต์.

| Role | Token | แหล่งสี (bridge) | ใช้เมื่อ |
| :--- | :--- | :--- | :--- |
| **emphasis** | `--value-emphasis` | `var(--text-primary)` | ตัวเลขสำคัญที่ไม่บอกทิศทาง (เช่น % ความคืบหน้ารวม, ยอดหลักในการ์ดสรุป) |
| **neutral** | `--value-neutral` | `var(--text-secondary)` | ตัวเลขในแถวตารางทั่วไป, ส่วน progress ปัจจุบัน/เป้า (ไม่เน้น) |
| **muted** | `--value-muted` | `var(--text-muted)` | ไม่มีค่า (`—`, `-`), placeholder, disabled amount |
| **success** | `--value-success` | `var(--success)` | สำเร็จ, ครบเงื่อนไข, กำไร, ยอดบวกที่ต้องการเน้นเชิงบวก |
| **danger** | `--value-danger` | `var(--destructive)` | ล้มเหลว, ขาดทุน, ยอดลบ, ยกเลิก |
| **warning** | `--value-warning` | `var(--warning)` *(ใหม่)* | รอดำเนินการ, ใกล้หมดเวลา, ความเสี่ยง (เช่น 0 วันคงเหลือรักษาระดับ) |
| **reward** | `--value-reward` | `var(--value-reward-fg)` *(ใหม่, อิง gold)* | เปอร์เซ็นต์สิทธิ, cashback/rolling, payout ชนะ, รางวัลเงิน |
| **accent** | `--value-accent` | `var(--accent-primary)` หรือ `--accent-highlight` | โบนัสแบรนด์, เพชร/gems, promo +% ที่ไม่ใช่สิทธิ VIP มาตรฐาน |

### Default policy (ตัดสินเมื่อ PP ไม่ระบุราย role)

- **เปอร์เซ็นต์สิทธิ / อัตราคืน (Cashback, Rolling, rebate %):** → **reward** (สอดคล้อง `design.md` — payout เน้น gold)
- **+% โบนัสเพชร / แต้มพิเศษ:** → **accent**
- **Progress % รวม (เลื่อน VIP):** → **emphasis**
- **วันคงเหลือ = 0 (รักษาระดับ):** → **warning**; ถ้าเลยกำหนดแล้ว (ถ้ามี state) → **danger**
- **ยอดเงินสรุปท้ายตาราง:** แยกตามความหมาย (ฝากสำเร็จ → success ได้; “ยอดเดิมพันรวม” → emphasis/neutral ไม่ใช่ success ทั้งก้อน)

### Proposed new tokens (`tokens.css`)

```css
--warning: #e8b339; /* หรือจูนจาก design — pending visual QA */
--value-reward-fg: #f0c14b; /* ทองอ่านง่ายบนพื้นเข้ม; ไม่ใช้ gradient เป็นตัวอักษร */
--value-emphasis: var(--text-primary);
--value-neutral: var(--text-secondary);
--value-muted: var(--text-muted);
--value-success: var(--success);
--value-danger: var(--destructive);
--value-warning: var(--warning);
--value-reward: var(--value-reward-fg);
--value-accent: var(--accent-primary);
```

Legacy aliases (migrate แล้วลบ):

- `--vip-benefit-value` → map ไป role ตาม context (reward / muted / success)
- `--vip-level-up-percent` → `--value-emphasis`
- `--vip-benefit-value-success` → `--value-success`
- `--vip-benefit-value-muted` → `--value-muted`

---

## 4. Implementation Layers

### 4.1 CSS utilities (`app/styles/base.css`, `@layer components`)

| Class | Role |
| :--- | :--- |
| `cosmic-value` | `tabular-nums font-medium` (หรือ inherit size จาก parent) |
| `cosmic-value--emphasis` | emphasis |
| `cosmic-value--neutral` | neutral |
| `cosmic-value--muted` | muted |
| `cosmic-value--success` | success |
| `cosmic-value--danger` | danger |
| `cosmic-value--warning` | warning |
| `cosmic-value--reward` | reward |
| `cosmic-value--accent` | accent |

กฎ: สีผ่าน `color: var(--value-*)` ใน utility; **ห้าม** hex ใน TSX ยกเว้น mock/debug.

### 4.2 TypeScript helpers (`lib/semanticValue.ts`)

```ts
// ตัวอย่าง API — implement ตาม plan
transactionStatusValueRole(status): ValueRole
transactionStatusValueClass(status): string // returns cosmic-value--*

moneyDeltaRole(amount: number): ValueRole // >0 success, <0 danger, 0 neutral
signedMoneyClass(amount: number): string

vipBenefitDisplayRole(rowId: string, display: string): ValueRole // — → muted, ✓ → success, % → reward

parseOptionalPercent(display: string): ValueRole
```

Enum ที่มีอยู่แล้วให้รวมศูนย์ที่ helper แทน `switch` ซ้ำในแต่ละ table.

### 4.3 Tailwind bridge (optional phase 2)

ใน `@theme` / `globals.css`: `--color-value-success: var(--value-success)` เพื่อ `text-value-success` — ทำหลัง utility CSS นิ่งแล้ว

### 4.4 Documentation

- เพิ่ม § **Semantic values** ใน `design.md` (ตาราง role + ตัวอย่าง)
- อัปเดต `.cursor/rules/design-system.mdc` สรุปสั้น ๆ
- `ui-qa-checklist`: ตรวจค่าตัวเลขในหน้าที่แก้ใช้ role ถูก

---

## 5. Surface Inventory (ทุกหน้า / โดเมน)

แต่ละแถว = ต้องใช้ระบบ role เดียวกันเมื่อ migrate

| โดเมน | Route / entry | ค่าที่ต้องใส่สี semantic |
| :--- | :--- | :--- |
| **Lobby หลัก** | `app/(lobby)/page.tsx`, category pages | HoF payout, jackpot/online count (neutral), แต้มในการ์ดถ้ามี |
| **Header / wallet** | `HeaderWalletChip`, `MenuDrawerWalletCards` | ยอดเครดิต → emphasis; แต้มรอง → accent ถ้าแยกชนิด |
| **Hub modals** | `DesktopHubModal`, bodies ต่าง ๆ | เทียบเท่า standalone — ห้าม fork สี |
| **ธุรกรรม** | `/transactions`, `TransactionsPageContent`, `TransactionHistoryTable` | status, ยอด, win/loss bet, สรุปท้ายตาราง |
| **ฝาก / ถอน** | `DepositBottomSheet`, `WithdrawBottomSheet`, pending dialog | จำนวนเงิน, สถานะรอ |
| **VIP** | `/vip`, `VipModal`, rank stack | สิทธิ %, progress %, วันคงเหลือ, ครบแล้ว |
| **Cashback / loss rebate** | `/cashback`, `/loss-rebate`, extra sections | ยอดคืน, ตารางประวัติ, สูตรคำนวณ |
| **Referral** | `/referral`, hub flat | โบนัสรวม (reward/accent), ตาราง users/earning |
| **Reward** | `/reward/*`, redeem panels | แต้ม, รางวัล, coming soon labels (ไม่ใช่ value) |
| **Gems store** | `/gems-store` | ราคา gems, ยอดแลก, confirm dialog |
| **Missions** | `/missions/check-in` | รางวัลรายวัน, streak |
| **Wheel** | `/wheel` | รางวัล, live winners, ticket balance |
| **Promotions / event / activities** | `/promotions`, `/event`, `/activities` | เงื่อนไขตัวเลข, รางวัลถ้ามี |
| **Profile** | `/profile`, account | ยอด, สถานะ verify success |
| **Lottery** | `/lottery/*`, bet boards, slips, results tables | ยอดแทง, อัตราจ่าย, ผลรางวัล, สรุปโพย |
| **Play** | `/play/[gameId]` | balance ใน chrome ถ้าแสดง |
| **Provider grids** | slots/casino/fishing/cards | RTP/online ถ้าแสดงเป็นตัวเลข |
| **Auth / toast / confirm** | login, `CosmicToast`, confirm | error/success ข้อความ — ใช้ alert/toast tokens ที่มี; ตัวเลขใน body ใช้ value roles |
| **Dashboard** | `/dashboard` | debug metrics → neutral |

---

## 6. Migration Phases

| Phase | งาน | เกณฑ์จบ |
| :--- | :--- | :--- |
| **0 — Foundation** | tokens + utilities + `semanticValue.ts` + `design.md` § | build ผ่าน, ไม่เปลี่ยน UI |
| **1 — High traffic** | VIP stack, transactions (+ hub), header wallet | สถานะ/สิทธิ/% ตรงตาราง role |
| **2 — Money loops** | deposit/withdraw, cashback, referral, gems | ยอดและโบนัสไม่ใช้ success มั่ว |
| **3 — Engagement** | wheel, check-in, reward, HoF | payout → reward |
| **4 — Lottery** | boards, slips, results tables | ยอด/ผลชนะแยก success/danger |
| **5 — Sweep** | lobby leftovers, play, promotions | grep ไม่มี `text-emerald-`, `text-red-` ในค่า |

แต่ละ PR: หน้าใหม่ **บังคับ** utilities/helpers; หน้าเก่าแก้เมื่อถึง phase.

---

## 7. Hard Rules

1. **สี = ความหมาย** ไม่ใช่ขนาดตัวอักษร
2. **Weight ≤ 500** — เน้นด้วย role + ขนาด (`text-sm` / `text-lg`)
3. **ตัวเลข** ใช้ `tabular-nums` (ผ่าน `cosmic-value`)
4. **ห้าม** glow/neon บนตัวเลข; gold ใช้ solid `--value-reward-fg` ไม่ใช้ gradient clip เป็นข้อความ (อ่านยากบนมือถือ)
5. **Progress bar** ยังใช้ gradient deposit/turnover ตาม VIP — สีในแถบ ≠ สีตัวเลข (ตัวเลขตาม role)
6. **shadcn** ใช้ bridge จาก tokens ไม่ใช้ stock theme

---

## 8. Verification & Acceptance

- [ ] ตารางธุรกรรม: สำเร็จ/รอ/ล้มเหลว สีเดียวกับ toast/alert ที่เทียบได้
- [ ] VIP: % สิทธิเป็น reward; `—` เป็น muted; ครบแล้วเป็น success
- [ ] HoF / wheel payout เป็น reward
- [ ] Win/loss bet: บวก success, ลบ danger (หรือ neutral สำหรับยอดเดิมพันรวม — ตาม mapping ใน helper)
- [ ] Hub desktop = standalone เดียวกันสำหรับ module เดียวกัน
- [ ] `rg "text-(emerald|green|red)-[0-9]" app/components` → 0 ในส่วนที่แสดงค่า (ยกเว้น comment)
- [ ] `rg "vip-benefit-value[^-]"` → เหลือแค่ alias ใน tokens หรือ 0 ใน TSX

---

## 9. Open Questions (resolve before implementation plan)

1. **`--warning` exact hex** — จูนคู่กับ `--success` / `--destructive` บนพื้น standalone
2. **ยอดเดิมพันรวมท้ายตาราง** — emphasis vs neutral (แนะนำ neutral, กำไร/ขาดทุนแยกบรรทัด success/danger)
3. **Payout ใหญ่ (Hero)** — อนุญาต `cosmic-value--reward` + ขนาดใหญ่ หรือแยก class `cosmic-value--reward-hero` (size only)

---

## 10. Next Step

หลัง PP อนุมัติ spec นี้ → ใช้ skill **writing-plans** สร้าง `docs/superpowers/plans/2026-10-08-semantic-value-colors.md` (phase 0–5, ไฟล์ที่แตะ, checklist QA).
