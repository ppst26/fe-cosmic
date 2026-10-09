# Multi-language (i18n) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** รองรับ 9 ภาษา (`th` default, `en`, `lo`, `my`, `vi`, `zh`, `id`, `fil`, `km`) ด้วย URL แยกภาษา จำภาษาไว้ใน profile และดึงเนื้อหาโปรโมชันตามภาษาจาก backend ตาม spec `docs/superpowers/specs/2026-10-10-i18n-multilanguage-design.md`

**Architecture:** ย้าย route ทั้งหมดเข้า `app/[lang]/` (root param `lang` อ่านผ่าน `next/root-params`); `proxy.ts` ใส่ prefix ภาษาและกัน path ที่ต้อง login โดยใช้ฟังก์ชัน pure ใน `lib/i18n/routing.ts`; ห่อ `next/link` + `useRouter` + `usePathname` ใน `lib/i18n/navigation.tsx` ให้เติม/ตัด prefix อัตโนมัติ (component เดิมเปลี่ยนแค่บรรทัด import); dictionary เป็น JSON ต่อภาษาใน `lib/i18n/messages/` โหลดฝั่ง server แล้ว merge ตาม fallback chain และส่งเข้า client เฉพาะ namespace ที่ใช้

> **อัปเดต 2026-10-10 (ระหว่างทำ Phase 1):** ไทย (default) **ไม่มี prefix ใน URL** — `/vip` แสดงไทยโดย proxy rewrite ภายในไป `/th/vip`, `/th/...` redirect ไปไม่มี prefix, ภาษาอื่นยังเป็น `/{locale}/...` · `withLocale(href, "th")` คืน path ไม่มี prefix · `decideProxyAction` มีผลลัพธ์ `rewrite` เพิ่ม · offline ไทยคือ `/offline` — โค้ดจริงอยู่ที่ `lib/i18n/routing.ts` และ `routing.test.ts` (ตัวอย่างโค้ดใน Task 1.1–1.2 ด้านล่างเป็นฉบับก่อนเปลี่ยน)

**Tech Stack:** Next.js 16.3.5 (App Router, `next/root-params`, `proxy.ts`), React 19, TypeScript, Tailwind CSS 4, pnpm, `tsx --test`

## Global Constraints

- **Gate ทุก task:** `pnpm next typegen && pnpm typecheck` + `pnpm test` + `pnpm build` (`pnpm lint` ล้มบน main อยู่แล้ว 5 จุด react-hooks/refs จึงใช้แค่ดูว่าไม่มี error ใหม่)
- **ไม่ทดสอบผ่าน browser automation:** ตรวจด้วย build output และ test; คนในทีมกดทดสอบเอง
- **ไม่เพิ่ม dependency:** ใช้ parser `Accept-Language` ของเราเอง (ต่างจาก spec §4 ที่ระบุ `@formatjs/intl-localematcher` + `negotiator` — ฟังก์ชันสั้นและทดสอบได้ จึงไม่คุ้มเพิ่ม 2 package)
- **Phase 1 ต้องไม่เปลี่ยนหน้าตา:** ทุกหน้ายังแสดงไทยเหมือนเดิม 100%
- **ห้าม import ตรง** `next/link`, `useRouter` / `usePathname` / `redirect` / `permanentRedirect` จาก `next/navigation` นอก `lib/i18n/` (บังคับด้วย ESLint ใน Task 1.6)
- **Href ใน data/component เขียนแบบไม่มี prefix** (`/vip`, `/casino`) — wrapper เติมให้เอง ไม่ต้องแก้ data
- **ตัวเลขเป็นเลขอารบิกเสมอ** (`-u-nu-latn`)
- Mobile-first ตาม `design.md`; UI ใหม่มีแค่ตัวสลับภาษา (spec §9)

---

## File map

| File | Responsibility |
| :--- | :--- |
| `lib/i18n/config.ts` | `LOCALES`, `Locale`, `DEFAULT_LOCALE`, `FALLBACK_CHAIN`, `LOCALE_LABELS`, `hasLocale`, cookie constants |
| `lib/i18n/routing.ts` | pure: `splitLocale`, `withLocale`, `parseAcceptLanguage`, `resolveRequestLocale`, `decideProxyAction` |
| `lib/i18n/routing.test.ts` | test routing + guard |
| `lib/auth/protectedPaths.ts` | `PROTECTED_PREFIXES`, `isProtectedPath` (ย้ายจาก matcher ใน `proxy.ts`) |
| `proxy.ts` | เรียก `decideProxyAction` |
| `lib/i18n/translate.ts` | `MessageTree`, `lookup`, `formatMessage`, `createTranslator`, `deepMerge`, type `NestedKey` |
| `lib/i18n/translate.test.ts` | test translator + plural + merge |
| `lib/i18n/messages/<locale>.json` | dictionary ต่อภาษา (top-level = namespace) |
| `lib/i18n/messages.ts` | `loadMessages(locale)` + `pickNamespaces` + type `Messages`, `Namespace` |
| `lib/i18n/messages.test.ts` | key parity / placeholder parity / coverage |
| `lib/i18n/server.ts` | `getLocale`, `getT`, `localizedRedirect`, `localizedPermanentRedirect` |
| `lib/i18n/I18nProvider.tsx` | client context (merge กับ provider ชั้นนอก) + `useT` |
| `lib/i18n/MessagesBoundary.tsx` | server component โหลด namespace แล้วห่อ `I18nProvider` |
| `lib/i18n/navigation.tsx` | client: `Link` (default), `useLocale`, `useRouter`, `usePathname`, `useSwitchLocale` |
| `lib/i18n/fonts.ts` | ฟอนต์ตามภาษา (`--font-locale`) |
| `scripts/i18n-swap-imports.mjs` | codemod เปลี่ยน import ไปใช้ `lib/i18n/navigation` |
| `app/[lang]/layout.tsx` | root layout ใหม่ (`<html lang>`, ฟอนต์, metadata) |
| `app/[lang]/**` | route เดิมทั้งหมด (ย้ายด้วย `git mv`) |
| `app/global-not-found.tsx` | 404 ของ URL ที่ไม่ match route (ต้องใช้เพราะ root layout เป็น dynamic segment) |
| `next.config.ts` | `experimental.globalNotFound` |
| `app/sw.ts`, `app/serwist/[path]/route.ts` | offline fallback ต่อภาษา |
| `app/styles/tokens.css`, `base.css`, `status-state.css`, `lucky-wheel.css` | font stack ใช้ `--font-locale` + line-height ตามภาษา |
| `lib/format.ts` | รับ locale (Phase 2) |
| `app/types/auth.ts`, `lib/auth/userStore.ts`, `app/api/auth/*` | `locale` ใน profile (Phase 3) |
| `lib/api/http.ts`, `app/hooks/useApi.ts` | ส่ง `lang` ไป backend + SWR key ตามภาษา (Phase 6) |

---

# Phase 1 — โครงพื้นฐาน (UI ไม่เปลี่ยน)

### Task 1.1: Locale config + routing functions

**Files:**
- Create: `lib/i18n/config.ts`
- Create: `lib/i18n/routing.ts`
- Create: `lib/auth/protectedPaths.ts`
- Create: `lib/i18n/routing.test.ts`

**Interfaces:**
- Produces: `Locale`, `hasLocale`, `splitLocale`, `withLocale`, `resolveRequestLocale`, `decideProxyAction`, `isProtectedPath`

- [ ] **Step 1: `lib/i18n/config.ts`**

```ts
/**
 * ภาษาที่รองรับ — ลำดับนี้ใช้แสดงในตัวสลับภาษา
 * เพิ่มภาษา: เพิ่ม code ที่นี่ + FALLBACK_CHAIN + LOCALE_LABELS + lib/i18n/messages/<code>.json
 */
export const LOCALES = ["th", "en", "lo", "my", "vi", "zh", "id", "fil", "km"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "th";

/** cookie จำภาษา — ตั้งตอนผู้ใช้เลือกภาษา และตอน login จาก profile */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;

/** คีย์ที่ขาดจะไล่ตามลำดับนี้ — th ต้องครบเสมอจึงเป็นปลายทางสุดท้าย */
export const FALLBACK_CHAIN: Record<Locale, readonly Locale[]> = {
  th: [],
  en: ["th"],
  lo: ["th", "en"],
  my: ["en", "th"],
  vi: ["en", "th"],
  zh: ["en", "th"],
  id: ["en", "th"],
  fil: ["en", "th"],
  km: ["en", "th"],
};

/** ชื่อภาษาในภาษานั้นเอง + ตัวย่อบนปุ่ม desktop */
export const LOCALE_LABELS: Record<Locale, { native: string; short: string }> = {
  th: { native: "ไทย", short: "TH" },
  en: { native: "English", short: "EN" },
  lo: { native: "ລາວ", short: "LO" },
  my: { native: "မြန်မာ", short: "MY" },
  vi: { native: "Tiếng Việt", short: "VI" },
  zh: { native: "简体中文", short: "ZH" },
  id: { native: "Bahasa Indonesia", short: "ID" },
  fil: { native: "Filipino", short: "FIL" },
  km: { native: "ខ្មែរ", short: "KM" },
};

export function hasLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
```

- [ ] **Step 2: `lib/auth/protectedPaths.ts`** (รายการเดียวกับ matcher เดิมใน `proxy.ts`)

```ts
/** path (ไม่มี prefix ภาษา) ที่ต้อง login — proxy.ts เป็นด่านแรก backend ต้องตรวจซ้ำเสมอ */
export const PROTECTED_PREFIXES = [
  "/transactions",
  "/cashback",
  "/profile/account",
  "/vip",
  "/lottery/slips",
] as const;

export function isProtectedPath(path: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
```

- [ ] **Step 3: `lib/i18n/routing.ts`**

```ts
import { DEFAULT_LOCALE, hasLocale, type Locale } from "./config";
import { isProtectedPath } from "@/lib/auth/protectedPaths";

/** แยก prefix ภาษาออกจาก pathname — /en/vip → { locale: "en", path: "/vip" } */
export function splitLocale(pathname: string): { locale: Locale | null; path: string } {
  const segment = pathname.split("/")[1];
  if (!hasLocale(segment)) return { locale: null, path: pathname || "/" };
  return { locale: segment, path: pathname.slice(segment.length + 1) || "/" };
}

/**
 * เติม/แทน prefix ภาษาให้ href ภายใน — href ภายนอก, //host, #hash ปล่อยตามเดิม
 * idempotent: /th/vip + "en" → /en/vip
 */
export function withLocale(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const cut = href.search(/[?#]/);
  const pathname = cut === -1 ? href : href.slice(0, cut);
  const suffix = cut === -1 ? "" : href.slice(cut);
  const { path } = splitLocale(pathname);
  return `/${locale}${path === "/" ? "" : path}${suffix}`;
}

/** alias ของ tag ที่ browser ส่งมาแต่เราใช้ code อื่น */
const TAG_ALIASES: Record<string, Locale> = { tl: "fil", in: "id" };

/** เลือกภาษาที่รองรับจาก Accept-Language ตาม q-value — ไม่มีที่ตรง → null */
export function parseAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag, q: q ? Number(q.trim().slice(2)) : 1, index };
    })
    .filter((entry) => entry.tag && !Number.isNaN(entry.q) && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  for (const { tag } of ranked) {
    if (hasLocale(tag)) return tag;
    const primary = tag.split("-")[0];
    if (hasLocale(primary)) return primary;
    if (primary in TAG_ALIASES) return TAG_ALIASES[primary];
  }
  return null;
}

/** ลำดับ: cookie → Accept-Language → th (ภาษาใน path จัดการก่อนเรียกฟังก์ชันนี้) */
export function resolveRequestLocale(input: {
  cookie: string | undefined;
  acceptLanguage: string | null;
}): Locale {
  if (hasLocale(input.cookie)) return input.cookie;
  return parseAcceptLanguage(input.acceptLanguage) ?? DEFAULT_LOCALE;
}

export type ProxyAction =
  | { type: "next" }
  | { type: "redirect"; pathname: string; search: string };

/**
 * ตัดสินใจของ proxy.ts แบบ pure เพื่อให้ test ได้
 * 1) ไม่มี prefix → redirect ใส่ภาษา (คง query)
 * 2) path ต้อง login แต่ไม่มี session → /{locale}?layer=login
 */
export function decideProxyAction(input: {
  pathname: string;
  search: string;
  cookieLocale: string | undefined;
  acceptLanguage: string | null;
  hasSession: boolean;
}): ProxyAction {
  const { locale, path } = splitLocale(input.pathname);
  if (!locale) {
    const target = resolveRequestLocale({ cookie: input.cookieLocale, acceptLanguage: input.acceptLanguage });
    return { type: "redirect", pathname: withLocale(input.pathname, target), search: input.search };
  }
  if (isProtectedPath(path) && !input.hasSession) {
    return { type: "redirect", pathname: `/${locale}`, search: "?layer=login" };
  }
  return { type: "next" };
}
```

- [ ] **Step 4: `lib/i18n/routing.test.ts`**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { PROTECTED_PREFIXES } from "@/lib/auth/protectedPaths";
import { decideProxyAction, parseAcceptLanguage, splitLocale, withLocale } from "./routing";

test("splitLocale strips a supported prefix only", () => {
  assert.deepEqual(splitLocale("/en/vip"), { locale: "en", path: "/vip" });
  assert.deepEqual(splitLocale("/fil"), { locale: "fil", path: "/" });
  assert.deepEqual(splitLocale("/vip"), { locale: null, path: "/vip" });
  assert.deepEqual(splitLocale("/eng/vip"), { locale: null, path: "/eng/vip" });
});

test("withLocale adds or replaces the prefix and keeps query/hash", () => {
  assert.equal(withLocale("/", "th"), "/th");
  assert.equal(withLocale("/vip?tab=rank", "en"), "/en/vip?tab=rank");
  assert.equal(withLocale("/th/vip#top", "km"), "/km/vip#top");
  assert.equal(withLocale("https://x.com/a", "en"), "https://x.com/a");
  assert.equal(withLocale("//x.com/a", "en"), "//x.com/a");
  assert.equal(withLocale("#section", "en"), "#section");
});

test("parseAcceptLanguage honours q-values, regions and aliases", () => {
  assert.equal(parseAcceptLanguage("vi-VN,vi;q=0.9,en;q=0.8"), "vi");
  assert.equal(parseAcceptLanguage("fr;q=1,en;q=0.5"), "en");
  assert.equal(parseAcceptLanguage("tl-PH"), "fil");
  assert.equal(parseAcceptLanguage("zh-TW"), "zh");
  assert.equal(parseAcceptLanguage("de,fr"), null);
  assert.equal(parseAcceptLanguage(undefined), null);
});

const base = { search: "", cookieLocale: undefined, acceptLanguage: null, hasSession: false };

test("missing prefix redirects using cookie, then header, then th", () => {
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/vip", search: "?tab=rank", cookieLocale: "km" }), {
    type: "redirect", pathname: "/km/vip", search: "?tab=rank",
  });
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/", acceptLanguage: "en-US" }), {
    type: "redirect", pathname: "/en", search: "",
  });
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/", cookieLocale: "xx" }), {
    type: "redirect", pathname: "/th", search: "",
  });
});

test("every protected path stays guarded in every locale", () => {
  for (const prefix of PROTECTED_PREFIXES) {
    for (const locale of ["th", "en", "km"] as const) {
      for (const pathname of [`/${locale}${prefix}`, `/${locale}${prefix}/x`]) {
        assert.deepEqual(decideProxyAction({ ...base, pathname }), {
          type: "redirect", pathname: `/${locale}`, search: "?layer=login",
        }, pathname);
        assert.deepEqual(decideProxyAction({ ...base, pathname, hasSession: true }), { type: "next" });
      }
    }
  }
});

test("public pages pass through without a session", () => {
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/en/casino" }), { type: "next" });
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/en/vipx" }), { type: "next" });
});
```

- [ ] **Step 5:** `pnpm test` → ผ่าน

---

### Task 1.2: `proxy.ts`

**Files:**
- Modify: `proxy.ts`

- [ ] **Step 1: เขียนใหม่ทั้งไฟล์**

```ts
import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, parseSessionToken } from "@/lib/auth/session";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { decideProxyAction } from "@/lib/i18n/routing";

/**
 * Next 16 proxy · Node.js runtime
 * 1) URL ไม่มีภาษา → redirect ใส่ prefix (cookie → Accept-Language → th)
 * 2) กันหน้าที่ต้อง login (lib/auth/protectedPaths.ts) → /{locale}?layer=login
 * เป็นด่านแรกเท่านั้น — route handler / backend ต้องตรวจสิทธิ์เองทุกครั้ง
 */
export function proxy(request: NextRequest) {
  const action = decideProxyAction({
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    cookieLocale: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
    hasSession: Boolean(parseSessionToken(request.cookies.get(COOKIE_NAME)?.value)),
  });
  if (action.type === "next") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = action.pathname;
  url.search = action.search;
  return NextResponse.redirect(url);
}

export const config = {
  // ทุกหน้า ยกเว้น API, ไฟล์ของ Next, service worker และไฟล์ที่มีนามสกุล (assets ใน public/, manifest)
  matcher: ["/((?!api|_next|serwist|.*\\..*).*)"],
};
```

> `manifest.webmanifest`, `favicon.ico`, `sw.js`, `*.avif` ถูกตัดด้วย `.*\\..*` อยู่แล้ว

---

### Task 1.3: Translator + dictionaries

**Files:**
- Create: `lib/i18n/translate.ts`, `lib/i18n/translate.test.ts`
- Create: `lib/i18n/messages/{th,en,lo,my,vi,zh,id,fil,km}.json`
- Create: `lib/i18n/messages.ts`, `lib/i18n/messages.test.ts`

- [ ] **Step 1: `lib/i18n/translate.ts`**

```ts
import type { Locale } from "./config";

export type MessageTree = { [key: string]: string | MessageTree };

/** dot-path ของ leaf ทั้งหมด — object ที่มี "other" ถือเป็น plural leaf */
export type NestedKey<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends { other: string }
      ? K
      : `${K}.${NestedKey<T[K]>}`;
}[keyof T & string];

export type MessageVars = Record<string, string | number>;

export function lookup(tree: MessageTree, key: string): string | MessageTree | undefined {
  let node: string | MessageTree | undefined = tree;
  for (const part of key.split(".")) {
    if (node === undefined || typeof node === "string") return undefined;
    node = node[part];
  }
  return node;
}

/** แทน {name} ด้วยค่าใน vars — ตัวที่ไม่มีค่าคงไว้ตามเดิมเพื่อให้เห็นว่าลืมส่ง */
export function formatMessage(template: string, vars?: MessageVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

/**
 * t("lottery.betSlip.title", { amount }) — key ไม่พบคืน key เอง (เห็นชัดบนจอ)
 * plural: value เป็น { one, other } แล้วส่ง vars.count
 */
export function createTranslator(tree: MessageTree, locale: Locale) {
  const plural = new Intl.PluralRules(locale);
  return (key: string, vars?: MessageVars): string => {
    const value = lookup(tree, key);
    if (typeof value === "string") return formatMessage(value, vars);
    if (value && typeof vars?.count === "number") {
      const form = value[plural.select(vars.count)] ?? value.other;
      if (typeof form === "string") return formatMessage(form, vars);
    }
    if (process.env.NODE_ENV !== "production") console.warn(`[i18n] missing key "${key}" (${locale})`);
    return key;
  };
}

/** merge ซ้อนชั้น — ตัวหลังทับตัวหน้า ใช้รวม fallback chain */
export function deepMerge(...trees: MessageTree[]): MessageTree {
  const out: MessageTree = {};
  for (const tree of trees) {
    for (const [key, value] of Object.entries(tree)) {
      const prev = out[key];
      out[key] =
        typeof value === "object" && typeof prev === "object" ? deepMerge(prev, value) : value;
    }
  }
  return out;
}
```

- [ ] **Step 2: `lib/i18n/translate.test.ts`** — ครอบ: lookup ซ้อน, `{var}`, var ที่ขาดคงไว้, plural `en` (1 → one, 2 → other), plural `th` (ทุกค่า → other), key ไม่พบคืน key, `deepMerge` ทับเฉพาะ leaf

- [ ] **Step 3: dictionary เริ่มต้น** — namespace ชุดแรกเท่าที่ Phase 1 ใช้

`lib/i18n/messages/th.json`:

```json
{
  "meta": {
    "title": "Cosmicbet — อาณาจักรแห่งความมันส์",
    "description": "Cosmicbet Front-end Gaming Lobby"
  },
  "common": {
    "language": "ภาษา"
  },
  "nav": {},
  "auth": {},
  "errors": {
    "notFoundTitle": "ไม่พบหน้าที่ต้องการ",
    "backHome": "กลับหน้าแรก"
  }
}
```

`en.json`: key เดียวกันทั้งหมด แปลเป็นอังกฤษ
`lo/my/vi/zh/id/fil/km.json`: `{}` (ใช้ fallback จนกว่าทีมแปลส่งไฟล์)

- [ ] **Step 4: `lib/i18n/messages.ts`**

```ts
import { FALLBACK_CHAIN, type Locale } from "./config";
import { deepMerge, type MessageTree } from "./translate";
import type thMessages from "./messages/th.json";

/** โครงของ dictionary ยึด th.json เป็นต้นแบบ */
export type Messages = typeof thMessages;
export type Namespace = keyof Messages;

const LOADERS: Record<Locale, () => Promise<MessageTree>> = {
  th: () => import("./messages/th.json").then((m) => m.default),
  en: () => import("./messages/en.json").then((m) => m.default),
  lo: () => import("./messages/lo.json").then((m) => m.default),
  my: () => import("./messages/my.json").then((m) => m.default),
  vi: () => import("./messages/vi.json").then((m) => m.default),
  zh: () => import("./messages/zh.json").then((m) => m.default),
  id: () => import("./messages/id.json").then((m) => m.default),
  fil: () => import("./messages/fil.json").then((m) => m.default),
  km: () => import("./messages/km.json").then((m) => m.default),
};

/** dictionary ของภาษา merge กับ fallback chain (ท้าย chain = th อยู่ล่างสุด) */
export async function loadMessages(locale: Locale): Promise<MessageTree> {
  const chain = [locale, ...FALLBACK_CHAIN[locale]].reverse();
  const trees = await Promise.all(chain.map((code) => LOADERS[code]()));
  return deepMerge(...trees);
}

export function pickNamespaces(messages: MessageTree, namespaces: readonly Namespace[]): MessageTree {
  return Object.fromEntries(namespaces.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]));
}
```

> import JSON ที่ว่าง (`{}`) จะได้ type `{}` — `LOADERS` cast เป็น `MessageTree` ผ่าน return type ได้

- [ ] **Step 5: `lib/i18n/messages.test.ts`** — อ่านไฟล์ด้วย `fs.readFileSync` (เลี่ยง JSON import ใน `tsx --test`)

ต้องตรวจ:
1. ทุก locale ใน `LOCALES` มีไฟล์ และ parse ได้
2. **fail** ถ้า locale ใดมี leaf key ที่ไม่มีใน `th`
3. **fail** ถ้าชุด `{placeholder}` ของ leaf ต่างจาก `th`
4. **fail** ถ้า `en` ขาด leaf key ที่ `th` มี
5. log coverage % ของภาษาอื่น (`console.log`) — ไม่ fail

---

### Task 1.4: Server helpers + client provider

**Files:**
- Create: `lib/i18n/server.ts`
- Create: `lib/i18n/I18nProvider.tsx`
- Create: `lib/i18n/MessagesBoundary.tsx`

- [ ] **Step 1: `lib/i18n/server.ts`**

```ts
import { cache } from "react";
import { lang } from "next/root-params";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { hasLocale, type Locale } from "./config";
import { loadMessages, type Messages, type Namespace } from "./messages";
import { withLocale } from "./routing";
import { createTranslator, type MessageVars, type NestedKey } from "./translate";

/** ภาษาของ request ปัจจุบัน (Server Component เท่านั้น) — ไม่รองรับ → 404 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

export const getMessages = cache(async () => loadMessages(await getLocale()));

/** t ฝั่ง server ต่อ namespace — const t = await getT("meta"); t("title") */
export async function getT<N extends Namespace>(namespace: N) {
  const locale = await getLocale();
  const t = createTranslator(await getMessages(), locale);
  return (key: NestedKey<Messages[N]>, vars?: MessageVars) => t(`${namespace}.${key}`, vars);
}

/** redirect() ที่คงภาษาปัจจุบัน — ใช้แทน redirect จาก next/navigation ใน page */
export async function localizedRedirect(path: string): Promise<never> {
  redirect(withLocale(path, await getLocale()));
}

export async function localizedPermanentRedirect(path: string): Promise<never> {
  permanentRedirect(withLocale(path, await getLocale()));
}
```

> `next/root-params` ใช้ใน Route Handler ไม่ได้ — API อ่านภาษาจาก query/header แทน (Phase 6)

- [ ] **Step 2: `lib/i18n/I18nProvider.tsx`**

```tsx
"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Messages, Namespace } from "./messages";
import { createTranslator, deepMerge, type MessageTree, type MessageVars, type NestedKey } from "./translate";

const I18nContext = createContext<{ locale: Locale; messages: MessageTree } | null>(null);

/** provider ซ้อนได้ — ชั้นในรวม namespace ของชั้นนอกไว้ด้วย */
export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: MessageTree;
  children: ReactNode;
}) {
  const parent = useContext(I18nContext);
  const value = useMemo(
    () => ({ locale, messages: parent ? deepMerge(parent.messages, messages) : messages }),
    [locale, messages, parent],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** const t = useT("lottery"); t("betSlip.title") */
export function useT<N extends Namespace>(namespace: N) {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT ต้องอยู่ใต้ I18nProvider");
  return useMemo(() => {
    const t = createTranslator(ctx.messages, ctx.locale);
    return (key: NestedKey<Messages[N]>, vars?: MessageVars) => t(`${namespace}.${key}`, vars);
  }, [ctx, namespace]);
}
```

- [ ] **Step 3: `lib/i18n/MessagesBoundary.tsx`** (server component)

```tsx
import type { ReactNode } from "react";
import { I18nProvider } from "./I18nProvider";
import { pickNamespaces, type Namespace } from "./messages";
import { getLocale, getMessages } from "./server";

/** ส่ง namespace ที่ segment นี้ใช้เข้า client — วางใน layout ของ segment */
export async function MessagesBoundary({
  namespaces,
  children,
}: {
  namespaces: readonly Namespace[];
  children: ReactNode;
}) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  return (
    <I18nProvider locale={locale} messages={pickNamespaces(messages, namespaces)}>
      {children}
    </I18nProvider>
  );
}
```

---

### Task 1.5: Client navigation wrappers

**Files:**
- Create: `lib/i18n/navigation.tsx`

- [ ] **Step 1:**

```tsx
"use client";

import NextLink from "next/link";
import {
  useParams,
  usePathname as useNextPathname,
  useRouter as useNextRouter,
} from "next/navigation";
import { useMemo, type ComponentProps } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE_SEC, hasLocale, type Locale } from "./config";
import { splitLocale, withLocale } from "./routing";

/** ภาษาจาก segment [lang] */
export function useLocale(): Locale {
  const params = useParams<{ lang?: string }>();
  return hasLocale(params?.lang) ? params.lang : DEFAULT_LOCALE;
}

/** pathname ที่ตัด prefix ภาษาแล้ว — logic เทียบ path เดิมใช้ต่อได้ทันที */
export function usePathname(): string {
  return splitLocale(useNextPathname() ?? "/").path;
}

/** router ที่เติม prefix ภาษาให้ push / replace / prefetch */
export function useRouter() {
  const router = useNextRouter();
  const locale = useLocale();
  return useMemo(
    () => ({
      back: router.back,
      forward: router.forward,
      refresh: router.refresh,
      push: (href: string, options?: Parameters<typeof router.push>[1]) =>
        router.push(withLocale(href, locale), options),
      replace: (href: string, options?: Parameters<typeof router.replace>[1]) =>
        router.replace(withLocale(href, locale), options),
      prefetch: (href: string, options?: Parameters<typeof router.prefetch>[1]) =>
        router.prefetch(withLocale(href, locale), options),
    }),
    [router, locale],
  );
}

type LinkProps = ComponentProps<typeof NextLink>;

/** next/link ที่เติม prefix ภาษา — ใช้แทนแบบ drop-in (default export เหมือน next/link) */
export default function Link({ href, ...props }: LinkProps) {
  const locale = useLocale();
  const localized =
    typeof href === "string"
      ? withLocale(href, locale)
      : href.pathname
        ? { ...href, pathname: withLocale(href.pathname, locale) }
        : href;
  return <NextLink href={localized} {...props} />;
}

/** สลับภาษา: ตั้ง cookie + เปลี่ยน prefix โดยคง path/query/hash */
export function useSwitchLocale() {
  const router = useNextRouter();
  return (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE_SEC}; samesite=lax`;
    const { pathname, search, hash } = window.location;
    router.replace(withLocale(`${pathname}${search}${hash}`, next), { scroll: false });
  };
}
```

---

### Task 1.6: ย้าย route เข้า `app/[lang]/` + root layout ใหม่

**Files:**
- Move: route ทั้งหมด (รายการด้านล่าง)
- Create: `app/[lang]/layout.tsx`, `lib/i18n/fonts.ts`
- Delete: `app/layout.tsx`
- Create: `app/global-not-found.tsx`
- Modify: `next.config.ts`, `app/styles/tokens.css`, `app/styles/base.css`, `app/styles/status-state.css`, `app/styles/lucky-wheel.css`

**ไม่ย้าย** (ไม่ใช่ route หรือต้องอยู่ root): `api/`, `serwist/`, `sw.ts`, `manifest.ts`, `favicon.ico`, `global-error.tsx`, `globals.css`, `providers.tsx`, `components/`, `data/`, `hooks/`, `lib/`, `styles/`, `types/`

- [ ] **Step 1: ย้ายด้วย git (คง history)**

```bash
mkdir -p "app/[lang]"
for item in "(lobby)" activities cashback casino dashboard event gems-store loss-rebate lottery \
  missions offline play profile promotions referral reward sport transactions vip wheel \
  error.tsx loading.tsx not-found.tsx; do
  git mv "app/$item" "app/[lang]/$item"
done
```

route ทุกไฟล์ import ผ่าน `@/` อยู่แล้ว (ตรวจแล้วไม่มี relative import) จึงไม่ต้องแก้ path

- [ ] **Step 2: `lib/i18n/fonts.ts`**

```ts
import { Noto_Sans, Noto_Sans_Khmer, Noto_Sans_Lao, Noto_Sans_Myanmar, Noto_Sans_SC } from "next/font/google";
import type { Locale } from "./config";

/**
 * ฟอนต์เสริมตามภาษา — ทุกตัวใช้ตัวแปร --font-locale แต่ใส่ class ของภาษาปัจจุบันตัวเดียว
 * preload: false เพื่อไม่ให้หน้าไทยดึงฟอนต์ CJK/พม่า · display: swap เพราะเครื่องอาจไม่มีฟอนต์ระบบของอักษรเหล่านี้
 * th / en / id / fil ใช้ Noto Sans Thai (latin) ที่โหลดอยู่แล้ว
 */
const common = { variable: "--font-locale", weight: ["400", "500"], display: "swap", preload: false } as const;

const lao = Noto_Sans_Lao({ ...common, subsets: ["lao", "latin"] });
const myanmar = Noto_Sans_Myanmar({ ...common, subsets: ["myanmar", "latin"] });
const khmer = Noto_Sans_Khmer({ ...common, subsets: ["khmer", "latin"] });
const chinese = Noto_Sans_SC({ ...common, subsets: ["latin"] });
const vietnamese = Noto_Sans({ ...common, subsets: ["vietnamese", "latin"] });

const LOCALE_FONT_CLASS: Partial<Record<Locale, string>> = {
  lo: lao.variable,
  my: myanmar.variable,
  km: khmer.variable,
  zh: chinese.variable,
  vi: vietnamese.variable,
};

export function localeFontClass(locale: Locale): string {
  return LOCALE_FONT_CLASS[locale] ?? "";
}
```

- [ ] **Step 3: font stack** — แทน `var(--font-noto-sans-thai)` ตัวแรกของ stack ด้วย `var(--font-locale, var(--font-noto-sans-thai)), var(--font-noto-sans-thai)` ใน:
  - `app/styles/tokens.css:549-550` (`--font-heading`, `--font-sans`)
  - `app/styles/base.css:26`, `app/styles/status-state.css:110`, `app/styles/lucky-wheel.css:875` → เปลี่ยนเป็น `font-family: var(--font-sans);`

  เพิ่มใน `app/styles/base.css` (spec §11):

```css
:lang(my),
:lang(km) {
  line-height: 1.7;
}
```

- [ ] **Step 4: `app/[lang]/layout.tsx`** (ย้ายเนื้อหาจาก `app/layout.tsx` เดิม)

```tsx
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { AppProviders } from "@/app/providers";
import { CosmicFooterGate } from "@/app/components/layout/CosmicFooterGate";
import { LOCALES, hasLocale } from "@/lib/i18n/config";
import { localeFontClass } from "@/lib/i18n/fonts";
import { MessagesBoundary } from "@/lib/i18n/MessagesBoundary";
import { getT } from "@/lib/i18n/server";
import "@/app/globals.css";

/** ฟอนต์หลักไทย/ลatin — โหลด self-host ผ่าน next/font จาก Google Fonts */
const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500"],
  display: "optional", // ลด CLS — ไม่ swap font หลัง paint (จาก 'swap')
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return LOCALES.map((code) => ({ lang: code }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT("meta");
  return {
    applicationName: "Cosmicbet",
    title: t("title"),
    description: t("description"),
    appleWebApp: { capable: true, title: "Cosmicbet", statusBarStyle: "black-translucent" },
    icons: { apple: "/pwa/apple-touch-icon.png" },
  };
}

export const viewport: Viewport = {
  themeColor: "#141416",
};

/**
 * RootLayout ต่อภาษา — กำหนด lang, ฟอนต์ตามภาษา, Dark Theme และ dictionary ชุดพื้นฐานของ shell
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${notoSansThai.variable} ${geistMono.variable} ${localeFontClass(locale)} dark cosmic-page cosmic-bg h-full antialiased`}
    >
      <body className="flex min-h-dvh min-w-0 flex-col text-[var(--text-primary)]">
        <MessagesBoundary namespaces={["common", "nav", "auth", "errors"]}>
          <AppProviders>
            <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
              <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
              <CosmicFooterGate />
            </div>
          </AppProviders>
        </MessagesBoundary>
      </body>
    </html>
  );
}
```

แล้ว `git rm app/layout.tsx`

- [ ] **Step 5: global 404** — `next.config.ts` เพิ่ม `experimental: { globalNotFound: true }` ใน `nextConfig`; สร้าง `app/global-not-found.tsx` ที่ import `./globals.css` + `Noto_Sans_Thai` เอง, `<html lang="th" className="dark cosmic-page cosmic-bg">`, ข้อความ 2 ภาษา (ไทย/อังกฤษ) + ลิงก์ `<a href="/">` (ใช้ `<a>` เพราะอยู่นอก `[lang]` — proxy พาไปภาษาที่ถูกเอง)

- [ ] **Step 6: Service worker offline ต่อภาษา**

`app/serwist/[path]/route.ts`:

```ts
import { LOCALES } from "@/lib/i18n/config";
// ...
  additionalPrecacheEntries: LOCALES.map((code) => ({ url: `/${code}/offline`, revision })),
```

`app/sw.ts` — แทน `fallbacks.entries` เดิม:

```ts
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";
// ...
/** entry แรกที่ match ชนะ — ภาษาอื่นเทียบ prefix ก่อน แล้ว th รับทุก document ที่เหลือ */
const offlineFallbacks = [
  ...LOCALES.filter((code) => code !== DEFAULT_LOCALE).map((code) => ({
    url: `/${code}/offline`,
    matcher({ request }: { request: Request }) {
      const { pathname } = new URL(request.url);
      return request.destination === "document" && (pathname === `/${code}` || pathname.startsWith(`/${code}/`));
    },
  })),
  {
    url: `/${DEFAULT_LOCALE}/offline`,
    matcher({ request }: { request: Request }) {
      return request.destination === "document";
    },
  },
];
// ...
  fallbacks: { entries: offlineFallbacks },
```

> ตรวจ `sw.ts` bundle ได้ด้วย esbuild (import `@/lib/i18n/config` ต้อง resolve ได้) — ถ้า alias `@/` ไม่ทำงานใน swSrc ให้ใช้ relative `../lib/i18n/config`

---

### Task 1.7: เปลี่ยน import navigation ทั้งโปรเจกต์ + ESLint guard

**Files:**
- Create: `scripts/i18n-swap-imports.mjs`
- Modify: ~41 ไฟล์ที่ import `next/link`, ~30 ไฟล์ที่ใช้ `useRouter`/`usePathname`/`redirect`/`permanentRedirect`
- Modify: `app/[lang]/profile/page.tsx`, `activities/page.tsx`, `loss-rebate/page.tsx`, `reward/exchange-money/page.tsx`, `casino/[provider]/page.tsx`
- Modify: `eslint.config.mjs`

- [ ] **Step 1: codemod** `scripts/i18n-swap-imports.mjs` — สำหรับทุก `.ts/.tsx` ใน `app/`, `components/`, `lib/` (ยกเว้น `lib/i18n/` และ `app/api/`):
  - `import Link from "next/link"` → `import Link from "@/lib/i18n/navigation"`
  - ใน `import { … } from "next/navigation"` แยก `useRouter`, `usePathname` ออกไปเป็น `import { useRouter, usePathname } from "@/lib/i18n/navigation"`; ตัวอื่น (`useSearchParams`, `useParams`, `notFound`) คงไว้; ถ้าไม่เหลือให้ลบบรรทัด
  - ไม่แตะ `redirect`/`permanentRedirect` (แก้มือใน Step 2 เพราะต้องเปลี่ยนเป็น async)
  - พิมพ์รายชื่อไฟล์ที่แก้

```bash
node scripts/i18n-swap-imports.mjs
```

- [ ] **Step 2: redirect ฝั่ง server (6 จุด)** — ทำ page เป็น `async` แล้วใช้ `await localizedRedirect(...)` / `await localizedPermanentRedirect(...)` จาก `@/lib/i18n/server` เช่น

```tsx
import { localizedRedirect } from "@/lib/i18n/server";

/**
 * โปรไฟล์ hub อยู่ใน popover — หน้า /profile ยัง redirect lobby
 */
export default async function ProfilePage() {
  await localizedRedirect("/");
}
```

  `casino/[provider]/page.tsx` มี 2 จุดใน component เดียว — เปลี่ยนทั้งสอง

- [ ] **Step 3: ตรวจจุดที่ codemod ไม่ครอบ**

```bash
grep -rnE "from \"next/link\"|(useRouter|usePathname|redirect|permanentRedirect)[^\n]*from \"next/navigation\"" app components lib --include=*.ts --include=*.tsx | grep -v "^lib/i18n/"
grep -rnE "window\.location\.(href|assign|replace)|<a [^>]*href=\"/" app components lib --include=*.tsx --include=*.ts
```

  ผลแรกต้องว่าง; ผลที่สองแก้ให้ผ่าน `withLocale` (ตอนเขียน plan มีแค่ `lib/domain/referral.ts` ที่ใช้ `window.location.origin` — ไม่ต้องแก้)

- [ ] **Step 4: ESLint guard** — ใน `eslint.config.mjs` เพิ่มหลัง `...nextTs`:

```js
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["lib/i18n/**", "app/api/**", "app/global-not-found.tsx"],
    rules: {
      "no-restricted-imports": ["error", {
        paths: [
          { name: "next/link", message: "ใช้ Link จาก @/lib/i18n/navigation (เติม prefix ภาษาให้)" },
          {
            name: "next/navigation",
            importNames: ["useRouter", "usePathname", "redirect", "permanentRedirect"],
            message: "ใช้ตัวจาก @/lib/i18n/navigation หรือ @/lib/i18n/server",
          },
        ],
      }],
    },
  },
```

- [ ] **Step 5: Gate** — `pnpm next typegen && pnpm typecheck && pnpm test && pnpm build`; ใน build output ต้องเห็น route `/[lang]/...` และ `ƒ Proxy`

- [ ] **Step 6: ให้ทีมกดทดสอบ** (ไม่ใช้ browser automation)
  - `/` แสดงไทยโดย URL ไม่เปลี่ยน; `/th/vip` → `/vip`; ตั้ง cookie `NEXT_LOCALE=en` แล้วเปิด `/vip` → `/en/vip` → `/en?layer=login` (ยังไม่ login)
  - เมนู, bottom nav, หมวดเกม: active state ถูกและลิงก์ภาษาไทยไม่มี prefix
  - `/en/casino` แสดงไทยเหมือนเดิม (ยังไม่แปล) แต่ลิงก์ภายในเป็น `/en/...`
  - `/xx/yy` → global 404
  - ออฟไลน์ (DevTools) → หน้า offline

- [ ] **Step 7: Commit** `feat(i18n): add locale routing, dictionaries and [lang] root layout`

---

# Phase 2 — Format ตามภาษา

### Task 2.1: `lib/format.ts` รับ locale

**Files:**
- Modify: `lib/format.ts`, `lib/format.test.ts`
- Modify: ตัวเรียกที่ส่งหน่วยเป็นภาษาไทย (`"รายการ"`, `"คน"`, `"เครดิต"`, `"เพชร"`, `"ล้าน"`)

- [ ] **Step 1:** เปลี่ยน `NUMBER_LOCALE` เป็นพารามิเตอร์ที่มีค่าเริ่มต้น เพื่อให้ตัวเรียกเดิมไม่พัง

```ts
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

/** BCP 47 ที่บังคับเลขอารบิก — my / lo / km จะได้ไม่เป็นเลขพื้นเมือง */
export function numberLocale(locale: Locale = DEFAULT_LOCALE): string {
  return `${locale === "th" ? "th-TH" : locale}-u-nu-latn`;
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions, locale?: Locale): string {
  return new Intl.NumberFormat(numberLocale(locale), options).format(value);
}
```

  `formatMoney`, `formatBaht`, `formatPercent` รับ `locale?: Locale` ต่อท้ายและส่งต่อ; `formatDateTimeShort` คง `en-GB` (dd/mm/yyyy ปี ค.ศ.) ตามเดิมเพราะใช้ตรงกันทุกภาษา

- [ ] **Step 2: หน่วยภาษาไทยในชื่อฟังก์ชันโดเมน** (`formatReferralCount`, `formatLossRebateRecordCount`, `formatGemsCredits`, `formatCheckInCredits`, `formatActivityCredits`, `formatVipCompactAmount`) — **ไม่แปลใน `lib/format.ts`** ให้คืนเฉพาะตัวเลข แล้ว component ประกอบหน่วยด้วย `t("common.units.records", { count })` ตอนแปลโดเมนนั้นใน Phase 5; ระหว่างนี้คงฟังก์ชันเดิมไว้ (mark `@deprecated`)

- [ ] **Step 3: hook** — เพิ่มใน `lib/i18n/navigation.tsx` หรือไฟล์ใหม่ `lib/i18n/useFormat.ts`:

```ts
/** formatNumber / formatBaht ที่ผูกภาษาปัจจุบันไว้แล้ว */
export function useFormat() {
  const locale = useLocale();
  return useMemo(() => ({
    number: (v: number, o?: Intl.NumberFormatOptions) => formatNumber(v, o, locale),
    money: (v: number) => formatMoney(v, locale),
    baht: (v: number) => formatBaht(v, locale),
    percent: (v: number) => formatPercent(v, locale),
  }), [locale]);
}
```

- [ ] **Step 4: test** — เพิ่มใน `lib/format.test.ts`: `formatNumber(1234567, undefined, "my")` = `"1,234,567"` (ไม่ใช่เลขพม่า), `"km"`, `"lo"` ก็เป็นเลขอารบิก; `formatBaht(1234.5, "en")` มี `฿` หรือ `THB`; ค่าเดิมเมื่อไม่ส่ง locale ต้องเท่าเดิม (test เดิมผ่านทั้งหมด)

- [ ] **Step 5:** วันที่ใน `app/lib/transactionDateUtils.ts` และ `lotteryUtils.ts` ที่ใช้ `th-TH` / พ.ศ. — ส่ง locale เข้า และแสดงพ.ศ.เฉพาะ `th` (spec §6)

- [ ] **Step 6:** Gate + commit `feat(i18n): locale-aware number and date formatting`

---

# Phase 3 — ภาษาใน profile + ตัวสลับภาษา

### Task 3.1: `locale` ใน profile (server)

**Files:**
- Modify: `app/types/auth.ts`, `lib/auth/userStore.ts`, `app/api/auth/profile/route.ts`, `app/api/auth/login/route.ts`, `app/api/auth/register/route.ts`
- Create: `lib/i18n/cookie.ts`
- Modify: `lib/auth/client.ts`, `lib/api/profile.ts`

- [ ] **Step 1: types**
  - `StoredUser.locale?: Locale`
  - `ProfileUser.locale: Locale` (ไม่มี → `DEFAULT_LOCALE` ใน `toProfileUser`)
  - `SessionUser.locale: Locale` (ให้ client รู้หลัง login โดยไม่ต้องเรียก profile อีกรอบ)
  - `RegisterRequestBody.locale?: string`
  - `UpdateProfileLocaleRequest { locale: string }`

- [ ] **Step 2: `lib/i18n/cookie.ts`**

```ts
import type { NextResponse } from "next/server";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE_SEC, type Locale } from "./config";

/** ตั้ง cookie ภาษาใน response ของ route handler (login / register / PATCH profile) */
export function attachLocaleCookie(response: NextResponse, locale: Locale): void {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE_SEC,
    sameSite: "lax",
  });
}
```

- [ ] **Step 3: `lib/auth/userStore.ts`** — เพิ่ม `updateUserLocale(userId, locale)` (แบบเดียวกับ `updateUserAvatarPreset`: throw `USER_NOT_FOUND`), `createUser` รับ `locale`, `toSessionUser`/`toProfileUser` คืน `locale`; demo user (`lib/auth/demoUser.ts`) เก็บใน memory เหมือน avatar

- [ ] **Step 4: API**
  - `PATCH /api/auth/profile`: ถ้า body มี `locale` → validate `hasLocale` (ไม่ผ่าน → 400 `INVALID_LOCALE`) → `updateUserLocale` → `attachLocaleCookie`; ถ้ามี `avatarPresetId` ทำแบบเดิม (body มีอย่างใดอย่างหนึ่งหรือทั้งคู่ได้)
  - `POST /api/auth/login`: หลัง `attachSessionCookie` → `attachLocaleCookie(response, user.locale ?? DEFAULT_LOCALE)`
  - `POST /api/auth/register`: `locale` จาก body ผ่าน `hasLocale` ไม่งั้น `DEFAULT_LOCALE` → บันทึก + ตั้ง cookie
  - ข้อความ error ภาษาไทยใน route ยังไม่แปล (Phase 4 เปลี่ยนเป็น error code ให้ client แปล)

- [ ] **Step 5: client**
  - `lib/auth/client.ts` `registerUser` ส่ง `locale: document.documentElement.lang`
  - `lib/api/profile.ts` เพิ่ม `updateProfileLocale(locale)` → `PATCH /api/auth/profile`
  - `AuthProvider.login`: ถ้า `result.user.locale !== useLocale()` → `router.replace(withLocale(currentPath, result.user.locale))` (cookie ตั้งจาก server แล้ว)

- [ ] **Step 6: test** — `lib/auth/userStore` ไม่มี test เดิม; เพิ่ม test ระดับฟังก์ชัน pure: `toProfileUser` คืน `"th"` เมื่อไม่มี `locale`

### Task 3.2: ตัวสลับภาษา (UI)

**Files:**
- Create: `app/components/layout/LanguageSwitcher.tsx`
- Modify: เมนู slide-over (มือถือ), หน้า/hub profile, `app/components/layout/Header.tsx` (desktop)

- [ ] **Step 1: อ่าน `design.md` + skill `cosmicbet-frontend`** ก่อนทำ UI
- [ ] **Step 2:** `LanguageSwitcher` มี 2 variant
  - `variant="sheet"` (มือถือ): ใช้ `Sheet` ของ shadcn ที่มีอยู่ แสดงรายการ `LOCALES` ด้วย `LOCALE_LABELS[code].native` และเครื่องหมายถูกที่ภาษาปัจจุบัน
  - `variant="dropdown"` (desktop header): ปุ่มแสดง `short` + `DropdownMenu`
  - แต่ละรายการตั้ง `lang={code}` บน element เพื่อให้ฟอนต์/line-height ถูก (ชื่อภาษาลาว/พม่า/เขมรต้องแสดงได้แม้หน้าปัจจุบันเป็นไทย — เพิ่ม `localeFontClass(code)` ไม่ได้เพราะเป็น client; ให้ใช้ system font fallback ที่ `:lang()` และยอมรับว่าครั้งแรกอาจใช้ฟอนต์ระบบ)
  - onSelect: `useSwitchLocale()(code)` แล้วถ้า login อยู่ → `updateProfileLocale(code)` แบบ fire-and-forget (ล้มเหลวไม่ย้อน UI)
- [ ] **Step 3:** ข้อความของตัวสลับใช้ `useT("common")("language")`
- [ ] **Step 4:** ผ่าน skill `ui-qa-checklist` ที่ 360px
- [ ] **Step 5:** Gate + commit `feat(i18n): persist locale in profile and add language switcher`

---

# Phase 4 — แปล shell

### Task 4.1: Header, bottom nav, เมนู, auth dialogs, toast, error

**Files:** `app/components/layout/*`, `app/components/auth/*`, เมนู slide-over, toast helper, `app/[lang]/error.tsx`, `not-found.tsx`, `loading.tsx`

**Pattern ต่อ component:**
1. ย้ายข้อความไทยทุกจุดไปเป็น key ใน `th.json` ตาม namespace (`nav`, `auth`, `common`, `errors`)
2. เพิ่ม key เดียวกันใน `en.json` (แปลอังกฤษ)
3. Client component: `const t = useT("nav")`; Server component: `const t = await getT("nav")`
4. Data ที่มี label (`app/data/menuDialogIconAssets.ts`, รายการ bottom nav, หมวด lobby) → เพิ่ม `labelKey` แทน `label` ภาษาไทย แล้วแปลตอน render
5. Bottom nav ที่ภาษายาว: เพิ่ม key `nav.short.*` และใช้ `truncate` (spec §11)

**API error:** เปลี่ยน route ใน `app/api/auth/*` ให้คืน `error` เป็น code (`RATE_LIMITED`, `INVALID_CREDENTIALS`, `INVALID_INPUT`, …) และ client แปลผ่าน `errors.<code>`; ระหว่างเปลี่ยน client ต้องรองรับทั้งข้อความเดิมและ code (ถ้าไม่ใช่ code ที่รู้จักให้แสดงตามที่ได้รับ)

- [ ] **Step 1:** สแกนข้อความไทยที่เหลือใน shell:

```bash
grep -rnP "[\x{0E00}-\x{0E7F}]" app/components/layout app/components/auth --include=*.tsx | grep -v "^\s*//\|/\*\|\* "
```

- [ ] **Step 2:** แปลตาม pattern จนผลข้างบนเหลือแค่คอมเมนต์
- [ ] **Step 3:** `pnpm test` (messages parity ต้องผ่าน — en ครบ)
- [ ] **Step 4:** Gate + commit `feat(i18n): translate app shell`

---

# Phase 5 — แปลทีละโดเมน

ทำตามลำดับ แต่ละโดเมนเป็น task + commit แยก ใช้ pattern เดียวกับ Phase 4:

| Task | โดเมน | Namespace | ไฟล์หลัก | หมายเหตุ |
|------|-------|-----------|----------|---------|
| 5.1 | Home / lobby | `home` | `app/components/home/*`, `app/[lang]/(lobby)/*`, `lobbyAnnouncementMockData.ts` | ชื่อเกม/ค่ายไม่แปล |
| 5.2 | Lottery | `lottery` | `app/components/lottery/**`, `app/data/lottery*`, `yikiMockData.ts`, `thaiLottoMockData.ts` | ชื่อหวยและประเภทการแทงเป็น key + tooltip อธิบาย (spec §6); แสดงโซนเวลา Bangkok |
| 5.3 | Promotions | `promotions` | `app/components/promotions/*` | ข้อความ UI เท่านั้น — เนื้อหาโปรโมชันมาจาก backend (Phase 6) |
| 5.4 | Wallet | `wallet` | ฝาก/ถอน sheets, `formatDeposit*`/`formatWithdraw*` | |
| 5.5 | Profile / VIP / Transactions | `profile`, `vip`, `transactions` | `app/components/{profile,vip,transactions}/*` | หน่วยจาก `lib/format.ts` ย้ายเป็น `t()` (Task 2.1 Step 2) |
| 5.6 | Rewards / Missions / Wheel / Gems / Referral / Cashback | `rewards` | `app/components/{reward,missions,gems-store,referral,cashback}/*`, `wheel` | ลบฟังก์ชัน `@deprecated` ใน `lib/format.ts` เมื่อไม่มีผู้เรียก |

**แต่ละ task:**
- [ ] เพิ่ม `<MessagesBoundary namespaces={["<ns>"]}>` ใน layout ของ segment นั้น (สร้าง `layout.tsx` ถ้ายังไม่มี) — ถ้าเป็น hub modal ที่เปิดได้จากทุกหน้า ให้เพิ่ม namespace นั้นใน root layout แทน
- [ ] แปลข้อความไทย → key (`th.json` + `en.json`)
- [ ] สแกนด้วย grep แบบ Phase 4 Step 1 บนโฟลเดอร์ของโดเมน → เหลือแค่คอมเมนต์
- [ ] ส่ง `en.json` ส่วนที่เพิ่มให้ทีมแปล 7 ภาษา (spec §12)
- [ ] Gate + ทีมตรวจหน้าที่ 360px ด้วย `my` และ `km` (ใช้ภาษาจริงเมื่อได้ไฟล์แปล; ก่อนหน้านั้นตรวจด้วย `en`)
- [ ] Commit `feat(i18n): translate <domain>`

---

# Phase 6 — เนื้อหาจาก backend ตามภาษา

### Task 6.1: ส่งภาษาไปทุก request + แยก cache

**Files:**
- Modify: `lib/api/http.ts`, `app/hooks/useApi.ts`, `app/types/promotions.ts`
- Modify: `app/api/promotions/route.ts`, `app/api/promotions/[id]/route.ts`
- Modify: `app/components/promotions/PromotionsCatalogProvider.tsx`
- Modify: `lib/api/endpoints.ts` (เอกสารจุดเรียก)

- [ ] **Step 1: `apiFetch`** — ฝั่ง browser อ่าน `document.documentElement.lang` (ผ่าน `hasLocale`) แล้วใส่ทั้ง header `Accept-Language` และ query `lang` ในทุก request (backend จะใช้ตัวไหนก็ได้); ฝั่ง server ไม่ใส่อัตโนมัติ (ผู้เรียกส่ง `query.lang` เอง)
- [ ] **Step 2: `useApi`** — ต่อ `locale` ท้าย `swrKey` แบบเดียวกับ `userScope` เพื่อให้สลับภาษาแล้วโหลดใหม่ ไม่ใช้ cache ภาษาเก่า
- [ ] **Step 3: contract** — `app/types/promotions.ts` เพิ่ม

```ts
/** response ที่ backend resolve ภาษาให้แล้ว — lang = ภาษาที่ใช้จริง (อาจเป็น fallback) */
export interface LocalizedPayload<T> {
  lang: Locale;
  data: T;
}
```

  ห่อ `PromotionsCatalogResponse` และ detail ด้วย `LocalizedPayload`; แบนเนอร์ที่มีข้อความฝังมี `imageUrl` ตามภาษา (backend fallback เป็นรูป `th`)
- [ ] **Step 4: mock route** — `app/api/promotions/*` อ่าน `lang` จาก `searchParams` (ไม่ใช้ `next/root-params` เพราะ Route Handler ไม่รองรับ) → คืนข้อมูล `th`/`en` จาก mock ที่เพิ่มคำแปลอังกฤษ; ภาษาอื่น fallback ตาม `FALLBACK_CHAIN` แล้วตั้ง `lang` ให้ตรงกับที่ใช้จริง
- [ ] **Step 5:** ประกาศ lobby — ทำแบบเดียวกันเมื่อได้ endpoint จริง (spec §13 open question) ระหว่างนี้ mock ใน `lobbyAnnouncementMockData.ts` เป็น `Record<"th" | "en", …>`
- [ ] **Step 6: test** — `lib/api/http.test.ts`: request มี `lang` + `Accept-Language` เมื่อมี `document`; mock route คืน `lang: "th"` เมื่อขอ `km` แต่ไม่มีคำแปล km/en
- [ ] **Step 7:** Gate + commit `feat(i18n): request localized promotions from backend`

---

# Phase 7 — SEO, metadata, QA

### Task 7.1: Metadata + hreflang

**Files:** `app/[lang]/layout.tsx`, หน้าที่มี `metadata` ของตัวเอง

- [ ] `generateMetadata` ใน root layout เพิ่ม

```ts
alternates: {
  languages: {
    ...Object.fromEntries(LOCALES.map((code) => [code, `/${code}`])),
    "x-default": "/",
  },
},
openGraph: { locale: locale === "th" ? "th_TH" : locale },
```

  หน้าย่อยที่ต้อง SEO (casino, sport, lottery, promotions) ทำ `generateMetadata` ของตัวเองด้วย path เดียวกันทุกภาษา
- [ ] `metadataBase` จาก env (`NEXT_PUBLIC_SITE_URL`) เพื่อให้ hreflang เป็น absolute URL
- [ ] `manifest.ts` คงภาษาไทยค่าเดียว (spec §10) แต่ `start_url: "/"` ให้ proxy เลือกภาษา

### Task 7.2: QA รวม

- [ ] grep ข้อความไทยทั้ง `app/` (ยกเว้นคอมเมนต์และ `lib/i18n/messages/`) → ต้องเหลือ 0
- [ ] `messages.test.ts` log coverage — รายงานภาษาที่ยังไม่ครบให้ทีม
- [ ] ผ่าน skill `ui-qa-checklist` ทุกหน้าที่ 360px ใน `th`, `en`, `my`, `km`, `zh`
- [ ] อัปเดต `design.md` (§ Typography: font stack + `:lang()` line-height) และ rules คู่ `.cursor/` ↔ `agent/` (`frontend-components.mdc`: ห้ามฮาร์ดโค้ดข้อความ ใช้ `useT`/`getT`; ห้าม import `next/link`)
- [ ] อัปเดต spec status → Implemented
- [ ] Commit `docs(i18n): document i18n conventions`

---

## Self-review

- **Spec coverage:** §3 locales/fonts → 1.1, 1.6 · §4 routing → 1.1, 1.2, 1.6 · §5 dictionaries → 1.3, 1.4 · §6 format → 2.1 · §7 profile → 3.1 · §8 backend → 6.1 · §9 switcher → 3.2 · §10 SEO/PWA → 1.6 (offline), 7.1 · §11 layout risk → 1.6 Step 3, 4.1, 7.2 · §12 phases → ตรงกัน
- **ความต่างจาก spec:** ไม่ใช้ `@formatjs/intl-localematcher` + `negotiator` (เขียน `parseAcceptLanguage` เอง); messages เป็นไฟล์เดียวต่อภาษา (top-level = namespace) แทนโฟลเดอร์ต่อภาษา เพื่อให้ loader เป็น static import 9 ตัว
- **ความเสี่ยงหลัก:** Task 1.6–1.7 (ย้ายโครงสร้าง + codemod) — ป้องกันด้วย test guard ใน 1.1, ESLint guard ใน 1.7, และ build ต้องผ่านก่อน commit
