# Slot Providers Page (/category/slots) — Design Specification

## Overview
หน้าแสดงรายชื่อและค่ายเกมส์สล็อต (Slot Providers Lobby) ตามที่ผู้ใช้ระบุ ออกแบบมาเพื่อเปิดเมื่อ:
1. ผู้ใช้คลิกปุ่ม **SLOTS** บนแถบหมวดหมู่เกม `CategoryNav` ในหน้าแรก
2. ผู้ใช้คลิกปุ่ม **View All** ในแถวสล็อต (SLOTS) ในหน้าแรก
3. ผู้ใช้คลิกเมนูย่อย **สล็อต** ใน Menu Slide Over (`RightMenuDrawer`)

---

## 1. Page Header (แถบด้านบน)
- แถบความสูงกะทัดรัด (Compact Sub-Header) ติดขอบบน (sticky) หรือเลื่อนตามหน้า
- **ซ้าย:** ปุ่มย้อนกลับ `<` (`ChevronLeftIcon`) กดแล้วนำทางกลับไปยังหน้าแรก (`/`)
- **ชื่อหน้า:** ข้อความ "สล็อต" สีขาวตัวหนาเด่นชัด

---

## 2. Subcategory Filter Tabs (แถบ 4 แท็บฟิลเตอร์ด้านบน)
- จัดเรียง 4 คอลัมน์บนมือถือ โดยมีไอคอนด้านบนและข้อความด้านล่าง:
  1. **ศูนย์รวม:** ไอคอนกล่องของขวัญ (สถานะเริ่มต้น Active: กรอบเรืองแสงสีม่วงพื้นผิวโปร่งใส)
  2. **ค่ายเกมทั้งหมด:** ไอคอนจอยเกมคอนโซล (Gamepad)
  3. **Drops & Wins:** ไอคอนหยดน้ำ/ไฟ (Water Drop)
  4. **ไก่:** ไอคอนไก่ (Chicken)
- รองรับการกดสลับแท็บเพื่อฟิลเตอร์รายการ

---

## 3. Search Bar (ช่องค้นหา)
- ช่องค้นหาแนวนอน: ไอคอนแว่นขยาย (`SearchIcon`) + ข้อความ placeholder "ค้นหาเกมและค่ายเกม"
- รองรับการพิมพ์ค้นหาชื่อค่ายเกมแบบ Real-time filter

---

## 4. Section Title & Provider Cards Layout
- **หัวข้อ:** "สล็อต" ตามด้วยข้อความบอกจำนวนสีรอง `(42 ค่ายเกม)`
- **2 แบนเนอร์ใหญ่ด้านบน (Full-width Featured Banners):**
  1. **JILI:** แบนเนอร์โทนสีอบอุ่น/ม่วงทอง พร้อมป้ายกำกับ 🔥 **HOT**, กราฟิกนักดนตรีโครงกระดูกวันแห่งความตาย (Day of the dead) และสโลแกน "PLAY FOR A BRIGHTER TOMORROW"
  2. **PRAGMATIC PLAY:** แบนเนอร์โทนสีน้ำเงิน/ฟ้าสายฟ้า พร้อมกราฟิกซุสเทพสายฟ้า วิหารกรีก และสโลแกน "PLAY BEYOND LIMITS"
- **การ์ดค่ายเกมขนาดปกติ (2-Column Grid):**
  - แสดง 2 คอลัมน์เท่ากันบนหน้าจอมือถือ พร้อมโลโก้ค่ายทางซ้ายและภาพตัวละคร/อาร์ตเวิร์กทางขวา:
    - **YGR:** เทพเจ้าแห่งโชคลาภ (Caishen) และก้อนทอง
    - **KING MIDAS:** กษัตริย์ไมดาสสีทอง
    - **Spadegaming:** สาวน้อยอนิเมะและโคมไฟจีน
    - **JOKER:** ตัวตลกโจ๊กเกอร์ถือไพ่
    - **FA CHAI:** สิงโตเชิดและเหรียญทอง
    - **ROYAL SLOT GAMING:** นักผจญภัยถือตะเกียง
    - **RELAX GAMING:** สาวชายหาดเขตร้อน
    - **KA Gaming:** เหล่าฮีโร่แฟนตาซี

---

## 5. File Structure
- `app/category/slots/page.tsx`: หน้าหลักของ Route
- `app/components/slots/SlotProvidersHeader.tsx`: แถบ Header ย้อนกลับ
- `app/components/slots/SlotFilterTabs.tsx`: แถบ 4 แท็บฟิลเตอร์
- `app/components/slots/SlotSearchBar.tsx`: ช่องค้นหา
- `app/components/slots/SlotProviderCards.tsx`: คอมโพเนนต์แบนเนอร์และการ์ดค่ายเกม
- `app/data/slotProvidersData.ts`: ข้อมูลค่ายเกมและสถิติ
