# Cosmicbet — Front-end Design Guide

เอกสารสำหรับ agent ออกแบบและพัฒนา Front-end จากดีไซน์ที่ตกลงร่วมกัน  
**สถานะ:** แนวทางล่าสุด ณ 14 กันยายน 2026

---

## 1. เป้าหมายและลำดับความสำคัญ

- สร้าง UI ที่เรียบง่าย มืออาชีพ อ่านง่าย และเข้าถึงเกม/ฟังก์ชันได้สะดวก
- **การกำหนด style และการออกแบบเริ่มต้นต้องเริ่มที่การออกแบบหน้าจอมือถือก่อนเป็นหลักเสมอ (Mobile-first design)** วาง layout ขนาดองค์ประกอบ ตัวอักษร และ spacing จากจอมือถือก่อนเป็นอันดับแรก แล้วจึงขยาย (scale up) ไปยังจอขนาดใหญ่
- ยึดคำสั่งผู้ใช้ล่าสุดก่อนเอกสารนี้ และยึดเอกสารนี้ก่อนภาพเก่าที่มีสไตล์ขัดกัน
- ธีมพื้นผิวล่าสุดคือม่วงเข้ม `#19183B` ไล่ไปม่วงเกือบดำ ไม่ใช่ม่วงสดหรือพื้นสีน้ำเงินสด
- การ์ดร้านค้าเพชร ภารกิจ วงล้อ, Jackpot และ Bottom Nav ใช้ไอคอนเรียบสีลาเวนเดอร์แทนกราฟิก 3D สีฉูดฉาด
- Primary CTA ของส่วนบนยังใช้ Indigo → Blue ได้ตามดีไซน์เดิม แยกจาก gradient พื้นผิว
- ภาพแยกส่วนเป็นส่วนต่อเนื่องของหน้าเดียวกัน ไม่ต้องสร้าง Header หรือ Navigation ซ้ำ
- ภาพ mockup เป็นแนวทางภาพรวม ไม่ใช่ขนาด CSS จริง ห้ามนำความสูงของภาพยาวมายืดหน้าเว็บตามสัดส่วนตรง ๆ
- ค่าระยะ ขนาดตัวอักษร breakpoint และ interaction ที่ระบุด้านล่างเป็นข้อเสนอสำหรับ implementation เพื่อให้ดีไซน์ใช้งานจริงได้ ไม่ใช่ค่าที่วัดจากภาพแบบ pixel-perfect

---

## 2. Design tokens

ใช้ CSS variables ส่วนกลาง ห้ามกระจาย hex และค่าระยะซ้ำไปทุก component

```css
:root {
  color-scheme: dark;
  --bg-page: #090b18;
  --surface-start: #19183b;
  --surface-mid: #121127;
  --surface-end: #090810;
  --surface-hover: #232145;
  --surface-selected: #29264f;
  --surface-gradient: linear-gradient(110deg,
    var(--surface-start) 0%, var(--surface-mid) 58%, var(--surface-end) 100%);

  --text-primary: #f5f4fc;
  --text-secondary: #b9b5cf;
  --text-muted: #9792b3;
  --icon-default: #b9b5df;
  --icon-active: #efedff;
  --border-subtle: #34304e;
  --border-active: #7770b7;
  --focus-ring: #c4b5fd;

  /* ใช้เฉพาะ CTA หลักและหมวดเกม active ของส่วนบน */
  --action-gradient: linear-gradient(90deg, #4930df, #0968f8);
  --category-active-gradient: linear-gradient(110deg, #26205b, #202d65);
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

  --radius-control: 4px;
  --radius-card: 6px;
  --radius-panel: 8px;
  --radius-pill: 999px;
  --page-gutter: clamp(16px, 3vw, 24px);
  --content-max: 1200px;
  --nav-height: 72px;
  --nav-offset: 16px;
  --motion-fast: 160ms;
}
```

พื้นหลังแต่ละ section ไม่ต้องใช้ gradient หลายชั้นซ้อนกัน — **component หลักเป็น borderless** แยกชั้นด้วยพื้นผิว/เงาเบา ๆ หลีกเลี่ยง glow, neon outline และแสงฟุ้งรอบตัวหนังสือ

---

## 3. Typography

ใช้ฟอนต์ที่รองรับไทยและอังกฤษครบ เช่น Noto Sans Thai หรือฟอนต์เดิมของโปรเจกต์ที่ใกล้เคียง ใช้ไม่เกินสองตระกูล ฟอนต์โลโก้เป็น asset ไม่ต้องจำลองด้วยข้อความ

| บทบาท | มือถือ | จอใหญ่ | Weight / line-height |
| :--- | :--- | :--- | :--- |
| **Hero title** | 26–32px | 36–44px | 700 / 1.25 |
| **Section heading** | 18–20px | 22–24px | 700 / 1.4 |
| **Feature card title** | 18–20px | 22–24px | 700 / 1.4 |
| **Jackpot amount** | 14–18px | 20–24px | 700 / 1.35 |
| **Body / game name** | 14px | 14–16px | 500 / 1.5 |
| **Secondary / metadata** | 12px | 12–13px | 400–500 / 1.5 |
| **Bottom Nav label** | 11–12px | 12px | 600 / 1.35 |

- ใช้ `font-variant-numeric: tabular-nums` กับยอดเงินและตาราง
- ไม่ใช้ uppercase หรือ letter-spacing กว้างกับภาษาไทย
- ห้ามตัดสระ/วรรณยุกต์ด้วย line-height ต่ำหรือ overflow ของกล่องข้อความ
- ยอดเงินต้องอ่านครบ ห้าม ellipsis; ชื่อเกมยาวตัดหนึ่งบรรทัดได้ โดยมีชื่อเต็มใน accessible name

---

## 4. Layout และ responsive

- **Mobile first อย่างเคร่งครัด**: การกำหนด style และการออกแบบทั้งหมดต้องเริ่มต้นจากหน้าจอมือถือก่อนเป็นหลักเสมอ; content อยู่กึ่งกลาง ใช้ `max-width: 1200px` และ gutter เดียวกันทั้งหน้า
- ระหว่าง section ปกติ 24–32px; ก่อน Providers 48–56px เพื่อแยกจากชุดเกมชัดเจน
- ระหว่าง heading กับรายการ 12–16px; ระหว่างการ์ด 8–12px มือถือ / 16px จอใหญ่
- ไม่ครอบทุก section ด้วยการ์ดใหญ่: ใช้ panel เฉพาะที่มีความหมาย เช่น Jackpot หรือ Hall of Fame
- Header และ Welcome ต้องไม่สูงจนหมวด/รายการเกมอยู่ไกลเกินจำเป็น
- ที่ความกว้างประมาณ 550px แสดงการ์ดเกม 3 ใบต่อแถวเหมือนภาพตัวอย่าง
- ต่ำกว่า 480px ให้การ์ดเกมกว้างอย่างน้อย 140–150px ใน carousel เห็นใบถัดไปบางส่วนได้ ไม่บีบจนชื่อเกมอ่านไม่ได้
- ตั้งแต่ 768px ปรับจำนวนการ์ดที่เห็นตามพื้นที่; ตั้งแต่ 1024px แสดงประมาณ 5–6 ใบเมื่อมีข้อมูลจริงเพียงพอ ห้ามสร้างรายการซ้ำเพื่อเติมแถว
- หมวดเกม 6 รายการอยู่แถวเดียว เลื่อนแนวนอนได้เมื่อพื้นที่ไม่พอ ห้ามบีบ target ต่ำกว่า 44px
- Feature cards 3 ใบคงการเรียงแนวตั้งตามแบบ จนกว่าผู้ใช้จะสั่งเปลี่ยน
- Jackpot คง 3 ใบเมื่อยอดเงินอ่านครบได้; บนมือถือแคบใช้แถวเลื่อนที่ card min-width 180px
- หน้าต้องไม่มี horizontal overflow ยกเว้น carousel ที่ตั้งใจให้เลื่อน

---

## 5. ลำดับหน้า

ลำดับนี้ใช้เมื่อประกอบหน้าเต็ม หากทำเฉพาะบางส่วนให้คงตำแหน่งสัมพัทธ์ ไม่เพิ่มส่วนที่ไม่ได้ร้องขอ

1. **Header**: cosmicbet, Log in, Sign up, ไอคอนด้านขวา
2. **Welcome Banner**: ข้อความโปรโมชันและ Sign up
3. **Promotional carousel**: การ์ดโปรโมชันและ pagination dots ไม่มี arrow
4. **Cosmic intro**: ดาวซ้าย ดาวเสาร์ขวา และข้อความแนะนำ
5. **ยอดนิยม**: Swipe Bet และ DEXY RACE
6. **หมวดเกม**: Lobby, Originals, Slots, Live Casino, Game Shows, Table Games
7. **Searchbar**: ค้นหาเกมหรือผู้ให้บริการ
8. **เกมยอดฮิต**
9. **Slots**
10. **คาสิโน**
11. **ยิงปลา**
12. **กีฬา**
13. **Providers** — เว้นด้านบนมากกว่า section ปกติ
14. **Feature cards**: ร้านค้าเพชร → ภารกิจ → วงล้อ
15. **Jackpot**: เงินรางวัลระดับตำนาน
16. **Hall of Fame**
17. **Floating Bottom Nav** — เป็น fixed navigation ไม่ใช่ section ปกติใน document flow

---

## 6. Icon system และขอบเขตของภาพสี

เลือก SVG icon family เดียวที่มีน้ำหนักสม่ำเสมอ ใกล้กับไอคอนหมวดเกมใน mockup ใช้ชุดที่มีในโปรเจกต์ก่อน หากต้องวาดเพิ่มให้ใช้ `viewBox="0 0 24 24"` และสัดส่วนเดียวกัน ไม่ผสม emoji, ภาพ 3D และ icon outline คนละน้ำหนักในชุด navigation

| ตำแหน่ง | ไอคอน |
| :--- | :--- |
| **ร้านค้าเพชร** | เพชรเจียระไน |
| **ภารกิจ** | Clipboard / checklist มีเครื่องหมายถูก |
| **วงล้อ** | วงล้อแบ่งช่องพร้อม pointer |
| **Jackpot heading** | Trophy |
| **Jackpot คาสิโน / กีฬา / สล็อต** | ไพ่ / ฟุตบอล / เครื่องสล็อต |
| **โปรไฟล์** | User bust |
| **ฝากเงิน** | Wallet + ลูกศรชี้เข้า/ลง |
| **ถอนเงิน** | Wallet + ลูกศรชี้ออก/ขึ้น |
| **โบนัส** | Gift |
| **ติดต่อ** | Headset / support |
| **ยอดนิยม** | ดาวสี่แฉกคู่ |
| **เกมยอดฮิต / Slots / คาสิโน / ยิงปลา / กีฬา** | Flame / cherries / cards / fish / football |
| **Providers** | Network / provider group |
| **Search / Previous / Next** | Magnifier / chevron-left / chevron-right |

- Default icon ใช้ `currentColor = --icon-default`; active ใช้ `--icon-active`
- Heading icon 20–24px; nav 24px; feature 36–40px; jackpot card 28–32px
- ไอคอนในสาม feature cards, Jackpot และ Bottom Nav ต้องเรียบและใช้สีเดียว ห้ามเพิ่มเหรียญ กล่องสมบัติ หรือภาพประกอบสีสด
- ภาพปกเกม โลโก้ค่าย และโปรโมชันยังมีสีจริงได้ ไม่ต้องย้อมทุกภาพเป็นม่วง
- ดาวของยอดนิยมและเหรียญหัวข้อ Hall of Fame ใช้ gold accent เล็ก ๆ ได้ตามแบบ ไม่ขยายเป็นกราฟิกตกแต่งใหญ่
- Cosmic background ใช้ใน Intro เท่านั้น ไม่กระจาย nebula ไปทุก card
- Bottom Nav ล่าสุดใช้พื้นสะอาด ไม่ใส่ดาวระยิบระยับหรือ animation เพิ่มเอง

---

## 7. Component specifications

### Header / Welcome / Intro
- ใช้โลโก้แบรนด์จาก `public/cm-logo.png` (component `CosmicbetLogo`); รักษาสัดส่วนด้วย `object-contain`
- Header สูงประมาณ 64–72px; Log in เป็น secondary action, Sign up เป็น primary CTA
- ไอคอนขวาต้องมี accessible name ตามฟังก์ชันจริง ห้ามเดาว่าเป็นการแจ้งเตือนหากยังไม่มีข้อมูล
- Welcome ใช้ข้อความและภาพที่ได้รับ พื้นที่ข้อความต้องอ่านชัด ไม่ให้ตัวละครทับ CTA
- Intro ใช้ heading “อาณาจักรแห่งความมันส์” พร้อมข้อมูลเกม/ผู้ให้บริการจากแหล่งข้อมูลจริง; ตัวเลขในภาพเป็นตัวอย่าง ไม่ใช่สถิติยืนยัน
- ดาวและดาวเสาร์เป็น decorative assets ไม่รับ pointer events และซ่อนจาก screen reader

### SectionHeader และ carousel controls
- ซ้าย: icon + heading; ขวา: View All → Previous → Next ในบรรทัดเดียวกัน
- ใช้กับ ยอดนิยม, เกมยอดฮิต, Slots, คาสิโน, ยิงปลา, กีฬา และ Providers
- View All เป็น pill พื้นม่วงเข้ม; arrow เป็นปุ่มวงกลม ภาพปุ่มประมาณ 32–36px แต่ hit area อย่างน้อย 44px
- Promotional carousel ส่วนบนใช้ dots เท่านั้น ไม่มี View All/arrow เพิ่มเอง
- Hall of Fame ใช้ tabs ไม่ต้องเพิ่มชุด View All/arrow; Feature cards และ Jackpot ไม่ต้องมีชุดนี้
- Carousel ใช้ native horizontal scroll + scroll-snap; previous/next เลื่อนไปกลุ่มถัดไป และ disabled เมื่อสุดรายการ
- View All ไปหน้ารวมของหมวดนั้น พร้อมคง category filter ไม่ใช่ลิงก์ที่ไม่มีผล
- ไม่ autoplay โดย default; pagination ต้องเปลี่ยนตาม slide ที่มองเห็น

### GameCard / ProviderCard / Searchbar
- GameCard เป็นภาพมุมโค้งที่กดได้ ไม่ซ้อนกรอบ card อีกชั้น ไม่ใส่ metadata ซ้ำกับภาพ
- เริ่มจาก `aspect-ratio: 3/4` และใช้ ratio เดียวกันในชุด; ภาพที่มีข้อความฝังต้องตรวจ crop ก่อนใช้ `object-fit: cover`
- ProviderCard เป็นช่องแนวนอนพื้นเข้มเตี้ย ใช้ `object-fit: contain` และ padding 16–20px เพื่อไม่ตัดโลโก้
- Searchbar สูง 44–48px, icon ซ้าย, placeholder “Game | Provider”; มี label สำหรับ assistive technology
- ค้นจากชื่อเกมและ provider ได้; กรอกแล้วมี clear action และแสดงสถานะไม่พบผลลัพธ์
- ข้อมูลภาพตัวอย่างใช้จัดวางเท่านั้น หมวดจริงต้องอ้าง taxonomy ของระบบ ห้ามจัดเกมตามภาพที่อาจผิดหมวดโดยอัตโนมัติ

### FeatureActionCard — ร้านค้าเพชร / ภารกิจ / วงล้อ
- สามใบเรียงแนวตั้ง มีเฉพาะชื่อด้านซ้ายและไอคอนด้านขวา
- สูงประมาณ 88–104px; padding 20px; gap 12px; radius 8px (`--radius-panel`)
- พื้น `--surface-gradient`; **ไม่ใช้ border** — hover เปลี่ยน `--surface-hover`
- ไม่มีคำบรรยาย จำนวนเกม ภาพ 3D แผงเอียง หรือ graphic สีฉูดฉาด
- ทั้งใบเป็น link ไปหน้าฟังก์ชัน ใช้ `<a>` จริง ไม่ใช้ div ที่กดได้

### JackpotSection
- หัวข้อ “เงินรางวัลระดับตำนาน” พร้อม trophy สีลาเวนเดอร์
- WinnerCard เรียง: icon → masked username → amount → category / game
- ไอคอนอยู่ใน card ไม่ลอยขนาดใหญ่ทับขอบ ยอดเงินเป็นจุดที่เด่นที่สุด
- พื้น section และ card ไล่สีจาก `#19183B`; ไม่มี crown backdrop, เหรียญ, ribbon หรือแสงฟุ้ง
- category เป็นสีลาเวนเดอร์ในธีม ไม่ใช้หลายสีสดแข่งกับยอดเงิน
- currency และ amount มาจากข้อมูล ใช้ formatter ตาม locale; ห้ามแปลง SGD เป็น THB เอง
- ตัวอย่างจากภาพ: 600,000.00 / 59,704.90 / 450,000.00 SGD ใช้เป็น mock data เท่านั้น
- ปกปิด username ตามกติกาของระบบ ห้ามสุ่มข้อมูลผู้ชนะแล้วแสดงเป็นข้อมูลจริง

### HallOfFame
- Heading แยกจาก panel; ภายในเป็น tabs: Live Bets, High Rollers, Lucky Wins
- Active tab ใช้พื้นม่วงเข้ม gradient + ขอบลาเวนเดอร์ + ตัวอักษรขาว ไม่ใช้ neon blue/green
- ใช้ semantic table สองคอลัมน์ GAME / PAYOUT; thumbnail 28–32px, row สูง 48–56px
- ชื่อเกมชิดซ้าย ยอดเงินและไอคอนจัดแนวเดียวกันทุกแถว ใช้เลข tabular และจัดจำนวนเงินชิดขวาภายในกลุ่ม
- row surface สลับเฉดบาง ๆ ได้ ไม่ทำ border หนาทุกแถว
- สีเขียวเป็น semantic accent ของเงิน/ผลบวก ไม่ใช่สี navigation
- เปลี่ยน tab แล้วเปลี่ยน dataset จริง แสดง loading/empty/error ตามสถานะ
- Live feed ต้องไม่ทำให้ layout กระโดดหรือ screen reader อ่านซ้ำทุกครั้ง

### FloatingBottomNav
- เมนูตามลำดับ: โปรไฟล์ / ฝากเงิน / ถอนเงิน / โบนัส / ติดต่อ
- Icon บน label ล่าง กว้างเท่ากันทั้ง 5 ช่อง ไม่มีปุ่มกลางยกสูงหรือใหญ่กว่าช่องอื่น
- พื้น gradient `#19183B` → `#090810`, ขอบบาง, ไอคอนลาเวนเดอร์, ไม่มี glow หรือ star graphic
- ใช้ fixed bottom พร้อม safe area; ไม่ติดขอบ viewport และไม่บังข้อมูลแถวสุดท้าย
- หากปลายทางเป็น route ให้ใช้ link และ `aria-current="page"` เมื่อ active; หากเปิด dialog ใช้ button
- อย่าทำเมนูหนึ่ง active โดยไม่มี state ของ route รองรับ
- จอใหญ่จำกัดความกว้างประมาณ 640px ตรงกลาง ไม่ยืดเมนูจนเต็มจอ

```css
.page-shell {
  max-width: var(--content-max);
  margin-inline: auto;
  padding-inline: var(--page-gutter);
  padding-bottom: calc(
    var(--nav-height) + var(--nav-offset) + env(safe-area-inset-bottom, 0px) + 24px
  );
}
.surface {
  background: var(--surface-gradient);
}
.floating-nav {
  position: fixed;
  z-index: 40;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(var(--nav-offset) + env(safe-area-inset-bottom, 0px));
  width: min(calc(100% - 32px), 640px);
  min-height: var(--nav-height);
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  background: var(--surface-gradient);
  border-radius: var(--radius-panel);
  box-shadow: 0 8px 24px rgb(0 0 0 / 24%);
}
.floating-nav > a,
.floating-nav > button {
  min-width: 0;
  min-height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 4px;
  color: var(--icon-default);
}
:where(a, button, input, [tabindex]):focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 3px;
}
```

- Dialog/overlay ต้องมี z-index สูงกว่า nav จัด focus trap และคืน focus เมื่อปิด ปรับ nav เมื่อ virtual keyboard เปิดเพื่อไม่ให้ทับ input

---

## 8. Interaction และ accessibility

- ลิงก์ใช้สำหรับ navigation; button ใช้สำหรับ action; ห้าม nested interactive elements
- รองรับ keyboard, touch, hover และ focus-visible โดยไม่อาศัยสีอย่างเดียว
- ใช้ tablist/tab/tabpanel และ keyboard navigation สำหรับ Hall of Fame; category navigation ไม่ต้องปลอมเป็น tabs หากเป็น route links
- Icon-only controls ต้องมี accessible name; SVG ตกแต่งตั้ง `aria-hidden="true"`
- ทดสอบ contrast ของข้อความจริงบนด้านสว่างที่สุดของ gradient: normal text อย่างน้อย 4.5:1; UI indicators/large text 3:1
- Disabled ลด emphasis พร้อมปิด action จริง; loading รักษาขนาด component ด้วย skeleton ที่ไม่กระพริบแรง
- Motion ประมาณ 120–180ms สำหรับสี/opacity ไม่ยกการ์ดหรือย่อขยายจน layout ขยับ
- รองรับ `prefers-reduced-motion`; ไม่ทำดาวกระพริบหรือ pulse ต่อเนื่อง
- แถว/การ์ดต้องมี loading, empty, error และ image fallback ตามบริบท

---

## 9. แนวทางโครงสร้างโค้ดสำหรับ agent

- อ่านโครงสร้างโปรเจกต์และ components ที่มีอยู่ ใช้ framework/router/icon library เดิม ไม่ย้าย stack โดยไม่จำเป็น
- สร้างหรือรวม tokens ไว้จุดเดียว และใช้ semantic variants เช่น surface, action, selected
- แยก reusable components: SectionHeader, CarouselControls, GameCard, ProviderCard, FeatureActionCard, JackpotWinnerCard, HallOfFame, FloatingBottomNav
- Render รายการจาก data arrays ที่มี stable IDs ไม่คัดลอก markup ทีละหมวด
- แยกข้อมูล mock ออกจาก service/API; ห้ามนำยอดเงินและผู้ชนะตัวอย่างขึ้นเป็นข้อมูล live
- ใช้ asset จริงที่ได้รับ หาก asset ขาดให้ใช้ placeholder ที่สื่อชนิดข้อมูล ห้ามเปลี่ยนโลโก้แบรนด์หรือ provider เอง
- โหลดภาพตาม viewport, ระบุ dimensions/aspect-ratio ลด layout shift; hero ที่สำคัญไม่ lazy-load แต่รายการด้านล่างทำได้
- CSS/SVG ใช้ทำพื้น gradient, icons, controls; ห้ามใช้ภาพ screenshot ของทั้ง component แทน UI ที่ต้องกดหรือค้นหาได้
- ถ้ายังไม่มี route/backend สำหรับ action ให้แยก callback/contract และแจ้งส่วนที่ยังไม่เชื่อมต่อ ไม่สร้างยอดฝากถอนหรือผลธุรกรรมสำเร็จปลอม

---

## 10. เกณฑ์ตรวจงานก่อนส่ง

- [ ] ลำดับ section ตรงตามเอกสาร ไม่มี component หรือ navigation ซ้ำ
- [ ] พื้นหลักเริ่ม `#19183B`; ไม่มีม่วงสด/neon ใน feature cards, Jackpot และ Bottom Nav
- [ ] Feature ทั้งสามใช้ icon เรียบถูกความหมาย; ฝาก/ถอนแยกทิศลูกศรชัด
- [ ] ทุกหมวดเกมและ Providers มี View All + arrows; promo carousel มีเฉพาะ dots
- [ ] Providers มีช่องว่างด้านบน 48–56px และไม่มี section ติดกันจนแยกไม่ออก
- [ ] ข้อความไทยไม่ขาด ยอดเงินไม่ตัด โลโก้ไม่ผิดสัดส่วน และภาพปกไม่ถูก crop จนชื่อเกมเสีย
- [ ] Floating nav ไม่บังแถวท้าย รองรับ safe area และ focus
- [ ] ตรวจหน้าที่ 360px, 390px, 768px และ 1280px; ไม่มี overflow ที่ไม่ได้ตั้งใจ
- [ ] Search, tabs, View All และ arrows ทำงานได้; empty/loading/error สอดคล้องกับข้อมูล
- [ ] ไม่ใส่กราฟิกใหม่ สถิติใหม่ เมนูใหม่ หรือ copy โปรโมชันที่ผู้ใช้ไม่ได้ให้
- [ ] ให้ agent ใช้ความเรียบง่าย ความสม่ำเสมอ และความอ่านง่ายเป็นเกณฑ์ตัดสินใจ หากภาพเก่ามีกราฟิกสีสดในส่วนที่ถูกแก้เป็นไอคอนแล้ว ให้ยึดเวอร์ชันไอคอนเรียบตามเอกสารนี้