# จุดเรียก API แบบคืน mock ทันที — Design Spec

**Date:** 2026-10-01
**Status:** Approved (design confirm by PP)
**Scope:** Cosmicbet front-end — จุดเรียกข้อมูลให้ agent ต่อ backend ทีหลัง โดยหน้าตา รูป และข้อความ mock ไม่เปลี่ยน

## Goal

ให้ทุกชุดข้อมูลที่ backend จะเป็นคนส่ง มีฟังก์ชันเรียกใน `lib/api/` และมีแถวในแผนที่ endpoint คอมโพเนนต์เลิก import ค่า mock มาแสดงเอง ฟังก์ชันอ่านคืนค่าชุดเดิมทันที ฟังก์ชันส่งจำลองผลกดปุ่มแบบเดิม ยังไม่ยิง HTTP ใหม่

## Confirmed decisions

| Topic | Decision |
|-------|----------|
| รูปแบบจุดเรียก | ฟังก์ชันใน `lib/api/` คืน mock ทันที ไม่สร้าง route ใหม่ และไม่ตั้ง base URL ของ backend |
| หน้าตา | JSX class รูป และข้อความบนจอเหมือนเดิม ไม่มีสถานะโหลดหรือ skeleton ใหม่ |
| ต้นฉบับข้อมูล | ไฟล์ `app/data/*MockData.ts` และไฟล์ใน `public/` ยังอยู่ที่เดิม |
| การอ่าน | ฟังก์ชัน `fetch*` เป็น synchronous เรียกตอน render |
| การส่ง | ฟังก์ชัน `submit*` คืน `Promise` และหน่วงเวลาเท่าของเดิม ปุ่มยังขึ้นข้อความกำลังทำอยู่ |
| ของที่ยิง `/api/` อยู่แล้ว | ไม่ย้ายกลับมาเป็น mock |

## Architecture

สามชั้น

1. **ข้อมูล** — `app/data/*MockData.ts` เป็นต้นฉบับข้อความ ตัวเลข และ path รูป
2. **เรียก** — `lib/api/<domain>.ts` คืนค่าจากไฟล์ข้อมูลนั้น ไฟล์นี้เป็นจุดเดียวที่ agent แก้เมื่อต่อ backend
3. **แผนที่** — `lib/api/endpoints.ts` บอก method, path ในอนาคต, ต้องล็อกอินหรือไม่, ชื่อฟังก์ชัน และไฟล์ mock

หัวไฟล์ `endpoints.ts` เขียนกติกาให้ agent ดังนี้

- ต่อ backend โดยแก้เฉพาะข้างในฟังก์ชันใน `lib/api/`
- ชนิดข้อมูลที่คืนต้องตรงกับตอนนี้
- path รูปต้องมากับข้อมูลที่คืน ไม่ hardcode ใน JSX เพิ่ม
- ห้ามใส่หน้าโหลดในรอบที่เปลี่ยนจาก mock เป็น HTTP ถ้ายังไม่ได้ตกลงเรื่องเฟรมแรกแยกต่างหาก
- ปุ่มนำทาง ไอคอนเมนู และข้อความโครงหน้าไม่ใช่ endpoint

## What is a call point

หุ้มเฉพาะข้อมูลที่เซิร์ฟเวอร์จะส่ง เช่น รายการ ยอด สถานะผู้ใช้ ประวัติ และผลกดยืนยัน

ไม่หุ้มสิ่งต่อไปนี้

- โครงนำทาง: `BOTTOM_NAV_DATA`, `CATEGORIES_DATA`, `HEADER_DESKTOP_NAV`, `DESKTOP_RIGHT_MENU_TILES`, `MENU_DIALOG_SECTIONS`
- ไอคอนและ asset helper: `menuIconAssets`, `lotteryIconAssets`, `getMenuIconSrc`
- ฟังก์ชันจัดรูปแบบที่รับตัวเลขแล้วคืนสตริง เช่น `formatDepositAmount` ยังอยู่ที่ `app/data/`
- type ของ TypeScript ยัง import จากไฟล์เดิมได้
- ฟุตเตอร์และลิงก์คงที่ใน `footerMockData.ts`

## How components call

จุดที่วันนี้ import ค่า mock มาวาดเอง ให้เปลี่ยนมาเรียก `lib/api/` ชิ้นที่รับค่าทาง props อยู่แล้วไม่เรียก API เอง

การอ่านอยู่ตรงในตัวคอมโพเนนต์ ไม่ใช้ `useEffect` และไม่เก็บ payload ลง state เพื่อโชว์โหลด

```tsx
const methods = fetchDepositMethods();
```

JSX ใช้ฟิลด์เดิม รวม `src` ของรูป

การตรวจช่องกรอกใน `lib/fieldInput.ts` ยังอยู่ที่ฟอร์ม ก่อนเรียก `submit*`

## Reads and writes

ฟังก์ชันอ่านคืนค่าทันทีและไม่ throw

ฟังก์ชันส่งคืนอย่างใดอย่างหนึ่ง

- `{ ok: true }`
- `{ ok: false, error: string }`

ข้อความ `error` และข้อความสำเร็จที่ใช้บนจอต้องเป็นประโยคที่ UI ใช้อยู่แล้ว

| การกด | ฟังก์ชัน | พฤติกรรมที่คงไว้ |
|--------|----------|------------------|
| ยืนยันฝาก | `submitDeposit` | หน่วง 500ms แล้วให้แผงปิดแบบเดิม |
| ยืนยันถอน | `submitWithdraw` | หน่วง 500ms แล้วให้แผงปิดแบบเดิม |
| แลกคูปอง | `submitCoupon` | หน่วง 600ms สำเร็จเฉพาะโค้ด `COSMIC100`, `FREEGEMS`, `WELCOME50` นอกนั้นใช้ข้อความรหัสไม่ถูกต้องชุดเดิม |

ยอดฝากหรือถอนที่ฟอร์มปฏิเสธอยู่แล้ว (ยอดไม่มากกว่า 0 หรือถอนเกินยอด) ยังไม่เรียก `submit*`

## Left on existing HTTP

ไม่เปลี่ยนการเรียกเหล่านี้

| Client | Path |
|--------|------|
| `lib/auth/client.ts` | `/api/auth/session`, `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/profile` |
| `PromotionsCatalogProvider` | `/api/promotions`, `/api/promotions/[id]` |
| `lib/lottery/submitBetSlip.ts` | `POST /api/lottery/bets` |
| `lib/lottery/fetchLotterySlip.ts` | `GET /api/lottery/slips`, `GET /api/lottery/slips/[slipId]` |

แผนที่ endpoint อ้าง path เหล่านี้ได้ แต่ไม่มีฟังก์ชัน mock ซ้อน

## Endpoint map

path ด้านล่างคือสัญญาในอนาคต รอบนี้ฟังก์ชันยังไม่ `fetch` path นั้น

### แผงเงินและคูปอง

| Function | Method | Future path | Auth | Mock source |
|----------|--------|-------------|------|-------------|
| `fetchDepositMethods` | GET | `/api/deposit/methods` | yes | `DEPOSIT_METHOD_OPTIONS` |
| `fetchDepositBankAccount` | GET | `/api/deposit/bank-account` | yes | `DEPOSIT_BANK_ACCOUNT_MOCK` |
| `fetchDepositQuickAmounts` | GET | `/api/deposit/quick-amounts` | yes | `{ amounts: DEPOSIT_QUICK_AMOUNTS, defaultAmount: DEPOSIT_DEFAULT_AMOUNT }` |
| `submitDeposit` | POST | `/api/deposit` | yes | รับ `{ amount, methodId }` แล้วคืน `{ ok: true }` หลัง 500ms ชื่อไฟล์สลิปยังอยู่แค่ในแผง ไม่ส่งเข้าฟังก์ชัน |
| `fetchWithdrawAccount` | GET | `/api/withdraw/account` | yes | `WITHDRAW_USER_BANK_MOCK` |
| `fetchWithdrawBalance` | GET | `/api/withdraw/balance` | yes | `WITHDRAW_AVAILABLE_BALANCE` |
| `fetchWithdrawQuickAmounts` | GET | `/api/withdraw/quick-amounts` | yes | `{ amounts: WITHDRAW_QUICK_AMOUNTS, defaultAmount: WITHDRAW_DEFAULT_AMOUNT }` |
| `submitWithdraw` | POST | `/api/withdraw` | yes | รับ `{ amount }` แล้วคืน `{ ok: true }` หลัง 500ms |
| `submitCoupon` | POST | `/api/coupons/redeem` | yes | โค้ด mock สามตัวในแผงคูปอง |

### โซนสมาชิก

| Function | Method | Future path | Auth | Mock source |
|----------|--------|-------------|------|-------------|
| `fetchVipPlayer` | GET | `/api/vip/player` | yes | `VIP_PLAYER_MOCK` |
| `fetchVipRanks` | GET | `/api/vip/ranks` | no | `{ tiers: VIP_RANK_TIERS, videos: VIP_RANK_VIDEO }` |
| `fetchVipBenefits` | GET | `/api/vip/benefits` | no | ตารางเปรียบเทียบสิทธิ |
| `fetchReferralOverview` | GET | `/api/referral/overview` | yes | โค้ด `COSMIC88`, สถิติ, ขั้นคอมมิชชัน, ขั้นตอน |
| `fetchReferralUsers` | GET | `/api/referral/users` | yes | `REFERRAL_USERS_MOCK` |
| `fetchReferralEarnings` | GET | `/api/referral/earnings` | yes | สรุปและประวัติรายได้ |
| `fetchCashbackPanels` | GET | `/api/cashback` | yes | แผงคืนยอดเล่นและคืนยอดเสีย |
| `fetchLossRebate` | GET | `/api/cashback/loss-rebate` | yes | `lossRebateMockData` |
| `fetchCheckIn` | GET | `/api/missions/check-in` | yes | วันเช็คอิน, ไมล์สโตน, เงื่อนไข |
| `fetchGemsStore` | GET | `/api/gems-store` | yes | ยอดแพ็กเกจ โควต้า เงื่อนไข และ path รูปเพชร |
| `fetchWheel` | GET | `/api/wheel` | yes | ช่องรางวัล ผู้ชนะ ประวัติ และกระเป๋าหมุน |
| `fetchTransactions` | GET | `/api/transactions` | yes | รายการฝาก ถอน โปรโมชัน เดิมพัน |
| `fetchPendingTransaction` | GET | `/api/transactions/pending` | yes | payload ฝากหรือถอนที่กำลังรอ |
| `fetchActivities` | GET | `/api/activities` | no | `ACTIVITIES_HUB_ITEMS` |
| `fetchProfileHubStats` | GET | `/api/profile/hub-stats` | yes | `PROFILE_HUB_STATS_MOCK` |
| `fetchWalletBalance` | GET | `/api/wallet/balance` | yes | `MOCK_MAIN_WALLET_BALANCE` และไอคอนกระเป๋า |
| `fetchSignUpOptions` | GET | `/api/auth/sign-up-options` | no | รายการธนาคารและช่องทางรู้จัก |
| `fetchMenuTicketCount` | GET | `/api/menu/ticket-count` | yes | `MENU_DIALOG_TICKET_COUNT_MOCK` |

`fetchVipRanks` รวม URL วิดีโอจาก `VIP_RANK_VIDEO` ฟังก์ชันคำนวณแรงค์ที่รับค่าจาก state ผู้เล่น เช่น `getVipRankViewStatus` ยังอยู่ที่ `vipMockData.ts`

### ล็อบบี้

| Function | Method | Future path | Auth | Mock source |
|----------|--------|-------------|------|-------------|
| `fetchHomeBanners` | GET | `/api/lobby/banners` | no | สไลด์ต้อนรับ โปรโมคารูเซล peek และแบนเนอร์หลัก |
| `fetchHomeHighlights` | GET | `/api/lobby/highlights` | no | `POPULAR_HIGHLIGHTS_DATA`, `INTRO_STATS_DATA` |
| `fetchHomeGames` | GET | `/api/lobby/games` | no | `GAME_SECTIONS_DATA`, สล็อตในหน้าแรก |
| `fetchHomeProviders` | GET | `/api/lobby/providers` | no | `PROVIDERS_DATA` |
| `fetchHomeFeatureActions` | GET | `/api/lobby/feature-actions` | no | `FEATURE_ACTIONS_DATA` |
| `fetchHomeTournaments` | GET | `/api/lobby/tournaments` | no | รายการทัวร์นาเมนต์และ path รูป |
| `fetchLobbyAnnouncements` | GET | `/api/lobby/announcements` | no | `LOBBY_ANNOUNCEMENT_MESSAGES` |
| `fetchHallOfFame` | GET | `/api/lobby/hall-of-fame` | no | `HALL_OF_FAME_DATA` |
| `fetchDesktopPlayerPanel` | GET | `/api/lobby/desktop-player` | yes | `DESKTOP_PLAYER_PANEL_MOCK` |

### หวยที่ยังเป็น mock

| Function | Method | Future path | Auth | Mock source |
|----------|--------|-------------|------|-------------|
| `fetchLotteryCatalog` | GET | `/api/lottery/catalog` | no | `LOTTERY_CATALOG_ENTRIES` |
| `fetchLotteryHub` | GET | `/api/lottery/hub` | no | รายการเด่น กริด และผลล่าสุด |
| `fetchLotteryMarkets` | GET | `/api/lottery/markets` | no | `LOTTERY_MARKETS` |
| `fetchLotteryPlayRounds` | GET | `/api/lottery/markets/:slug/rounds` | no | `getLotteryPlayRounds` |
| `fetchYikiBoard` | GET | `/api/lottery/yiki/board` | no | ชนิดแทงและกลุ่มตัวเลขยี่กี |
| `fetchThaiLottoBoard` | GET | `/api/lottery/thai/board` | no | ชนิดแทงและผลล่าสุดหวยไทย |

การสุ่มรอบจากเวลาปัจจุบันยังทำในฟังก์ชัน mock เดิม ฟังก์ชันเรียกส่งต่ออาร์กิวเมนต์เดิม ไม่เปลี่ยนจำนวนรอบที่โชว์

## Modules

| File | หน้าที่ |
|------|--------|
| `lib/api/endpoints.ts` | แผนที่อย่างเดียว ไม่คืนข้อมูล |
| `lib/api/deposit.ts` | อ่านและส่งฝาก |
| `lib/api/withdraw.ts` | อ่านและส่งถอน |
| `lib/api/coupon.ts` | ส่งแลกคูปอง |
| `lib/api/vip.ts` | แรงค์ ผู้เล่น ตารางสิทธิ |
| `lib/api/referral.ts` | ภาพรวม รายชื่อผู้ถูกชวน รายได้ |
| `lib/api/cashback.ts` | แผงคืนยอดและคืนยอดเสีย |
| `lib/api/checkIn.ts` | เช็คอินรายวัน |
| `lib/api/gemsStore.ts` | ร้าน Gems |
| `lib/api/wheel.ts` | วงล้อ |
| `lib/api/transactions.ts` | ประวัติและรายการที่รอ |
| `lib/api/activities.ts` | กิจกรรม |
| `lib/api/profile.ts` | สถิติฮับโปรไฟล์ กระเป๋า ตัวเลือกสมัคร จำนวนตั๋วเมนู |
| `lib/api/lobby.ts` | แบนเนอร์ เกม ค่าย ทัวร์นาเมนต์ ประกาศ Hall of Fame แผงผู้เล่นเดสก์ท็อป |
| `lib/api/lotteryContent.ts` | แคตตาล็อก ฮับ ตลาด รอบ กระดานยี่กีและหวยไทย |

## Implementation order

1. สร้าง `endpoints.ts` ให้ครบทุกแถวในสเปกนี้ และสร้างฟังก์ชันให้คืน mock ได้
2. สลับจุดเรียกของฝาก ถอน และคูปอง
3. สลับโซนสมาชิก
4. สลับล็อบบี้
5. สลับหวยที่ยังอ่าน mock ตรง ๆ

แต่ละขั้นต้องเปิดหน้าที่แตะแล้วยังเห็นรูปและข้อความชุดเดิม

## Error handling

- การอ่านไม่ throw และไม่คืน `null` แทนลิสต์ที่วันนี้เป็นอาร์เรย์ว่างอยู่แล้ว เช่น ธุรกรรมโปรโมชัน
- `submitCoupon` ที่โค้ดไม่ใช่สามตัวด้านบนคืน `{ ok: false, error: "รหัสคูปองไม่ถูกต้องหรือหมดอายุแล้ว" }`
- `submitCoupon` ที่ผ่านคืน `{ ok: true, message: "แลกเครดิตฟรีสำเร็จ — ยอดจะเข้ากระเป๋าในไม่กี่นาที (mock)" }`
- ฝากและถอนที่ผ่านเงื่อนไขฟอร์มแล้วคืน `{ ok: true }` หลังครบเวลาหน่วง ไม่เพิ่มข้อความผิดพลาดใหม่

## Testing

- ฟังก์ชันอ่านคืนค่าเดียวกับ export ของ mock ที่อ้างในตาราง (เทียบความเท่าของค่า ไม่ใช่แค่ชนิด)
- เปิดแผงฝาก ถอน และแลกคูปอง: รูป ยอดด่วน ปุ่มกำลังทำ และข้อความสำเร็จหรือรหัสผิดยังเหมือนก่อนย้าย
- หน้าแรก ฮับสมาชิก และหน้าหวยที่สลับแล้วไม่มีจอว่างคั่นก่อนข้อมูลโผล่
- `pnpm exec tsc --noEmit` ผ่าน

## Out of scope

- สร้าง `app/api/` route ใหม่สำหรับโดเมนในแผนที่
- เรียก backend จริงหรือใส่ `NEXT_PUBLIC_API_URL`
- เปลี่ยนรูป ข้อความ mock หรือระยะหน่วงของปุ่ม
- หุ้มเมนูนำทาง ไอคอน และฟุตเตอร์
- ย้ายล็อกอิน สมัครสมาชิก โปรโมชัน และการส่งโพยออกจาก `/api/` ที่มีอยู่
