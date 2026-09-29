# Cosmicbet Lottery Kit (Next.js)

ชุดย้าย **หวยครบ flow** จากโปรเจกต์ Cosmicbet ไปโปรเจกต์ Next/React อื่น:

- Hub (`/lottery`)
- หวยรัฐบาล (`/lottery/thai-government` + แทงรอบ)
- ยี่กี 5 / 15 / 30 นาที (รายการรอบ + แทง)
- ตลาดทั่วไป (`/lottery/[marketId]` …)
- โพย (`/lottery/slips`, `/lottery/slips/[slipId]`)
- Mock API: `POST /api/lottery/bets`, `GET /api/lottery/slips`, `GET /api/lottery/slips/[slipId]`

## 1. สร้างชุดไฟล์ (ใน repo Cosmicbet)

```bash
pnpm export:lottery-kit
```

ผลลัพธ์อยู่ที่ **`exports/lottery-kit/dist/`** — zip โฟลเดอร์นี้ไปโปรเจกต์ปลายทางได้เลย

## 2. ใส่ในโปรเจกต์ Next ปลายทาง

### 2.1 คัดลอกไฟล์

นำทุกอย่างใต้ `dist/` ไป **ทับโครงเดิม** (merge):

| ใน dist | ไปที่โปรเจกต์ |
|---------|----------------|
| `app/lottery/` | `app/lottery/` |
| `app/components/lottery/` | `app/components/lottery/` |
| `app/api/lottery/` | `app/api/lottery/` |
| `app/hooks/useLotteryBetSubmit.ts` | เหมือนกัน |
| `app/types/lottery*.ts`, `yiki.ts` | เหมือนกัน |
| `app/data/lottery*.ts`, `thaiLottoMockData.ts`, `yikiMockData.ts` | เหมือนกัน |
| `app/lib/bangkokTime.ts` | เหมือนกัน |
| `lib/lottery/` | `lib/lottery/` |
| `lib/utils.ts` | merge ถ้ามี `cn()` อยู่แล้วก็ใช้ของเดิม |
| `app/components/ui/cosmicButtonClasses.ts` | เหมือนกัน |
| `app/components/ui/responsiveSheetDialog.ts` | เหมือนกัน |
| `app/components/ui/LotteryKitIcons.tsx` | เหมือนกัน |
| `app/styles/*` (ชุดที่ export) | merge ใน `app/styles/` |

### 2.2 TypeScript alias

ใน `tsconfig.json` ต้องมี:

```json
"paths": { "@/*": ["./*"] }
```

(หรือเทียบเท่า — โค้ดหวย import แบบ `@/app/...`, `@/lib/...`)

### 2.3 CSS

ใน `app/globals.css` ของโปรเจกต์ปลายทาง (หลัง tailwind / shadcn):

```css
@import "./styles/tokens.css";
@import "./styles/base.css";
@import "./styles/scrollbars.css";
@import "./styles/glass-cards.css";
@import "./styles/buttons.css";
@import "./styles/layout.css";
@import "./styles/modals.css";
@import "./styles/lottery.css";
@import "./styles/focus-input.css";
```

หรือ copy จาก `integration/styles/globals-lottery.css` แล้วปรับ path ให้ตรงโปรเจกต์

โปรเจกต์ต้องใช้ **Tailwind CSS 4** และ design token ใน `tokens.css` — หน้าตาจะตรง Cosmicbet

### 2.4 Dependencies

```bash
pnpm add radix-ui cn class-variance-authority
```

(Next / React ตามเวอร์ชันโปรเจกต์ปลายทาง)

## 3. Shell: โปรเจกต์ไม่มี Lobby Cosmicbet

หน้า lottery ใน Cosmicbet ใช้ `LobbyDesktopPageShell` (header + sidebar + bottom nav ทั้ง lobby)

ถ้าโปรเจกต์ปลายทาง **ไม่มี** shell นั้น ให้รันหลัง merge:

```bash
node integration/apply-standalone-shell.mjs
```

(รันจาก root โปรเจกต์ — ต้อง copy โฟลเดอร์ `integration/` จาก dist ไปด้วย)

สคริปต์จะ:

- ติดตั้ง `app/components/layout/LotteryRouteShell.tsx`
- แทนที่ `LobbyDesktopPageShell` → `LotteryRouteShell` ในหน้า `app/lottery/**` และ `LotteryPlayPageShell`
- ตั้ง `/lottery` เป็น hub standalone (`LotteryHubContent`)
- เปลี่ยน import ไอคอนเป็น `LotteryKitIcons` (ไม่ต้อง copy `Icons.tsx` ทั้งก้อน)

ถ้าโปรเจกต์ปลายทาง **มี lobby เต็ม** อยู่แล้ว — copy `LobbyDesktopPageShell` + dependency จาก Cosmicbet แทน แล้ว **ไม่ต้อง**รันสคริปต์นี้

## 4. ทดสอบ flow

1. `pnpm dev`
2. เปิด `/lottery` — hub + ตารางผล
3. `/lottery/thai-government` → เลือกรอบ → แทง → ส่งโพย
4. `/lottery/yiki-5` (หรือ 15/30) → แทง → redirect `/lottery/slips/[id]`
5. `/lottery/slips` — รายการโพย mock

Mock เก็บโพยใน memory ของ server process — restart dev แล้วโพยหาย (ตาม design mock)

## 5. อัปเดตชุดจาก Cosmicbet

รัน `pnpm export:lottery-kit` ใหม่ใน repo ต้นทาง แล้ว diff/merge กับโปรเจกต์ปลายทาง

---

`manifest.json` ใน dist มีรายการ route/API และเวลาที่ generate
