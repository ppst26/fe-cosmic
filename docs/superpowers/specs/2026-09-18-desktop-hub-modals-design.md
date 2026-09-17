# Desktop Hub Modals — Design Spec

**Date:** 2026-09-18  
**Status:** Approved (design confirm by PP)  
**Scope:** Cosmicbet lobby — desktop (lg+) only

## Goal

Replace full-page navigation for selected “hub” features on desktop with a centered modal dialog over the lobby. Mobile (`< lg`) keeps existing full routes, Header, and FloatingBottomNav unchanged.

## Confirmed decisions

| Topic | Decision |
|-------|----------|
| Mobile | Full page + existing routes (Option A) |
| Desktop breakpoint | `lg` (1024px), aligned with lobby desktop shell |
| Deep links (Phase 1) | Direct URL (e.g. `/promotions`) still renders full page on desktop |
| Deep links (Phase 2) | Optional later: `/?hub=promotions` or intercepting routes — out of scope v1 |
| Theme | Reuse Radix Dialog, overlay, and `cosmic-modal-shell` tokens from VIP modal |

## Hub modal registry (v1)

| `DesktopHubId` | Route (mobile) | Body component | Modal title |
|----------------|----------------|----------------|-------------|
| `promotions` | `/promotions` | `PromotionsHubPageContent` | Promotions |
| `cashback` | `/cashback` | `CashbackPageContent` | คืนยอด |
| `gems-store` | `/gems-store` | `GemsStorePageContent` | ร้านค้า Gems |
| `account` | `/profile/account` | `ProfileSheetBody` (+ profile fetch) | ข้อมูลบัญชี |
| `referral` | `/referral` | `ReferralPageContent` | ชวนเพื่อน |

**Out of scope v1:** `/transactions`, `/wheel`, `/missions`, game category routes (`/slots`, `/casino`, `/sport`, `/fishing`), VIP (already modal).

### Cashback tab query

- Mobile: `?tab=loss` via URL unchanged.
- Desktop open from profile “คืนยอดเสีย”: pass initial tab `loss` into provider state when opening `cashback` hub modal.
- Sidebar/menu link to `/cashback`: default tab (play) unless specified.

## Architecture (recommended approach: Hub Modal Provider)

Single provider pattern (extends existing `VipModalProvider` convention):

```
AppProviders
  └── DesktopHubModalProvider
        ├── children (app)
        └── DesktopHubModal (portal, one active hub at a time)
```

### Public API

```ts
type DesktopHubId = "promotions" | "cashback" | "gems-store" | "account" | "referral";

interface OpenHubOptions {
  cashbackTab?: "play" | "loss";
}

openHub(id: DesktopHubId, options?: OpenHubOptions): void;
closeHub(): void;
```

Hook: `useDesktopHubModal()`.

### Route → hub mapping

Central map in `hubModalRegistry.ts` (or co-located):

- `/promotions` → `promotions`
- `/cashback` → `cashback`
- `/gems-store` → `gems-store`
- `/profile/account` → `account`
- `/referral` → `referral`

Helper: `hrefToHubId(href: string): DesktopHubId | null` (strip query for match; parse `tab` separately for cashback).

## UI shell (`DesktopHubModal`)

- **Overlay:** `fixed inset-0 z-[65] bg-black/75` (match VIP).
- **Content:** centered, `z-[70]`, flex column, overflow hidden on shell, scroll on body.
- **Size:** `w-[min(92vw,720px)]`, `max-h-[min(90dvh,800px)]`.
- **Surface:** `bg-[var(--surface-mid)]`, `rounded-[var(--radius-panel)]`, shadow consistent with VIP.
- **Chrome:**
  - Header row: `Dialog.Title` (hub title) + close button (`CloseIcon`, accessible label).
  - Body: `overflow-y-auto` padding `px-[var(--page-gutter)] pb-4`.
- **Excluded from modal body:** lobby `Header`, `FloatingBottomNav`, `SlotProvidersHeader`, page-level back rows (close button replaces back).

### CSS

- Prefer modifier class e.g. `.cosmic-modal-shell--hub` on content for width override without breaking VIP `max-w-[400px]`.

## Navigation (`HubNavLink`)

Props: `href`, `children`, optional `className`, optional `openOptions` for cashback tab.

Behavior:

1. Render as Next.js `Link` with given `href`.
2. On click: if `window.matchMedia("(min-width: 1024px)")` matches (or Tailwind `lg` via hook `useIsDesktop()`):
   - `preventDefault()`
   - `openHub(mappedId, options)`
3. Else: default navigation.

Use `useIsDesktop` hook (matchMedia + listener) to avoid hydration mismatch on first paint — link works without JS; enhancement on client.

## Integration points (v1)

| Location | Change |
|----------|--------|
| `app/providers.tsx` | Wrap with `DesktopHubModalProvider` |
| `app/components/layout/Header.tsx` | Promotions link → `HubNavLink` |
| `app/components/layout/LobbyDesktopSidebar.tsx` | Menu tiles with `href` in registry → `HubNavLink` |
| `app/components/layout/LobbyDesktopRightRail.tsx` | Cashback / gems links → `HubNavLink` |
| `app/data/menuMockData.ts` | No data change required if sidebar uses `HubNavLink` for href tiles |
| `app/components/auth/ProfileSlideOverCard.tsx` | Desktop: account + loss rebate → `openHub` instead of `router.push` |
| `app/data/desktopLobbyMockData.ts` | Consumers via rail/sidebar links |

Mobile menu (`RightMenuDrawer`) can stay `Link` (mobile-only drawer) or use `HubNavLink` safely (same behavior on small screens).

## Account modal auth

- Opening `account` on desktop when not authenticated: close hub and trigger login flow (reuse `AuthProvider` / open login drawer) OR show inline message in modal — **v1:** redirect behavior mirrors page: if not logged in, close modal and open login drawer (no full navigation to `/profile/account` on desktop).

- Profile fetch: same as `ProfileAccountPage` — load on open, loading state in body.

## Content component constraints

- `*PageContent` components must not assume page shell. Already mostly true; verify:
  - `CashbackPageContent` accepts optional `initialTab` prop (add if missing).
  - `ReferralPageContent` / `GemsStorePageContent` / `PromotionsHubPageContent` — no duplicate page titles if modal header shows title (hide duplicate h1 in modal context via prop `variant="embedded"` optional — prefer single title in modal chrome only).

## Accessibility

- Radix Dialog: focus trap, Escape to close, `Dialog.Title` per hub.
- Return focus to trigger on close (Radix default).

## Error handling

- Unknown hub id: no-op in provider.
- Failed profile fetch: show error/empty state inside modal body (reuse page patterns).

## Testing (manual QA)

- [ ] Mobile: each route still full page with bottom nav.
- [ ] Desktop lobby: each link opens modal, lobby visible under overlay, scroll works inside modal.
- [ ] Close: X, overlay click (if enabled — match VIP), Escape.
- [ ] Profile popover → account / loss rebate on desktop opens correct hub.
- [ ] Direct `/promotions` on desktop width: still full page (Phase 1).
- [ ] No regression: VIP modal, deposit/withdraw sheets, coupon sheet.

## Implementation plan

After this spec is reviewed, invoke **writing-plans** skill for phased tasks (provider + shell → registry content → HubNavLink → integration → QA).

## Self-review (2026-09-18)

- No TBD placeholders in scope table.
- Phase 1 deep link explicitly documented; no contradiction with mobile full-page rule.
- Account auth edge case specified for v1.
- Scope bounded to five hubs; game routes explicitly excluded.
