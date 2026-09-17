# หน้ารายการธุรกรรม (2026-09-15)

## รูปแบบ
- **หน้าเต็ม** `/transactions` — Header + แถบย้อนกลับ + แท็บ + รายการ
- Query `?kind=withdraw` เปิดแท็บถอน (ค่าเริ่มต้น = ฝาก)
- เปิดจากเมนูล่าง **ฝากเงิน** → `/transactions`, **ถอนเงิน** → `/transactions?kind=withdraw`
- จาก popover โปรไฟล์ **รายการฝากถอน** → `/transactions`

## Tab
- มี **2 แท็บเท่านั้น**: ฝากเงิน | ถอนเงิน (segment 2 คอลัมน์)
- **ไม่มี** ปุ่ม filter / ช่วงวันที่ / สถานะ

## รายการ
- Mock ใน `transactionsMockData.ts`
- แสดง: ไอคอน, ชื่อ, วันเวลา, ref, สถานะ, จำนวน (+/-)
- ต้องล็อกอิน — ไม่ล็อกอินแสดงข้อความแจ้ง

## API
- ยังไม่เชื่อม backend — แยก contract ไว้ใน type `TransactionItem`
