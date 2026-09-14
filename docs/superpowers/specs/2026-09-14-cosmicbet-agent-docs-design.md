# Cosmicbet Agent Docs — Design Spec

วันที่: 2026-09-14  
สถานะ: draft สำหรับรีวิวก่อน implementation  
โปรเจกต์: Cosmicbet front-end (Next.js / HeroUI / Tailwind)

## เป้าหมาย

สร้างชุดเอกสารให้ agent ประยุกต์ใช้ตอนพัฒนาหน้าเล่นเว็บเดิมพัน Cosmicbet โดยเก็บคู่กันใน `.cursor/` (Cursor) และ `agent/` (IDE อื่น) ให้เนื้อหาเหมือนกัน และมีแผนที่โปรเจกต์ + คู่มือ sync แบบ manual

## การตัดสินใจที่ตกลงแล้ว

| หัวข้อ | เลือก |
|--------|--------|
| ขอบเขต | ครบชุด: rules + skills + `AGENTS.md` / `agent.md` + sync guide |
| Design source | `design.md` ที่ root เป็นต้นฉบับเต็ม; rules สรุปสั้น + ชี้ไปที่ไฟล์นี้ |
| Sync | Manual + checklist (ไม่มี script) |
| `AGENTS.md` vs `agent.md` | เนื้อหาเดียวกัน |
| โครงสร้าง | แยกไฟล์ตามเรื่อง (หนึ่ง concern ต่อไฟล์) |

## โครงสร้างไฟล์เป้าหมาย

```
design.md                          # ต้นฉบับดีไซน์ (ไม่มิเรอร์)
AGENTS.md                          # = agent.md
agent.md                           # = AGENTS.md

.cursor/
  rules/
    personality.mdc
    communication.mdc
    tech-stack.mdc
    design-system.mdc
    frontend-components.mdc
  skills/
    cosmicbet-frontend/SKILL.md
    ui-qa-checklist/SKILL.md

agent/
  rules/                           # มิเรอร์ 1:1 ของ .cursor/rules/
  skills/                          # มิเรอร์ 1:1 ของ .cursor/skills/
```

ลบ: `.cursor/skills/SKILL.md` เก่า (Monday ChatAi / Go template) — ไม่ใช้ path นั้นอีก

แหล่งแก้หลักที่แนะนำตอนทำงานใน Cursor: `.cursor/` แล้วก็อปไป `agent/`  
ถ้าทำงานใน IDE อื่น: แก้ `agent/` แล้วก็อปกลับ `.cursor/`

## เนื้อหา Rules

### personality.mdc (alwaysApply: true)

คงเนื้อหาปัจจุบัน: agent ชื่อแพร, เรียกผู้ใช้พีพี, โทนเป็นกันเอง เนื้อหาเทคนิคถูกต้อง

### communication.mdc (alwaysApply: true)

อัปเดตจากฉบับปัจจุบัน:

- สื่อสารกับผู้ใช้เป็นภาษาไทย; reasoning ภายในเป็นอังกฤษ
- ตัวแปร / ฟังก์ชัน / interface เป็นภาษาอังกฤษ (Next/React/TypeScript — ไม่ใช่ Go)
- คอมเมนต์ภาษาไทยเหนือฟังก์ชัน; บอกความเชื่อมโยงถ้าใช้ในที่อื่น
- แยก front-end components เป็นชิ้น; ใช้ utility / global CSS; ลด hardcode inline CSS
- Commit: ทำเมื่อผู้ใช้สั่ง หรือตาม convention ของ IDE นั้น — ไม่บังคับ commit อัตโนมัติทุกครั้งหากขัดกับกฎผู้ใช้ใน Cursor

### tech-stack.mdc

- Stack: Next.js 16 (App Router), React 19, Tailwind CSS 4, HeroUI
- ก่อนเขียนโค้ด Next อ่าน docs ใน `node_modules/next/dist/docs/` — API อาจต่างจากความรู้เดิม
- อย่าเปลี่ยน stack โดยไม่ได้รับคำสั่ง
- HeroUI อาจยังไม่ได้ติดตั้งตอนเริ่ม — ติดตั้งเมื่อเริ่มงาน UI จริง ไม่ใช่ในรอบ docs นี้

Apply: `alwaysApply: true` (ให้ IDE ที่อ่าน rules ทั้งชุดได้บริบท stack เสมอ)

### design-system.mdc

สรุปสั้นจาก `design.md` (ไม่ก็อปทั้งไฟล์):

- พื้นผิวม่วงเข้มเริ่ม `#19183B`; ใช้ CSS variables ส่วนกลาง
- Primary CTA แยกเป็น Indigo→Blue ได้; ไม่ใช้ม่วงสด/neon ใน feature cards, Jackpot, Bottom Nav
- ไอคอนเรียบสีลาเวนเดอร์ใน nav / feature / jackpot; ห้าม 3D สีฉูดฉาดในส่วนเหล่านั้น
- Mobile first; max-width 1200px; ลำดับ section ตาม `design.md`
- รายละเอียด tokens, typography, component specs, a11y → อ่าน `design.md`

Globs: `**/*.{tsx,css}` (และเทียบเท่าในทั้งสองโฟลเดอร์ rules)

### frontend-components.mdc

- แยก reusable: SectionHeader, CarouselControls, GameCard, ProviderCard, FeatureActionCard, JackpotWinnerCard, HallOfFame, FloatingBottomNav
- Render จาก data arrays + stable IDs; mock แยกจาก API/service
- Link สำหรับ navigation; button สำหรับ action; ไม่ซ้อน interactive
- ไม่สร้าง Header/Nav ซ้ำเมื่อประกอบจากภาพแยกส่วน
- Asset จริงจากผู้ใช้; ห้ามเปลี่ยนโลโก้แบรนด์เอง

Globs: `**/*.{ts,tsx}`

## เนื้อหา Skills

### cosmicbet-frontend/SKILL.md

- Trigger: สร้างหรือแก้หน้า/component ของ Cosmicbet / หน้าเดิมพัน / ตาม design.md
- Workflow: อ่าน `design.md` + design-system + frontend-components → ทำเฉพาะส่วนที่ขอ → ใช้ tokens/CSS vars → แยก component ตามรายชื่อ → จบด้วย ui-qa-checklist เมื่อใกล้ส่งงาน
- Hard rules: ไม่เพิ่ม section/เมนู/กราฟิกที่ไม่ได้ร้องขอ; ไม่ยึด pixel จาก mockup เป็นความสูงหน้า

### ui-qa-checklist/SKILL.md

- Trigger: ก่อนบอกว่างาน UI เสร็จ หรือเมื่อผู้ใช้ขอตรวจ QA
- Checklist ย่อจากหมวด 10 ใน `design.md`: ลำดับ section, tokens, icons, View All/arrows vs promo dots, Providers spacing, ข้อความไทย/ยอดเงิน, floating nav + safe area, breakpoints 360/390/768/1280, loading/empty/error

## แผนที่โปรเจกต์ (`AGENTS.md` = `agent.md`)

เนื้อหาเดียวกันทั้งสองไฟล์ ประกอบด้วย:

1. สรุปโปรเจกต์: Cosmicbet front-end หน้าเล่นเว็บเดิมพัน
2. Stack สั้น ๆ
3. ตาราง “งานอะไร → อ่านไฟล์ไหนก่อน”
4. โครงสร้าง `agent/` ↔ `.cursor/` และกฎว่าต้องเหมือนกัน
5. Sync checklist แบบ manual (รายการไฟล์ที่ต้องคู่กัน)
6. คง Next.js agent notice (`node_modules/next/dist/docs/`) ไว้ในเอกสารนี้

## ขอบเขต implementation รอบถัดไป

### ทำ

- ยืนยัน `design.md` มีเนื้อหา Design Guide ครบ (เคยว่างระหว่างออกแบบ — ตอน implement ต้อง verify ก่อน)
- สร้าง/อัปเดตไฟล์ตามโครงสร้างด้านบน ทั้งสองโฟลเดอร์
- เขียน `AGENTS.md` และ `agent.md` ให้เหมือนกัน
- ลบ skill เก่า Monday/Go

### ไม่ทำ

- ไม่สร้างหน้าเว็บหรือติดตั้ง HeroUI ในรอบ docs
- ไม่ก็อปทั้ง `design.md` เข้า rules/skills
- ไม่สร้าง sync script

## ความเสี่ยงและข้อควรแก้ก่อน/ระหว่าง implement

1. **`design.md` เคยว่างระหว่างออกแบบ** — ตอน implement ต้อง verify ว่ามีเนื้อหาครบก่อนสร้าง rules ที่อ้างอิง
2. Skill เก่าอาจทำให้ agent สับสน — ลบให้หมดจาก `.cursor/skills/SKILL.md`
3. `communication.mdc` เดิมยังอ้าง Go ecosystem — ต้องอัปเดตทั้งสองโฟลเดอร์พร้อมกัน

## เกณฑ์สำเร็จ

- [ ] rules ครบ 5 ไฟล์ในทั้ง `.cursor/rules/` และ `agent/rules/` และเนื้อหาคู่กัน
- [ ] skills ใหม่ 2 ตัวในทั้งสองโฟลเดอร์; ไม่เหลือ SKILL Monday/Go
- [ ] `AGENTS.md` และ `agent.md` เนื้อหาเดียวกัน มีแผนที่ + sync checklist
- [ ] `design.md` มีเนื้อหา Design Guide ครบและเป็นแหล่งจริง
- [ ] ไม่มีโค้ด UI / dependency ใหม่ในรอบนี้ (ยกเว้นกู้ `design.md` และการเพิ่มไฟล์ docs/rules/skills)

## Addendum — 2026-09-14 (stack update)

UI library เปลี่ยนจาก HeroUI เป็น **shadcn/ui (Radix)**  
ดูรายละเอียด: `docs/superpowers/specs/2026-09-14-heroui-to-shadcn-design.md`
