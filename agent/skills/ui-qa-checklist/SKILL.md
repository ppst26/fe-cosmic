---
name: ui-qa-checklist
description: >-
  Runs Cosmicbet UI acceptance checks from design.md before calling work done.
  Use when finishing UI tasks, reviewing front-end output, or when the user asks
  for QA, visual check, or pre-submit review.
---

# Cosmicbet UI QA Checklist

คัดลอก checklist นี้แล้วติ๊กทีละข้อก่อนบอกว่างานเสร็จ (รายละเอียดเต็ม: `design.md` หมวด 11)

- [ ] ลำดับ section ตรง `design.md` หมวด 6; ไม่มี Header/Nav ซ้ำ
- [ ] พื้นหลัก `--bg-page` / `#0C0713`; action หลัก `#7747E5` — ไม่มีม่วงสด/neon นอก palette
- [ ] Feature ทั้งสามใช้ไอคอนเรียบถูกความหมาย; ฝาก/ถอนแยกทิศลูกศรชัด
- [ ] หมวดเกมและ Providers มี View All (เกม) / marquee (providers); **กิจกรรม lobby** มี carousel + dots + arrows **ไม่มี** View All
- [ ] กิจกรรม lobby ใช้รูป `public/tournament/` ไม่ใช่การ์ด jackpot ยอดเงิน
- [ ] Providers: marquee โลโก้ ไม่ glass card; ช่องว่างด้านบน 48–56px
- [ ] Promo carousel pagination แยกจากกิจกรรม (dots กลางสำหรับทัวร์นาเมนต์)
- [ ] ข้อความไทยไม่ขาดสระ; ยอดเงินไม่ถูกตัด; โลโก้/ปกเกมไม่เสียสัดส่วนผิดวิธี
- [ ] Floating nav ไม่บังแถวท้าย; มี safe area; focus ใช้ได้
- [ ] ตรวจที่ความกว้าง 360, 390, 768, 1280px; ไม่มี horizontal overflow ที่ไม่ได้ตั้งใจ
- [ ] Search, tabs, View All, arrows ทำงาน; มี loading/empty/error ตามบริบท
- [ ] ไม่ใส่กราฟิกใหม่ / สถิติใหม่ / เมนูใหม่ / copy ที่ผู้ใช้ไม่ได้ให้

ถ้าข้อใดไม่ผ่าน — แก้ก่อนส่ง และอ้าง `design.md` เป็นเกณฑ์ตัดสิน
