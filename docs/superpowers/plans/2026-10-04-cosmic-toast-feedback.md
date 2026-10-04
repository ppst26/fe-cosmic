# Cosmic Toast Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ใช้ toast ลอยเป็นช่องทางเดียวสำหรับข้อความชั่วคราวในฟอร์ม/แอป ไม่แทรก layout — ปิดจุดที่ยังเป็น inline error

**Architecture:** `context/ToastContext.tsx` + `ToastProvider` ใน `app/providers.tsx`; feature เรียก `useToast().showToast()`; สไตล์ย้ายไป token/CSS แยก

**Tech Stack:** Next.js 16, React 19, Tailwind 4, tokens ใน `app/styles/tokens.css`

## Global Constraints

- ไม่เพิ่ม UI library (sonner ฯลฯ) โดยไม่ได้รับคำสั่ง
- สีข้อความ/UI อ้าง `var(--…)` จาก tokens
- `font-weight` สูงสุด 500 ใน UI ใหม่
- ตอบ copy ภาษาไทยเหมือนเดิม

---

### Task 1: Theme styling สำหรับ ToastHost

**Files:**
- Create: `app/styles/toast.css`
- Modify: `app/globals.css` (import chain)
- Modify: `context/ToastContext.tsx` (class names แทน emerald/red utilities)

**Interfaces:**
- Produces: class `cosmic-toast`, `cosmic-toast--error`, `cosmic-toast--success`, `cosmic-toast--info`

- [ ] **Step 1:** เพิ่ม token ถ้าจำเป็น (`--toast-bg`, `--toast-border`) ใน `tokens.css`
- [ ] **Step 2:** สร้าง `toast.css` — solid พื้นเข้ม, border subtle, ไอคอน semantic
- [ ] **Step 3:** แก้ `ToastHost` ใช้ `font-medium`, ลบ `font-semibold`
- [ ] **Step 4:** รัน `pnpm exec tsc --noEmit`

---

### Task 2: โปรโมชั่น — โหลด catalog ไม่สำเร็จ

**Files:**
- Modify: `app/components/promotions/PromotionsCatalogProvider.tsx`
- Modify: `app/components/promotions/PromotionsHubPageContent.tsx`

**Interfaces:**
- Consumes: `useToast()` จาก `context/ToastContext.tsx`

- [ ] **Step 1:** ใน provider เมื่อ fetch fail → `showToast("โหลดโปรโมชั่นไม่สำเร็จ", "error")` (หรือแยก hook ใน child ที่ subscribe error — หลีกเลี่ยง toast ซ้ำทุก re-render)
- [ ] **Step 2:** ลบ/ลด paragraph `text-[var(--destructive)]` กลางหน้า — แสดง empty state หรือซ่อน feed เมื่อไม่มี catalog
- [ ] **Step 3:** ทดสอบ `/promotions` mock fail path (ถ้ามี toggle) หรือจำลอง error state ชั่วคราว

---

### Task 3: Audit จุดแจ้งเตือนที่เหลือ

**Files:**
- Grep: `role="alert"`, `setError(`, `destructive)]">{error`
- แก้ตามผล (ถ้ามี) ให้ใช้ toast หรือยืนยัน out-of-scope

- [ ] **Step 1:** รายการไฟล์ที่ยัง inline error
- [ ] **Step 2:** ย้ายหรือจดเหตุผลใน spec ถ้าไม่ย้าย (เช่น lottery feedback)

---

### Task 4: QA manual

- [ ] Login: เบอร์ผิด → toast, ฟอร์มไม่เลื่อน
- [ ] SignUp step 1/2 validation → toast
- [ ] Coupon ผิด/ถูก → toast
- [ ] Toast ไม่บังปุ่มปิด sheet (z-index)
- [ ] มือถือ safe-area บน

---

### Task 5: Commit (เมื่อ PP สั่ง)

- [ ] `git add` ไฟล์ที่เกี่ยวข้อง + docs
- [ ] commit message อธิบาย why (toast แทน inline alert)
