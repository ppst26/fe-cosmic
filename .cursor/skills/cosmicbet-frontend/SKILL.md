---
name: cosmicbet-frontend
description: >-
  Builds or edits Cosmicbet betting front-end UI from design.md using Next.js,
  shadcn/ui (Radix), and Tailwind. Use when creating pages/components, implementing
  lobby sections, or when the user mentions Cosmicbet, design.md, or betting UI.
---

# Cosmicbet Frontend

## When to use

งานสร้างหรือแก้หน้า/component ของ Cosmicbet / หน้าเดิมพัน / ตาม `design.md`

## Workflow

1. อ่าน `design.md` (ต้นฉบับ) และ rules `design-system` + `frontend-components` + `tech-stack` + `shadcn-ui` + `typography`
2. อ่าน `components.json` ก่อนเพิ่ม primitive shadcn
3. อ่าน Next docs ใน `node_modules/next/dist/docs/` ถ้าแตะ App Router / routing / image
4. ทำเฉพาะส่วนที่ผู้ใช้ร้องขอ — คงตำแหน่งสัมพัทธ์ตามลำดับหน้าใน `design.md` หมวด 5
5. Mock แยกจาก API; link vs button ให้ถูกความหมาย
6. ก่อนบอกว่าเสร็จ — ใช้ skill `ui-qa-checklist`

## Styling (Tailwind เป็นหลัก)

| ทำใน TSX (Tailwind) | ทำใน `app/styles/*.css` |
| --- | --- |
| Layout shells, flex/grid, gap, spacing, size, position, overflow, responsive | Tokens (`tokens.css`), สี, gradient |
| Layout components compose ด้วย `cn()` | Solid fills, gradient จำกัด, shadow / glow / แสง (ไม่ blur เป็นหลัก) |
| Typography ตาม `typography.mdc` | Keyframes, scrollbar theme, pseudo ซับซ้อน |
| shadcn + semantic utilities | Class โทน visual (inner card solid, modal shell) — ไม่เพิ่ม pattern glass ใหม่ |

- งานใหม่: **ไม่** เพิ่มกฎ margin/padding/flex/grid ใน feature CSS ถ้า Tailwind ทำได้
- CSS เก่า: ไม่ย้ายทั้งไฟล์เว้นผู้ใช้สั่ง — แตะแล้วค่อยดึง layout ไป Tailwind

## Hard rules

- การกำหนด style และการออกแบบเริ่มต้นต้องเริ่มที่การออกแบบหน้าจอมือถือก่อนเป็นหลักเสมอ (Mobile-first)
- ไม่เพิ่ม section, เมนู, กราฟิก, สถิติ หรือ copy ที่ผู้ใช้ไม่ได้ให้
- ไม่ยึดความสูงภาพ mockup เป็นความสูงหน้าเว็บ
- Feature / กิจกรรม lobby (carousel รูปทัวร์นาเมนต์) / Bottom Nav = ไอคอนเรียบ ไม่ใช่ 3D/neon — ดู `design.md` § LobbyActivitiesSection
- ไม่สร้าง Header หรือ Navigation ซ้ำเมื่อประกอบจากภาพแยกส่วน
