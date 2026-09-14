# Cosmicbet Agent Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** สร้างชุด rules + skills + แผนที่โปรเจกต์คู่กันใน `.cursor/` และ `agent/` ให้ agent พัฒนา Cosmicbet front-end ตาม `design.md` ได้สม่ำเสมอข้าม IDE

**Architecture:** `design.md` ที่ root เป็นต้นฉบับดีไซน์เต็ม; rules สรุปสั้นและชี้ไปที่ไฟล์นั้น; skills เป็น workflow/QA; `AGENTS.md` กับ `agent.md` เนื้อหาเดียวกัน; มิเรอร์ `rules/` และ `skills/` ระหว่าง `.cursor/` กับ `agent/` แบบ manual (ไม่มี sync script)

**Tech Stack:** Markdown / Cursor `.mdc` rules / Agent Skills (`SKILL.md`); โปรเจกต์เป้าหมาย Next.js 16 + React 19 + Tailwind 4 + HeroUI (ยังไม่ติดตั้งในรอบนี้)

## Global Constraints

- อย่าสร้างหน้าเว็บ / component / ติดตั้ง HeroUI ในรอบนี้
- อย่าก็อปทั้ง `design.md` เข้า rules หรือ skills — สรุปสั้น + ลิงก์เท่านั้น
- ไฟล์คู่ใน `.cursor/` และ `agent/` ต้องเนื้อหาเหมือนกันทีละไบต์หลังจบแต่ละ task ที่แตะคู่ไฟล์
- `AGENTS.md` และ `agent.md` ต้องเนื้อหาเหมือนกัน
- ลบ `.cursor/skills/SKILL.md` เก่า (Monday ChatAi / Go) ให้หมด — ไม่ทิ้ง orphan
- Commit เฉพาะเมื่อผู้ใช้สั่ง (user rule ของ Cursor) — ขั้น commit ในแผนนี้เป็น optional จนกว่าจะได้รับคำสั่ง
- Spec อ้างอิง: `docs/superpowers/specs/2026-09-14-cosmicbet-agent-docs-design.md`

## File map

| Path | Responsibility |
|------|----------------|
| `design.md` | ต้นฉบับ Design Guide (verify เท่านั้น — มีเนื้อหาแล้ว) |
| `AGENTS.md` / `agent.md` | แผนที่โปรเจกต์ + sync checklist (เนื้อหาเดียวกัน) |
| `*/rules/personality.mdc` | บุคลิกแพร/พีพี (คงเดิม) |
| `*/rules/communication.mdc` | ภาษา + commit + component hygiene (อัปเดตจาก Go → Next/TS) |
| `*/rules/tech-stack.mdc` | Next / HeroUI / Tailwind / อ่าน Next docs |
| `*/rules/design-system.mdc` | สรุป tokens + ห้ามทำ + ชี้ `design.md` |
| `*/rules/frontend-components.mdc` | รายชื่อ component + data/mock patterns |
| `*/skills/cosmicbet-frontend/SKILL.md` | Workflow สร้าง/แก้ UI ตาม design |
| `*/skills/ui-qa-checklist/SKILL.md` | Checklist ก่อนส่งงาน |
| `.cursor/skills/SKILL.md` | ลบ (skill เก่า) |

---

### Task 1: Verify design.md + remove legacy skill

**Files:**
- Verify: `design.md`
- Delete: `.cursor/skills/SKILL.md`

**Interfaces:**
- Consumes: ไม่มี
- Produces: `design.md` พร้อมใช้เป็นแหล่งจริง; ไม่มี skill Monday/Go ค้างที่ path เก่า

- [ ] **Step 1: ยืนยัน design.md มีเนื้อหา**

Run:

```bash
wc -l design.md && head -n 3 design.md
```

Expected:
- บรรทัดประมาณ 500+
- บรรทัดแรกมีข้อความประมาณ `Cosmicbet — Front-end Design Guide`

ถ้าไฟล์ว่างหรือสั้นผิดปกติ: หยุดแล้วถามผู้ใช้ให้เซฟ/กู้ `design.md` ก่อนทำ Task ถัดไป

- [ ] **Step 2: ลบ skill เก่า**

Run:

```bash
rm -f .cursor/skills/SKILL.md
test ! -f .cursor/skills/SKILL.md && echo "legacy skill removed"
```

Expected: พิมพ์ `legacy skill removed`

- [ ] **Step 3: Verify ไม่มี SKILL.md หลงเหลือที่ root ของ skills**

Run:

```bash
find .cursor/skills agent/skills -maxdepth 1 -name 'SKILL.md' 2>/dev/null || true
```

Expected: ไม่มี output (ยังไม่มี `agent/skills` ก็ได้)

- [ ] **Step 4: Commit (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

```bash
git add design.md .cursor/skills/SKILL.md
git commit -m "$(cat <<'EOF'
chore: drop legacy Monday/Go skill path

EOF
)"
```

---

### Task 2: Update communication.mdc (ทั้งสองโฟลเดอร์)

**Files:**
- Modify: `.cursor/rules/communication.mdc`
- Modify: `agent/rules/communication.mdc`

**Interfaces:**
- Consumes: เนื้อหาเดิม personality ไม่แตะ
- Produces: communication rule ที่อ้าง Next/React/TypeScript และ commit ตามคำสั่งผู้ใช้

- [ ] **Step 1: เขียน `.cursor/rules/communication.mdc` ให้เป็นเนื้อหานี้ทั้งไฟล์**

```markdown
---
description: กฎการสื่อสาร ภาษาโค้ด และแนวทาง commit สำหรับ Cosmicbet front-end
alwaysApply: true
---

# Agent Communication Rules

- สื่อสารกับผู้ใช้เป็นภาษาไทย แต่คิดและทำงานเบื้องหลังเป็นภาษาอังกฤษ
- ตอบคำถามและอธิบายให้ผู้ใช้เป็นภาษาไทยเสมอ
- เวลาคิด วิเคราะห์โค้ด หรือทำงานเบื้องหลัง (reasoning) — ใช้ภาษาอังกฤษเพื่อประหยัด token
- ตั้งชื่อตัวแปร ฟังก์ชัน โครงสร้าง และ interface เป็นภาษาอังกฤษเสมอ (Next.js / React / TypeScript)
- คอมเมนต์ใน source เป็นภาษาไทย วางเหนือฟังก์ชันทุกครั้ง และบอกความเชื่อมโยงหากถูกใช้จากที่อื่น
- แยก front-end components เป็นชิ้น ๆ; ใช้ utility / global CSS ที่มีอยู่; ลด hardcode inline CSS
- Commit เมื่อผู้ใช้สั่ง หรือตาม convention ของ IDE ที่ใช้อยู่ — อย่า commit อัตโนมัติถ้าขัดกับกฎผู้ใช้
```

- [ ] **Step 2: ก็อปไป `agent/rules/communication.mdc`**

Run:

```bash
cp .cursor/rules/communication.mdc agent/rules/communication.mdc
```

- [ ] **Step 3: Verify คู่ไฟล์เหมือนกัน และไม่มีคำว่า Go ecosystem**

Run:

```bash
diff -q .cursor/rules/communication.mdc agent/rules/communication.mdc
grep -n "Go" .cursor/rules/communication.mdc || echo "no Go refs"
```

Expected:
- `diff` เงียบ (ไม่มีความต่าง)
- `no Go refs`

- [ ] **Step 4: Commit (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

```bash
git add .cursor/rules/communication.mdc agent/rules/communication.mdc
git commit -m "$(cat <<'EOF'
docs: align communication rules with Next/React stack

EOF
)"
```

---

### Task 3: Add tech-stack.mdc (ทั้งสองโฟลเดอร์)

**Files:**
- Create: `.cursor/rules/tech-stack.mdc`
- Create: `agent/rules/tech-stack.mdc`

**Interfaces:**
- Consumes: `package.json` (Next 16 / React 19 / Tailwind 4)
- Produces: alwaysApply rule สำหรับ stack + การอ่าน Next docs

- [ ] **Step 1: สร้าง `.cursor/rules/tech-stack.mdc`**

```markdown
---
description: Tech stack Cosmicbet — Next.js, HeroUI, Tailwind และวิธีอ่าน docs ก่อนเขียนโค้ด
alwaysApply: true
---

# Tech Stack

- Front-end: Next.js 16 (App Router) + React 19 + TypeScript
- UI: HeroUI + Tailwind CSS 4
- Package manager: pnpm
- ก่อนเขียนหรือแก้โค้ด Next — อ่านคู่มือใน `node_modules/next/dist/docs/` เพราะ API อาจต่างจากความรู้เดิม; เคารพ deprecation notices
- อย่าเปลี่ยน stack หรือเพิ่ม UI library อื่นโดยไม่ได้รับคำสั่ง
- HeroUI ถ้ายังไม่ได้อยู่ใน `package.json` ให้ติดตั้งเมื่อเริ่มงาน UI จริง ไม่เดา API จากเวอร์ชันเก่า
- ใช้ CSS variables / design tokens จากแนวทางใน `design.md` และ rule `design-system` — หลีกเลี่ยง hex กระจายใน component
```

- [ ] **Step 2: ก็อปไป `agent/rules/tech-stack.mdc`**

Run:

```bash
cp .cursor/rules/tech-stack.mdc agent/rules/tech-stack.mdc
diff -q .cursor/rules/tech-stack.mdc agent/rules/tech-stack.mdc
```

Expected: `diff` เงียบ

- [ ] **Step 3: Commit (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

```bash
git add .cursor/rules/tech-stack.mdc agent/rules/tech-stack.mdc
git commit -m "$(cat <<'EOF'
docs: add tech-stack agent rules for Next/HeroUI/Tailwind

EOF
)"
```

---

### Task 4: Add design-system.mdc (ทั้งสองโฟลเดอร์)

**Files:**
- Create: `.cursor/rules/design-system.mdc`
- Create: `agent/rules/design-system.mdc`

**Interfaces:**
- Consumes: `design.md` (สรุป ไม่ก็อปทั้งไฟล์)
- Produces: file-scoped rule สำหรับงาน UI

- [ ] **Step 1: สร้าง `.cursor/rules/design-system.mdc`**

```markdown
---
description: สรุป design system Cosmicbet — tokens, layout, ข้อห้าม; รายละเอียดเต็มใน design.md
globs: "**/*.{tsx,css}"
alwaysApply: false
---

# Design System (summary)

ต้นฉบับเต็ม: `design.md` ที่ root — อ่านก่อนลงมือทำ UI ที่เกี่ยวกับ layout / visual

- พื้นผิวม่วงเข้มเริ่ม `#19183B` ไล่ไปม่วงเกือบดำ; ใช้ CSS variables ส่วนกลาง ห้ามกระจาย hex ซ้ำ
- Primary CTA ส่วนบนใช้ Indigo → Blue ได้; แยกจาก gradient พื้นผิว
- Feature cards, Jackpot, Bottom Nav: ไอคอนเรียบสีลาเวนเดอร์ — ห้าม 3D / neon / glow / ม่วงสด
- Mobile first; content กึ่งกลาง; `max-width` 1200px; gutter จาก tokens ใน `design.md`
- ลำดับ section ของหน้าเต็มตามหมวด 5 ใน `design.md`; อย่าเพิ่ม Header/Nav ซ้ำเมื่อประกอบจากภาพแยกส่วน
- Mockup เป็นแนวทางภาพรวม ไม่ใช่ขนาด CSS จริง — ห้ามยืดหน้าตามความสูงภาพ
- เกณฑ์ตรวจก่อนส่ง: หมวด 10 ใน `design.md` หรือ skill `ui-qa-checklist`
```

- [ ] **Step 2: ก็อปและ verify**

Run:

```bash
cp .cursor/rules/design-system.mdc agent/rules/design-system.mdc
diff -q .cursor/rules/design-system.mdc agent/rules/design-system.mdc
grep -n "design.md" .cursor/rules/design-system.mdc
```

Expected: `diff` เงียบ; มีการอ้าง `design.md` อย่างน้อยหนึ่งบรรทัด

- [ ] **Step 3: Commit (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

```bash
git add .cursor/rules/design-system.mdc agent/rules/design-system.mdc
git commit -m "$(cat <<'EOF'
docs: add Cosmicbet design-system summary rules

EOF
)"
```

---

### Task 5: Add frontend-components.mdc (ทั้งสองโฟลเดอร์)

**Files:**
- Create: `.cursor/rules/frontend-components.mdc`
- Create: `agent/rules/frontend-components.mdc`

**Interfaces:**
- Consumes: รายชื่อ component จาก `design.md` หมวด 9
- Produces: file-scoped rule สำหรับโครงสร้าง component

- [ ] **Step 1: สร้าง `.cursor/rules/frontend-components.mdc`**

```markdown
---
description: โครงสร้าง component Cosmicbet — แยกชิ้น, data arrays, link vs button
globs: "**/*.{ts,tsx}"
alwaysApply: false
---

# Frontend Components

แยก reusable components อย่างน้อยตามนี้เมื่อสร้างหน้าเต็มหรือส่วนที่เกี่ยวข้อง:

- SectionHeader, CarouselControls
- GameCard, ProviderCard, FeatureActionCard
- JackpotWinnerCard, HallOfFame, FloatingBottomNav

กฎ:

- Render รายการจาก data arrays ที่มี stable IDs — ห้ามคัดลอก markup ทีละหมวดโดยไม่จำเป็น
- แยก mock data ออกจาก service/API; ห้ามนำยอดเงิน/ผู้ชนะตัวอย่างขึ้นเป็นข้อมูล live
- ลิงก์ (`<a>` / Next `Link`) สำหรับ navigation; `button` สำหรับ action; ห้าม nested interactive
- ใช้ asset จริงที่ได้รับ; ถ้าขาดให้ใช้ placeholder ที่สื่อชนิดข้อมูล — ห้ามเปลี่ยนโลโก้แบรนด์หรือ provider เอง
- ถ้ายังไม่มี route/backend ให้แยก callback/contract และแจ้งส่วนที่ยังไม่เชื่อม — ห้ามสร้างผลธุรกรรมสำเร็จปลอม
```

- [ ] **Step 2: ก็อปและ verify**

Run:

```bash
cp .cursor/rules/frontend-components.mdc agent/rules/frontend-components.mdc
diff -q .cursor/rules/frontend-components.mdc agent/rules/frontend-components.mdc
grep -E "FloatingBottomNav|GameCard" .cursor/rules/frontend-components.mdc
```

Expected: `diff` เงียบ; พบชื่อ component ทั้งสอง

- [ ] **Step 3: Commit (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

```bash
git add .cursor/rules/frontend-components.mdc agent/rules/frontend-components.mdc
git commit -m "$(cat <<'EOF'
docs: add frontend component structure rules

EOF
)"
```

---

### Task 6: Ensure personality.mdc mirrored

**Files:**
- Verify/Modify: `.cursor/rules/personality.mdc`
- Verify/Modify: `agent/rules/personality.mdc`

**Interfaces:**
- Consumes: เนื้อหาปัจจุบัน (แพร / พีพี)
- Produces: คู่ไฟล์เหมือนกัน

- [ ] **Step 1: Diff คู่ไฟล์**

Run:

```bash
diff -q .cursor/rules/personality.mdc agent/rules/personality.mdc || true
```

- [ ] **Step 2: ถ้าต่างกัน — ให้ `.cursor` เป็นต้นทางแล้วก็อป**

Run (ทำเมื่อ Step 1 รายงานว่าต่าง):

```bash
cp .cursor/rules/personality.mdc agent/rules/personality.mdc
diff -q .cursor/rules/personality.mdc agent/rules/personality.mdc
```

Expected ท้ายสุด: `diff` เงียบ; เนื้อหายังมีคำว่า `แพร` และ `พีพี`

- [ ] **Step 3: Commit เฉพาะเมื่อมีการเปลี่ยนและผู้ใช้สั่ง**

```bash
git add .cursor/rules/personality.mdc agent/rules/personality.mdc
git commit -m "$(cat <<'EOF'
docs: mirror personality rules across agent folders

EOF
)"
```

---

### Task 7: Add skill cosmicbet-frontend (ทั้งสองโฟลเดอร์)

**Files:**
- Create: `.cursor/skills/cosmicbet-frontend/SKILL.md`
- Create: `agent/skills/cosmicbet-frontend/SKILL.md`

**Interfaces:**
- Consumes: `design.md`, rules `design-system` + `frontend-components`
- Produces: skill workflow สำหรับงาน UI Cosmicbet

- [ ] **Step 1: สร้างโฟลเดอร์และไฟล์ `.cursor/skills/cosmicbet-frontend/SKILL.md`**

```markdown
---
name: cosmicbet-frontend
description: >-
  Builds or edits Cosmicbet betting front-end UI from design.md using Next.js,
  HeroUI, and Tailwind. Use when creating pages/components, implementing
  lobby sections, or when the user mentions Cosmicbet, design.md, or betting UI.
---

# Cosmicbet Frontend

## When to use

งานสร้างหรือแก้หน้า/component ของ Cosmicbet / หน้าเดิมพัน / ตาม `design.md`

## Workflow

1. อ่าน `design.md` (ต้นฉบับ) และ rules `design-system` + `frontend-components` + `tech-stack`
2. อ่าน Next docs ใน `node_modules/next/dist/docs/` ถ้าแตะ App Router / routing / image
3. ทำเฉพาะส่วนที่ผู้ใช้ร้องขอ — คงตำแหน่งสัมพัทธ์ตามลำดับหน้าใน `design.md` หมวด 5
4. ใช้ CSS variables / tokens; แยก reusable components ตามรายชื่อใน rule
5. Mock แยกจาก API; link vs button ให้ถูกความหมาย
6. ก่อนบอกว่าเสร็จ — ใช้ skill `ui-qa-checklist`

## Hard rules

- ไม่เพิ่ม section, เมนู, กราฟิก, สถิติ หรือ copy ที่ผู้ใช้ไม่ได้ให้
- ไม่ยึดความสูงภาพ mockup เป็นความสูงหน้าเว็บ
- Feature / Jackpot / Bottom Nav = ไอคอนเรียบ ไม่ใช่ 3D/neon
- ไม่สร้าง Header หรือ Navigation ซ้ำเมื่อประกอบจากภาพแยกส่วน
```

- [ ] **Step 2: ก็อปทั้งโฟลเดอร์ไป agent**

Run:

```bash
mkdir -p agent/skills/cosmicbet-frontend
cp .cursor/skills/cosmicbet-frontend/SKILL.md agent/skills/cosmicbet-frontend/SKILL.md
diff -q .cursor/skills/cosmicbet-frontend/SKILL.md agent/skills/cosmicbet-frontend/SKILL.md
```

Expected: `diff` เงียบ

- [ ] **Step 3: Commit (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

```bash
git add .cursor/skills/cosmicbet-frontend/SKILL.md agent/skills/cosmicbet-frontend/SKILL.md
git commit -m "$(cat <<'EOF'
docs: add cosmicbet-frontend agent skill

EOF
)"
```

---

### Task 8: Add skill ui-qa-checklist (ทั้งสองโฟลเดอร์)

**Files:**
- Create: `.cursor/skills/ui-qa-checklist/SKILL.md`
- Create: `agent/skills/ui-qa-checklist/SKILL.md`

**Interfaces:**
- Consumes: หมวด 10 ใน `design.md`
- Produces: skill QA ก่อนส่งงาน UI

- [ ] **Step 1: สร้าง `.cursor/skills/ui-qa-checklist/SKILL.md`**

```markdown
---
name: ui-qa-checklist
description: >-
  Runs Cosmicbet UI acceptance checks from design.md before calling work done.
  Use when finishing UI tasks, reviewing front-end output, or when the user asks
  for QA, visual check, or pre-submit review.
---

# Cosmicbet UI QA Checklist

คัดลอก checklist นี้แล้วติ๊กทีละข้อก่อนบอกว่างานเสร็จ (รายละเอียดเต็ม: `design.md` หมวด 10)

- [ ] ลำดับ section ตรงเอกสาร; ไม่มี Header/Nav ซ้ำ
- [ ] พื้นหลักเริ่ม `#19183B`; ไม่มีม่วงสด/neon ใน feature cards, Jackpot, Bottom Nav
- [ ] Feature ทั้งสามใช้ไอคอนเรียบถูกความหมาย; ฝาก/ถอนแยกทิศลูกศรชัด
- [ ] หมวดเกมและ Providers มี View All + arrows; promo carousel มีเฉพาะ dots
- [ ] Providers มีช่องว่างด้านบน 48–56px
- [ ] ข้อความไทยไม่ขาดสระ; ยอดเงินไม่ถูกตัด; โลโก้/ปกเกมไม่เสียสัดส่วนผิดวิธี
- [ ] Floating nav ไม่บังแถวท้าย; มี safe area; focus ใช้ได้
- [ ] ตรวจที่ความกว้าง 360, 390, 768, 1280px; ไม่มี horizontal overflow ที่ไม่ได้ตั้งใจ
- [ ] Search, tabs, View All, arrows ทำงาน; มี loading/empty/error ตามบริบท
- [ ] ไม่ใส่กราฟิกใหม่ / สถิติใหม่ / เมนูใหม่ / copy ที่ผู้ใช้ไม่ได้ให้

ถ้าข้อใดไม่ผ่าน — แก้ก่อนส่ง และอ้าง `design.md` เป็นเกณฑ์ตัดสิน
```

- [ ] **Step 2: ก็อปและ verify**

Run:

```bash
mkdir -p agent/skills/ui-qa-checklist
cp .cursor/skills/ui-qa-checklist/SKILL.md agent/skills/ui-qa-checklist/SKILL.md
diff -q .cursor/skills/ui-qa-checklist/SKILL.md agent/skills/ui-qa-checklist/SKILL.md
```

Expected: `diff` เงียบ

- [ ] **Step 3: Commit (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

```bash
git add .cursor/skills/ui-qa-checklist/SKILL.md agent/skills/ui-qa-checklist/SKILL.md
git commit -m "$(cat <<'EOF'
docs: add Cosmicbet UI QA checklist skill

EOF
)"
```

---

### Task 9: Write AGENTS.md and agent.md (เนื้อหาเดียวกัน)

**Files:**
- Modify: `AGENTS.md`
- Create/Modify: `agent.md`

**Interfaces:**
- Consumes: โครงสร้างไฟล์ทั้งหมดจาก Task 1–8
- Produces: แผนที่โปรเจกต์ + sync checklist คู่กัน

- [ ] **Step 1: เขียน `AGENTS.md` ทั้งไฟล์เป็นเนื้อหานี้**

หมายเหตุ: คง Next.js agent notice ไว้ท้ายไฟล์

```markdown
# Cosmicbet — Agent Project Map

Front-end หน้าเล่นเว็บเดิมพัน **Cosmicbet**  
Stack: Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · HeroUI · TypeScript · pnpm

## อ่านอะไรก่อนทำงาน

| งาน | อ่านก่อน |
|-----|----------|
| ภาพรวมโปรเจกต์ / sync docs | `AGENTS.md` หรือ `agent.md` (ไฟล์นี้) |
| ดีไซน์เต็ม (tokens, sections, QA) | `design.md` |
| บุคลิกการตอบ | `agent/rules/personality.mdc` หรือ `.cursor/rules/personality.mdc` |
| ภาษา / คอมเมนต์ / commit | `*/rules/communication.mdc` |
| Stack & Next docs | `*/rules/tech-stack.mdc` + `node_modules/next/dist/docs/` |
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
- [ ] `.cursor/rules/design-system.mdc` ↔ `agent/rules/design-system.mdc`
- [ ] `.cursor/rules/frontend-components.mdc` ↔ `agent/rules/frontend-components.mdc`
- [ ] `.cursor/skills/cosmicbet-frontend/SKILL.md` ↔ `agent/skills/cosmicbet-frontend/SKILL.md`
- [ ] `.cursor/skills/ui-qa-checklist/SKILL.md` ↔ `agent/skills/ui-qa-checklist/SKILL.md`

คำสั่งตรวจเร็ว:

```bash
diff -q AGENTS.md agent.md
for f in personality communication tech-stack design-system frontend-components; do
  diff -q ".cursor/rules/$f.mdc" "agent/rules/$f.mdc"
done
diff -q .cursor/skills/cosmicbet-frontend/SKILL.md agent/skills/cosmicbet-frontend/SKILL.md
diff -q .cursor/skills/ui-qa-checklist/SKILL.md agent/skills/ui-qa-checklist/SKILL.md
```

ไม่มีความต่าง = sync ครบ

## Hard rules สั้น ๆ

- ยึด `design.md` เป็นต้นฉบับดีไซน์; rules เป็นสรุปเท่านั้น
- อย่าเพิ่ม UI นอกสcope ที่ผู้ใช้ขอ
- อย่าใช้ skill/path เก่า Monday ChatAi หรือ Go template

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
```

- [ ] **Step 2: ก็อปไป `agent.md`**

Run:

```bash
cp AGENTS.md agent.md
diff -q AGENTS.md agent.md
```

Expected: `diff` เงียบ

- [ ] **Step 3: ยืนยัน `CLAUDE.md` ยังชี้ `@AGENTS.md`**

Run:

```bash
cat CLAUDE.md
```

Expected: มี `@AGENTS.md` (ไม่ต้องแก้ถ้ายังชี้ถูก)

- [ ] **Step 4: Commit (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

```bash
git add AGENTS.md agent.md
git commit -m "$(cat <<'EOF'
docs: add Cosmicbet agent project map and sync checklist

EOF
)"
```

---

### Task 10: Final mirror verification

**Files:**
- Verify: คู่ไฟล์ทั้งหมดใน sync checklist

**Interfaces:**
- Consumes: ผลลัพธ์ Task 1–9
- Produces: หลักฐานว่าเกณฑ์สำเร็จของ spec ผ่าน

- [ ] **Step 1: รันชุด diff ทั้งชุด**

Run:

```bash
set -e
test -s design.md
test ! -f .cursor/skills/SKILL.md
diff -q AGENTS.md agent.md
for f in personality communication tech-stack design-system frontend-components; do
  diff -q ".cursor/rules/$f.mdc" "agent/rules/$f.mdc"
done
diff -q .cursor/skills/cosmicbet-frontend/SKILL.md agent/skills/cosmicbet-frontend/SKILL.md
diff -q .cursor/skills/ui-qa-checklist/SKILL.md agent/skills/ui-qa-checklist/SKILL.md
grep -q "Go ecosystem" .cursor/rules/communication.mdc && exit 1 || true
grep -q "Cosmicbet" AGENTS.md
echo "ALL MIRRORS OK"
```

Expected: พิมพ์ `ALL MIRRORS OK` และ exit code 0

- [ ] **Step 2: ยืนยันไม่มี dependency / UI ใหม่ในรอบนี้**

Run:

```bash
git status --short
```

Expected: เห็นเฉพาะไฟล์ docs/rules/skills/`design.md`/`AGENTS.md`/`agent.md` — ไม่มี `package.json` เปลี่ยนจากการติดตั้ง HeroUI และไม่มีไฟล์หน้าเว็บใหม่ที่ไม่ได้เกี่ยวกับ docs

- [ ] **Step 3: Commit รวมทั้งชุด (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

ถ้ายังไม่ได้ commit ราย task ให้รวมครั้งเดียว:

```bash
git add AGENTS.md agent.md design.md \
  .cursor/rules agent/rules \
  .cursor/skills agent/skills \
  docs/superpowers/specs/2026-09-14-cosmicbet-agent-docs-design.md \
  docs/superpowers/plans/2026-09-14-cosmicbet-agent-docs.md
git status
git commit -m "$(cat <<'EOF'
docs: add Cosmicbet agent rules, skills, and project map

Mirror agent guidance for Cursor and other IDEs, with design.md as the source of truth.

EOF
)"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| กู้/มี `design.md` | Task 1 (verify — ไฟล์มีเนื้อหาแล้ว) |
| ลบ skill Monday/Go | Task 1 |
| อัปเดต communication (เลิก Go) | Task 2 |
| tech-stack.mdc คู่กัน | Task 3 |
| design-system.mdc คู่กัน | Task 4 |
| frontend-components.mdc คู่กัน | Task 5 |
| personality มิเรอร์ | Task 6 |
| skill cosmicbet-frontend | Task 7 |
| skill ui-qa-checklist | Task 8 |
| AGENTS.md = agent.md + sync checklist | Task 9 |
| เกณฑ์สำเร็จ / ไม่ติด UI deps | Task 10 |
| ไม่มี sync script | ไม่มี task สร้าง script |
| Commit ตามผู้ใช้สั่ง | ทุก commit step ติด optional |

Placeholder scan: ไม่มี TBD / “similar to Task N” / เนื้อหาไฟล์ครบในแต่ละ create step

## Addendum — 2026-09-14 (stack update)

UI library เปลี่ยนจาก HeroUI เป็น **shadcn/ui (Radix)** — ดู `docs/superpowers/plans/2026-09-14-heroui-to-shadcn.md`
