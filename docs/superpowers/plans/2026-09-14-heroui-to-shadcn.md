# HeroUI → shadcn/ui Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ติดตั้ง shadcn/ui (Radix) ในโปรเจกต์ Cosmicbet, bridge tokens จาก `design.md`/`globals.css`, และลบ HeroUI ออกจากเอกสาร agent ทั้งหมด

**Architecture:** Cosmicbet CSS variables คงเป็นต้นฉบับใน `app/globals.css`; shadcn semantic tokens ชี้ไปที่ค่าเหล่านั้น; shadcn components อยู่ที่ `components/ui` (root) แยกจาก `app/components/ui` custom; docs ใน `.cursor/` และ `agent/` มิเรอร์กัน

**Tech Stack:** Next.js 16 · React 19 · Tailwind CSS 4 · shadcn/ui (Radix) · TypeScript · pnpm

## Global Constraints

- ไม่ refactor หน้า lobby / custom components ใน `app/components/` ให้เป็น shadcn ทั้งก้อน
- ไม่ `shadcn add` ชุดใหญ่ (Button/Tabs/Dialog ฯลฯ) นอกจากที่ init บังคับ
- ไม่แก้เนื้อหา visual ใน `design.md`
- ไม่มี HeroUI ใน dependencies (และไม่ติดตั้งเพื่อถอน)
- shadcn base = **radix**; theme dark; CSS variables on
- Path shadcn UI = `components/ui` (alias `@/components/ui`) — **ห้าม** ทับ `app/components/ui/`
- คู่ไฟล์ `.cursor/` ↔ `agent/` ที่แตะต้องเหมือนกัน
- Commit เฉพาะเมื่อผู้ใช้สั่ง — ขั้น commit ในแผนเป็น optional
- Spec: `docs/superpowers/specs/2026-09-14-heroui-to-shadcn-design.md`

## File map

| Path | Responsibility |
|------|----------------|
| `components.json` | shadcn project config |
| `components/ui/*` | shadcn primitives (ถ้า init สร้าง) |
| `lib/utils.ts` | `cn()` helper (ถ้า init สร้าง) |
| `app/globals.css` | Cosmicbet tokens + shadcn theme bridge + shell utilities |
| `*/rules/tech-stack.mdc` | Stack = shadcn ไม่ใช่ HeroUI |
| `*/rules/shadcn-ui.mdc` | กฎใช้ shadcn |
| `*/skills/cosmicbet-frontend/SKILL.md` | Workflow อ้าง shadcn |
| `AGENTS.md` / `agent.md` | Stack + sync checklist รวม `shadcn-ui.mdc` |
| `docs/superpowers/specs/2026-09-14-cosmicbet-agent-docs-design.md` | Addendum: stack เปลี่ยนเป็น shadcn |
| `docs/superpowers/plans/2026-09-14-cosmicbet-agent-docs.md` | Addendum สั้น ๆ ชี้ stack ใหม่ |

---

### Task 1: Backup globals.css และรัน shadcn init (Radix)

**Files:**
- Create: `components.json`, likely `lib/utils.ts`, possibly `components/ui/`
- Modify: `package.json`, `pnpm-lock.yaml`, possibly `app/globals.css` (CLI อาจแตะ)
- Preserve: `app/components/ui/*` (ห้ามลบ)

**Interfaces:**
- Consumes: Next App Router + Tailwind 4 + `@/*` → `./*`
- Produces: `components.json` with `"style"`/`base` radix; deps installed; Cosmicbet `app/components/ui` ยังอยู่

- [ ] **Step 1: Backup CSS ก่อน init**

Run:

```bash
cp app/globals.css app/globals.css.pre-shadcn.bak
wc -l app/globals.css.pre-shadcn.bak
```

Expected: สำเนามีบรรทัดเท่ากับ `globals.css` ปัจจุบัน (~110)

- [ ] **Step 2: Init shadcn ด้วย Radix (non-interactive)**

Run จาก repo root:

```bash
pnpm dlx shadcn@latest init -y --base radix --css-variables
```

ถ้า CLI ถาม/สร้าง path ให้ยืนยันว่า components ไปที่ `components` (root) ไม่ใช่ `app/components`  
ถ้าได้ defaults ที่ไม่ใช่ radix: แก้ `components.json` ให้ `"rsc": true` ตาม Next และฐานเป็น radix ตามเอกสาร CLI ล่าสุด แล้วบันทึกใน report

- [ ] **Step 3: ยืนยัน artifacts และไม่ชน path**

Run:

```bash
test -f components.json && echo "components.json OK"
test -d app/components/ui && echo "custom app/components/ui preserved"
ls components/ui 2>/dev/null || echo "components/ui may be empty until first add (OK for init)"
grep -i heroui package.json || echo "no HeroUI in package.json"
cat components.json
```

Expected: มี `components.json`; `app/components/ui` ยังอยู่; ไม่มี heroui ใน package.json

- [ ] **Step 4: Commit (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

```bash
git add components.json package.json pnpm-lock.yaml lib app/globals.css components
git commit -m "$(cat <<'EOF'
chore: initialize shadcn/ui with Radix base

EOF
)"
```

---

### Task 2: Merge globals.css — Cosmicbet tokens + shadcn bridge

**Files:**
- Modify: `app/globals.css`
- Reference: `app/globals.css.pre-shadcn.bak`, `design.md` tokens

**Interfaces:**
- Consumes: Cosmicbet `:root` vars จาก backup; shadcn theme vars ที่ CLI ใส่ (ถ้ามี)
- Produces: ไฟล์ CSS เดียวที่มี (1) Cosmicbet tokens (2) shadcn semantic bridge (3) shell utilities

- [ ] **Step 1: ตรวจว่า CLI ทำอะไรกับ globals.css**

Run:

```bash
diff -u app/globals.css.pre-shadcn.bak app/globals.css | head -120 || true
```

บันทึกผลใน report — ถ้าไม่ต่าง ยังต้องเพิ่ม bridge; ถ้าต่าง ต้อง merge ไม่ทับ Cosmicbet

- [ ] **Step 2: เขียน `app/globals.css` ให้มีโครงสร้างนี้ (รวมเนื้อหาจริง)**

ลำดับที่ต้องการ:

1. `@import "tailwindcss";` และ imports ที่ shadcn ต้องการ (เช่น `tw-animate-css` ถ้า init ใส่)
2. `:root` Cosmicbet ทั้งชุดจาก backup (`--bg-page`, `--surface-*`, `--text-*`, spacing, radius, gradients, …)
3. shadcn semantic bridge ใน `:root` (และ `.dark` ถ้า CLI ใช้) โดย map:

```css
  /* shadcn ↔ Cosmicbet bridge */
  --background: var(--bg-page);
  --foreground: var(--text-primary);
  --card: var(--surface-mid);
  --card-foreground: var(--text-primary);
  --popover: var(--surface-mid);
  --popover-foreground: var(--text-primary);
  --primary: #4930df;
  --primary-foreground: #f5f4fc;
  --secondary: var(--surface-hover);
  --secondary-foreground: var(--text-primary);
  --muted: var(--surface-hover);
  --muted-foreground: var(--text-muted);
  --accent: var(--surface-selected);
  --accent-foreground: var(--text-primary);
  --destructive: #ef4444;
  --border: var(--border-subtle);
  --input: var(--border-subtle);
  --ring: var(--focus-ring);
  --radius: 12px; /* = --radius-control */
```

4. `@theme inline` ของ Cosmicbet จาก backup **บวก** mapping สี shadcn ที่ CLI ต้องการ (เช่น `--color-background: var(--background);` ฯลฯ) — รวมทั้งสอง ไม่เลือกอย่างใดอย่างหนึ่ง
5. `body` + `.page-shell` + `.surface` + `.no-scrollbar` + focus-visible จาก backup
6. `color-scheme: dark` คงไว้

ถ้า CLI ใส่ `@custom-variant dark` หรือ utility อื่น ให้เก็บไว้เหนือ/คู่กับบล็อกเหล่านี้ตามที่จำเป็นให้ build ผ่าน

- [ ] **Step 3: ลบไฟล์ backup หลัง merge สำเร็จ (หรือเก็บไว้จน Task 5)**

แนะนำเก็บ `app/globals.css.pre-shadcn.bak` จนผ่าน `pnpm build` แล้วค่อยลบใน Task 5

- [ ] **Step 4: Verify tokens ยังอยู่**

Run:

```bash
grep -E "--bg-page|--surface-start|--action-gradient|page-shell" app/globals.css
grep -E "--background:|--primary:" app/globals.css
```

Expected: พบทั้ง Cosmicbet และ bridge

- [ ] **Step 5: Commit (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

```bash
git add app/globals.css
git commit -m "$(cat <<'EOF'
style: bridge shadcn theme tokens to Cosmicbet palette

EOF
)"
```

---

### Task 3: อัปเดต tech-stack + สร้าง shadcn-ui rules (มิเรอร์)

**Files:**
- Modify: `.cursor/rules/tech-stack.mdc`, `agent/rules/tech-stack.mdc`
- Create: `.cursor/rules/shadcn-ui.mdc`, `agent/rules/shadcn-ui.mdc`

**Interfaces:**
- Consumes: `components.json` จาก Task 1
- Produces: docs ที่ห้าม HeroUI และบังคับ shadcn/Radix

- [ ] **Step 1: เขียน `.cursor/rules/tech-stack.mdc` ทั้งไฟล์**

```markdown
---
description: Tech stack Cosmicbet — Next.js, shadcn/ui, Tailwind และวิธีอ่าน docs ก่อนเขียนโค้ด
alwaysApply: true
---

# Tech Stack

- Front-end: Next.js 16 (App Router) + React 19 + TypeScript
- UI: shadcn/ui (Radix) + Tailwind CSS 4
- Package manager: pnpm
- ก่อนเขียนหรือแก้โค้ด Next — อ่านคู่มือใน `node_modules/next/dist/docs/` เพราะ API อาจต่างจากความรู้เดิม; เคารพ deprecation notices
- ก่อนเพิ่ม UI primitive — อ่าน `components.json` และใช้ `pnpm dlx shadcn@latest` (อย่าเดา API)
- อย่าเปลี่ยน stack หรือเพิ่ม UI library อื่น (รวม HeroUI) โดยไม่ได้รับคำสั่ง
- Cosmicbet design tokens ใน `design.md` / `app/globals.css` เป็นต้นฉบับ; shadcn semantic colors ต้องใช้ค่าที่ bridge แล้ว — ห้ามใช้ธีมม่วงสด default
- shadcn components อยู่ที่ `components/ui` (`@/components/ui`); custom Cosmicbet อยู่ที่ `app/components/` — อย่าปนหรือทับกันโดยไม่ตั้งใจ
```

- [ ] **Step 2: เขียน `.cursor/rules/shadcn-ui.mdc` ทั้งไฟล์**

```markdown
---
description: แนวทางใช้ shadcn/ui ใน Cosmicbet — CLI, compose, tokens
globs: "**/*.{ts,tsx,css}"
alwaysApply: false
---

# shadcn/ui

- เพิ่ม component ด้วย `pnpm dlx shadcn@latest add <name>` — อย่า copy จากอินเทอร์เน็ตคนละเวอร์ชัน
- ใช้ primitive ที่มีใน `components/ui` ก่อนเขียน markup เอง (Button, Dialog, Tabs, …)
- Base = Radix: ใช้ `asChild` เมื่อต้องประกอบ trigger/custom element
- สไตล์: semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`) ที่ bridge กับ Cosmicbet แล้ว; layout ระยะ/surface พิเศษใช้ Cosmicbet vars จาก `design.md`
- ห้าม override สี component ด้วย hex กระจาย; ห้ามนำ HeroUI / library UI อื่นเข้ามาแทน
- Icons: ชุดเดียวทั้งโปรเจกต์ (lucide จาก shadcn หรือ SVG ตาม `design.md`) — น้ำหนักสม่ำเสมอ ไม่ผสม 3D/emoji ใน nav/feature/jackpot
```

- [ ] **Step 3: มิเรอร์ไป agent**

```bash
cp .cursor/rules/tech-stack.mdc agent/rules/tech-stack.mdc
cp .cursor/rules/shadcn-ui.mdc agent/rules/shadcn-ui.mdc
diff -q .cursor/rules/tech-stack.mdc agent/rules/tech-stack.mdc
diff -q .cursor/rules/shadcn-ui.mdc agent/rules/shadcn-ui.mdc
```

Expected: ทั้งสอง `diff` เงียบ

- [ ] **Step 4: Commit (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

```bash
git add .cursor/rules/tech-stack.mdc .cursor/rules/shadcn-ui.mdc agent/rules/tech-stack.mdc agent/rules/shadcn-ui.mdc
git commit -m "$(cat <<'EOF'
docs: switch agent rules from HeroUI to shadcn/ui

EOF
)"
```

---

### Task 4: อัปเดต skill + AGENTS.md/agent.md + addendum docs

**Files:**
- Modify: `.cursor/skills/cosmicbet-frontend/SKILL.md`, `agent/skills/cosmicbet-frontend/SKILL.md`
- Modify: `AGENTS.md`, `agent.md`
- Modify: `docs/superpowers/specs/2026-09-14-cosmicbet-agent-docs-design.md` (addendum ท้ายไฟล์)
- Modify: `docs/superpowers/plans/2026-09-14-cosmicbet-agent-docs.md` (addendum สั้นท้ายไฟล์)

**Interfaces:**
- Consumes: rules จาก Task 3
- Produces: ไม่มี HeroUI ใน active agent docs; sync checklist รวม `shadcn-ui.mdc`

- [ ] **Step 1: แก้ description ใน cosmicbet-frontend SKILL**

ในทั้งสอง path เปลี่ยนข้อความที่พูด HeroUI เป็น shadcn/ui (Radix) เช่น:

```yaml
description: >-
  Builds or edits Cosmicbet betting front-end UI from design.md using Next.js,
  shadcn/ui (Radix), and Tailwind. Use when creating pages/components, implementing
  lobby sections, or when the user mentions Cosmicbet, design.md, or betting UI.
```

ใน Workflow เพิ่ม: อ่าน `components.json` + rule `shadcn-ui` เมื่อแตะ primitive

- [ ] **Step 2: อัปเดต `AGENTS.md` แล้ว `cp` ไป `agent.md`**

- บรรทัด stack: `… · shadcn/ui (Radix) · …` แทน HeroUI
- ตารางอ่านไฟล์: เพิ่มแถว `shadcn / UI primitives` → `*/rules/shadcn-ui.mdc` + `components.json`
- Sync checklist: เพิ่ม  
  `- [ ] .cursor/rules/shadcn-ui.mdc ↔ agent/rules/shadcn-ui.mdc`  
  และใน bash loop เพิ่ม `shadcn-ui` ในรายการ rules

จากนั้น:

```bash
cp AGENTS.md agent.md
diff -q AGENTS.md agent.md
```

- [ ] **Step 3: Addendum ใน spec/plan เก่า**

ท้าย `docs/superpowers/specs/2026-09-14-cosmicbet-agent-docs-design.md` เพิ่ม:

```markdown
## Addendum — 2026-09-14 (stack update)

UI library เปลี่ยนจาก HeroUI เป็น **shadcn/ui (Radix)**  
ดูรายละเอียด: `docs/superpowers/specs/2026-09-14-heroui-to-shadcn-design.md`
```

ท้าย plan เก่า `docs/superpowers/plans/2026-09-14-cosmicbet-agent-docs.md` เพิ่มข้อความสั้นแบบเดียวกัน

- [ ] **Step 4: Grep เคลียร์ active docs**

```bash
rg -n -i "heroui" AGENTS.md agent.md .cursor/rules .cursor/skills agent/rules agent/skills || echo "CLEAN"
```

Expected: `CLEAN` หรือเหลือแค่คำว่า HeroUI ในประโยคห้ามใช้ (เช่น "อย่าเพิ่ม HeroUI") ซึ่งยอมรับได้ — ต้องไม่มีคำว่าใช้ HeroUI เป็น stack ปัจจุบัน

- [ ] **Step 5: มิเรอร์ skill**

```bash
cp .cursor/skills/cosmicbet-frontend/SKILL.md agent/skills/cosmicbet-frontend/SKILL.md
diff -q .cursor/skills/cosmicbet-frontend/SKILL.md agent/skills/cosmicbet-frontend/SKILL.md
```

- [ ] **Step 6: Commit (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

```bash
git add AGENTS.md agent.md .cursor/skills agent/skills docs/superpowers
git commit -m "$(cat <<'EOF'
docs: replace HeroUI references with shadcn/ui in agent maps

EOF
)"
```

---

### Task 5: Verify build + final checklist

**Files:**
- Verify only; อาจลบ `app/globals.css.pre-shadcn.bak`
- Fix: `app/globals.css` หรือ config ถ้า build พัง

**Interfaces:**
- Consumes: ผล Task 1–4
- Produces: หลักฐานเกณฑ์สำเร็จของ spec

- [ ] **Step 1: Mirror + content checks**

```bash
set -e
test -f components.json
test -d app/components/ui
diff -q AGENTS.md agent.md
diff -q .cursor/rules/tech-stack.mdc agent/rules/tech-stack.mdc
diff -q .cursor/rules/shadcn-ui.mdc agent/rules/shadcn-ui.mdc
diff -q .cursor/skills/cosmicbet-frontend/SKILL.md agent/skills/cosmicbet-frontend/SKILL.md
grep -q "shadcn" .cursor/rules/tech-stack.mdc
grep -q "--bg-page" app/globals.css
grep -q "--background:" app/globals.css
(grep -qi "UI: HeroUI" AGENTS.md && exit 1) || true
echo "CHECKS_OK"
```

Expected: `CHECKS_OK`

- [ ] **Step 2: Lint / build**

```bash
pnpm lint
pnpm build
```

Expected: ทั้งคู่ exit 0  
ถ้า fail เพราะ CSS/theme — แก้ใน Task นี้ให้ผ่านก่อนปิด

- [ ] **Step 3: ลบ backup ถ้า build ผ่าน**

```bash
rm -f app/globals.css.pre-shadcn.bak
```

- [ ] **Step 4: Commit รวม (optional — เฉพาะเมื่อผู้ใช้สั่ง)**

```bash
git add -A
git status
git commit -m "$(cat <<'EOF'
feat: adopt shadcn/ui (Radix) and drop HeroUI from agent docs

EOF
)"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| Init shadcn Radix | Task 1 |
| Path ไม่ชน `app/components/ui` | Task 1 + 5 |
| Token bridge Cosmicbet ↔ shadcn | Task 2 |
| tech-stack + shadcn-ui rules มิเรอร์ | Task 3 |
| skill + AGENTS/agent + addendum | Task 4 |
| ไม่มี HeroUI เป็น stack ปัจจุบัน | Task 4–5 |
| ไม่ refactor lobby / ไม่ add ชุดใหญ่ | Global + Task 1 |
| build/lint ผ่าน | Task 5 |

Placeholder scan: ไม่มี TBD; เนื้อหาไฟล์ docs ระบุใน task; init command มี `--base radix`
