# Menu Slide Over (Right-Side Drawer) — Design Specification

## Overview
Component เมนูแบบ Slide Over สำหรับหน้าเว็บ Cosmicbet ออกแบบเพื่อรองรับการเปิดจากด้านขวาของหน้าจอ (Right side slide-in) เพื่อให้สอดคล้องกับตำแหน่งของปุ่ม Hamburger Menu บน Header ซึ่งอยู่ด้านขวาบน โดยปรับสลับตำแหน่งใน Header แถบบน:
- **ปุ่มปิด (X) สลับมาอยู่ด้านซ้าย**
- **หัวข้อ "เมนู" อยู่ด้านขวา**

---

## 1. Interaction & Layout Behavior

- **Trigger:** คลิกปุ่ม Hamburger Menu ใน `Header.tsx` (หรือผ่าน floating bottom nav / action อื่น)
- **Overlay (Backdrop):**
  - แสดงฉากหลังสีเข้มโปร่งแสง (`bg-black/60 backdrop-blur-sm`)
  - คลิกที่ฉากหลังเพื่อปิด drawer
  - กดปุ่ม `Escape` บนคีย์บอร์ดเพื่อปิด drawer
  - ล็อก body scroll ขณะ drawer เปิดอยู่
- **Drawer Panel:**
  - วางตำแหน่งชิดขวา: `fixed inset-y-0 right-0 z-50 h-full w-[85%] max-w-[340px] sm:max-w-[380px]`
  - Transition เข้า/ออกจากขวา: `translate-x-full` -> `translate-x-0`
  - พื้นหลังและพื้นผิว: ม่วงเข้ม `#121127` ไล่เฉดสีสอดคล้องกับ design tokens ใน `design.md`
  - Scroll container: รองรับการเลื่อนแนวตั้ง (`overflow-y-auto`) ซ่อน scrollbar เพื่อความสวยงาม

---

## 2. Header แถบบน (Header Bar)

- จัดวางด้วย `flex items-center justify-between px-4 py-3.5`
- **ด้านซ้าย:** ปุ่มปิด `(X)`
  - ขนาด `w-9 h-9 rounded-full bg-[#232145]/90 text-[var(--icon-active)] hover:bg-[var(--surface-hover)] active:scale-95`
  - มีไอคอนกากบาท X ที่มี stroke ชัดเจน
  - มี `aria-label="ปิดเมนู"`
- **ด้านขวา:** ข้อความหัวข้อ
  - "เมนู" ตัวหนา ขนาด 20px สีขาว `#ffffff`

---

## 3. Quick Feature Cards (2x2 Grid)

การ์ด 4 ฟังก์ชันหลักที่มีสีสันสะดุดตาตาม Mockup ต้นฉบับ:
1. **วงล้อ:** แบ็กกราวด์โทนม่วง/ชมพูเข้ม พร้อมกราฟิกวงล้อหมุนเสี่ยงโชคหลากสี (Wheel of Fortune)
2. **ร้านค้าเพชร:** แบ็กกราวด์โทนน้ำเงินเข้ม/ฟ้า พร้อมกราฟิกเพชรสีฟ้าเปล่งประกายและหีบสมบัติ
3. **ภารกิจ:** แบ็กกราวด์โทนน้ำเงินเข้มเนวีบลู พร้อมกราฟิกกระดานคลิปบอร์ด ติ๊กถูกสีเขียว และเหรียญทอง
4. **การแข่งขัน:** แบ็กกราวด์โทนแดงทับทิม/ไวน์แดง พร้อมกราฟิกถ้วยรางวัลทองคำและธงตาหมากรุกแข่งรถ

---

## 4. Main Navigation Menu (Navigation Items)

รายการเมนูหลักพร้อมไอคอนนำหน้า:
- **คาสิโน:** ไอคอนลูกเต๋า (Dice) + ลูกศร Chevron Down (สามารถคลิกเพื่อกางหมวดหมู่ย่อย: คาสิโนสด, สล็อต, เกมโต๊ะ)
- **กีฬา:** ไอคอนลูกฟุตบอล (Soccer Ball)
- **โบนัส:** ไอคอนกล่องของขวัญ (Gift Box)
- **โปรโมชั่น:** ไอคอนตั๋วคูปอง (Promo Ticket)
- **NFT:** ไอคอนบล็อกเชนหกเหลี่ยม N (Hexagon NFT)
- **ชวนเพื่อน:** ไอคอนกลุ่มเพื่อน/ผู้ใช้งาน (Referral Friends)

---

## 5. Divider & Secondary Utilities

- เส้นแบ่งความบาง 1px สี `--border-subtle`
- ลิงก์ฟังก์ชันเสริม:
  - **แชทสด:** ไอคอนชุดหูฟัง (Customer Support Headset)
  - **ติดตั้งแอป:** ไอคอนดาวน์โหลดลงกล่อง/แอป (Download App)
  - **ภาษาไทย:** ไอคอนลูกโลก (Globe) + ภาษาปัจจุบัน "ภาษาไทย" + Chevron Down

---

## 6. Action Cards (กล่องล่าง)

1. **กล่องบัตรของขวัญ (Gift Card Card):**
   - การ์ดพื้นเข้มพร้อมเส้นขอบ subtle
   - ไอคอนกล่องของขวัญ / Ribbon
   - ข้อความ "บัตรของขวัญ" + "ใช้รหัสเพื่อรับเครดิต"
   - ปุ่ม "แลกบัตรของขวัญ" (Pill outline button เต็มความกว้าง)
2. **กล่องซื้อคริปโต (Crypto Onramp Card):**
   - ไอคอนกระเป๋าเงิน Wallet
   - ข้อความ "ยังไม่มีคริปโต?" พร้อมข้อความเน้น "ซื้อคริปโต" และลูกศรชี้ขวา `>`

---

## 7. Component Structure & Architecture

- **Component File:** `app/components/layout/RightMenuDrawer.tsx`
- **Data File:** ข้อมูลเมนูแยกไว้ใน `app/data/menuData.ts` (หรือ `lobbyMockData.ts`)
- **Icons:** ขยายไอคอนใน `app/components/ui/Icons.tsx` เพื่อให้ทุกส่วนเป็น SVG คมชัด ไม่แตกบนจอมือถือ
- **Page Integration:** นำเข้า `RightMenuDrawer` และผูก state `isMenuOpen` เข้ากับ `Header.tsx` และ `app/page.tsx`
