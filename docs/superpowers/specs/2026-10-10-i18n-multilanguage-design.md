# Design Spec: Multi-language (i18n)

- **Date:** 2026-10-10
- **Status:** Draft — รออนุมัติก่อนเริ่ม Phase 1
- **Scope:** ทุกหน้าใน `app/` (lobby, standalone, hub modals, lottery, profile, transactions), `proxy.ts`, `lib/format.ts`, auth profile, API โปรโมชัน/ประกาศ

---

## 1. Problem Statement

- ข้อความไทยฮาร์ดโค้ดราว 4,000 จุดใน `app/components` และ `app/data/*MockData.ts`
- `<html lang="th">` ตายตัวใน `app/layout.tsx`
- `lib/format.ts` ล็อก `NUMBER_LOCALE = "th-TH"`
- ฟอนต์ `Noto_Sans_Thai` ไม่ครอบคลุมอักษรลาว พม่า เขมร จีน
- ไม่มี route ต่อภาษา และไม่มี SEO แยกภาษา

---

## 2. Goals & Non-Goals

### Goals

- รองรับ 9 ภาษา โดย URL แยกภาษาและแชร์ลิงก์ได้
- จำภาษาของผู้ใช้ที่ login แล้วไว้ใน **profile ฝั่ง server**
- ข้อมูลโปรโมชันและประกาศ **แปลจาก backend**
- Dictionary เป็น server-only ส่วน client ได้รับเฉพาะ namespace ที่หน้านั้นใช้
- Mobile-first: ข้อความยาวต้องไม่ทำให้ปุ่ม แท็บ หรือ bottom nav แตก

### Non-Goals

- ไม่รองรับ RTL (ไม่มีภาษา RTL ในชุดนี้)
- ไม่ทำ domain แยกต่อประเทศ
- ไม่แปลชื่อเกมหรือชื่อค่าย provider (ใช้ชื่อเดิม)
- ไม่เพิ่มระบบจัดการคำแปลบนเว็บ (TMS) ในเฟสนี้

---

## 3. Locales

| Code | ภาษา | ฟอนต์ (next/font/google) | Fallback chain |
|------|------|--------------------------|----------------|
| `th` | ไทย (default) | Noto Sans Thai | — |
| `en` | English | Noto Sans Thai (latin) | th |
| `lo` | ລາວ | Noto Sans Lao | th → en |
| `my` | မြန်မာ | Noto Sans Myanmar | en → th |
| `vi` | Tiếng Việt | Noto Sans (subset `vietnamese`) | en → th |
| `zh` | 简体中文 | Noto Sans SC | en → th |
| `id` | Bahasa Indonesia | Noto Sans Thai (latin) | en → th |
| `fil` | Filipino | Noto Sans Thai (latin) | en → th |
| `km` | ខ្មែរ | Noto Sans Khmer | en → th |

- ใช้ BCP 47 code แบบสั้น (`fil` ไม่ใช่ `tl`, `zh` = Simplified)
- ภาษาลาว fallback ไปไทยก่อน เพราะผู้ใช้ลาวส่วนใหญ่อ่านไทยได้
- พม่าใช้ **Unicode** เท่านั้น ไม่รองรับ Zawgyi
- `[lang]/layout.tsx` โหลดเฉพาะฟอนต์ของภาษานั้น + Noto Sans Thai เป็นฐาน (ข้อความผสม เช่น ชื่อเกม) เพื่อไม่ให้ทุกหน้าโหลดฟอนต์ CJK

---

## 4. Routing

### URL

- **ไทย (default) ไม่มี prefix:** `/vip`, `/casino` (URL เดิมทั้งหมดใช้ต่อได้)
- **ภาษาอื่นมี prefix:** `/en/vip`, `/km/casino`
- `/th/...` → redirect ถาวรไป URL ไม่มี prefix (ไทยมี URL เดียว)
- ภายในยังย้ายทุกหน้าเข้า `app/[lang]/` (ยกเว้น `api/`, `manifest.ts`, `sw.ts`, `serwist/`, `favicon.ico`) และ proxy **rewrite** `/vip` → `/th/vip` แบบที่ผู้ใช้ไม่เห็น
- `app/[lang]/layout.tsx` เป็น root layout: `<html lang={lang}>` + `generateStaticParams` คืนทั้ง 9 ภาษา
- `lang` ที่ไม่รองรับ → `notFound()`

### ลำดับตัดสินภาษา (ใน `proxy.ts`)

1. มีภาษาอื่นใน path → ใช้ตามนั้น
2. ไม่มี prefix → ดู cookie `NEXT_LOCALE` (ตั้งตอนผู้ใช้เลือก หรือตอน login จากค่าใน profile) ถ้าเป็นภาษาอื่น → redirect `/{locale}/...`
3. ไม่มี cookie → `Accept-Language` ถ้าเป็นภาษาอื่นที่รองรับ → redirect `/{locale}/...`
4. นอกนั้นแสดงไทย (rewrite ไป `/th/...`)

ผู้ใช้ที่สลับกลับเป็นไทยจะได้ cookie `th` จึงไม่ถูก redirect ไปภาษาอื่นอีก

### `proxy.ts`

- matcher ใหม่ครอบทุก path ยกเว้น `_next`, `api`, `sw.js`, `manifest.webmanifest`, ไฟล์ที่มีนามสกุล (assets ใน `public/`)
- ลำดับในฟังก์ชัน: (a) `/th/...` → redirect ไม่มี prefix, (b) ไม่มี prefix แต่ต้องการภาษาอื่น → redirect ใส่ prefix, (c) ตัด prefix แล้วเทียบกับรายการ path ที่ต้อง login เดิม (`/transactions`, `/cashback`, `/profile/account`, `/vip`, `/lottery/slips`)
- redirect ไป login คงภาษาเดิม: `/en/vip` → `/en?layer=login`, `/vip` → `/?layer=login`
- ไม่มี prefix (ไทย) → rewrite ไป `/th/...`
- ต้องมี test ใน `lib/i18n/routing.test.ts` สำหรับ guard ทุก path × อย่างน้อย 2 ภาษา เพื่อกัน guard หลุดหลังย้ายโครงสร้าง

---

## 5. Dictionaries

### โครงสร้าง

```
lib/i18n/config.ts              locales, defaultLocale, fallbackChain, hasLocale
lib/i18n/getDictionary.ts       server-only · ใช้ lang() จาก next/root-params
lib/i18n/translate.ts           t(dict, key, vars) + plural ผ่าน Intl.PluralRules
lib/i18n/I18nProvider.tsx       client context
lib/i18n/useT.ts                hook ฝั่ง client: const t = useT("lottery")
lib/i18n/messages/th/common.json
lib/i18n/messages/th/lottery.json
lib/i18n/messages/<locale>/<namespace>.json
```

- Namespace ตามโดเมน: `common`, `nav`, `auth`, `home`, `lottery`, `promotions`, `vip`, `profile`, `transactions`, `wallet`, `rewards`, `errors`
- Key บอกความหมาย เช่น `lottery.betSlip.confirm` ห้ามใช้ข้อความไทยเป็น key
- ตัวแปร: `"ยอดคงเหลือ {amount}"`
- Layout ของแต่ละ segment ส่งเข้า `I18nProvider` เฉพาะ namespace ที่ใช้ (ส่ง `common` + `nav` ตลอด)

### Fallback และ test

- คีย์ที่ขาดใน locale จะไล่ตาม fallback chain ใน §3 จนถึง `th` (ซึ่งต้องครบเสมอ)
- `lib/i18n/messages.test.ts`:
  - **fail** ถ้า locale ใดมี key ที่ไม่มีใน `th` (key ค้าง/พิมพ์ผิด)
  - **fail** ถ้า `{placeholder}` ไม่ตรงกับ `th`
  - **fail** ถ้า `en` ขาด key (en เป็นต้นทางให้ทีมแปลภาษาอื่น)
  - รายงาน coverage % ของภาษาอื่น ไม่ทำให้ fail (ปล่อยแปลทีหลังได้)
- Type ของ key สร้างจาก `th/*.json` เพื่อให้ `t("...")` ถูก typecheck

---

## 6. Format ตัวเลข วันที่ สกุลเงิน

- `lib/format.ts` รับ `locale` เป็นพารามิเตอร์ ใช้ `${locale}-u-nu-latn` เสมอ เพื่อไม่ให้ `my`, `lo`, `km` แสดงเลขพื้นเมือง (ตัวเลขยอดเงินและหวยต้องเป็นเลขอารบิก)
- สกุลเงินเป็นบาท (`THB`) ทุกภาษา เปลี่ยนแค่รูปแบบการแสดง
- เวลายังเป็น `Asia/Bangkok` ตาม `app/lib/bangkokTime.ts` โดยแสดงโซนเวลาให้ชัดในหน้า lottery (ปิดรับและออกผล)
- ปีพุทธศักราชใช้เฉพาะ `th` ภาษาอื่นใช้ปี ค.ศ.
- ชื่อหวยไทย/ลาว/ฮานอย และประเภทการแทง (3 ตัวบน, 2 ตัวล่าง ฯลฯ) เป็น key ใน `lottery.json` ต้องมีคำอธิบายใน tooltip สำหรับภาษาที่ไม่คุ้นกับคำเหล่านี้

---

## 7. ภาษาใน Profile (server)

- `StoredUser` / `ProfileUser` (`app/types/auth.ts`) เพิ่ม `locale?: Locale`
- `PATCH /api/auth/profile` รับ `{ locale }` และ validate ด้วย `hasLocale`
- **Login สำเร็จ**: ตั้ง cookie `NEXT_LOCALE` จาก `user.locale` แล้วให้ client redirect ไป path ภาษานั้นถ้าต่างจากปัจจุบัน
- **Register**: บันทึกภาษาปัจจุบันจาก URL ลง profile
- **สลับภาษาขณะ login**: เปลี่ยน path + ตั้ง cookie ทันที แล้วยิง PATCH แบบ fire-and-forget (ถ้าล้มเหลวก็ไม่ย้อน UI เพราะรอบหน้าจะ sync ใหม่)
- **Guest**: ใช้ cookie อย่างเดียว
- Logout ไม่ลบ cookie ภาษา

---

## 8. เนื้อหาจาก Backend (โปรโมชัน / ประกาศ)

### Contract

- Client ส่ง `?lang=<locale>` ไปที่ `app/api/promotions/*` (และ endpoint ประกาศ) แล้ว route handler ส่งต่อให้ backend
- Backend คืนข้อความที่ resolve ภาษาแล้ว พร้อม `lang` ที่ใช้จริง:

```ts
interface LocalizedPayload<T> {
  lang: Locale;          // ภาษาที่ backend ใช้จริง (อาจ fallback)
  data: T;
}
```

- ถ้า backend ยังไม่มีคำแปล ให้ fallback ตาม chain ใน §3 ฝั่ง backend; ฝั่ง frontend ไม่ต้อง merge เอง
- SWR key ต้องมี `lang` เพื่อไม่ให้ cache ข้ามภาษา
- Mock data (`promotionsHubMockData.ts`, `promotionDetailMockData.ts`, `lobbyAnnouncementMockData.ts`) เปลี่ยนเป็น `Record<Locale, …>` บางส่วน (th + en) เพื่อจำลอง contract เดียวกัน

### รูปแบนเนอร์

- แบนเนอร์ที่มีข้อความฝังให้ backend ส่ง URL รูปตามภาษา ถ้าไม่มีให้ fallback เป็นรูป `th`
- แบนเนอร์ที่ทำใหม่ควรเป็นข้อความซ้อนบนรูป แทนการฝังข้อความ

### Mock data ฝั่ง UI ที่ไม่มาจาก backend

- ข้อมูลอย่างเมนู, หมวดเกม, VIP tiers, ภารกิจ: เปลี่ยนจากข้อความไทยเป็น `labelKey` แล้วแปลผ่าน dictionary

---

## 9. UI: ตัวสลับภาษา

- **มือถือ**: อยู่ในเมนู slide-over และหน้า profile → "ภาษา" เปิดเป็น sheet รายการ 9 ภาษา
- **Desktop**: ปุ่มเล็กใน header แสดงตัวย่อ (`TH`, `EN`, …) เปิดเป็น dropdown
- แต่ละรายการแสดงชื่อในภาษานั้นเอง (`ລາວ`, `မြန်မာ`, `ខ្មែរ`) ไม่ใช้ธงชาติ
- ใช้ shadcn primitives ที่มีอยู่ (`Sheet` / `DropdownMenu`) ตาม `design.md`
- เมื่อเลือก: คง path, query, hash เดิม และเปลี่ยนแค่ prefix

---

## 10. SEO / Metadata / PWA

- `generateMetadata` ต่อภาษา โดย title/description มาจาก dictionary
- `alternates.languages` ครบ 9 ภาษา + `x-default` → `/` (ไทยไม่มี prefix)
- `og:locale` ตามภาษา
- `manifest.ts`: ใช้ `name` ภาษาไทยเป็นค่าเดียว (manifest ไม่รองรับหลายภาษาต่อไฟล์) และ `start_url` = `/`
- Service worker (`sw.ts`): precache หน้า `/[lang]/offline` ทุกภาษา หรืออย่างน้อยเฉพาะภาษาปัจจุบันตอน install; runtime cache แยกตาม path อยู่แล้ว

---

## 11. Layout Risk (Mobile-first)

| ภาษา | ความเสี่ยง | แนวทาง |
|------|-----------|--------|
| `my`, `km` | ข้อความยาว 1.3–1.6× ของไทย สระบน/ล่างสูง | `line-height` ≥ 1.6 ใน `:lang(my)`, `:lang(km)`; ปุ่มต้อง wrap ได้ ห้ามกำหนดความสูงตายตัว |
| `vi`, `id`, `fil` | คำยาว | bottom nav ใช้ `truncate` + label สั้นแยก key (`nav.short.*`) |
| `zh` | สั้นกว่า แต่ฟอนต์หนัก | โหลด subset เฉพาะหน้าภาษาจีน |
| `lo` | ฟอนต์ใกล้ไทย | ใช้ line-height เดียวกับไทย |

- เพิ่ม CSS ตามภาษาใน `app/styles/base.css` ผ่าน selector `:lang(...)`
- ตรวจทุกหน้าที่ 360px ด้วย `my` และ `km` (สองภาษาที่ยาวที่สุด) ก่อนปิดแต่ละเฟส

---

## 12. Phases

| # | งาน | เสร็จเมื่อ |
|---|-----|-----------|
| 1 | ย้าย `app/` → `app/[lang]/`, `proxy.ts` locale + guard, `lib/i18n` core, ฟอนต์ตามภาษา, test routing + messages | UI ไทยเหมือนเดิม 100%, `/en/...` เปิดได้ (ยังเป็นไทย), guard ผ่าน test |
| 2 | `lib/format.ts` + date utils รับ locale | test format ทุกภาษา |
| 3 | Profile `locale` + API PATCH + sync ตอน login/register + ตัวสลับภาษา | สลับภาษาแล้วจำข้าม session |
| 4 | Shell: header, bottom nav, menu, auth dialogs, toasts, errors → `common`/`nav`/`auth`/`errors` | shell แปลครบ th+en |
| 5 | ทีละโดเมน: home → lottery → promotions → wallet → profile/vip/transactions → rewards/missions/wheel | ไม่มีข้อความไทยฮาร์ดโค้ดในโดเมนนั้น |
| 6 | Backend contract โปรโมชัน/ประกาศ (`?lang=`), SWR key, แบนเนอร์ตามภาษา | สลับภาษาแล้วเนื้อหา backend เปลี่ยน |
| 7 | SEO metadata/hreflang, offline page, QA layout 9 ภาษา | ผ่าน `ui-qa-checklist` |

- ไฟล์แปลของ 7 ภาษา (lo, my, vi, zh, id, fil, km) ส่งให้ทีมแปลหลัง `en` ของแต่ละเฟสเสร็จ ระหว่างนั้นใช้ fallback chain ไปก่อน
- Gate ทุกเฟส: `pnpm typecheck` + `pnpm test` + `pnpm build`

---

## 13. Open Questions

- ทีมแปลภาษาใดเป็นคนทำ และส่งไฟล์รูปแบบไหน (JSON ตรง ๆ หรือ spreadsheet ที่ต้องแปลงกลับ)
- Backend ใช้ endpoint ประกาศตัวไหน (ตอนนี้มีแค่ mock `lobbyAnnouncementMockData.ts`)
- ข้อความ legal (ข้อกำหนด, การเล่นอย่างรับผิดชอบ) ต้องผ่านการตรวจทางกฎหมายต่อภาษาหรือไม่
