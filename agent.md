# Cosmicbet — Agent Project Map

Front-end หน้าเล่นเว็บเดิมพัน **Cosmicbet**  
Stack: Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · shadcn/ui (Radix) · TypeScript · pnpm

## อ่านอะไรก่อนทำงาน

| งาน | อ่านก่อน |
|-----|----------|
| ภาพรวมโปรเจกต์ / sync docs | `AGENTS.md` หรือ `agent.md` (ไฟล์นี้) |
| ดีไซน์เต็ม (tokens, sections, QA) | `design.md` |
| บุคลิกการตอบ | `agent/rules/personality.mdc` หรือ `.cursor/rules/personality.mdc` |
| ภาษา / คอมเมนต์ / commit | `*/rules/communication.mdc` |
| Stack & Next docs | `*/rules/tech-stack.mdc` + `node_modules/next/dist/docs/` |
| shadcn / UI primitives | `*/rules/shadcn-ui.mdc` + `components.json` |
| สรุป visual rules | `*/rules/design-system.mdc` |
| โครงสร้าง component | `*/rules/frontend-components.mdc` |
| สร้าง/แก้หน้า UI | skill `cosmicbet-frontend` |
| ตรวจก่อนส่ง UI | skill `ui-qa-checklist` |

## โฟลเดอร์ agent docs

| โฟลเดอร์ | ใช้เมื่อ |
|----------|---------|
| `.cursor/` | ทำงานใน Cursor |
| `agent/` | ทำงานใน IDE อื่น |

`rules/` และ `skills/` ในสองโฟลเดอร์ต้อง**เนื้อหาเหมือนกัน**  
ต้นทางแนะนำตอนอยู่ Cursor: แก้ `.cursor/` แล้วก็อปไป `agent/`  
ต้นทางตอนอยู่ IDE อื่น: แก้ `agent/` แล้วก็อปกลับ `.cursor/`

`design.md` อยู่ที่ root เพียงที่เดียว — ไม่ต้องก็อปเข้า `.cursor/` หรือ `agent/`

## Sync checklist (manual)

หลังแก้ docs ของ agent ให้ติ๊กว่าคู่ไฟล์ตรงกัน:

- [ ] `AGENTS.md` ↔ `agent.md`
- [ ] `.cursor/rules/personality.mdc` ↔ `agent/rules/personality.mdc`
- [ ] `.cursor/rules/communication.mdc` ↔ `agent/rules/communication.mdc`
- [ ] `.cursor/rules/tech-stack.mdc` ↔ `agent/rules/tech-stack.mdc`
- [ ] `.cursor/rules/shadcn-ui.mdc` ↔ `agent/rules/shadcn-ui.mdc`
- [ ] `.cursor/rules/design-system.mdc` ↔ `agent/rules/design-system.mdc`
- [ ] `.cursor/rules/frontend-components.mdc` ↔ `agent/rules/frontend-components.mdc`
- [ ] `.cursor/skills/cosmicbet-frontend/SKILL.md` ↔ `agent/skills/cosmicbet-frontend/SKILL.md`
- [ ] `.cursor/skills/ui-qa-checklist/SKILL.md` ↔ `agent/skills/ui-qa-checklist/SKILL.md`

คำสั่งตรวจเร็ว:

```bash
diff -q AGENTS.md agent.md
for f in personality communication tech-stack shadcn-ui design-system frontend-components; do
  diff -q ".cursor/rules/$f.mdc" "agent/rules/$f.mdc"
done
diff -q .cursor/skills/cosmicbet-frontend/SKILL.md agent/skills/cosmicbet-frontend/SKILL.md
diff -q .cursor/skills/ui-qa-checklist/SKILL.md agent/skills/ui-qa-checklist/SKILL.md
```

ไม่มีความต่าง = sync ครบ

## Hard rules สั้น ๆ

- การกำหนด style และการออกแบบเริ่มต้นต้องเริ่มที่การออกแบบหน้าจอมือถือก่อนเป็นหลักเสมอ (Mobile-first)
- ยึด `design.md` เป็นต้นฉบับดีไซน์; rules เป็นสรุปเท่านั้น
- อย่าเพิ่ม UI นอก scope ที่ผู้ใช้ขอ
- อย่าใช้ skill/path เก่า Monday ChatAi หรือ Go template

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
