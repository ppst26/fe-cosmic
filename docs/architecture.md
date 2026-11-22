# สถาปัตยกรรมโปรเจกต์ Cosmicbet (front-end)

เอกสารนี้อธิบาย **โครงสร้างทั้งระบบ** ว่าอะไรอยู่ตรงไหน ทำงานต่อกันอย่างไร และจะเพิ่มของใหม่ที่ไหน
เรื่องการต่อ API เฉพาะดูที่ [`docs/api/backend-integration.md`](api/backend-integration.md) · เรื่องธีม ดู [`docs/THEME-SWITCH-GUIDE.md`](THEME-SWITCH-GUIDE.md) · ดีไซน์ ดู `design.md`

> เนื้อหาสะท้อนโค้ด ณ ตอนเขียน — ถ้าโครงเปลี่ยน แก้เอกสารนี้ในคอมมิตเดียวกัน

---

## 1. ภาพรวม 1 นาที

| หัวข้อ | สิ่งที่ใช้ |
|-------|-----------|
| Framework | Next.js 16 (App Router) · React 19 · TypeScript |
| Style | Tailwind CSS 4 + CSS ตามโดเมน (`app/styles/*`) + CSS Modules บางหน้า · shadcn/ui (Radix) เป็น primitive |
| ข้อมูล | SWR (client) + fetch ฝั่ง server เฉพาะ lobby/brand · mock สลับเป็น backend ด้วย env |
| ภาษา | 9 ภาษา (`th` เป็น default ไม่มี prefix ใน URL) · dictionary แยก namespace |
| ธีม | 16 ธีมสลับได้ ผ่าน CSS variables + `data-theme` |
| PWA | Serwist (service worker + หน้า offline) |
| แนวทางหลัก | **Mobile-first** · สีทึบตาม token · ไม่ใช้ backdrop blur ในงานใหม่ |

```
Browser ──► proxy.ts ──► app/[lang]/layout.tsx ──► AppProviders ──► หน้า (page) ──► component ──► hook ──► lib/api ──► Backend
            (ภาษา+กันหน้า)   (html · ฟอนต์ · ธีม · dictionary)   (state ทั้งแอป)
```

---

## 2. โครงโฟลเดอร์

```
app/
  [lang]/                  ทุกหน้าอยู่ใต้ segment ภาษา (th en lo my vi zh id fil km)
    layout.tsx             root layout: <html lang>, ฟอนต์, ธีม, dictionary, AppProviders
    (lobby)/               หน้า lobby + หมวดเกม (/ /casino /slots /fishing /sport /cards /lottery)
    vip/ cashback/ wheel/ ...   หน้าเต็มของแต่ละโดเมน
  api/                     mock server (auth · lottery · promotions) — ห้ามขึ้น production
  components/<domain>/     UI แยกตามโดเมน (vip, lottery, deposit, ...) · ui/ = primitive ของโปรเจกต์
  hooks/                   hook ใช้ร่วม · hooks/api/* = hook ดึงข้อมูลรายโดเมน
  data/                    mock + config คงที่ (เมนู, footer, ไอคอน)
  types/                   ชนิดข้อมูลทุกโดเมน
  styles/                  CSS ตามโดเมน (นำเข้าผ่าน app/globals.css)
  providers.tsx            ชั้น provider ทั้งแอป
  sw.ts · serwist/         PWA
components/ui/             shadcn primitives (button, chart, select, table)
lib/
  api/                     ชั้นเรียก backend (apiFetch · fetchXxx · endpoints · mock)
  auth/                    session ฝั่ง client/server, กันหน้า (protectedPaths, proxySession)
  i18n/                    ภาษา: config, routing, provider, dictionary (messages/)
  domain/                  คำนวณฝั่ง client ที่ไม่ผูก mock
  lottery/ promotions/     logic ของโดเมนหวย/โปรโมชัน
  server/                  helper ฝั่ง server (อ่าน body, rate limit)
  format.ts                formatter ตัวเลข/เงิน/วันที่กลาง
  themes.ts · theme.ts     รายการธีม (generated) + ตัวสลับธีม
proxy.ts                   ด่านแรกของทุก request (ภาษา + กันหน้า member)
scripts/themes/            ตัวสร้างธีม → app/styles/themes.css + lib/themes.ts
docs/                      เอกสาร (ไฟล์นี้, api/, THEME-SWITCH-GUIDE, superpowers/)
exports/                   ชุดย้ายระบบหวยไปโปรเจกต์อื่น
agent/ · .cursor/          rules + skills ของ AI agent (เนื้อหาคู่กัน)
```

---

## 3. วงจรชีวิตของ request

1. **`proxy.ts`** (Node runtime) ทำ 3 อย่างตามลำดับ
   - ภาษาไทย (default) ไม่มี prefix → **rewrite** ภายในเป็น `/th/...`
   - ผู้ใช้ที่เลือกภาษาอื่นไว้ (cookie `NEXT_LOCALE` → `Accept-Language`) เปิด URL ไทย → **redirect** ไปภาษานั้น
   - หน้าที่ต้อง login (`lib/auth/protectedPaths.ts`) แต่ไม่มี session → redirect ไปหน้าแรก `?layer=login`
   - เป็นแค่ด่านแรก — backend ต้องตรวจสิทธิ์เองเสมอ
2. **`app/[lang]/layout.tsx`** (server) อ่านภาษาด้วย `lang()` จาก `next/root-params` → ตั้ง `<html lang>`, ฟอนต์ (Noto Sans Thai + ฟอนต์ตามภาษา), สคริปต์ตั้งธีมก่อน paint, metadata จาก `loadSiteBrand()`
3. **`MessagesBoundary`** ส่ง dictionary เข้า `I18nProvider` · **`AppProviders`** ครอบ state ทั้งแอป (ดู §6)
4. **หน้า** (`page.tsx`) ประกอบ component ของโดเมน — หลายหน้าเป็น client component ที่ประกอบ `Header` + เนื้อหา + `FloatingBottomNav` เอง
5. component เรียก **hook** → `useApi` → `lib/api/*` → `apiFetch` → backend (หรือ mock)

---

## 4. Routing และหน้า

- ทุกหน้าอยู่ใต้ `app/[lang]/` — ใช้ `Link`/`useRouter`/`usePathname` จาก `@/lib/i18n/navigation` (ไม่ใช่ `next/navigation`) เพื่อให้ prefix ภาษาถูกต้อง · `pathname` ที่ได้ตัด prefix ออกแล้ว
- `withLocale(href, locale)` สร้าง href ตามภาษา (th ไม่มี prefix) · redirect ฝั่ง server ใช้ตัวที่คงภาษาใน `lib/i18n/server.ts`
- **กลุ่ม `(lobby)`**: `layout.tsx` โหลดเนื้อหา lobby ฝั่ง server (`loadLobbyContent()`) แล้ว render `HomeLobbyPage` ครั้งเดียว — `page.tsx` ของแต่ละหมวดคืน `null` และหมวดที่ active อ่านจาก pathname → สลับหมวดแล้วแถบหมวดไม่ remount ไม่กระพริบ
- **หน้าเต็มของโดเมน** (vip, cashback, wheel, referral, transactions ...) ที่ต้อง login ตรวจที่ proxy + ฝั่ง client (`useAuth`)
- **Desktop vs mobile**: บางหน้าบน desktop เปิดเป็น **hub modal** แทนหน้าเต็ม (เช่น VIP redirect ไป `/?layer=hub&hub=vip`) — ดู `app/components/hub/*`
- **Overlay ผูกกับ URL**: modal/sheet (ฝาก, ถอน, คูปอง, โปรไฟล์, login, signup, เมนู, ภาษา, hub, vip) ใช้ `?layer=<ชื่อ>` ผ่าน `useOverlayLayer` — ปุ่มย้อนของเบราว์เซอร์ปิด overlay ได้ · รายการชื่อใน `lib/overlayUrl.ts`
- **หวย**: `/lottery` (lobby) → `/lottery/[marketId]` (รายการรอบ) → `/lottery/[marketId]/[roundId]` (แทง) · ตลาดที่มีโฟลเดอร์ของตัวเอง: `thai-government`, `yiki-5/15/30` · `results` (ผลรางวัล) · `slips` (โพย) · `rules/[marketSlug]`

---

## 5. ภาษา (i18n)

- กำหนดใน `lib/i18n/config.ts`: ภาษา, default (`th`), สายสำรอง (`FALLBACK_CHAIN`: คีย์ขาดจะไล่ตามสายจนถึง th)
- Dictionary: `th`/`en` = โฟลเดอร์ หนึ่งไฟล์ต่อ namespace (`lib/i18n/messages/th/*.json`) · ภาษาอื่น = ไฟล์เดียว `<code>.json` (ว่างได้ → ใช้ fallback) · `th` ครบเสมอและเป็นต้นแบบของชนิด
- ฝั่ง client: `const t = useT("vip"); t("tabs.benefits")` — key ตรวจชนิดจาก th (`MessageKey<"vip">`) · ข้อมูลที่เก็บ `labelKey` แปลตอน render: `t(item.labelKey)`
- ฝั่ง server: `const t = await getT("meta")`
- ตอนนี้ root layout ส่ง **ทุก namespace** ให้ client (เพราะ hub modal เปิดได้ทุกหน้า) — ตัดแยกต่อ segment ภายหลังได้ด้วย `MessagesBoundary namespaces={[...]}`
- ฟอนต์ตามภาษา: `lib/i18n/fonts.ts` (ลาวใช้ไฟล์ในโปรเจกต์ เพราะ Turbopack บน Vercel ดึงจาก Google ไม่ได้)
- ข้อความ error จาก server แสดงตามที่ส่งมา (ไม่แปล) · ข้อความ default ของ client อยู่ที่ `errors.api.*`

---

## 6. State ทั้งแอป (Providers)

`app/providers.tsx` ซ้อนตามนี้ (นอก → ใน) — provider ชั้นในพึ่งชั้นนอกได้:

| ชั้น | หน้าที่ |
|-----|--------|
| `UrlSearchParamsProvider` | อ่าน query ฝั่ง client โดยไม่ทำให้หน้า bail out จาก SSR |
| `SWRConfig` | ค่าเริ่มต้น cache/retry ทั้งแอป |
| `ToastProvider` | toast |
| `PwaInstallProvider` | สถานะติดตั้งแอป |
| `AuthProvider` | session (`useAuth`) · login/register/logout |
| `CouponRedeemProvider` · `LanguagePickerProvider` | sheet แลกคูปอง / เลือกภาษา |
| `PendingTransactionProvider` · `DepositProvider` · `WithdrawProvider` | flow ฝาก/ถอน และรายการ pending |
| `DesktopHubModalProvider` · `VipModalProvider` · `NotificationProvider` · `TransactionsProvider` | modal/hub ของ desktop |
| `LobbyShellSidebarProvider` | สถานะ sidebar ของ lobby |
| (ใน provider สุดท้าย) `GlobalAuthOverlays` · `FloatingActions` · `ProfileAvatarPrefetch` | overlay login/signup, ปุ่มลอย |

หลักการ: **ข้อมูลจาก server อยู่ใน SWR cache** (ไม่ใส่ context) · context ใช้กับ "สถานะ UI/flow" เท่านั้น

---

## 7. การดึงข้อมูล (สรุป)

```
Component → hook (app/hooks/api/*) → useApi (SWR) → lib/api/*.ts → apiFetch → Backend
```

- component **ไม่เรียก `fetch` ตรง** · ชั้น `lib/api` คืน `ApiResult<T>` (ไม่ throw) · แปลงรูป backend → รูปที่ UI ใช้ที่ชั้นนี้
- `auth: true` → ไม่ยิงถ้ายังไม่ login · cache แยกตามผู้ใช้
- แสดงผลด้วย `ResourceGate` (โหลด / error+ลองใหม่ / ชวน login)
- **ข้อยกเว้นฝั่ง server**: เนื้อหา lobby (`loadLobbyContent`), แบรนด์ (`loadSiteBrand`), `generateStaticParams` ของตลาดหวย
- **โหมด mock**: ไม่ตั้ง `NEXT_PUBLIC_API_BASE_URL` = ข้อมูลจำลอง · ตั้งแล้ว = ยิงจริง

รายละเอียด สัญญา API วิธีต่อ endpoint adapter และสถานะราย endpoint → [`docs/api/backend-integration.md`](api/backend-integration.md)
ชั้น backend ที่ใช้ร่วมหลายโปรเจกต์ (glass · black-purple · lotto · cas) → [`docs/api/shared-backend-layer.md`](api/shared-backend-layer.md)

---

## 8. Auth และความปลอดภัยฝั่งหน้าเว็บ

- session เป็น cookie (`HttpOnly`) · front-end ไม่เก็บ token · `AuthProvider` เรียก `GET /api/auth/session` ตอนเปิดแอป
- กันหน้า 2 ชั้น: `proxy.ts` (มี cookie ไหม — วิธีตรวจตามโหมดใน `lib/auth/proxySession.ts`) + ฝั่ง client (`useAuth` / `ResourceGate`)
- `next.config.ts` ตั้ง security headers ทุกหน้า (กันฝัง iframe, nosniff, referrer, permissions, CSP บางส่วน, HSTS บน production) และ cache ของรูป static
- mock auth ใน `app/api/auth/*` (cookie เซ็น HMAC, scrypt) ใช้ตอนพัฒนาเท่านั้น

---

## 9. Style, ธีม และ design system

- **Tailwind ใน TSX สำหรับ layout** · สี/แสง/เงา/สถานะ อยู่ใน CSS ที่อ้าง **token** (`var(--...)`) — หลีกเลี่ยงการฝังสี hex ในคอมโพเนนต์ เพื่อให้ธีมเปลี่ยนที่เดียว
- ลำดับ import ใน `app/globals.css`: tokens → base → motion → primitives (cards, buttons, filters) → layout shells → navigation → modals/sheets → โดเมนต่างๆ
- **Tokens**: `app/styles/tokens.css` (ธีมเริ่มต้น "cosmic" อยู่ใน `:root`)
- **ธีมอื่น**: `app/styles/themes.css` และ `lib/themes.ts` **สร้างจาก** `scripts/themes/gen-themes.js` — อย่าแก้มือ แก้สคริปต์แล้วรัน `node scripts/themes/gen-themes.js` (รายละเอียด `docs/THEME-SWITCH-GUIDE.md`)
- การสลับธีม: `lib/theme.ts` ตั้ง `<html data-theme data-mode>` + จำใน `localStorage` · สคริปต์ใน root layout ตั้งค่าก่อน paint แรกเพื่อไม่ให้กระพริบ · ธีมสว่างถอด class `dark`
- ภาษาดีไซน์: พื้นผิวทึบ · ไม่ใช้ backdrop blur ในงานใหม่ · น้ำหนักตัวอักษร ≤ 500 · ปุ่มหลัก/ปุ่มกลับใช้ class กลาง (`btn-primary`, `cosmic-back-btn`, ...)
- primitive ของโปรเจกต์อยู่ `app/components/ui/*` (ปุ่ม ตาราง แท็บ dialog สถานะ) · shadcn อยู่ `components/ui/*` — **เพิ่ม primitive ผ่าน `pnpm dlx shadcn@latest`** อย่าเดา API
- `design.md` = ต้นฉบับดีไซน์ · `agent/rules/design-system.mdc` = สรุป

---

## 10. PWA และ offline

`app/sw.ts` (Serwist) + route `app/serwist/[path]` · มีหน้า `/offline` ต่อภาษา (precache) · ติดตั้งแอปผ่าน `PwaInstallProvider` / `PwaInstallBanner` / หน้า `/download`
ภาพ/ asset ที่เปลี่ยนแล้วต้องล้างแคช ใช้ `?v=` ต่อท้าย URL (เช่นตรา VIP)

---

## 11. ทดสอบและคุณภาพ

| คำสั่ง | ทำอะไร |
|-------|-------|
| `npx tsc --noEmit -p .` (หรือ `pnpm typecheck`) | ตรวจชนิด |
| `pnpm test` | unit test (`tsx --test` ใน `lib/**`, `app/**`, `scripts/**`) |
| `pnpm build` | build production (ตรวจ prerender + ฟอนต์) |
| `pnpm lint` | ESLint — **ตอนนี้มี error เดิมบน main** จึงใช้ typecheck + test เป็นเกณฑ์หลัก |

เทสต์ที่ช่วยกันพังโครง: `lib/api/endpoints.test.ts` (สัญญา endpoint) · `lib/api/mockDataImports.test.ts` (UI ใหม่ห้าม import `*MockData` ตรง) · `lib/i18n/*.test.ts` (dictionary/routing) · `lib/auth/*.test.ts`
การตรวจหน้าตาทำด้วยตาและการคลิก (ไม่มีเทสต์ภาพอัตโนมัติ)

---

## 12. วิธีเพิ่มของใหม่

**เพิ่มหน้าใหม่**
1. สร้าง `app/[lang]/<route>/page.tsx` + component ใน `app/components/<domain>/`
2. หน้าที่ต้อง login → เพิ่ม path ใน `lib/auth/protectedPaths.ts`
3. ข้อความ → เพิ่ม key ใน `lib/i18n/messages/th/<ns>.json` (และ `en/`) ก่อนใช้ `t(...)`
4. สไตล์ → Tailwind สำหรับ layout + CSS ใน `app/styles/` (หรือ CSS Module) อ้าง token
5. mobile-first ก่อน แล้วขยาย `lg:`

**เพิ่มข้อมูลจาก API**
1. เพิ่ม endpoint ใน `lib/api/endpoints.ts` (+ เทสต์)
2. เขียน `fetchXxx` ใน `lib/api/<domain>.ts` (เริ่มด้วย `mockResult` แล้วสลับเป็น `apiFetch`)
3. เพิ่ม hook ใน `app/hooks/api/<domain>.ts` (`auth: true` ถ้าต้อง login)
4. ใช้ใน component ด้วย hook + `ResourceGate`

**เพิ่มภาษา**: เพิ่ม code ใน `lib/i18n/config.ts` (`LOCALES`, `FALLBACK_CHAIN`, `LOCALE_LABELS`) + `lib/i18n/messages/<code>.json` + ฟอนต์ใน `lib/i18n/fonts.ts` ถ้าอักษรพิเศษ

**เพิ่มธีม**: แก้ `scripts/themes/gen-themes.js` (และ preset) แล้วรันสคริปต์สร้างใหม่

**เพิ่ม overlay ที่ผูก URL**: เพิ่มชื่อใน `OverlayLayer` (`lib/overlayUrl.ts`) แล้วใช้ `useOverlayLayer("<ชื่อ>")`

---

## 13. หลักการที่ใช้ตัดสินใจ

- **Mobile-first** เสมอ — ออกแบบหน้าจอมือถือก่อนแล้วขยาย
- **UI ไม่รู้แหล่งข้อมูล** — เปลี่ยน mock ↔ backend ได้โดยแก้ชั้น `lib/api`
- **สถานะครบ** — ข้อมูลจาก API ต้องมี โหลด / ว่าง / ผิดพลาด
- **ไม่มีผลธุรกรรมปลอม** — ถ้ายังไม่มี endpoint ให้แจ้งว่ายังไม่เชื่อม อย่าแสดงว่าสำเร็จ
- **Token แทนสีตรงๆ** — เปลี่ยนธีม/ดีไซน์ที่ token ที่เดียว
- **เอกสารคู่โค้ด** — กฎของ agent อยู่ `AGENTS.md` และ `agent/` + `.cursor/` (ต้องเนื้อหาตรงกัน)
