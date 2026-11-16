# Cosmicbet — Front-end Design Guide

เอกสารสำหรับ agent ออกแบบและพัฒนา Front-end  
**สถานะ:** ภาพรวมดีไซน์ที่ลงตัวแล้ว ณ 17 พฤศจิกายน 2026 (อัปเดตจากโค้ดจริงใน `app/styles/`, `lib/themes.ts`, `app/components/`)  
**ต้นฉบับดีไซน์:** Cosmicbet เท่านั้น — **ไม่** follow UI/UX จากเว็บอ้างอิงภายนอก (เช่น Dexsport.io) อ้างอิงเฉพาะ `design.md` + `tokens.css` + component ใน repo

> **วิธีใช้เอกสารนี้:** ลำดับความสำคัญ = คำสั่งผู้ใช้ล่าสุด > เอกสารนี้ > mockup เก่า  
> ค่าตัวเลขในเอกสารอ้างจาก token จริง — ถ้าโค้ดกับเอกสารไม่ตรง ให้ถือ **`app/styles/tokens.css` เป็นความจริง** แล้วแก้เอกสาร  
> รายการที่ "โค้ดยังไม่ตรงกฎ" รวมอยู่ที่ **§ 15 หนี้ดีไซน์ที่ทราบ** — อย่าลอกจุดเหล่านั้นไปทำซ้ำในงานใหม่

---

## 0. ภาพรวมดีไซน์ในหนึ่งหน้า

Cosmicbet คือเว็บเดิมพันแนว **Solid cosmic** — พื้นเข้มทึบ มุมโค้ง ม่วง-คราม เป็นสีแบรนด์ แยกชั้นด้วย **ความสว่างของพื้นผิว** ไม่ใช่ขอบหนาหรือ blur

| เสา | สาระ |
| :--- | :--- |
| **Solid ไม่ใช่ Glass** | การ์ด/sheet/chrome ใช้ fill ทึบจาก token · overlay มืดล้วน ไม่ blur · แสงจำกัดเฉพาะ header, แถบหัว section, CTA |
| **Token-first** | สี/ระยะ/มุม/motion อยู่ใน CSS variables ส่วนกลาง · component อ่านจาก token → **เปลี่ยนธีมได้ทั้งเว็บโดยไม่แก้ TSX** |
| **12 ธีมสลับได้** | ธีมเริ่มต้น `cosmic` + มืด 6 + สว่าง 5 · `<html data-theme>` + `data-mode` · สร้างจาก generator (§ 4) |
| **Mobile-first** | วางจากจอมือถือ (bottom nav + bottom sheet) แล้วขยายเป็น desktop (sidebar + right rail + modal กลางจอ) ที่ breakpoint `lg` = 1024px |
| **น้ำหนักเบา** | ไม่มี loading boundary ราก/splash · section ใต้ fold defer · รูป avif/webp ย่อแล้ว · motion เฉพาะ transform/opacity (§ 12) |
| **พร้อมต่อ backend** | ข้อมูลทุกจอผ่าน `lib/api/*` (mock → HTTP แก้ที่ฟังก์ชันเดียว) · รวม title/favicon (§ 13) |

**สิ่งที่ห้ามทำ (สรุป):** เพิ่ม blur/glass ใหม่ · ใส่ hex พื้นผิวตายตัวใน component · น้ำหนักฟอนต์เกิน 500 · เพิ่ม UI นอก scope ที่ผู้ใช้ขอ · รื้อ section อื่นโดยไม่จำเป็น

---

## 1. เป้าหมายและลำดับความสำคัญ

- UI เรียบ มืออาชีพ อ่านง่าย — เข้าถึงเกม/หวย/กระเป๋าเงินในไม่กี่คลิก
- **Mobile-first เสมอ** — spacing, ตัวอักษร, การ์ด คิดจากมือถือก่อน
- **พื้นหลังหน้า:** ชั้น `--cosmic-page-base` + nebula เบา (บน `<html>`) · **การ์ดและ chrome ทึบ**
- **สีเน้น (action):** `--action-solid` (ค่าเริ่มต้น `#4930df`) สำหรับปุ่มหลัก, tab active, ลิงก์สำคัญ · gradient ม่วง→ฟ้า (`--action-gradient`) เฉพาะ CTA/badge โปรโมชัน
- แยก **พื้นผิวยก (solid)** จากพื้นหน้า ด้วยระดับความสว่าง — ไม่พึ่ง border หนา
- ภาพแยกส่วนเป็นส่วนต่อเนื่องของหน้าเดียวกัน ไม่สร้าง Header/Navigation ซ้ำ
- Mockup เป็นแนวทางภาพรวม ไม่ใช่ขนาด CSS จริง

---

## 2. ภาษาดีไซน์ (สรุปสำหรับ agent)

| พื้นที่ | ลักษณะที่ต้องทำ |
| :--- | :--- |
| **Header / chrome** | แถบทึบ (`--cosmic-chrome-surface-bg` มือถือ · `--header-desktop-chrome-*` desktop) · chip ยอด/ค้นหา solid · ธีมอื่นไล่สี `ga→gb` ผ่าน `.theme-brand-surface` |
| **Hero** | Carousel แบนเนอร์มุมโค้ง · pagination จุด/เส้น · รูปเต็มการ์ด |
| **หมวดเกม (CategoryNav)** | การ์ดมุมโค้ง solid · 3D icon เฉพาะแถวหมวด · active = `--category-active-gradient` |
| **Search** | pill พื้นทึบยก (desktop เท่านั้น) · ไม่ ring หนักตอน focus |
| **รายการเกม** | หัว section แถบไล่ม่วงจาง (`.lobby-section-header-band`) · carousel แนวนอน · ปกเกม 3:4 |
| **ตาราง/ลีดเดอร์** | แถว **แยกการ์ด** มี `gap` แนวตั้งชัด · ตารางข้อมูลใช้ `.cosmic-data-table-*` |
| **Bottom sheet / Modal** | shell ทึบ (graphite → ม่วงจาง) + inner card/field ทึบอ่อนกว่า shell · ปุ่มยืนยัน `btn-primary` |
| **Desktop shell** | header band + sidebar (พับได้) + main + right rail · modal กลางจอ |
| **Mobile bottom nav** | 5 ช่อง (ถอน / ฝาก / เมนู / คืนยอด / ติดต่อ) · พื้น `--bottom-nav-bg` ทึบ |
| **ปุ่มลอย** | มุมล่างขวา: เลือกธีม + live chat (§ 9 FloatingActions) |

---

## 3. Design tokens

แหล่งความจริง: **`app/styles/tokens.css`** (`:root` = ธีม `cosmic`) · ธีมอื่น override ใน `app/styles/themes.css` (generated) · ห้ามกระจาย hex ซ้ำใน component

### 3.1 บันไดพื้นผิว (จากหลังสุดไปหน้าสุด)

| ชั้น | Token (ค่าธีมเริ่มต้น) | ใช้กับ |
| :--- | :--- | :--- |
| หน้า (page) | `--cosmic-page-base` `#0d0814` + `--cosmic-nebula-bg-image` (บน `<html class="cosmic-bg">`) | พื้นหลังทั้งเว็บ |
| หน้า standalone มือถือ | `--standalone-page-bg` `#0a0a0c` + radial | โปรไฟล์/ธุรกรรม/โปรโมชัน |
| Surface ไล่โทน | `--surface-start` `#19183b` → `--surface-mid` `#121127` → `--surface-end` `#090810` · `--surface-gradient` | hero, section band, shadcn bridge |
| Chrome | `--cosmic-chrome-surface-bg` `#141416` · `--bottom-nav-bg` `#161321` · `--header-desktop-chrome-start/end` | header, bottom nav, footer |
| Shell modal (desktop) | `--cosmic-dialog-shell-bg` (graphite → ม่วงจาง) | `.cosmic-modal-shell` |
| Shell sheet (มือถือ) | `--cosmic-mobile-sheet-bg` `#262528 → #1e1b24` | `.cosmic-mobile-sheet` |
| Inner card ใน sheet/hub | `--sheet-row-fill` `#2f2f34` (+`-hover`) · alias `--inner-card-fill` | แถวเลือก, การ์ดย่อย |
| ช่องกรอก | `--sheet-field-fill` `#35333b` (+`-focus`) | input ใน sheet |
| พื้นทึบสองชั้น | `--surface-solid-outer` `#131216` · `--surface-solid-inner` `#1d1a22` | กลุ่มข้อมูล, โปรไฟล์ popover, FAB |
| hover/selected | `--surface-hover` `#232145` · `--surface-selected` `#29264f` | แถว/แท็บที่เลือก |

กฎ: การ์ดที่ซ้อนอยู่ในชั้นใด ให้ **อ่อนกว่าชั้นแม่หนึ่งขั้น** (inner > shell) · ไม่ใช้ gradient/alpha/blur กับ inner card เพื่อลดกระตุกบนมือถือ

### 3.2 สี ตัวอักษร และ action

| กลุ่ม | Token | ค่าเริ่มต้น |
| :--- | :--- | :--- |
| ตัวอักษร | `--text-primary` / `-secondary` / `-muted` | `#f5f4fc` / `#b9b5cf` / `#a8a3c5` |
| ไอคอน | `--icon-default` / `--icon-active` | `#b9b5df` / `#efedff` |
| เส้น | `--border-subtle` / `--border-active` / `--focus-ring` | `#34304e` / `#7770b7` / `#c4b5fd` |
| Action | `--action-solid` (+`-hover`) · `--action-gradient` · `--accent-primary` | `#4930df` (`#5d45eb`) · `#4930df→#0968f8` · `#7c6cf0` |
| CTA | `--cta-primary-gradient` · `--btn-primary-gradient` (ธีมกำหนด) · `--cta-white-*` | ม่วงเข้ม→ม่วง · ขาว (nav button) |
| Category active | `--category-active-gradient` | `#26205b → #202d65` |
| รางวัล/สถานะ | `--gold-gradient` · `--success` `#41d995` · `--warning` `#e8b339` · `--destructive` `#ef4444` | gold ใช้กับ payout |
| shadcn bridge | `--primary`, `--background`, `--card`, … ผูกกับ token ข้างบน | ให้ primitive ของ shadcn เปลี่ยนตามธีม |

ม่วงแบรนด์ **คงที่** เฉพาะ chip หมวด active · CTA · progress — chrome/sheet เป็น graphite กลาง (R≈G) ไม่ปนม่วง

### 3.3 มุมโค้ง ระยะ และเลย์เอาต์

| Token | ค่า | ใช้กับ |
| :--- | :--- | :--- |
| `--radius-control` | 4px | ช่อง/ปุ่มเล็ก (= `--radius` ของ shadcn) |
| `--radius-card` / `-filter` / `-thumb` / `--header-chip-radius` | 6px | การ์ดเล็ก, ปกเกม, ชิป header, ช่อง filter |
| `--radius-data-table` | 8px | กรอบตาราง |
| `--radius-panel` | 18px | แผง/โมดัล/แบนเนอร์ |
| `--radius-lobby-modal` | 22px | modal catalog XL |
| `--radius-pill` | 999px | ปุ่ม pill, chip, FAB |
| `--space-1…12` | 4,8,12,16,20,24,32,40,48px | ระยะมาตรฐาน |
| `--page-gutter` | `clamp(16px, 3vw, 24px)` | ขอบซ้ายขวา |
| `--content-max` | 1200px | ความกว้างเนื้อหา |
| `--nav-height` | 68px (+ `--nav-safe` safe area) | bottom nav |
| `--header-mobile-bar-height` / `--header-desktop-bar-height` | 76px / 72px | header |

### 3.4 Motion tokens

`--motion-instant` 100ms · `--motion-fast` 160ms · `--motion-base` 240ms · `--motion-slow` 400ms · `--ease-out` / `--ease-in` / `--ease-spring` · `--stagger` 40ms · `--motion-sheet-*` (รายละเอียด § 10)

### 3.5 Token เฉพาะโดเมน

| โดเมน | Token ตัวอย่าง |
| :--- | :--- |
| Hub modal | `--hub-lobby-shell-bg`, `--hub-lobby-chrome`, `--hub-lobby-sidebar-width` (208px), `--hub-lobby-grid-gap` (12px), `--hub-dialog-card-bg` |
| Overlay | `--dialog-overlay-bg` `rgb(0 0 0 / .74)` — ไม่ blur |
| VIP | `--vip-panel-*`, `--vip-progress-*`, `--vip-rank-card-*` |
| Lottery | `--lottery-glass-fill/-hover/-border`, `--lottery-panel-fill`, `--lottery-grid-cell-radius`, `--lottery-rules-*` |
| Toast | `--toast-bg/-border/-icon-*` |
| ค่าความหมาย | `--value-emphasis/neutral/muted/success/danger/warning/reward/accent` (§ 5.3) |

---

## 4. ระบบธีม (Theme system)

**หลักคิด:** ธีม = ชุด CSS variable ที่ override ภายใต้ `[data-theme="key"]` · component ใช้ `var(--token)` อยู่แล้ว → สลับ token = สลับทั้งเว็บ

### 4.1 ธีมที่มี (12)

| โหมด | ธีม (key) |
| :--- | :--- |
| **มืด (7)** | `cosmic` (ค่าเริ่มต้น = `:root` ใน `tokens.css`), `thunder-x`, `dark-mix-berry`, `tron`, `sanim`, `gatsby`, `wisdom` |
| **สว่าง (5)** | `sunfire`, `blue-syrah`, `good-witch`, `mix-berry`, `mr-bond` |

### 4.2 Runtime

```
เลือกธีมใน ThemePickerSheet → setTheme(key)  (lib/theme.ts)
  ├─ <html data-theme="key">       ← ตัวสลับ CSS
  ├─ <html data-mode="light|dark"> ← กฎที่ต่างกันระหว่างโหมด (เช่น โลโก้)
  ├─ class "dark" เฉพาะธีมมืด       ← shadcn / dark: variants
  ├─ localStorage["themeColor"]
  └─ <meta name="theme-color"> อัปเดตตามพื้นธีม
โหลดหน้าใหม่: inline script ใน <head> ตั้งค่าก่อน paint ครั้งแรก (ไม่กะพริบ)
```

### 4.3 ไฟล์

| ไฟล์ | หน้าที่ | แก้มือ? |
| :--- | :--- | :--- |
| `scripts/themes/gen-themes.js` | ตารางธีม + "บทบาทสี" (ga→gb, icon, action, active) | แก้ที่นี่ |
| `scripts/themes/themes-static.css` | กฎร่วมทุกธีม (`[data-theme]:not([data-theme="cosmic"])`) | แก้ที่นี่ |
| `app/styles/themes.css`, `lib/themes.ts` | **generated** | **ห้ามแก้มือ** |
| `lib/theme.ts` | `setTheme`, `useTheme` (`useSyncExternalStore`) | ได้ |
| `app/components/theme/ThemePickerSheet.tsx` | sheet เลือกธีม (กริด มืด/สว่าง + ตัวอย่าง 3 สี) | ได้ |
| `docs/THEME-SWITCH-GUIDE.md` | คู่มือละเอียดของระบบ | ได้ |

คำสั่งสร้างใหม่: `node scripts/themes/gen-themes.js` (idempotent) — **ถ้าแก้ `themes.css` ด้วยมือ ค่าจะหายตอนรันครั้งหน้า** ให้ย้ายไปที่สคริปต์/`themes-static.css`

### 4.4 กฎสำหรับผู้เขียน component

1. ใช้ **token** สำหรับพื้นผิว/ข้อความ/เส้น/action — ห้าม hex พื้นผิวตายตัว (สีรางวัล/สถานะ/ธง/ปก provider คงเดิมได้)
2. ปุ่มหลักใช้ `btn-primary` (อ่าน `--btn-primary-gradient`) ไม่ใช้ hex ไล่สีเอง
3. โลโก้: ใช้ `CosmicbetLogo` (เรนเดอร์ 2 รูป dark/light สลับด้วย `data-mode`) — **อย่าใช้ `<img src="/cosmic-dark.png">` ตรง ๆ** ใน chrome ที่ธีมสว่างใช้ได้
4. พื้นที่ chrome ที่ต้องไล่สีตามธีมใส่ class `theme-brand-surface` / `cosmic-mobile-chrome-surface`
5. ธีมสว่างกลับสเกล `--color-white` / `--color-zinc-*` ให้ `text-white`/`text-zinc-*` ในโค้ดเดิมยังอ่านได้ — แต่งานใหม่ให้ใช้ token ความหมาย (`text-[var(--text-primary)]`)
6. ทดสอบงาน UI ใหม่อย่างน้อย **cosmic + 1 ธีมสว่าง**

### 4.5 FloatingActions (ปุ่มลอยล่างขวา)

`app/components/layout/FloatingActions.tsx` + `app/styles/floating-actions.css` — mount ครั้งเดียวใน `AppProviders`

- ปุ่มกลม 48px พื้น `--surface-solid-inner` เงา `0 4px 14px rgb(0 0 0 / .38)` · ปุ่มธีม (palette) + live chat (จุดสถานะเขียว)
- มือถือวางเหนือ bottom nav: `bottom: nav-height + nav-safe + 0.875rem` · desktop `1.5rem`
- `z-index: 40` (ต่ำกว่า sheet 70) · **ซ่อน** บน `/play` และหน้าเลือกเลขหวยที่มี action bar ล่างสุด
- live chat ยังไม่เชื่อมต่อ → toast "ยังไม่เชื่อมต่อ" · sheet เลือกธีมโหลดแยก chunk (`next/dynamic`)

---

## 5. Typography

ฟอนต์ตามภาษา (9 locale: `th en lo my vi zh id fil km`) — ไทย **Noto Sans Thai** (+ fallback system) · ตัวเลข/โค้ด **Geist Mono** (`--font-mono`, `preload: false`)

**โหลดฟอนต์:** `app/[lang]/layout.tsx` (`next/font/google`) → CSS variable บน `<html>` + `localeFontClass(locale)` · map ใน `app/globals.css`/`tokens.css` (`--font-sans`, `--font-heading`)

**กฎน้ำหนัก (บังคับ):** ใช้ได้แค่ **400** และ **500** — ห้าม `font-semibold/bold/extrabold/black` และห้าม `font-weight` เกิน 500 ใน CSS · เน้นด้วย **ขนาดและสี** ไม่ใช่ bold (จุดที่โค้ดยังเกิน → § 15)

| บทบาท | มือถือ | จอใหญ่ | Weight / line-height | ใช้กับ |
| :--- | :--- | :--- | :--- | :--- |
| Hero / Promo Title | 24–28px | 32–40px | 500 / 1.25 | แบนเนอร์, Modal Hero |
| Section Title | 18–20px | 20–22px | 500 / 1.35 | หัวข้อ section |
| Card / Hub Title | 16–17px | 17–18px | 500 / 1.35 | ชื่อการ์ด, เมนูด่วน |
| Body / Input / Label | 14–15px | 15–16px | 400–500 / 1.45–1.5 | เนื้อหา, ปุ่ม |
| Secondary / Caption | 13–14px | 13–14px | 400–500 / 1.45 | คำอธิบายย่อย |
| Micro / Meta / Badge | 12px | 12–13px | 500 / 1.4 | **ขั้นต่ำสุด** วันที่/ป้าย |
| Table Header | 11.5–12px | 12px | 500 / 1.3 | หัวตารางอังกฤษ (`uppercase tracking-wider`) |

- ยอดเงิน `tabular-nums` · payout เน้น gold · ไทยไม่ uppercase/letter-spacing กว้าง ไม่ตัดสระด้วย line-height ต่ำ

### 5.1 Implementation

- ขนาด/น้ำหนักกำหนดใน **TSX** (`text-*`, `font-normal|medium`) หรือ class `cosmic-type-*` ใน `app/styles/base.css`
- **ห้าม** `font-size`/`font-weight` ใน feature CSS (ยกเว้น `base.css`, `tokens.css`, `buttons.css`, edge case icon-only)
- class ที่มี: `cosmic-type-body`, `-caption`, `-section-title`, `-hub-title`, `-sheet-title/-desc/-label/-meta`, `-nav-label`, `-chip-tab`, `-toolbar-control`, `-sidebar-link(-lg)`, `-sidebar-section`, `-marquee(-label)`, `-rail-card-title/-subtitle`
- รายละเอียดสถานะ refactor: `.cursor/rules/typography.mdc`

### 5.2 Legibility

`text-legibility.css` / `typography-bridge.css` ดูแลการแสดงผลไทย (สระ/วรรณยุกต์) และ bridge ฟอนต์ — อย่า override ใน feature CSS

### 5.3 Semantic values (ตัวเลข / สถานะ)

ใช้ **role** ตามความหมายข้อมูล ไม่ใช่ขนาดฟอนต์ · class `cosmic-value` + `cosmic-value--{role}` (`base.css`) · helper `lib/semanticValue.ts` · ห้าม hex / `text-emerald-*` ใน TSX

| Role | Token | ใช้เมื่อ |
| :--- | :--- | :--- |
| emphasis | `--value-emphasis` | ตัวเลขสำคัญไม่บอกทิศทาง |
| neutral | `--value-neutral` | ตัวเลขทั่วไปในตาราง |
| muted | `--value-muted` | `—` / ไม่มีค่า |
| success | `--value-success` | สำเร็จ, ครบเงื่อนไข, กำไร |
| danger | `--value-danger` | ล้มเหลว, ขาดทุน |
| warning | `--value-warning` | รอดำเนินการ |
| reward | `--value-reward` | % สิทธิ/cashback, payout ชนะ (gold ทึบ ไม่ gradient text) |
| accent | `--value-accent` | เพชร/gems, promo +% |

นโยบาย: cashback/rolling % → reward · เพชรจากฝาก +% → accent · ธุรกรรม pending → warning

---

## 6. Layout และ responsive

- Content กึ่งกลาง `max-width: var(--content-max)`; gutter `--page-gutter` เดียวกัน
- ระหว่าง section **24–32px**; ก่อน Providers **40–48px** · heading → รายการ **12–16px** · การ์ดใน carousel **8–12px** มือถือ / **12–16px** desktop
- **Breakpoint หลัก:** `lg` = 1024px (มือถือ/แท็บเล็ต → desktop shell) · เสริม `sm` 640 / `md` 768 / 1280
- **มือถือ:** header (76px) + เนื้อหา + bottom nav (68px) · `FloatingBottomNav`/`BottomNav` fixed + safe area · `.page-shell` เผื่อ padding ล่าง = nav + safe + 24px
- **Desktop (≥1024):** `LobbyDesktopPageShell` = header band + `LobbyDesktopSidebarColumn` (พับเหลือไอคอนได้) + main + `LobbyDesktopRightRail`/เมนูขวา · footer desktop (`CosmicFooter`)
- หน้า standalone มือถือ: `.mobile-standalone-page` + `.page-sub-header` (ย้อนกลับ + ชื่อหน้า)
- **Category row:** การ์ดมุมโค้ง solid สูง ~72–88px มือถือ · gap 8–12px · เลื่อนแนวนอนเมื่อเกิน
- **Carousel presets** (`Carousel.tsx` + class บน `.carousel-track`): `.carousel-games` (3 คอลัมน์+peek) · `.carousel-popular` (2) · `.carousel-providers` (สำรอง) · `.carousel-tournaments` (~2.2 คอลัมน์, การ์ด 3:4)
- Hall of Fame / แถวแยก: gap แนวตั้ง **8–10px** มือถือ, **10–12px** sm+
- **ห้าม** horizontal overflow นอก carousel ที่ตั้งใจ · ห้ามให้ section ใต้ fold ทำ CLS (ดู § 12)

---

## 7. ลำดับหน้า (Lobby)

hero → หมวด → รายการเกม (โทน Cosmicbet solid)

1. **Header** — มือถือ guest: โลโก้ + เข้าสู่ระบบ / สมัคร · ล็อกอิน: แฮมเบอร์เกอร์ + **รูปโปรไฟล์** ซ้าย, โลโก้กลาง, กระดิ่ง + wallet chip ขวา
2. **Welcome / Promotional carousel** — มุมโค้งใหญ่ pagination เส้น/จุด
3. **แถบประกาศเลื่อน** (`lobby-announcement-marquee`) — มือถือ
4. **หมวดเกม** — CategoryNav (การ์ด solid)
5. **Searchbar** — desktop/hub เท่านั้น
6. **เกมยอดฮิต → Slots → คาสิโน → ยิงปลา → กีฬา** (มือถือแสดงตามหมวด `showMobileLobbySections`)
7. **Providers** — marquee โลโก้สี ช่องไฟกว้าง **ไม่มี View All** (การ์ดใหญ่ JILI/Pragmatic ซ่อนบนหน้าสล็อต ทุกค่ายอยู่กริด 3 คอลัมน์เดียว)
8. **กิจกรรม (ทัวร์นาเมนต์ carousel)** — **มือถือเท่านั้น** · ต้องล็อกอิน (`AuthGate`) หรือข้อความชวนเข้าสู่ระบบ
9. **Hall of Fame** — แท็บ solid
10. **Footer** — โลโก้ภาพ (ไม่ใช่ข้อความ), ไม่มี trust cards, ไม่มีเส้นขอบบน, copyright 2026
11. **Bottom nav** (มือถือ) + **FloatingActions**

**ไม่แสดงบน lobby:** การ์ด Feature สามใบ (ร้านค้าเพชร/ภารกิจ/วงล้อ) — เข้าทางเมนู/hub

**เส้นทาง lobby:** `/`, `/slots`, `/casino`, `/fishing`, `/sport`, `/lottery`, `/cards` ใช้ `HomeLobbyPage` ร่วมกัน (route group `app/[lang]/(lobby)`) — เปลี่ยนหมวดด้วย `scroll: false` + คงตำแหน่ง scroll

**หน้าอื่น:** `/promotions`, `/event` (กิจกรรม hub), `/wheel`, `/vip`, `/referral`, `/cashback`, `/loss-rebate`, `/gems-store`, `/missions`, `/transactions`, `/profile/*`, `/lottery/*` (§ 9.8), `/download` (§ 9.9), `/offline`

---

## 8. Icon system และขอบเขตของภาพ

| โซน | แนวทาง |
| :--- | :--- |
| **Nav, header, bottom bar** | SVG เรียว น้ำหนักเดียว `currentColor` (lucide / `Icons.tsx`) |
| **แถวหมวดเกม + เมนู** | 3D icon (`Menu3DIcon`, `public/menu-icon/*.webp` **96px**) — ไม่ยัด 3D ลงกิจกรรม/HoF |
| **ปกเกม / โปรโมชัน / provider** | สีจริงได้ |
| **รูปโปรไฟล์** | preset `public/Avartar/*.webp` ผ่าน `UserAvatar` / `HeaderUserAvatar` (ไอคอนเส้นเฉพาะตอนโปรไฟล์ยังไม่โหลด) |
| **Hall of Fame** | ดาวทองเล็กที่หัวข้อ · payout สีทอง |

Default `--icon-default`; active `--icon-active` หรือ `--action-solid`

### 8.1 Brand assets

| Asset | ที่อยู่ | หมายเหตุ |
| :--- | :--- | :--- |
| โลโก้ wordmark | `public/cosmic-dark.png` / `cosmic-light.png` | ใช้ผ่าน `CosmicbetLogo` (สลับตามโหมดธีม) |
| โลโก้ "cm" (app icon) | `public/brand/favicon.png`, `public/favicon.ico` (16/32/48), `public/pwa/{apple-touch-icon,icon-192,icon-512}.png` | พื้นเข้ม มุมโค้ง · apple/pwa เติมพื้นทึบ |
| แบนเนอร์สมัคร | `public/signup/banner.webp` (แนวนอน 1200:491), `banner-tall.webp` (แนวตั้ง 900:1599) | § 9.6 |
| title / favicon | มาจาก `lib/api/siteBrand.ts` (เปลี่ยนได้ผ่าน API) | § 13 |

รูปทุกไฟล์ใน `public/` เป็น avif/webp ย่อขนาดแล้ว — **ไม่เพิ่ม PNG/JPG หนัก** · รูปเมนูย่อให้พอดีขนาดแสดง ×2

---

## 9. Component specifications

### 9.1 Header
- มือถือ สูง ~76px พื้น chrome ทึบ · desktop แถบ 72px (`.lobby-desktop-shell__header-band`)
- **Sign up:** `--action-solid`/gradient pill · **Log in:** chip solid (`glass-card--soft`) ไม่ใช่ CTA
- **ล็อกอิน:** wallet chip (ยอดเครดิต + ปุ่มฝาก) · กระดิ่ง (จุดแดงแจ้งเตือน) · ประวัติ · **รูปโปรไฟล์** (`HeaderUserAvatar` ดึงจาก `useProfile`, fallback ไอคอนเส้น)
- **มือถือ guest:** เฉพาะโลโก้ + Log in/Sign up — ซ่อน search/โปรไฟล์ · desktop มีค้นหา
- โลโก้: `CosmicbetLogo` เสมอ

### 9.2 Promotional carousel
- การ์ด `radius-panel` ขึ้นไป · pagination เส้นบาง/จุด · ไม่ autoplay default · รูป LCP ต้องมีขนาดกรอบตายตัว (กัน CLS)

### 9.3 CategoryNav / SectionHeader / Carousel
- CategoryNav: การ์ดพื้น solid, label ซ้ายบน, ภาพขวาล่าง, active = `--category-active-gradient`
- SectionHeader: ซ้าย icon + heading · ขวา View All (pill chip) + prev/next (`CarouselControls`) — ส่วนที่ไม่มีหน้ารายละเอียดใช้ `showViewAll={false}`
- Track: native scroll + `scroll-snap`, ซ่อน scrollbar · ปุ่มเลื่อน hit area ≥ 44px
- Pagination: Promo = จุด/แถบ · Welcome = จุด/เส้น · กิจกรรม = จุดกลมกลาง

### 9.4 ปุ่ม (3 ชั้น + sheet)

ใช้ **ชั้นเดียวต่อปุ่ม** · ค่าคงที่ class: `app/components/ui/cosmicButtonClasses.ts` · shadcn `Button` variant ตามตาราง

| ชั้น | Class / variant | ใช้เมื่อ |
| :--- | :--- | :--- |
| **1 Chip solid** | `glass-control` + `glass-pill` / `glass-icon-btn` | แท็บรอง, View All, ลูกศร carousel, ปุ่มปิด, ตัวกรองเล็ก |
| **2 White solid (nav)** | `cosmic-btn-nav` (+`--sm/--lg`) · `Button variant="navSolid"` | ไปหน้าอื่น/ลิงก์ภายนอก |
| **3 Primary CTA** | `cosmic-cta-primary` (+`--sm/--lg`) · `btn-primary` · `Button variant="ctaPrimary"` | สมัคร, ส่งฟอร์ม, รับโบนัส, ฝาก — action สำคัญ |

- **ไม่ใช้ชั้น 2** กับ submit/สมัคร/รับรางวัล · **ไม่ใช้ชั้น 3** กับ View All/ลูกศร/เปิดแท็บ
- อื่น ๆ: `cosmic-cta-white` (+`--sm`) ในการ์ด feature · `cosmic-cta-muted` ปุ่มรองบนการ์ด solid
- **btn-primary:** สูง 54px, pill, `--btn-primary-gradient` (ธีมกำหนด) + inset highlight, variant `--sm/--lg/--stacked/--inline/--dimmed`
- **Accessibility:** hit area ≥ 44px · `focus-visible` ตาม `globals.css`

### 9.5 Bottom sheet (ฝาก / ถอน / คูปอง / login / signup / เลือกธีม / ภาษา)
- shell `.cosmic-mobile-sheet` พื้น `--cosmic-mobile-sheet-bg` · มือถือเลื่อนจากล่าง · **lg+ เป็น modal กลางจอ** (`responsiveSheet*` helpers ใน `responsiveSheetDialog.ts`)
- inner card/input/quick select ใช้พื้นทึบอ่อนกว่า shell (`--sheet-row-fill`, `--sheet-field-fill` ผ่าน `cosmic-sheet-soft-glass`, `cosmic-sheet-field`, `cosmic-choice-btn`) — ไม่ gradient/blur
- ปุ่มยืนยัน **`btn-primary`** (ห้าม `cosmic-action-btn` ม่วงทึบ) · ปิดด้วย `glass-control`+`glass-icon-btn`
- หัว: `ResponsiveSheetHeader` — กลับซ้าย · ปิดขวา

### 9.6 Auth sheets (Login / Sign up)

- **Login:** หัวเป็น **โลโก้ cosmicbet จัดกลาง** (สูง 36px มือถือ / 40px desktop) แทนข้อความ — เก็บ "เข้าสู่ระบบ" เป็น `Dialog.Title` แบบ `sr-only` · ไม่มีคำอธิบายใต้หัว
- **Sign up** (ทั้ง step 1 และ 2): มีพื้นที่แบนเนอร์โปรโมชันด้านบน
  - **มือถือ:** แบนเนอร์แนวนอนเต็มความกว้าง กรอบ `aspect-[1200/491]` (ไม่ crop) มุมบนโค้งตาม sheet · ปุ่มปิดลอยมุมขวาบนของแบนเนอร์
  - **Desktop (lg+):** modal กว้าง `min(94vw, 740px)` แบ่งสองฝั่ง — ซ้ายฟอร์ม (padding 32px), ขวา **แบนเนอร์แนวตั้ง 280px** เต็มความสูง (`object-cover`) · ฟอร์มใช้ของเราเอง ไม่ลอกจากตัวอย่างอ้างอิง
  - รูปกำหนดที่ค่าคงที่ `SIGN_UP_BANNER_SRC` / `SIGN_UP_SIDE_BANNER_SRC` ใน `SignUpBottomDrawer.tsx` (ตั้ง `null` = placeholder ไล่สี) · ต่อ API ภายหลังได้
- Auth overlays ผูก `?layer=login|signup` (`useOverlayLayer`) และโหลดแยก chunk ตอนเปิดครั้งแรก

### 9.7 Search / GameCard / Providers
- Searchbar สูง 44–48px pill พื้น solid ยก · placeholder "Game | Provider"
- GameCard: `radius-card`, `aspect-ratio: 3/4`, ไม่ซ้อนกรอบ
- ProvidersSection: `ProviderLogoMarquee` โลโก้จาก `public/provider logo/` (สีจริง ช่องไฟกว้าง) ไม่ห่อการ์ด · ช่องว่างบน 48–56px
- กริดค่ายสล็อต 3 คอลัมน์ (`SlotProviderCards`, `hideFeatured`)

### 9.8 Lottery (หวย)

- โครง: `/lottery` hub → `/lottery/[market]` รอบ → `/lottery/[market]/[roundId]` หน้าแทง (คอมโพเนนต์ใน `app/components/lottery/`) · `/lottery/results` ผลรางวัล (date picker + รอบยี่กี) · `/lottery/rules/[slug]` กติกา · `/lottery/slips` โพย
- **Hub market card:** `.lottery-hub-market-card--has-art` พื้น gradient จาก `--action-solid` 24%→12%→4% ลงสู่ `--lottery-glass-fill` (**ไล่สีให้ตรงธีม**) · 4 การ์ดแรกชื่อ `1.25rem` (`.lottery-feature-card__title`)
- หัวการ์ดตลาดกดได้ทั้งใบเพื่อเปิด **กติกา/อัตราจ่าย** (`LotteryRulesModal`) · ข้อความกติกาใน `lib/lottery/rulesContent.ts` (หวยรัฐบาล + ยี่กี 5/15/30)
- หน้าแทง: แป้นตัวเลข `LotteryNumberPad`/`LotteryNumberGrid`, slip `LotteryBetSlip`, ผลหลังแทง `LotteryBetResultDialog` · มี action bar ล่างสุดแทน bottom nav (FloatingActions ซ่อน)
- ใช้ token `--lottery-*` ไม่ใช่ hex · ธง/ไอคอนตลาด `LotteryFlagOrb`, `LotteryMarketIcon`
- **Performance:** route `[roundId]` เป็น server component + `generateStaticParams() { return []; }` (SSG on-demand) · Link รอบใช้ `prefetch` · board data (`yiki-board`) อุ่นไว้ใน `LOTTERY_ROUNDS_TARGETS` → เปิดหน้าแทงแทบทันที

### 9.9 PWA / Download
- `PwaInstallBanner` ในเลย์เอาต์: โลโก้ + ลิงก์สีม่วง "วิธีติดตั้ง" + ปุ่มติดตั้ง → เปิดหน้า `/download` (`DownloadAppPage`: ขั้นตอน Android/iOS ภาพ `public/pwa/{android,ios}/step-*.webp`)
- `HomeScreenShortcutPromo` บน lobby · manifest ที่ `app/manifest.ts` (ไอคอนใน `public/pwa`) · service worker `app/sw.ts` (serwist)

### 9.10 Wheel / Rewards / VIP / Cashback
- วงล้อ: hero + `WheelRays` (สีตามธีม — ดู `docs/api/wheel-theme.md`), การ์ดยอดคงเหลือ, รายการรางวัล/ผู้ชนะแบบแถวแยก solid
- VIP/Cashback/Referral/Gems store: แผง `--vip-panel-*` + ตาราง `.cosmic-data-table-*` (outline table, pagination ใช้ token `--cosmic-pagination-*`)
- ตัวเลข/สถานะใช้ semantic value (§ 5.3)

### 9.11 Hall of Fame / กิจกรรม lobby
- **HoF:** หัวข้อแยกจากตาราง · แท็บ pill solid (Latest Winner / Top Win Multiple) · แต่ละแถว **การ์ดแยก** `gap` ชัด — ห้ามแถวติดกัน · payout gold, multiple pill เข้ม · JS วัดตารางตอน mount จึง **ไม่ใส่ `content-visibility`**
- **กิจกรรม (`JackpotSection`):** หัว 「กิจกรรม」 + ไอคอนเมนู · carousel การ์ดรูปเต็ม 3:4 จาก `public/tournament/` · dots กลาง + prev/next (ไม่มี View All) · ห้ามกลับไปการ์ดยอดผู้ชนะ mock

### 9.12 Bottom nav / Footer
- **Bottom nav:** พื้น `--bottom-nav-bg`, 5 ช่องเท่ากัน icon + label (`cosmic-type-nav-label`), active `--nav-active`, safe area, กว้างสูงสุด ~640px, z-index ต่ำกว่า modal/sheet · ธีมอื่นไล่สี `theme-brand-surface`
- **Footer (`CosmicFooter`):** desktop พื้น `--cosmic-footer-desktop-bg` · โลโก้เป็นรูป · มีหมวด "ทายผล" (เดิม "กิจกรรม")

### 9.13 Toast / Status / Notifications
- Toast host ด้านบน (z-250) ใช้ `--toast-*` · loading/empty/error ผ่าน `StatusState` / `ResourceGate` (ทุกรายการที่ดึงข้อมูลต้องมีสามสถานะ)
- Notifications: popover desktop / หน้ามือถือ (`app/components/notifications`)

### 9.14 Dialog & Modal (solid shell + inner card)

ใช้ Radix `Dialog` + `cosmic-modal-shell` · มือถือ sheet (`cosmic-sheet-shell`) · desktop modal กลางจอ

| ประเภท | Class / ขนาด | ใช้เมื่อ |
| :--- | :--- | :--- |
| **Compact hub** | `cosmic-modal-shell--hub` · `w-[min(92vw,720px)]` · `max-h-[min(90dvh,800px)]` | บัญชี, ธุรกรรม, เช็คอิน, cashback |
| **Wide hub** | `--hub` · `w-[min(94vw,1040px)]` · `max-h-[min(92dvh,880px)]` | โปรโมชัน, กิจกรรม (master–detail) |
| **Lobby catalog (XL)** | `cosmic-modal-shell--lobby` · `w-[min(96vw,1280px)]` · `max-h-[min(92dvh,900px)]` | เลือกเกมทั้งค่าย |
| **Auth/Focus** | `responsiveAuthSheetContentClass` · ~480px (signup desktop 740px) | login, signup, ยืนยัน, ฟอร์มสั้น |

- **Overlay** `cosmic-dialog-overlay` สี `--dialog-overlay-bg` — **ห้าม backdrop-blur**
- **Shell:** `--hub-lobby-shell-bg` (XL) / `--cosmic-dialog-shell-bg`; มุม `--radius-lobby-modal` (22px) · ไม่ stroke · เงา `0 22px 48px rgb(0 0 0 / 48%)`
- **z-index:** overlay 65 · content 70 (สูงกว่า bottom nav 50 และ FAB 40)

**โครง Lobby catalog (XL)** — toolbar + sidebar + grid

```
┌─────────────────────────────────────────────────────────────┐
│ [Casino│Sports]   [  🔍 Search…………………  ]  Filters  Sort  [×] │
├──────────┬──────────────────────────────────────────────────┤
│ All      │  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐                    │
│ Top ●    │  │  │ │  │ │  │ │  │ │  │ │  │   gap 12px         │
│ New      │  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘                    │
│ Slots    │  … grid 6 คอลัมน์ (desktop กว้าง) …                 │
└──────────┴──────────────────────────────────────────────────┘
```

- Toolbar: segment pill (พื้น `--hub-lobby-chrome`, active = `--surface-hover`/elevated) · search flex 1 สูง 40–44px radius `--radius-control` ไม่ ring · Filters/Sort ปุ่มรองสูงเท่า search · ปิดมุมขวาบน 36–40px
- Sidebar (≥1024): กว้าง `--hub-lobby-sidebar-width` (208px) scroll แยก · แถว ~40–44px · active `--surface-selected`
- Grid: `hub-lobby-modal__grid` gap `--hub-lobby-grid-gap` · คอลัมน์ `6` ≥1280 · `5` ≥1024 · `4` ≥768 · `3` ≥480 · `2` มือถือ · tile มุม 14–16px ปก 3:4
- **<1024px:** ซ่อน sidebar → แถบหมวดเลื่อนใต้ toolbar · เปิดเป็น **sheet เต็มสูง**
- Hub ทั่วไป: `Dialog.Title` + ปิด · การ์ดรายการ `--hub-dialog-card-bg` · master–detail แถวเลือกมี inset accent `--action-solid`
- Component: `DesktopHubModal`, `HubLobbyModalLayout` · class `hub-lobby-modal__*`
- A11y: `Dialog.Title` ซ่อน `sr-only` ได้ถ้า segment อ่านชัด · focus trap/Escape/คืน focus · sidebar `role="navigation"` + `aria-current`

---

## 10. Interaction, accessibility และ Motion

- ลิงก์ = navigation; ปุ่ม = action · keyboard + `focus-visible` + touch target ≥ 44px
- HoF: tablist + keyboard; live feed ไม่ทำ layout กระโดด
- Contrast ข้อความบนพื้นเข้ม ≥ 4.5:1 (ธีมสว่างต้องผ่านเช่นกัน)
- `prefers-reduced-motion`: ไม่ pulse/กระพริบต่อเนื่อง

### Motion
- **หลักการ:** CSS-first (ไม่ใช้ framer-motion) · animate เฉพาะ `transform`/`opacity` (accordion ใช้ `grid-template-rows`) · ต้องมีความหมาย · ไม่ block เกิน 400ms · ไม่มี loop นอกจาก marquee/ticker/skeleton
- **Tokens:** § 3.4 · `--ease-spring` เฉพาะ reward/badge · `--stagger` สูงสุด 6 ตัว
- **Utilities** (`motion.css`, `motion-recent.css`): `.motion-press` · `.motion-lift` (hover:hover เท่านั้น) · `.motion-reveal` + `<MotionReveal index>` · `.motion-pop` · `.motion-skeleton`
- **Reduced motion:** token ทั้งหมดเป็น 1ms, `--stagger: 0` — component ใหม่ใช้ token ไม่ hardcode ms
- **Sheet/modal 2 step:** เปิด = กล่องเข้า ~560ms → เนื้อหาไล่ขึ้น (delay 240ms) · ปิด = เนื้อหาจาง ~190ms → กล่องออก + scrim จาง รวม ~520ms · มือถือเลื่อนจากล่าง, lg+ ขยายจากกลาง (ครอบ `.cosmic-mobile-sheet`, `.cosmic-modal-shell`, `.cosmic-confirm-dialog`, `.cosmic-dialog-overlay`)
- **Tabs:** line tabs (`CosmicLineTabs`) = เส้น neon เลื่อน/ยืดเป็นองค์ประกอบเดียว · pill/segment = color/bg/shadow ผ่าน `--motion-base` + press scale · เนื้อหาตามแท็บใช้ `<TabPanelTransition tabKey order>`
- **ห้าม:** parallax, glow pulse, bounce ซ้ำ, stagger เกิน 6

---

## 11. Data, API และ i18n (ผลต่อดีไซน์)

- **ชั้นข้อมูล:** `lib/api/*` (ฟังก์ชัน `fetchX()` คืน `ApiResult<T>`) ← ตอนนี้ `mockResult(mock)` · แมป endpoint ใน `lib/api/endpoints.ts` · UI ใช้ผ่าน hook `useApi` (SWR-like, cache ข้ามหน้า) ใน `app/hooks/api/*`
- **ต่อ backend:** แทน `mockResult` ด้วย `apiFetch(path)` ในฟังก์ชันเดียว · **ชนิดข้อมูลที่คืนต้องตรงของเดิม** · path รูปมากับข้อมูล · ห้ามใส่หน้าโหลดตอนสลับ mock→HTTP
- **ห้ามแสดงยอด/ผู้ชนะ mock เป็นข้อมูล live**
- **i18n:** 9 ภาษา (`th en lo my vi zh id fil km`) · ข้อความอยู่ `lib/i18n/messages/{locale}/*.json` (namespace: common, home, nav, auth, wallet, lottery, …) · ใช้ `useT("ns")` · ภาษาที่ยังไม่แปลตก fallback th/en · ไทยไม่มี prefix URL (`/th` → `/`)
- ข้อความใหม่ใน UI ต้องเพิ่มคีย์ใน `th` + `en` เป็นอย่างน้อย
- **Responsive ของข้อความ:** อย่าตัดสระ/ยอดเงิน; รองรับภาษาที่ยาวกว่าไทย (กรอบต้องยืดหรือ truncate ตั้งใจ)

---

## 12. Performance conventions (ส่วนหนึ่งของดีไซน์)

ประสบการณ์ "เร็ว" คือข้อกำหนดดีไซน์ — สรุปสิ่งที่ลงตัวแล้ว:

- **ไม่มี `loading.tsx` ระดับราก และไม่มี splash** — เคยทำให้ footer CLS 0.366 และ LCP ช้า · แสดง SSR content ทันที
- **Section ใต้ fold:** โหลดด้วย `next/dynamic` (คง SSR) และใส่ `.lobby-defer` (+ `.providers-section`, `.most-online-section`, `.tournaments-section`, `.cosmic-footer`) → `content-visibility: auto; contain-intrinsic-size: auto 420px` · ยกเว้น `.hall-of-fame` (JS วัดตาราง)
- **รูป:** `images.unoptimized: true` (public เป็น avif/webp แล้ว) · รูป LCP/above-fold ไม่ lazy · รูปใต้ fold lazy · ไอคอนเมนู `eager` แต่ไม่ `fetchPriority="high"` · ระบุ width/height/aspect กันเลย์เอาต์กระโดด · ถ้าต่อ CDN ย่อรูป ให้ใช้ custom image loader
- **ฟอนต์:** Geist Mono `preload: false` · อย่าเพิ่มฟอนต์ที่ blocking
- **CSS:** token กลาง + ไฟล์ตามโดเมน (`app/styles/*.css`, รวม ~21k บรรทัด) · ระวัง render-blocking CSS ก้อนใหญ่ (หนี้: แยก per-route)
- **Overlay/sheet หนัก** (login, signup, theme picker, modal): `next/dynamic` + `useLazyOverlayMount` โหลด chunk ตอนเปิดครั้งแรก
- **หน้า dynamic ตาม id** (`[roundId]`): server component + `generateStaticParams` ว่าง + `prefetch` บน Link
- **GPU:** ไม่ใช้ backdrop-filter ในของใหม่ · เงาไม่ซ้อนหลายชั้น
- **วัดผล:** Lighthouse desktop+mobile (slow 4G) — เป้า CLS ≈ 0; อย่าเพิ่ม LCP element แบบ lazy/clone หลัง mount (เคยทำให้ CLS 0.185)

---

## 13. Brand runtime: title และ favicon (API-ready)

- **ค่าเริ่มต้น:** title `cosmicbet - รวมความสนุก ปลุกพลังโชค` (ทุกภาษา) · favicon `/brand/favicon.png` · apple icon `/pwa/apple-touch-icon.png`
- **โครง:** `lib/api/siteBrand.ts` — `fetchSiteBrand()` (mock → `GET /api/site/brand`) · `resolveSiteBrand()` ตรวจทีละฟิลด์ (ว่าง/ผิดรูป → ค่าเริ่มต้น) · `loadSiteBrand()` ไม่ throw · ใช้ใน `generateMetadata()` ของ `app/[lang]/layout.tsx`
- URL ไอคอนรับเฉพาะ path ในเว็บ (`/…`) หรือ `https://` · แนะนำ PNG จัตุรัส ≥ 64px (apple 180×180 ไม่โปร่งใส)
- `app/manifest.ts` และไอคอน PWA ใช้ไฟล์ใน `public/pwa` — ถ้าเปลี่ยนแบรนด์ ต้องอัปเดตไฟล์เหล่านี้ด้วย

---

## 14. แนวทางโครงสร้างโค้ดสำหรับ agent

- อ่าน `app/globals.css` (import ลำดับ: `tokens.css` … `focus-input.css`, `input-zoom.css`, **`themes.css` ท้ายสุด**) และ component ที่มี
- **ห้ามเพิ่ม pattern glass ใหม่** · migrate `glass-*` เป็นชิป solid เมื่อแก้ไฟล์นั้น
- shadcn semantic colors ต้อง bridge กับ tokens (`--primary`, `--card` …)
- แยก mock data (`app/data/*`) จาก API (`lib/api/*`)
- Next.js 16: อ่าน `node_modules/next/dist/docs/` ก่อนแตะ API ของ Next
- Verification gate: `npx tsc --noEmit -p .` · `pnpm test` · `pnpm build` (`pnpm lint` มี error เดิมบน main — ไม่ใช่เกณฑ์)

### แผนไฟล์หลัก

| หน้าที่ | ไฟล์ |
| :--- | :--- |
| Layout ราก/ธีม/metadata | `app/[lang]/layout.tsx`, `app/providers.tsx`, `lib/theme.ts`, `lib/api/siteBrand.ts` |
| หน้า lobby + ลำดับ section | `app/components/home/HomeLobbyPage.tsx` (route group `app/[lang]/(lobby)`) |
| Carousel ร่วม | `ui/Carousel.tsx`, `CarouselControls.tsx` (+ presets ใน `layout.css`/`carousel.css`) |
| กิจกรรม lobby | `home/JackpotSection.tsx`, `HOME_LOBBY_TOURNAMENT_ITEMS` |
| Providers / ค่ายสล็อต | `ProvidersSection.tsx`, `ProviderLogoMarquee.tsx`, `slots/SlotProviderCards`, `LobbyCategoryProviders.tsx` |
| HoF | `HallOfFame.tsx`, `hallOfFameMockData.ts` |
| Header / chrome | `layout/Header.tsx`, `HeaderUserAvatar.tsx`, `LobbyDesktopTopBar.tsx`, `BottomNav.tsx`, `CosmicFooter.tsx` |
| Desktop shell | `LobbyDesktopPageShell.tsx`, `LobbyDesktopSidebarColumn.tsx`, `LobbyDesktopRightRail.tsx` |
| เมนูขวา | `RightMenuDrawer.tsx` — ไทล์ `menu-item--solid`, grid 3/4/4 |
| ปุ่มลอย + ธีม | `layout/FloatingActions.tsx`, `theme/ThemePickerSheet.tsx` |
| Auth sheets | `auth/LoginBottomDrawer.tsx`, `SignUpBottomDrawer.tsx`, `GlobalAuthOverlays.tsx` |
| หวย | `app/components/lottery/*`, `lib/lottery/*`, `app/styles/lottery.css` |
| วงล้อ | `app/components/wheel/*`, `lucky-wheel.css`, `docs/api/wheel-theme.md` |
| PWA | `pwa/PwaInstallBanner.tsx`, `DownloadAppPage.tsx`, `app/manifest.ts`, `app/sw.ts` |
| ปุ่ม/ค่าคงที่ class | `ui/cosmicButtonClasses.ts`, `app/styles/buttons.css` |
| Sheet helpers | `ui/responsiveSheetDialog.ts`, `ResponsiveSheetHeader.tsx` |

ก่อนเพิ่ม section ใหม่บน lobby — เทียบลำดับใน § 7; ถ้าผู้ใช้ขอเฉพาะส่วนใด ห้ามรื้อ section อื่น

---

## 15. หนี้ดีไซน์ที่ทราบ (โค้ดยังไม่ตรงกฎ — ห้ามลอกไปทำซ้ำ)

| เรื่อง | สภาพปัจจุบัน | ทิศทาง |
| :--- | :--- | :--- |
| ชื่อ class `glass-*` | ยังใช้ทั่วโค้ด (พื้นจริงเป็น solid/แก้วบางใน `--glass-fill*`) | เปลี่ยนชื่อเป็นชิป solid เมื่อแก้ไฟล์นั้น |
| `backdrop-filter` | ยังพบใน ~18 ไฟล์ CSS (modals, hub-modals, lucky-wheel, hall-of-fame, layout ฯลฯ) หลายจุดตั้ง `none`/token 0px | ลบเมื่อแตะไฟล์ ไม่เพิ่มใหม่ |
| น้ำหนักฟอนต์ > 500 | `buttons.css` (600/700 ปุ่ม primary), `confirm-dialog.css`, `footer.css`, หัวการ์ดหวย hub (700), ~17 จุด `font-bold/semibold` ใน TSX | ลดเป็น 500 ทีละโดเมน (ปุ่มหลักต้องตกลงกับ design ก่อน) |
| hex พื้นผิวตายตัว | `menu-drawer.css`, `hub-modals.css`, บางจุดใน `modals.css`/`footer.css` | tokenize เมื่อพบจุดที่ธีมสว่าง/อื่นอ่านผิด |
| `themes.css` แก้มือ | `--line-tab-neon-glow: none` ทุกธีมต่างจากที่ generator สร้าง | ย้ายไป `themes-static.css`/generator |
| โลโก้ footer | ใช้ `cosmic-dark.png` ตรง ๆ ธีมสว่างอาจจม | ใช้ `CosmicbetLogo` |
| CSS render-blocking | ~163KB รวมก้อนเดียว (FCP slow 4G ~2.2s) | แยก per-route |
| JS bundle | ~310KB (interactive slow 4G ~5.3s) | split เพิ่มเมื่อมี API จริง |
| 404 ที่รู้จัก | prefetch `/support`, `/games`, รูป `slots/Spadegaming.webp` | แก้ลิงก์/เพิ่มรูป |
| วิดีโอ rank | `public/rank` ~20MB ไม่ถูกใช้ | ลบ |
| Mobile LCP | `PromoCarousel` รูปแรก (lazy/clone) | แก้ได้เมื่อไม่ทำให้ CLS (เคยพลาด) |
| API จริง | ยังเป็น mock | เมื่อต่อ: per-section Suspense + skeleton สูงตายตัว, ISR/revalidate ข้อมูลสาธารณะ, CDN ย่อรูป |

---

## 16. เกณฑ์ตรวจงานก่อนส่ง

- [ ] ใช้ token (ไม่มี hex พื้นผิวใหม่) · action หลัก = `--action-solid` · ไม่มีม่วง/neon นอก palette
- [ ] **ธีม:** ดูใน `cosmic` + ธีมสว่างอย่างน้อย 1 ธีม — ข้อความ/ไอคอนอ่านออก โลโก้สลับถูก · รีเฟรชแล้วธีมคงเดิมไม่กะพริบ
- [ ] Mobile-first: ทดสอบ 360 / 390 / 768 / 1280px; ไม่ overflow โดยไม่ตั้งใจ
- [ ] Hero carousel; หมวดเกมเป็นการ์ดมุมโค้ง solid · search desktop เท่านั้น
- [ ] ปุ่ม: เลือกชั้นเดียวถูกต้อง (§ 9.4) · hit area ≥ 44px · `btn-primary` ใน sheet
- [ ] Sheet/modal: inner card อ่อนกว่า shell · ไม่ blur · ปิดได้ด้วย Escape · focus trap · มือถือเป็น sheet / desktop เป็น modal
- [ ] Hall of Fame แถวแยกการ์ด gap ชัด · กิจกรรม = carousel รูป + dots + prev/next (ไม่มี View All)
- [ ] Providers marquee ไม่ glass card · ช่องว่างบน ~48px · ลำดับ section ตาม § 7
- [ ] ไทยอ่านครบ ยอดเงินไม่ถูกตัด โลโก้ไม่เพี้ยน · มีคีย์ i18n th+en สำหรับข้อความใหม่
- [ ] loading / empty / error ครบทุกรายการที่ดึงข้อมูล · ไม่แสดง mock เป็นข้อมูล live
- [ ] Bottom nav ไม่บังเนื้อหา · FAB ไม่ชนปุ่มสำคัญ (ซ่อนบนหน้าที่ต้องซ่อน) · safe area + focus
- [ ] Performance: ไม่เพิ่ม blocking CSS/ฟอนต์/รูปใหญ่ · รูปมี width/height · section ใต้ fold defer · ไม่เกิด CLS
- [ ] `npx tsc --noEmit -p .` · `pnpm test` · `pnpm build` ผ่าน
- [ ] ไม่เพิ่มเมนู/copy/สถิติที่ผู้ใช้ไม่ได้ขอ · ไม่รื้อ section อื่นโดยไม่จำเป็น
