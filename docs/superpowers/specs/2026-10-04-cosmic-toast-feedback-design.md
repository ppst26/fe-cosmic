# Cosmic Toast — แจ้งเตือนลอย (ไม่แทรก layout ฟอร์ม)

**Date:** 2026-10-04  
**Status:** Approved (PP เลือก Toast ลอย)  
**Scope:** Cosmicbet front-end — ข้อความ validation / API error / success ชั่วคราว

## Goal

แทนที่แถบ `role="alert"` ในฟอร์ม (ที่ดัน layout) ด้วย **toast ลอย** ที่ไม่กินพื้นที่ใน sheet/dialog ผู้ใช้ยังอ่านข้อความเดิมได้ชัด ไม่เพิ่ม UI library ใหม่

## Out of scope

- **CosmicConfirmDialog** — ยืนยันก่อนทำ (เช่น ออกจากระบบ) ยังเป็น modal ตามเดิม
- **Field-level `aria-invalid`** บน input — ทำในรอบถัดไปถ้าต้องการ (ไม่บังคับในรอบนี้)
- **Browser `alert()`** — ไม่ใช้ในโปรเจกต์อยู่แล้ว

## Confirmed decisions

| Topic | Decision |
|-------|----------|
| รูปแบบ | Toast ลอย มุมบนกลางจอ (`fixed`, ไม่แตะ layout ฟอร์ม) |
| API | `useToast()` จาก `context/ToastContext.tsx` → `showToast(message, variant?, durationMs?)` |
| Variants | `success` · `error` · `info` |
| Stack | สูงสุด 3 รายการล่าสุด, auto-dismiss ค่าเริ่มต้น 4000ms |
| z-index | `z-[250]` — สูงกว่า sheet auth (`z-[60]`) |
| Provider | `ToastProvider` ใน `app/providers.tsx` (มีแล้ว) |

## Architecture

```
AppProviders
  ToastProvider          ← state + ToastHost (portal-like fixed layer)
    …children…
    ToastHost            ← render ท้าย provider, ไม่ใช่ child ของฟอร์ม

Feature (Login / SignUp / Coupon / …)
  const { showToast } = useToast()
  on fail → showToast(msg, "error")
  on success → showToast(msg, "success")  (ถ้ามี)
```

- ฟอร์ม **ไม่เก็บ** `error` state สำหรับแสดงแถบในฟอร์ม
- ข้อความ error ใช้ประโยคเดิมจาก validation / API (`RegisterRequestBody` flow)

## Styling (ธีม Cosmicbet)

รอบ implement ถัดไป:

- ย้ายสีจาก Tailwind `emerald-*` / `red-*` ไป **semantic tokens** (`--success`, `--destructive`, `--vip-panel-bg`, `--text-primary`) ใน `app/styles/toast.css` หรือชั้นเดียวใน `ToastContext` host
- น้ำหนักตัวอักษร **ไม่เกิน `font-medium` (500)** ตาม typography rule
- ไม่ใช้ blur/glass เป็นภาษาหลัก — solid fill + border subtle

## Migration map

| พื้นที่ | สถานะ | หมายเหตุ |
|--------|--------|----------|
| `LoginBottomDrawer` | ✅ Toast | ลบ inline alert แล้ว |
| `SignUpBottomDrawer` | ✅ Toast | ลบ inline alert แล้ว |
| `CouponRedeemBottomSheet` | ✅ Toast | ลบ inline alert แล้ว |
| `PromotionsHubPageContent` | ⏳ | ยังแสดง `{error}` กลางหน้า |
| `PromotionsCatalogProvider` | ⏳ | `setError` โหลด catalog ไม่สำเร็จ |
| หวย `thai-lotto-feedback` | 📋 ทางเลือก | inline `aria-live` — เก็บหรือย้าย toast ตาม UX การเดิมพัน |
| ฝาก/ถอน sheets | ✅ ไม่มีแถบ alert แบบเดิมใน grep | ตรวจซ้ำตอน implement |

## Accessibility

- Host: `aria-live="polite"` · แต่ละ toast: `role="alert"`
- ปุ่มปิด manual + auto-dismiss
- ข้อความภาษาไทยตาม copy เดิม

## Success criteria

1. เปิด login / signup / coupon แล้วกด submit ผิด — **ฟอร์มไม่กระโดด** มี toast ด้านบน
2. ไม่เหลือ `{error && <p role="alert">…` ในฟอร์ม auth/coupon
3. โปรโมชั่นโหลด fail แจ้งผ่าน toast (ไม่บังทั้งหน้า) หรือ empty state ที่ตกลงใน plan
4. Toast ใช้สีจาก theme tokens (หลังงาน styling)

## Spec self-review

- ไม่มี placeholder endpoint
- ขอบเขน confirm dialog ชัด
- โค้ดพื้นฐานมีอยู่แล้ว — งานหลักคือ **ปิดช่องที่เหลือ + theme toast**
