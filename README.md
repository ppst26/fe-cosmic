# Cosmicbet — Front-end (glass)

หน้าเล่นเว็บเดิมพัน Cosmicbet
Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Radix) · pnpm

> Next.js 16 มี breaking changes จากเวอร์ชันก่อน — อ่านคู่มือใน `node_modules/next/dist/docs/` ก่อนแก้ routing, `cookies()`, middleware/proxy

## เริ่มใช้งาน

ต้องมี Node.js 22+ และ pnpm 10 (`corepack enable`)

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| สคริปต์ | ใช้ทำอะไร |
|---------|-----------|
| `pnpm dev` | dev server |
| `pnpm build` / `pnpm start` | build และรัน production |
| `pnpm lint` | ESLint ทั้ง repo (ข้าม `exports/` และ `.tmp-*`) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | unit test (`node:test` ผ่าน `tsx`) ใน `lib/**/*.test.ts`, `scripts/**/*.test.ts` |
| `pnpm export:lottery-kit` | สร้างชุดย้ายระบบหวยไป `exports/lottery-kit/dist` (ดู `exports/lottery-kit/README.md`) |

ก่อนส่งงานควรผ่าน `pnpm lint && pnpm typecheck && pnpm test`

## Environment variables

คัดลอก `.env.example` เป็น `.env.local` แล้วแก้ค่า (เปลี่ยน `NEXT_PUBLIC_*` ต้อง restart dev server)

| ตัวแปร | ใช้ที่ | หมายเหตุ |
|--------|--------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | `lib/api/http.ts` | base URL ของ backend · ว่าง = เรียก mock route ใน `app/api` · คนละ origin ต้องเปิด CORS + credentials |
| `NEXT_PUBLIC_SITE_URL` | `lib/domain/referral.ts` | URL เว็บจริง สำหรับลิงก์ชวนเพื่อนตอน SSR |
| `NEXT_PUBLIC_IMAGE_HOSTS` | `next.config.ts` | origin รูปจาก CDN สำหรับ `next/image` (คั่นด้วย comma) · origin ของ API ถูกเพิ่มให้อัตโนมัติ |
| `AUTH_SESSION_SECRET` | `lib/auth/session.ts` | secret เซ็น cookie ของ mock auth · **ต้องตั้งใน production** (ถ้าไม่ตั้งจะใช้ค่า dev ที่ฝังในโค้ด) |

## ข้อมูลตอนนี้เป็น mock — ต่อ API จริงตรงไหน

ทุกหน้าดึงข้อมูลผ่าน **`lib/api/*.ts`** ซึ่งส่วนใหญ่ยังคืน mock จาก `app/data/*MockData.ts`

- `lib/api/endpoints.ts` — แผนที่ฟังก์ชัน → method / path / ต้อง login หรือไม่ (สัญญาที่ backend ต้องทำให้ตรง)
- `lib/api/http.ts` — **`apiFetch<T>(path, { method, body, query })`** ตัวเดียวสำหรับทุกการเรียก: ใส่ base URL, ส่ง cookie, รองรับ JSON / FormData และ **ไม่ throw** — คืน `{ ok: true, data }` หรือ `{ ok: false, error: { code, status, message } }` (`code`: `NETWORK` · `UNAUTHORIZED` · `HTTP` · `PARSE` · `ABORTED`, `message` พร้อมแสดงผู้ใช้)
- auth (`lib/auth/client.ts`), หวย (`lib/lottery/*`) และโปรโมชัน (`lib/api/promotions.ts`) ใช้ `apiFetch` แล้ว
- ต่อ backend โดยแก้ **เฉพาะ body ของฟังก์ชันใน `lib/api/`** ให้เรียก `apiFetch` และคืนชนิดข้อมูลเดิม ห้ามเรียก `fetch()` ตรงจาก component
- ฟังก์ชัน `fetch*` ทั้งหมดยังเป็น synchronous และหลาย component เรียกระหว่าง render — เมื่อเปลี่ยนเป็น HTTP (async) ต้องปรับจุดเรียกด้วย
- บาง component ยัง import จาก `app/data/*` ตรง (รายชื่อค่ายเกม, รายการเกม, VIP tiers, lookup หวย) — ต้องย้ายมาผ่าน `lib/api` ก่อน

### Mock server ใน repo (dev เท่านั้น)

| Route | ทำอะไร | ข้อจำกัด |
|-------|--------|----------|
| `app/api/auth/*` (login, register, logout, session, profile) | auth แบบเบา: cookie `cm_session` (HMAC), รหัสผ่าน scrypt | ผู้ใช้เก็บใน `.data/users.json` (gitignored) · token ไม่หมดอายุ · มี demo user ใน `lib/auth/demoUser.ts` |
| `app/api/lottery/*` (bets, slips) | ส่งโพยและดูโพย | เก็บใน memory (`lib/lottery/mockSlipStore.ts`) หายเมื่อ restart · ยังไม่เช็ก login / ไม่ตัดเงิน |
| `app/api/promotions/*` | catalog + รายละเอียดโปรโมชัน | อ่านจาก `public/promotions/*.json` |

**ห้าม deploy mock server เหล่านี้ขึ้น production** — ต้องแทนด้วย backend จริง

## โครงสร้างโฟลเดอร์

```
app/
  (lobby)/          หน้าหมวดเกม — layout เลือกเนื้อหาจาก pathname, page.tsx คืน null
  api/              mock route handlers (ดูตารางด้านบน)
  components/       UI แยกตามโดเมน (deposit, lottery, vip, ...) · ui/ = primitives ของโปรเจกต์
  data/             mock data + config คงที่ (เมนู, ฟุตเตอร์, ไอคอน) — ไฟล์ *MockData.ts ลบได้เมื่อ endpoint พร้อม
  hooks/            hooks ใช้ร่วม
  lib/              utils ฝั่ง UI (วันที่, path)
  styles/           CSS ตามโดเมน — import ทั้งหมดผ่าน app/globals.css · tokens.css = design tokens
  types/            รูปข้อมูลทุกโดเมน = สัญญา response ที่ backend ต้องส่ง (ใช้ร่วม route ↔ client)
components/ui/      shadcn primitives (button, chart, select, table)
lib/
  api/              จุดดึงข้อมูลทั้งหมด + endpoints.ts + http.ts (apiFetch)
  auth/             session, password, user store (mock)
  domain/           คำนวณฝั่ง client ที่ไม่ผูก mock (สรุปธุรกรรม, กรองรายได้ referral, ลิงก์ชวนเพื่อน)
  format.ts         formatter ตัวเลข/เงิน/วันที่กลาง — ห้ามสร้าง Intl.NumberFormat ใหม่ใน component
  uiConstants.ts    page size และจำนวนการ์ด
  lottery/, promotions/
public/             รูปและ asset
exports/lottery-kit ชุดย้ายระบบหวยไปโปรเจกต์อื่น
```

## เอกสารประกอบ

| ไฟล์ | เนื้อหา |
|------|---------|
| `design.md` | ต้นฉบับดีไซน์ (tokens, sections, QA) |
| `AGENTS.md` | แผนที่โปรเจกต์ + กฎสำหรับ AI agent (`agent.md`, `CLAUDE.md` ชี้มาที่นี่) |
| `.cursor/`, `agent/` | rules + skills ของ agent (เนื้อหาเหมือนกัน) |
| `docs/superpowers/` | spec และ plan ของแต่ละฟีเจอร์ |

## สถานะโหลด / ว่าง / ผิดพลาด

- ระดับ route: `app/loading.tsx` · `app/error.tsx` (ปุ่มลองใหม่ = `retry()` ของ Next 16) · `app/not-found.tsx` · `app/global-error.tsx` (root layout พัง)
- ในหน้า: ใช้ `LoadingState` · `EmptyState` · `ErrorState` · `Skeleton` จาก `app/components/ui/StatusState.tsx` — สีทึบตาม token ไม่ใช้ glass
- ข้อมูลที่โหลดจาก API ต้องมีครบ 3 สถานะ: กำลังโหลด · ไม่มีข้อมูล · โหลดไม่สำเร็จ (พร้อมปุ่มลองใหม่)

## แนวทางหลัก

- Mobile-first เสมอ แล้วค่อยขยายไป desktop (`lg:`)
- Layout ด้วย Tailwind ใน TSX · สี/แสง/token อยู่ในไฟล์ CSS (`app/styles/tokens.css`)
- ชื่อตัวแปร/ฟังก์ชันภาษาอังกฤษ · คอมเมนต์ใน source ภาษาไทย
