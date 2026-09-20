# Cosmicbet — Front-end Design Guide

เอกสารสำหรับ agent ออกแบบและพัฒนา Front-end  
**สถานะ:** แนวทางล่าสุด ณ 19 กันยายน 2026  
**อ้างอิงภาพรวม UI:** [Dexsport.io](https://dexsport.io/) (Web3 sportsbook + casino)  
**อ้างอิงสี/แบรนด์ Dexsport (อ่านเพื่อโทน ไม่ใช่คัดลอกโลโก้):** [Brand resources](https://dexsport.io/brand-resources/)

Cosmicbet ยังใช้โลโก้และ copy ของแบรนด์ตัวเอง — เอกสารนี้กำหนด **ภาษาดีไซน์** ให้ใกล้ Dexsport: พื้นกราไฟต์เข้ม, ม่วง product `#7747E5`, พื้นผิวยกชั้นมุมโค้ง, carousel โปรโมชัน, แถวรายการแยกการ์ด, navigation กระชับแบบ Web3

---

## 1. เป้าหมายและลำดับความสำคัญ

- UI เรียบ มืออาชีพ อ่านง่าย — เน้นเข้าถึงเกม/กีฬา/กระเป๋าเงินในไม่กี่คลิก (แนว Dexsport)
- **Mobile-first เสมอ** — วาง spacing, ตัวอักษร และการ์ดจากจอมือถือก่อน แล้วขยายไป desktop (sidebar + content กว้าง)
- คำสั่งผู้ใช้ล่าสุด > เอกสารนี้ > mockup เก่าที่ขัดกับ Dexsport reference
- **พื้นหลังหลัก:** graphite black `#0C0713` (ตาม Dexsport) — ไม่ใช้ม่วงน้ำเงินสดหรือ nebula หนาเต็มจอ
- **สีเน้น (action):** `#7747E5` สำหรับปุ่มหลัก, tab active, ลิงก์สำคัญ — อนุญาต gradient ม่วง→ฟ้าอ่อนเฉพาะ badge/CTA โปรโมชัน (เทียบป้าย “WEB3 BETTING” บน Dexsport)
- แยก **พื้นผิวยก** (`--surface-elevated`) จากพื้นหน้า — การ์ดหมวด, แถว HoF, search, wallet pill อยู่บนชั้นที่สว่างขึ้นเล็กน้อย ไม่พึ่ง border หนา
- ภาพแยกส่วนเป็นส่วนต่อเนื่องของหน้าเดียวกัน ไม่สร้าง Header/Navigation ซ้ำ
- Mockup เป็นแนวทางภาพรวม ไม่ใช่ขนาด CSS จริง
- ค่าระยะ/breakpoint ด้านล่างเป็นข้อเสนอ implementation ไม่ใช่ pixel-perfect จากภาพ

---

## 2. สิ่งที่ดึงจาก Dexsport (สรุปสำหรับ agent)

| พื้นที่ | ลักษณะที่ต้องเลียนแบบ |
| :--- | :--- |
| **Header** | โลโก้ซ้าย; ค้นหาในปุ่ม/ช่องมุมโค้ง; กระเป๋า/ยอดแบบ pill มืด; **Sign up** ม่วงเต็ม; ไอคอนช่วยเหลือ/ภาษา |
| **Hero** | Carousel การ์ดโปรโมชันมุมโค้งใหญ่; pagination เป็น **เส้นแนวนอน** (ไม่ใช่จุดกลมใหญ่) |
| **หมวดเกม (Casino)** | การ์ดแนวนอนมุมโค้ง มี label + ภาพประกอบ (Dexsport ใช้ 3D icon — ใช้ได้เฉพาะแถวหมวด ไม่ใช่ทั้งแอป) |
| **Search** | แถบ pill กว้างเต็ม content, พื้นเข้มกว่าหน้าเล็กน้อย, placeholder สั้น (“Search” / “Game \| Provider”) |
| **รายการเกม** | แถว section + “See all”; การ์ดปกเกมมุมโค้ง; เลื่อนแนวนอน |
| **ตาราง/ลีดเดอร์** | แถว **แยกการ์ด** มี `gap` แนวตั้งชัด (ไม่ติดกันเป็นตาราง monolith) |
| **Desktop** | Sidebar ซ้ายรายการเมนู; เนื้อหากลางกว้าง |
| **Mobile bottom nav** | 5 ช่อง icon + label; พื้นเข้ม; active เน้นสี product |

---

## 3. Design tokens

ใช้ CSS variables ส่วนกลาง ห้ามกระจาย hex ซ้ำใน component

```css
:root {
  color-scheme: dark;

  /* พื้นหลัง — อิง Dexsport Black */
  --bg-page: #0c0713;
  --surface-start: #16121f;
  --surface-mid: #121018;
  --surface-end: #0c0713;
  --surface-elevated: #1c1826;
  --surface-hover: #252033;
  --surface-selected: #2e2840;
  --surface-gradient: linear-gradient(
    180deg,
    var(--surface-elevated) 0%,
    var(--surface-mid) 100%
  );

  --text-primary: #ffffff;
  --text-secondary: #b8b4c8;
  --text-muted: #7a758c;
  --icon-default: #a8a3b8;
  --icon-active: #ffffff;
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-active: rgba(119, 71, 229, 0.55);
  --focus-ring: #9b7cf0;

  /* Product purple — Dexy #7747E5 */
  --action-solid: #7747e5;
  --action-gradient: linear-gradient(90deg, #7747e5 0%, #5b8cff 100%);
  --category-active-gradient: linear-gradient(
    110deg,
    color-mix(in srgb, var(--action-solid) 28%, var(--surface-elevated)),
    var(--surface-selected)
  );
  --gold-gradient: linear-gradient(180deg, #ffe66d, #d99a08);
  --success: #41d995;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  --radius-control: 10px;
  --radius-card: 12px;
  --radius-panel: 16px;
  --radius-pill: 999px;
  --page-gutter: clamp(16px, 3vw, 24px);
  --content-max: 1200px;
  --nav-height: 64px;
  --nav-offset: 12px;
  --motion-fast: 160ms;
}
```

- พื้นหลังหน้า: `--bg-page` แบบเรียบ หรือ radial ม่วงจางมาก ๆ (opacity ต่ำ) — **ห้าม** cosmic nebula หนาเต็มทุก section
- Component หลัก: **borderless** หรือ border `1px` ที่ `--border-subtle` — แยกชั้นด้วย elevation + radius
- หลีกเลี่ยง neon outline, glow รอบข้อความ, ม่วงสดนอก palette

---

## 4. Typography

**อิง Dexsport:** Adieu (display/heading), Object Sans (body) — ในโปรเจกต์ใช้ **Noto Sans Thai** (+ fallback system sans) ให้รองรับไทยครบ · ตัวเลข/โค้ด: **Geist Mono** (`--font-mono`)

**โหลดฟอนต์ (implementation):** `app/layout.tsx` (`next/font/google`) → CSS variable `--font-noto-sans-thai` บน `<html>` · map ใน `app/globals.css` (`@theme` → `--font-sans`, `--font-heading`) · `body { font-family: … }`

**กฎน้ำหนัก (บังคับ):** ใช้ได้แค่ **400 (normal)** และ **500 (medium)** — **ห้าม** `font-semibold` / `font-bold` / `font-extrabold` / `font-black` และ **ห้าม** `font-weight` ใน CSS เกิน 500 · เน้นหัวข้อด้วย **ขนาด** (`text-lg`, `text-xl`) และสี (`text-primary`) ไม่ใช่ bold

| บทบาท | มือถือ | จอใหญ่ | Weight / line-height |
| :--- | :--- | :--- | :--- |
| **Hero / promo title** | 22–28px | 32–40px | 500 / 1.2 |
| **Section heading** | 18–20px | 20–22px | 500 / 1.35 |
| **Feature / hub title** | 17–18px | 18–20px | 500 / 1.35 |
| **Body / game name** | 14px | 14–15px | 400–500 / 1.45 |
| **Secondary / time / odds** | 12px | 12–13px | 400–500 / 1.45 |
| **Table header** | 10–11px | 11px | 500 / 1.3, uppercase อังกฤษเท่านั้น |
| **Bottom nav label** | 10–11px | 11–12px | 500 / 1.25 |

- ยอดเงิน: `tabular-nums`; payout เน้นใช้ gold (`--gold-gradient` หรือ `#ffe66d`) แบบ Dexsport leaderboard
- ไทย: ไม่ uppercase / letter-spacing กว้าง; ไม่ตัดสระด้วย line-height ต่ำ

**Implementation (Tailwind):**

- กำหนดขนาด/น้ำหนักใน **TSX** (`text-*`, `font-normal` / `font-medium`) หรือ class ใน `app/styles/base.css` → `@layer components` (`cosmic-type-*`)
- **ห้าม** `font-size` / `font-weight` ใน feature CSS (`app/styles/*.css` ยกเว้น `base.css`, `tokens.css`, `buttons.css` และ edge case เช่น mock/debug label, icon-only)
- ไล่ refactor ตามโดเมน: **lobby** → **hub** → **lottery** (ดูสถานะใน `.cursor/rules/typography.mdc`)

---

## 5. Layout และ responsive

- Content กึ่งกลาง `max-width: var(--content-max)`; gutter `--page-gutter` เดียวกัน
- ระหว่าง section: **24–32px**; ก่อน Providers **40–48px**
- ระหว่าง heading กับรายการ: **12–16px**; ระหว่างการ์ดใน carousel: **8–12px** มือถือ / **12–16px** desktop
- **Category row (Dexsport-style):** การ์ดมุมโค้ง ~12–16px สูงประมาณ 72–88px มือถือ; gap แนวนอน 8–12px; เลื่อนแนวนอนเมื่อเกินจอ
- Game grid/carousel: ~550px แสดง 3 ใบ; แคบกว่า 480px min-width การ์ด ~140px เห็นใบถัดไปบางส่วน
- **Carousel presets** (`app/globals.css` + `Carousel.tsx`): กำหนดด้วย class บน `.carousel-track`
  | Class | ใช้กับ | มือถือ (โดยประมาณ) |
  | :--- | :--- | :--- |
  | `.carousel-games` | แถวเกม (GameSection) | 3 คอลัมน์ + peek |
  | `.carousel-popular` | ยอดนิยม | 2 คอลัมน์ |
  | `.carousel-providers` | (สำรอง — lobby ใช้ marquee แทน) | 3 คอลัมน์ |
  | `.carousel-tournaments` | **กิจกรรม / ทัวร์นาเมนต์** (`JackpotSection.tsx`) | ~2.2 คอลัมน์ การ์ดแนวตั้ง 3:4 + peek |
- ตั้งแต่ 1024px: sidebar lobby (ถ้ามี) ~240–280px; เนื้อหาหลักไม่เกิน `--content-max`
- Hall of Fame / ตารางแถวแยก: **gap แนวตั้ง 8–10px** มือถือ, **10–12px** sm+ ระหว่างแถว glass/elevated
- ห้าม horizontal overflow นอก carousel ที่ตั้งใจ

---

## 6. ลำดับหน้า (Cosmicbet lobby)

ลำดับเดิมของโปรเจกต์ — จัดวางและสไตล์ให้ **รู้สึกใกล้ Dexsport casino home** (hero → หมวด → search → รายการเกม)

1. **Header** — โลโก้ Cosmicbet, Log in, Sign up (ม่วง), ไอคอนขวา / wallet (เมื่อมี)
2. **Welcome / Promotional carousel** — มุมโค้งใหญ่; pagination แบบเส้น
3. **Cosmic intro** (ถ้ายังใช้) — กระชับ ไม่แย่ง hero
4. **ยอดนิยม** — Swipe Bet / DEXY RACE
5. **หมวดเกม** — Lobby, Originals, Slots, Live Casino, … (สไตล์การ์ดหมวด Dexsport)
6. **Searchbar** — pill กว้าง
7. **เกมยอดฮิต → Slots → คาสิโน → ยิงปลา → กีฬา** (บนมือถือแสดงเมื่ออยู่หมวด home / เส้นทางที่ `HomeLobbyPage` เปิดชุดนี้ — ดู `showMobileLobbySections`)
8. **Providers** — marquee โลโก้ (ไม่ใช่การ์ด glass รายค่าย); View All ไป `/providers`
9. **กิจกรรม (ทัวร์นาเมนต์ carousel)** — **มือถือเท่านั้น** (`lg:hidden`); อยู่เหนือ HoF; ต้องล็อกอิน (`AuthGate`) หรือแสดงข้อความชวนเข้าสู่ระบบ
10. **Hall of Fame (Top Performance)** — แท็บ soft glass; ไม่ glow ม่วงหนักบน active
11. **Floating Bottom Nav** — fixed มือถือ; Cosmicbet: ถอน / ฝาก / เมนู / คืนยอด / ติดต่อ

**ไม่แสดงบน lobby:** การ์ด Feature สามใบ (ร้านค้าเพชร / ภารกิจ / วงล้อ) — เข้าผ่านเมนู / hub (`/event`, `/wheel` ฯลฯ) แทน; component `FeatureActionCards` เก็บไว้ reuse ได้แต่ไม่ mount ใน `HomeLobbyPage`

หมายเหตุ: ข้อ 6 Searchbar เป็นแนวทาง desktop / hub — **ไม่**อยู่แถบ header มือถือ guest

**เส้นทาง lobby (implementation):** `/`, `/slots`, `/casino`, `/fishing`, `/sport`, `/lottery`, `/cards` ใช้ `HomeLobbyPage` ร่วมกัน — หมวดจาก URL (`CategoryNav` + sidebar `navigationMode="route"`, `scroll: false` + คงตำแหน่ง scroll เมื่อเปลี่ยนหมวด)

---

## 7. Icon system และขอบเขตของภาพ

| โซน | แนวทาง |
| :--- | :--- |
| **Nav, header, bottom bar** | SVG เรียว น้ำหนักเดียว `currentColor` |
| **แถวหมวดเกม (CategoryNav)** | อนุญาตภาพประกอบ/3D ค่ายหรือ asset หมวด (เหมือน Dexsport); chip **soft glass** (`glass-card--soft`) — ไม่ยัด 3D ลงกิจกรรม/HoF |
| **ปกเกม / โปรโมชัน / provider** | สีจริงได้ |
| **Hall of Fame** | ดาวทองเล็ก ๆ ที่หัวข้อ; payout สีทอง |

Default `--icon-default`; active `--icon-active` หรือ `--action-solid` บน nav

---

## 8. Component specifications

### Header
- สูงประมาณ **56–64px**; พื้น `--bg-page` หรือโปร่งใสบนพื้นเดียวกัน
- **Sign up:** พื้น `--action-solid` หรือ `--action-gradient`; มุม `--radius-pill` หรือ `--radius-control`
- **Log in:** ghost / พื้น `--surface-elevated`
- **Desktop:** ค้นหา + wallet card ตาม layout เดิม
- **Mobile ไม่ล็อกอิน:** แสดงเฉพาะโลโก้ + Log in / Sign up — **ซ่อน** search และโปรไฟล์
- **Mobile ล็อกอิน:** ไอคอนกระเป๋า + ยอดเครดิต + ปุ่มโปรไฟล์ใน **กลุ่ม `glass-card--soft` เดียว** (ไม่ซ้อน glass หลายชั้น); **ไม่**แสดง search / wallet card แบบ desktop
- โลโก้: `CosmicbetLogo` / `public/cm-logo.png`

### Promotional carousel
- การ์ด `border-radius: var(--radius-panel)` ขึ้นไป
- Pagination: **เส้นบาง** ความกว้างเท่ากัน active สีขาว/ม่วง inactive จาง
- ไม่ autoplay default

### CategoryNav (Dexsport-style tiles)
- การ์ดแต่ละหมวด: พื้น `--surface-elevated`, radius `--radius-card`, padding 12–16px
- Label มุมซ้ายบน; ภาพประกอบขวาล่าง (crop ไม่บังข้อความ)
- Active: border หรือพื้น `--category-active-gradient`

### SectionHeader + carousel
- ซ้าย: icon + heading (`SectionHeader`, optional `titleId` สำหรับ `aria-labelledby`)
- ขวา — **แบบมาตรฐาน (เกม / ยอดนิยม):** View All (pill `glass-control glass-pill`) + prev/next (`CarouselControls`, `showViewAll` default `true`)
- ขวา — **กิจกรรมทัวร์นาเมนต์:** prev/next **เท่านั้น** (`showViewAll={false}`) — อ้างอิง carousel แนว Dexsport/Tournaments
- Track: native scroll + `scroll-snap`; ซ่อน scrollbar (`.carousel-track`)
- ปุ่มเลื่อน: `glass-control glass-icon-btn`; hit area ≥ 44px (`::after` ใน CSS)
- **Pagination แยกตาม section:**
  | Section | รูปแบบ |
  | :--- | :--- |
  | Promo (`PromoCarousel`) | จุด/แถบด้านล่าง (active เน้นสี product) |
  | Welcome hero | เส้นแนวนอน (ตาม Dexsport) |
  | **กิจกรรมทัวร์นาเมนต์** | **จุดกลมกลางแถว** — active `--text-primary`, inactive `--surface-hover` |

### ปุ่มหลัก (3 ชั้น)

ใช้ **ชั้นเดียวต่อปุ่ม** — ห้ามผสม gradient CTA กับ glass ในปุ่มเดียวกัน  
ค่าคงที่ class: `app/components/ui/cosmicButtonClasses.ts` · shadcn `Button` variant ตามตาราง

| ชั้น | ชื่อ | Class / variant | ใช้เมื่อ |
| :--- | :--- | :--- | :--- |
| **1 — Outline glass** | Glass control | `glass-control` + `glass-pill` หรือ `glass-icon-btn` · `Button` (เพิ่มภายหลัง: `glassPill` / `glassIcon`) | แท็บรอง, View All, ปุ่มเลื่อน carousel, ตัวกรองเล็ก ๆ |
| | Log in (header) | `glass-card--soft` บน `.cosmic-nav__auth-login` | เข้าสู่ระบบ — โทน glass ไม่ใช่ CTA |
| **2 — White solid** | Nav / link | **`cosmic-btn-nav`** (+ `--sm` / `--lg`) · `Button variant="navSolid"` | ไปหน้าอื่นในแอป (`Link` / `router.push`) · **external** (`<a target="_blank" rel="noopener noreferrer">`) |
| **3 — Primary CTA** | Action | `cosmic-cta-primary` (+ `--sm` / `--lg`) · `Button variant="ctaPrimary"` | สมัคร, ส่งฟอร์ม, รับโบนัส, ฝาก — action สำคัญที่ไม่ใช่แค่เปลี่ยนหน้า |

**ไม่ใช้ชั้น 2 สำหรับ:** submit ฟอร์ม, สมัคร, รับรางวัล → ชั้น 3  
**ไม่ใช้ชั้น 3 สำหรับ:** View All / ลูกศร carousel / เปิดแท็บ → ชั้น 1  

**อื่น ๆ (ไม่ใช่ปุ่มหลัก 3 ชั้น):**

- `cosmic-cta-white` + `--sm` — ปุ่มขาวมุมโค้งใน **การ์ด feature** (คู่ `cosmic-cta-muted`)
- `cosmic-cta-muted` — ปุ่มรองโปร่งบน glass card (outline อ่อน) **ไม่**แทน `cosmic-btn-nav`

**Accessibility:** hit area ≥ 44px บนมือถือ (ใช้ `min-height` / padding ของแต่ละ class); `focus-visible` ตาม globals.css

**Mobile bottom sheet** (ฝาก / ถอน / คูปอง / login / signup): ปุ่มยืนยัน **`cosmic-sheet-submit`** — **ห้าม** `cosmic-action-btn` ม่วงทึบ · ข้อมูล / input / quick select ใช้ **soft glass** (`cosmic-sheet-soft-glass`, `cosmic-sheet-field`, `cosmic-choice-btn` ใน `.cosmic-mobile-sheet`) · ปิด/คัดลอก `glass-control` + `glass-icon-btn` · พื้น `.cosmic-mobile-sheet` · หัว `ResponsiveSheetHeader` — กลับซ้าย · ปิดขวา · constants ใน `cosmicButtonClasses.ts`

### Searchbar
- สูง **44–48px**; radius `--radius-pill`; พื้น `--surface-elevated`
- **ไม่ใช้ ring/outline ตอน focus/hover** (เรียบแบบ Dexsport)
- Placeholder: “Game \| Provider” หรือ “Search”

### GameCard / Providers (lobby)
- GameCard: มุม `--radius-card`, ไม่ซ้อนกรอบ; `aspect-ratio: 3/4`
- **ProvidersSection:** `ProviderLogoMarquee` — โลโก้จาก `public/provider logo/` (หรือ data ใน `homeProviderLogosData.ts`); **ไม่**ห่อแต่ละโลโก้ด้วย glass card; default grayscale, hover สว่างขึ้น; ช่องว่างด้านบน section **48–56px** (`mt-12` / `sm:mt-14`)

### FeatureActionCard (ไม่ใช้บนหน้า lobby หลัก)
- การ์ดยกชั้น glass + CTA ขาว/รอง — ร้านค้าเพชร / ภารกิจ / วงล้อ
- **ห้าม**ใส่กลับใต้ Hall of Fame บน `HomeLobbyPage` เว้นแต่ผู้ใช้สั่งชัด

### LobbyActivitiesSection (ชื่อในโค้ด: `JackpotSection`)
- **หัวข้อ:** 「กิจกรรม」 + ไอคอนเมนูกิจกรรม (`MenuItemIcon` / `activities`) — **ไม่**ใช้ trophy / ไม่แสดงยอดผู้ชนะ mock
- **เนื้อหา:** carousel แนวนอน การ์ด **รูปเต็ม** จาก `public/tournament/` (`esport.webp`, `esport2.webp`, `sport-win.avif`, `slot-win.avif` — `TOURNAMENT_IMAGE_PATHS` ใน `lobbyMockData.ts`)
- การ์ด: `.carousel-tournament-card`, `aspect-ratio: 3/4`, `object-fit: cover`, มุม `--radius-panel`; แตะไป `/event` (หรือ href ต่อ API ภายหลัง)
- Data: `HOME_LOBBY_TOURNAMENT_ITEMS` ใน `lobbyMockData.ts` · type `HomeLobbyTournamentItem`
- เลื่อน: ลากนิ้ว + ปุ่ม prev/next; dots ผูก index สไลด์ (หนึ่งจุดต่อการ์ด)
- **ห้าม**กลับไป layout การ์ด 3 คอลัมน์พร้อมชื่อผู้ใช้/ยอดเงิน — หน้า `/event` เป็นที่รายละเอียดกิจกรรมแบบ hub
- Component เก่า `JackpotWinnerCard` ไม่ใช้บน lobby แล้ว (เก็บไว้ได้จนกว่าจะลบหรือ reuse)

### HallOfFame (Top Performance)
- หัวข้อแยกจากตาราง; แท็บ pill: **Latest Winner** / **Top Win Multiple** (หรือชุด tab ตาม product)
- Active tab: พื้น `--surface-selected` หรือ `--category-active-gradient`; ตัวอักษรขาว
- คอลัมน์: **Game | Player | Time | Payout/Multiple** (ตาม implementation)
- แต่ละแถว: **การ์ดแยก** (glass/elevated), `gap` แนวตั้งชัด — **ห้ามแถวติดกัน**
- Payout: สีทอง; multiple: pill พื้นเข้ม

### FloatingBottomNav
- พื้น `--surface-elevated` หรือ gradient เข้ม `#16121f → #0c0713`
- 5 ช่องเท่ากัน; icon + label; active: สี `--action-solid` หรือขาว
- fixed + safe area; กว้างสูงสุด ~640px กลางจอบนมือถือ
- z-index ต่ำกว่า modal/sheet

### Dialog & Modal — ระบบ (อิง Dexsport game lobby)

ใช้ Radix `Dialog` + class `cosmic-modal-shell` ใน `globals.css`  
มือถือ: sheet เต็มจอ (`cosmic-sheet-shell`) · Desktop: modal กลางจอ

#### ประเภท (เลือกขนาดตามเนื้อหา)

| ประเภท | Class / ขนาด | ใช้เมื่อ |
| :--- | :--- | :--- |
| **Compact hub** | `cosmic-modal-shell--hub` · `w-[min(92vw,720px)]` · `max-h-[min(90dvh,800px)]` | บัญชี, ธุรกรรม, เช็คอิน, cashback |
| **Wide hub** | `cosmic-modal-shell--hub` · `w-[min(94vw,1040px)]` · `max-h-[min(92dvh,880px)]` | โปรโมชัน, กิจกรรม — master–detail |
| **Lobby catalog (XL)** | `cosmic-modal-shell--lobby` · `w-[min(96vw,1280px)]` · `max-h-[min(92dvh,900px)]` | เลือกเกมทั้งค่าย — แบบภาพอ้างอิง (sidebar + grid) |
| **Focus** | `cosmic-modal-shell` · ~400px | VIP, ยืนยัน, ฟอร์มสั้น |

- **Overlay:** `cosmic-dialog-overlay` — สีมืด `--dialog-overlay-bg` เท่านั้น **ห้าม backdrop-blur** (ประหยัด GPU มือถือ)
- **Shell:** พื้น `--hub-lobby-shell-bg` (lobby XL) หรือ `--cosmic-dialog-shell-bg` (hub ทั่วไป); มุม `--radius-lobby-modal` (20–24px); **ไม่ stroke**; เงา `0 22px 48px rgb(0 0 0 / 48%)`
- **z-index:** overlay `65`, content `70` — สูงกว่า bottom nav

#### โครง Lobby catalog (XL) — toolbar + sidebar + grid

```
┌─────────────────────────────────────────────────────────────┐
│ [Casino│Sports]   [  🔍 Search…………………  ]  Filters  Sort  [×] │
├──────────┬──────────────────────────────────────────────────┤
│ All      │  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐                    │
│ Top ●    │  │  │ │  │ │  │ │  │ │  │ │  │   gap แนวตั้ง/แนวนอน │
│ New      │  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘                    │
│ Slots    │  … grid 6 คอลัมน์ (desktop กว้าง) …                 │
│ …        │                                                    │
└──────────┴──────────────────────────────────────────────────┘
```

**Toolbar (แถวบน — ไม่มีหัวข้อใหญ่ซ้ำถ้ามี segment แล้ว)**

| องค์ประกอบ | สเปก |
| :--- | :--- |
| **Segment Casino / Sports** | Pill สองช่องในพื้น `--hub-lobby-chrome`; active = พื้น `--surface-elevated` + ตัวอักษรขาว; inactive = `--text-muted` |
| **Search** | กินพื้นที่ flex 1; สูง 40–44px; radius `--radius-control`; พื้น `--hub-lobby-chrome`; placeholder “Search” — **ไม่ ring ตอน focus** |
| **Filters / Sort** | ปุ่มรองสูงเท่า search; icon + label; พื้น `--hub-lobby-chrome`; เปิด popover / sheet ย่อย |
| **ปิด** | มุมขวาบน; ปุ่ม 36–40px; icon X; `aria-label="ปิด"` |

**Sidebar (ซ้าย — desktop ≥1024px)**

- กว้าง `--hub-lobby-sidebar-width` (200–220px); scroll แนวตั้งแยกจาก grid
- รายการหมวด: icon 20px + label; สูงแถว ~40–44px; radius `--radius-control`
- **Active:** พื้น `--surface-selected` หรือ pill เต็มความกว้าง (เทียบ “Top” ในภาพ)
- หมวดตัวอย่าง: All, Top, New, Slots, Live casino, Crash, Table, Roulette, Shows, Bonus buy, …

**Main grid**

- Container: `hub-lobby-modal__grid` — `gap: var(--hub-lobby-grid-gap)` (**12px** desktop, **10px** แคบลง) ทั้งแนวตั้งและแนวนอน — แถวไม่ติดกัน
- คอลัมน์: `6` ≥1280 · `5` ≥1024 · `4` ≥768 · `3` ≥480 · `2` มือถือใน sheet
- **Game tile:** มุม `14–16px`; ภาพปก `aspect-ratio: 3/4`; ชื่อเกม bold ใต้ภาพ; provider ตัวเล็ก muted
- **Badge “TOP”:** มุมซ้ายบนภาพ; พื้นดำโปร่ง; ตัวพิมพ์เล็ก uppercase

**Responsive**

| จอ | พฤติกรรม |
| :--- | :--- |
| **&lt;1024px** | ซ่อน sidebar → แถบหมวดเลื่อนแนวนอนใต้ toolbar หรือปุ่ม Filters |
| **&lt;1024px** | เปิด lobby XL เป็น **sheet เต็มสูง** แทน modal ย่อ (ใช้ `cosmic-sheet-shell`) |
| **≥1024px** | Modal กลางจอ + sidebar คงที่ |

**Hub ทั่วไป (Promotions / Activities / อื่น ๆ)**

- Header แบบเดิม: `Dialog.Title` + ปิด — ไม่บังคับ toolbar segment
- การ์ดรายการ: `--hub-dialog-card-bg` / `--surface-elevated`; มุม `--radius-panel`
- Master–detail: แถวเลือกมี inset accent `--action-solid` (โปรโมชัน) ตาม implementation ปัจจุบัน

**Component ในโค้ด (อ้างอิง)**

- `DesktopHubModal` — compact / wide hub
- `HubLobbyModalLayout` — โครง toolbar + sidebar + grid สำหรับ lobby XL (ใส่ใน `Dialog.Content`)
- Class: `hub-lobby-modal__*` ใน `app/globals.css`

**Accessibility**

- `Dialog.Title` ซ่อนด้วย `sr-only` ได้ถ้า toolbar มี segment ที่อ่านชัดแล้ว
- Focus trap; ปิดด้วย Escape; คืน focus ไป trigger
- Sidebar: `role="navigation"` + `aria-current` บน active; grid เป็น list ของลิงก์เกม

```css
.page-shell {
  max-width: var(--content-max);
  margin-inline: auto;
  padding-inline: var(--page-gutter);
  padding-bottom: calc(
    var(--nav-height) + var(--nav-offset) + env(safe-area-inset-bottom, 0px) + 24px
  );
}
```

---

## 9. Interaction และ accessibility

- ลิงก์ = navigation; ปุ่ม = action
- keyboard, focus-visible, touch targets ≥ 44px
- Hall of Fame: tablist + keyboard; live feed ไม่กระโตก layout
- Contrast: ข้อความบนพื้นเข้ม ≥ 4.5:1
- `prefers-reduced-motion`: ไม่ pulse/กระพริบต่อเนื่อง
- loading / empty / error ทุกรายการที่ดึงข้อมูล

---

## 10. แนวทางโครงสร้างโค้ดสำหรับ agent

- อ่าน `app/globals.css` และ component ที่มี — migrate token เก่า (`#19183B`, indigo CTA) ไป palette Dexsport ตามเอกสารนี้เมื่อแก้ UI
- shadcn semantic colors ต้อง bridge กับ tokens ด้านบน
- แยก mock data จาก API; ห้ามแสดงยอด/ผู้ชนะ mock เป็นข้อมูล live
- เมื่ออ้างอิง Dexsport ให้เปิด [dexsport.io/casino](https://dexsport.io/casino/) สำหรับ lobby และ [dexsport.io](https://dexsport.io/) สำหรับ sportsbook

### แผนไฟล์ lobby (อัปเดตล่าสุด — อ้างอิงก่อนแก้ UI)

| หน้าที่ | ไฟล์หลัก |
| :--- | :--- |
| หน้า + ลำดับ section | `app/components/home/HomeLobbyPage.tsx` |
| หมวด URL | `app/lib/lobbyCategoryFromPath.ts`, `app/{slots,casino,...}/page.tsx` |
| กิจกรรม carousel | `app/components/home/JackpotSection.tsx`, `HOME_LOBBY_TOURNAMENT_ITEMS` |
| Carousel ร่วม | `app/components/ui/Carousel.tsx`, `CarouselControls.tsx`, presets ใน `globals.css` |
| Providers marquee | `ProvidersSection.tsx`, `ProviderLogoMarquee.tsx` |
| HoF | `HallOfFame.tsx`, `hallOfFameMockData.ts` |
| Header มือถือ | `app/components/layout/Header.tsx` |
| เมนูขวา | `RightMenuDrawer.tsx` — ไทล์ `menu-item--solid` (ไม่ glass), grid 3/4/4 |
| Sidebar desktop พับ | `LobbyDesktopSidebar.tsx` — พับแล้ว icon อย่างเดียว |
| กิจกรรมเต็มหน้า | `/event` → `ActivitiesHubPageContent` (แยกจากโปร `/promotions`) |
| วงล้อ | `app/components/wheel/*` — hero `wheel-bg.avif`, glass ชั้นนอก / soft glass แถวใน |

ก่อนเพิ่ม section ใหม่บน lobby — เทียบลำดับหมวด 6 และตารางด้านบน; ถ้าผู้ใช้ขอเฉพาะส่วนใดส่วนหนึ่ง ห้ามรื้อ section อื่นโดยไม่จำเป็น

---

## 11. เกณฑ์ตรวจงานก่อนส่ง

- [ ] พื้นหลัก `--bg-page` / `#0C0713`; action หลัก `#7747E5` — ไม่มีม่วงสด/neon นอก palette
- [ ] Hero carousel + pagination แบบเส้น; หมวดเกมเป็นการ์ดมุมโค้งแบบ Dexsport
- [ ] Search pill พื้น elevated (desktop); มือถือ guest ไม่มี search
- [ ] Hall of Fame แถวแยกการ์ด มี gap แนวตั้งชัด; แท็บ soft glass
- [ ] **กิจกรรม:** carousel รูปทัวร์นาเมนต์ + dots + prev/next (ไม่มี View All); ไม่ใช่การ์ด jackpot ยอดเงิน
- [ ] Providers: marquee โลโก้ ไม่ glass card; ช่องว่างบน ~48px
- [ ] ลำดับ section ตามหมวด 6; ไม่ซ้ำ header/nav
- [ ] ไทยอ่านครบ; ยอดเงินไม่ถูกตัด; โลโก้ไม่เพี้ยน
- [ ] Bottom nav ไม่บังเนื้อหา; safe area + focus
- [ ] ทดสอบ 360 / 390 / 768 / 1280px; ไม่ overflow โดยไม่ตั้งใจ
- [ ] ไม่เพิ่มเมนู/copy/สถิติที่ผู้ใช้ไม่ได้ขอ
- [ ] Modal lobby XL: toolbar (segment + search + filters) · sidebar/grid แยก scroll · grid มี gap ชัด · มือถือเป็น sheet
