# HeroUI → shadcn/ui — Design Spec

วันที่: 2026-09-14  
สถานะ: implemented 2026-09-14
โปรเจกต์: Cosmicbet front-end

## เป้าหมาย

เอา HeroUI ออกจากเอกสารและแนวทาง agent ทั้งหมด แล้วติดตั้ง **shadcn/ui (Radix)** ในโปรเจกต์จริง พร้อม map semantic tokens ให้สอดคล้องกับ Cosmicbet design tokens ใน `design.md` / `app/globals.css`

## การตัดสินใจที่ตกลงแล้ว

| หัวข้อ | เลือก |
|--------|--------|
| ขอบเขต | เอกสาร agent + init shadcn จริงในโปรเจกต์ (ไม่เพิ่มชุด component จำนวนมาก) |
| Theme | Dark + map tokens จาก Cosmicbet ตั้งแต่ต้น |
| Base | Radix (`asChild`) |
| แนวทาง | Init + แก้ docs พร้อมกัน |
| Cosmicbet vars | คงไว้เป็นต้นฉบับ — bridge ไป shadcn ไม่แทนที่ |

## สถานะปัจจุบัน

- HeroUI **ไม่มี** ใน `package.json` และไม่มี import ใน `app/`
- มี UI custom บางส่วนภายใต้ `app/components/` และ tokens Cosmicbet ใน `app/globals.css`
- การอ้าง HeroUI อยู่ใน docs/rules/skills เป็นหลัก

## แผนงาน

### 1. Init shadcn/ui

- ใช้ `pnpm dlx shadcn@latest init` (package manager ของโปรเจกต์คือ pnpm)
- ตั้งค่า: Radix, dark, Next App Router aliases
- เลือก path ของ `components/ui` ให้**ไม่ชน**กับ `app/components/ui/` ที่มี custom (`Icons`, `SectionHeader`) — แนะนำ alias มาตรฐานเช่น `@/components/ui` ที่โฟลเดอร์ `components/ui` ระดับ root (แยกจาก `app/components/ui`)
- ได้ `components.json` และ dependencies ที่ CLI ดึงมา (`class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, radix packages ตามที่ init กำหนด)

### 2. Token bridge

เก็บ Cosmicbet CSS variables ตาม `design.md` แล้ว map shadcn semantic โดยประมาณ:

| shadcn | Cosmicbet |
|--------|-----------|
| `--background` | `--bg-page` |
| `--foreground` | `--text-primary` |
| `--card` / `--popover` | `--surface-mid` |
| `--primary` | indigo จาก CTA (`#4930df` ฝั่ง action) |
| `--primary-foreground` | `--text-primary` / ขาวอ่านชัด |
| `--muted` | `--surface-hover` |
| `--muted-foreground` | `--text-muted` |
| `--border` / `--input` | `--border-subtle` |
| `--ring` | `--focus-ring` |
| `--radius` | สอดคล้อง `--radius-control` / card |

หลัง init ถ้า CLI ทับ `globals.css` ต้องรวมกลับ: Cosmicbet tokens + shell utilities (`.page-shell`, `.surface`, `.no-scrollbar`, focus-visible) + shadcn theme bridge

กฎ agent: layout/Cosmicbet sections ใช้ tokens จาก `design.md`; primitive shadcn ใช้ semantic classes ที่ map แล้ว — ห้ามใช้สี stock ม่วงสดของธีม default

### 3. อัปเดตเอกสาร (มิเรอร์ `.cursor/` ↔ `agent/`)

| ไฟล์ | การเปลี่ยน |
|------|------------|
| `*/rules/tech-stack.mdc` | HeroUI → shadcn/ui (Radix) + อ้าง `components.json` / CLI |
| `*/rules/shadcn-ui.mdc` | สร้างใหม่: ใช้ registry/CLI ก่อนเขียนเอง; compose; ยึด tokens ที่ map |
| `*/skills/cosmicbet-frontend/SKILL.md` | description และ workflow อ้าง shadcn |
| `AGENTS.md` / `agent.md` | บรรทัด stack + อัปเดต sync checklist ให้รวม `shadcn-ui.mdc` |
| `docs/superpowers/specs|plans/*` ที่ยังพูด HeroUI | แก้หรือใส่ addendum ชี้ stack ใหม่ |

หลังแก้: รัน sync checklist / `diff -q` คู่ไฟล์ตาม `AGENTS.md`

### 4. สิ่งที่ไม่ทำ

- ไม่ refactor หน้า lobby / custom components ที่มีอยู่ให้เป็น shadcn ทั้งก้อน
- ไม่ `shadcn add` ชุดใหญ่ (Button, Tabs, Dialog ฯลฯ) นอกจากไฟล์ที่ init บังคับ
- ไม่แก้เนื้อหา visual ใน `design.md` (ยังเป็นต้นฉบับดีไซน์)
- ไม่ติดตั้งแล้วถอน HeroUI (ไม่มีในโปรเจกต์อยู่แล้ว)

## ความเสี่ยง

1. CLI ทับ `globals.css` — ต้อง merge คืน Cosmicbet + bridge
2. ชน path `app/components/ui` — แยก shadcn ไว้ที่ `components/ui` (root) ชัดเจน
3. Agent อาจใช้สี shadcn default — ต้องมี bridge + ข้อความใน `tech-stack` / `design-system`

## เกณฑ์สำเร็จ

- [ ] มี `components.json` และ init สำเร็จ; ไม่มี HeroUI ใน dependencies
- [ ] Cosmicbet tokens ยังอยู่ใน CSS; shadcn semantic map แล้ว
- [ ] ไม่มีคำว่า HeroUI / heroui ใน rules, skills, `AGENTS.md`, `agent.md` (ยกเว้นประวัติใน docs เก่าที่ระบุว่าถูกแทนที่แล้ว)
- [ ] มี `*/rules/shadcn-ui.mdc` คู่กันทั้งสองโฟลเดอร์
- [ ] คู่ไฟล์ `.cursor/` ↔ `agent/` ที่แตะแล้วยัง mirror
- [ ] ไม่มีการ refactor หน้า lobby เป็นงานหลักของรอบนี้
- [ ] `pnpm build` หรืออย่างน้อย `pnpm lint` ยังผ่านหลัง init (ถ้า build พังเพราะ CSS merge ต้องแก้ก่อนปิดงาน)

## ความสัมพันธ์กับงานก่อนหน้า

ชุด agent docs Cosmicbet (2026-09-14) ยังใช้ได้ — เปลี่ยนเฉพาะชั้น UI library จาก HeroUI เป็น shadcn/ui ตาม spec นี้
