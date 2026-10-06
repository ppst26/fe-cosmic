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

ตอนนี้ยังไม่มีไฟล์ `.env.example` — ตัวแปรที่โค้ดอ่านอยู่จริง:

| ตัวแปร | ใช้ที่ | หมายเหตุ |
|--------|--------|----------|
| `AUTH_SESSION_SECRET` | `lib/auth/session.ts` | secret เซ็น cookie `cm_session` · **ต้องตั้งใน production** (ถ้าไม่ตั้งจะใช้ค่า dev ที่ฝังในโค้ด) |

ตัวแปรที่วางแผนไว้สำหรับต่อ backend (ยังไม่ได้ใช้ในโค้ด): `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`

## ข้อมูลตอนนี้เป็น mock — ต่อ API จริงตรงไหน

ทุกหน้าดึงข้อมูลผ่าน **`lib/api/*.ts`** ซึ่งตอนนี้คืน mock จาก `app/data/*MockData.ts`

- `lib/api/endpoints.ts` — แผนที่ฟังก์ชัน → method / path / ต้อง login หรือไม่ (สัญญาที่ backend ต้องทำให้ตรง)
- ต่อ backend โดยแก้ **เฉพาะ body ของฟังก์ชันใน `lib/api/`** ให้คืนชนิดข้อมูลเดิม
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
  data/             mock data + formatter/helper (กำลังทยอยย้าย helper ออก)
  hooks/            hooks ใช้ร่วม
  lib/              utils ฝั่ง UI (วันที่, path)
  styles/           CSS ตามโดเมน — import ทั้งหมดผ่าน app/globals.css · tokens.css = design tokens
  types/            type ใช้ร่วมระหว่าง route กับ client
components/ui/      shadcn primitives (button, chart, select, table)
lib/
  api/              จุดดึงข้อมูลทั้งหมด + endpoints.ts
  auth/             session, password, user store (mock)
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

## แนวทางหลัก

- Mobile-first เสมอ แล้วค่อยขยายไป desktop (`lg:`)
- Layout ด้วย Tailwind ใน TSX · สี/แสง/token อยู่ในไฟล์ CSS (`app/styles/tokens.css`)
- ชื่อตัวแปร/ฟังก์ชันภาษาอังกฤษ · คอมเมนต์ใน source ภาษาไทย
