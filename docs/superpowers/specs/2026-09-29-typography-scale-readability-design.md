# Design Spec: Typography Scale & Readability Baseline

- **Date:** 2026-09-29
- **Status:** Approved
- **Scope:** System-wide Typography Baseline & Thai Legibility Refactoring

---

## 1. Problem Statement & Motivation

ในระบบปัจจุบันมีจุดแสดงผลข้อความหลายแห่งที่กำหนดขนาดฟอนต์เล็กเกินไป เช่น `text-[9.5px]`, `text-[10px]`, `text-[11px]` และ `text-xs` (12px) ร่วมกับสี `text-[var(--text-muted)]` ซึ่งส่งผลเสียอย่างรุนแรงต่อการอ่าน (Legibility) โดยเฉพาะข้อความภาษาไทย (Noto Sans Thai) ที่มีสระบน–ล่าง (ิ ี ุ ู) และวรรณยุกต์ (่ ้ ๊ ๋) ทำให้สระจม วรรณยุกต์ซ้อน และตัวหนังสือกลืนไปกับพื้นหลังสีเข้ม (Dark Surface)

นอกจากนี้ โปรเจกต์มีกฎบังคับห้ามใช้ `font-bold` (น้ำหนักสูงสุดคือ 500 / `font-medium`) ดังนั้นเมื่อตัวอักษรมีขนาดเล็กและเส้นบาง จึงทำให้สูญเสียความชัดเจนในการแยกแยะตัวอักษร

---

## 2. New Typography Hierarchy & Baseline Tokens

ยกระดับขนาดตัวอักษรขั้นต่ำทั้งระบบ โดยยึดหลัก **Mobile-First** และจำกัด **Font Weight สูงสุดไม่เกิน 500 (`font-medium`)**:

| ระดับบทบาท (Role) | มือถือ (Mobile) | จอใหญ่ (Desktop) | Weight / Line-height | คำอธิบาย & การใช้งาน |
| :--- | :--- | :--- | :--- | :--- |
| **Hero / Main Title** | 24–28px | 32–40px | 500 / 1.25 | หัวข้อใหญ่ของแบนเนอร์หรือ Modal Hero |
| **Section Title** | 18–20px | 20–22px | 500 / 1.35 | หัวข้อประจำส่วน เช่น เกมยอดฮิต, ค่ายเกม |
| **Card / Hub Title** | 16–17px | 17–18px | 500 / 1.35 | ชื่อการ์ด, เมนูด่วน, หัวเรื่องในการ์ด |
| **Body / Input / Label** | 14–15px | 15–16px | 400–500 / 1.45–1.5 | ข้อความเนื้อหาหลัก, ช่องกรอกฟอร์ม, ชื่อเกม, ปุ่มกด |
| **Secondary / Caption** | 13–14px | 13–14px | 400–500 / 1.45 | คำอธิบายย่อย, subtitle ใต้หัวข้อ, รายละเอียดเงื่อนไข |
| **Micro / Meta / Badge** *(Min Baseline)* | 12px | 12–13px | 500 / 1.4 | **ขนาดขั้นต่ำสุดของระบบ** ใช้เฉพาะ วันที่/เวลา, ยอดตัวเลขขนาดเล็ก, tags |
| **Table Header** | 11–12px | 12px | 500 / 1.3 | เฉพาะหัวตารางภาษาอังกฤษตัวพิมพ์ใหญ่ (`uppercase tracking-wider`) |

### กฎเหล็กของสเกลใหม่ (Hard Rules):
1. **ยกเลิกขนาด 9.5px, 10px และ 11px สำหรับข้อความภาษาไทยทุกจุด:** ข้อความภาษาไทยทุกข้อความจะเริ่มต้นที่ **12px ขึ้นไปเท่านั้น**
2. **Line-height ขั้นต่ำ 1.45 สำหรับภาษาไทย:** ห้ามใช้ `leading-none` กับข้อความภาษาไทยที่มีสระบน-ล่าง
3. **Contrast บน Dark Surface:** ตัวหนังสือที่เป็นคำอธิบายรอง (Secondary) ต้องใช้สี `var(--text-secondary)` (สว่างไม่ต่ำกว่า `#aaa3bc` หรือ opacity 75%+)

---

## 3. Color & Contrast Rules

| ประเภทองค์ประกอบ | การจัดการ | ขนาด & สีที่กำหนด |
| :--- | :--- | :--- |
| **Decorative / Separator**<br>(เช่น `•`, `/`, ขีดคั่น, ไอคอนประดับ) | คงไว้ได้ | ใช้ `text-[var(--text-muted)]` หรือ `opacity-50` ได้ เพื่อไม่ให้เด่นเกินเนื้อหา |
| **ข้อความภาษาไทย / คำอธิบาย**<br>(ข้อความที่ผู้ใช้ต้องอ่าน) | ต้องปรับขึ้น | ปรับขนาดเป็น **12px–13px** ขึ้นไป และปรับสีเป็น **`text-[var(--text-secondary)]`** |
| **ตัวแปรส่วนกลาง `--text-muted`** | จูนให้สว่างขึ้นเล็กน้อย | ปรับค่าใน `tokens.css` จากเดิม `#9792b3` ให้สว่างขึ้นเล็กน้อยเป็น `#a8a3c5` เพื่อช่วยจุดที่หลงเหลือให้อ่านง่ายขึ้น |

---

## 4. Target Components & Scope of Refactoring

### 4.1 Modals & Bottom Sheets
- **Deposit & Withdraw Bottom Sheet:** ปรับคำอธิบายขั้นตอน (`โอนเข้าบัญชีของคุณ`, `แตะยอดเงินเพื่อแก้ไข`) จาก 11px เป็น 12.5–13px สี `text-secondary`
- **Gems Store & Coupon:** ปรับอัตราแลก (`20 Gems = 1 เครดิต`) และคำอธิบายแพ็กเกจจาก 10–11px เป็น 13px
- **Referral (ชวนเพื่อน):** ปรับ Tier hints, Subtitle, ขั้นตอน 1-2-3 จาก 10–11px เป็น 12.5–13px
- **VIP Modals:** ปรับคำอธิบายภารกิจเลื่อนขั้น, กฎการรักษายศ, หมายเหตุตัวเลข จาก 10–11px เป็น 12–13px

### 4.2 Tables & Data Grids
- **Hall of Fame (Top Performance):**
  - Table Header (`GAME`, `PLAYER`, `TIME`, `PAYOUT`) ปรับเป็น 11.5–12px uppercase tracking-wider
  - วันที่และเวลาในตารางปรับเป็น 12px `tabular-nums`
- **Cashback Loss Rebate Table:** ปรับหัวตารางและยอดตัวเลขในแถวจาก 11px เป็น 12–13px
- **Transaction History List:** ปรับสกุลเงินและวันที่เวลาจาก 10px เป็น 12px

### 4.3 Missions, Check-in & Lucky Wheel
- **Daily Check-In Card:** ปรับรางวัลรายวันและป้ายกำกับจาก 9.5px–11px เป็น 12px
- **Lucky Wheel:** ปรับ Live winners ticker และสรุปยอดกระเป๋าตั๋ว/เพชรจาก 10–11px เป็น 12–13px

### 4.4 Game Cards & Overflows
- **Provider Cards & Game Grid:** ปรับชื่อเกมย่อยและ subtitle ในการ์ดขนาดเล็กจาก 10–11.5px เป็น 12–13px พร้อม `line-clamp` ป้องกันข้อความดันการ์ดเสียสัดส่วน

---

## 5. Safety Guardrails

- **ปุ่มและ Badge ขนาดเล็ก:** ปรับ padding แนวนอนให้สัมพันธ์กับขนาดฟอนต์ที่ใหญ่ขึ้นเพื่อคงความกว้างและการจัดวางเดิม
- **การนิ่งของตาราง:** ตัวเลข วันที่ และเวลา ต้องคงคลาส `tabular-nums` เสมอ
- **No Weight Exceeding 500:** ห้ามใส่ `font-semibold` หรือ `font-bold` เด็ดขาด ใช้เพียง `font-normal` (400) และ `font-medium` (500) ตามกฎของโปรเจกต์

---

## 6. Verification & Acceptance Criteria

1. **TypeScript Validation:** รัน `pnpm exec tsc --noEmit` ต้องผ่านฉลุย (Exit code 0)
2. **Scan Verification:** ตรวจสอบ grep ไม่พบ `text-[9.5px]`, `text-[10px]` ที่ใช้กับข้อความภาษาไทย
3. **Viewport Legibility Check:**
   - Mobile Viewport (375px): ข้อความภาษาไทยอ่านออกง่าย สระบน-ล่างไม่ชนขอบ
   - Desktop Viewport (1440px): สัดส่วนตัวหนังสือสมดุลกับการ์ดและตาราง
