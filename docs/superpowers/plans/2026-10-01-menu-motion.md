# Menu Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ให้เมนู `RightMenuDrawer` เปิดแบบ stagger, ลอยเมื่อชี้ด้วยเมาส์บนเดสก์ท็อป, และยุบเมื่อกดบนมือถือ โดยแอนิเมชันเปิดไม่ทับ `transform` ของท่าชี้และท่ากด

**Architecture:** แก้เฉพาะ `app/styles/menu-drawer.css` คลาส entrance ที่มีอยู่ใน `RightMenuDrawer.tsx` ใช้ต่อ Keyframe เปิดเมนูจอง `opacity`, `translate`, `scale` ท่าชี้และท่ากดจอง `transform` การ์ดลอยและแถวขยับอยู่ใต้ `@media (hover: hover) and (pointer: fine)` ท่ากดยุบเป็น `:active` นอก media นั้น แล้วให้ `:active` ภายใน media ชนะบนจอเมาส์

**Tech Stack:** Next.js 16, CSS ใน `app/styles/menu-drawer.css`, token `--motion-fast` `--ease-out` `--ease-in` `--accent-primary`, ตรวจด้วย `node:test` ผ่าน `pnpm dlx tsx --test`

## Global Constraints

- ตอนเปิดใช้ `opacity` และ `translate` เท่านั้น keyframe ห้ามกำหนด `transform`
- ตอนชี้และกดใช้ `transform` เท่านั้น
- การ์ดลอยเฉพาะ `@media (hover: hover) and (pointer: fine)`
- แถวแนวตั้งบนเดสก์ท็อปไม่ยกทั้งแถว ขยับไอคอนกับลูกศร
- มือถือใช้ `:active` สำหรับยุบ และห้ามมีกฎที่ทำให้ `:hover` บนจอ coarse ค้างเป็นท่าลอย
- `prefers-reduced-motion: reduce` ปิด stagger และไม่เปลี่ยน `transform` ตอนชี้หรือกด แต่ยังเปลี่ยนสีพื้นได้
- แก้ `app/styles/menu-drawer.css` อย่างเดียว ไม่เพิ่ม event ใน `RightMenuDrawer.tsx` และไม่เพิ่มไฟล์ CSS
- ไม่ใส่ motion ให้ bottom nav, sidebar, หรือการ์ดล็อบบี้
- ไม่เพิ่ม token และไม่เพิ่มไลบรารีแอนิเมชัน

## File structure

- Modify: `app/styles/menu-drawer.css` — keyframe เปิดเมนู และกติกาชี้/กดของการ์ดกับแถว
- Create: `scripts/menu-motion.test.ts` — อ่านไฟล์ CSS แล้วล็อกช่องทาง motion
- Do not modify: `app/components/layout/RightMenuDrawer.tsx` (คลาส `menu-enter-*` และ `--menu-enter-i` พร้อมแล้ว)

---

### Task 1: ล็อก keyframe เปิดเมนู

**Files:**
- Create: `scripts/menu-motion.test.ts`
- Modify: `app/styles/menu-drawer.css` (เฉพาะ `@keyframes menu-enter-logo`, `menu-enter-avatar`, `menu-enter-item`)
- Test: `scripts/menu-motion.test.ts`

**Interfaces:**
- Consumes: ไม่มี
- Produces: `keyframeBody(source, name)` ในไฟล์เทสต์ และ keyframe สามตัวที่ไม่มี `transform`

- [ ] **Step 1: Write the failing test**

สร้าง `scripts/menu-motion.test.ts`

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../app/styles/menu-drawer.css", import.meta.url), "utf8");

function keyframeBody(source: string, name: string): string {
  const start = source.indexOf(`@keyframes ${name}`);
  assert.notEqual(start, -1, `missing @keyframes ${name}`);
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  throw new Error(`unclosed @keyframes ${name}`);
}

test("entrance keyframes do not set transform", () => {
  for (const name of ["menu-enter-logo", "menu-enter-avatar", "menu-enter-item"]) {
    const body = keyframeBody(css, name);
    assert.equal(/\btransform\s*:/.test(body), false, name);
  }
  assert.match(keyframeBody(css, "menu-enter-logo"), /translate:\s*0 -10px/);
  assert.match(keyframeBody(css, "menu-enter-avatar"), /scale:\s*0\.82/);
  assert.match(keyframeBody(css, "menu-enter-item"), /translate:\s*0 14px/);
  assert.match(
    css,
    /\.menu-enter-item\s*\{[^}]*animation-delay:\s*calc\(120ms \+ var\(--menu-enter-i, 0\) \* 42ms\)/,
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm dlx tsx --test scripts/menu-motion.test.ts`

Expected: FAIL เพราะ `menu-enter-logo` และ `menu-enter-avatar` ยังมี `transform:`

- [ ] **Step 3: Write minimal implementation**

ใน `app/styles/menu-drawer.css` แทนที่ keyframe สามตัวนี้ทั้งก้อน คงระยะเวลาและ `animation-delay` ของ `.menu-enter-*` ไว้เหมือนเดิม

```css
@keyframes menu-enter-logo {
  from {
    opacity: 0;
    translate: 0 -10px;
  }

  to {
    opacity: 0.98;
    translate: 0 0;
  }
}

@keyframes menu-enter-avatar {
  from {
    opacity: 0;
    scale: 0.82;
  }

  to {
    opacity: 1;
    scale: 1;
  }
}

@keyframes menu-enter-item {
  from {
    opacity: 0;
    translate: 0 14px;
    scale: 0.94;
  }

  to {
    opacity: 1;
    translate: 0 0;
    scale: 1;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm dlx tsx --test scripts/menu-motion.test.ts`

Expected: PASS 1 test

- [ ] **Step 5: Commit**

```bash
git add scripts/menu-motion.test.ts app/styles/menu-drawer.css
git commit -m "$(cat <<'EOF'
fix(menu): keep entrance motion off the transform channel

EOF
)"
```

---

### Task 2: ท่าลอยบนเดสก์ท็อปและท่ากดบนมือถือ

**Files:**
- Modify: `scripts/menu-motion.test.ts`
- Modify: `app/styles/menu-drawer.css` (กติกา `.menu-grid-tile` และ `.menu-list-row` ตั้งแต่บล็อก reduced-motion เดิมจนจบ `.menu-list-row:focus-visible` ก่อน `.menu-drawer-promo-card`)
- Test: `scripts/menu-motion.test.ts`

**Interfaces:**
- Consumes: keyframe จาก Task 1 และคลาส `menu-grid-tile`, `menu-grid-icon`, `menu-grid-label`, `menu-list-row`, `menu-list-icon`, `menu-list-chevron`, `menu-enter-item`
- Produces: กติกาชี้ใต้ `(hover: hover) and (pointer: fine)`, กติกา `:active` นอก media นั้น, และบล็อก `prefers-reduced-motion` ที่อยู่หลังกติกาชี้

- [ ] **Step 1: Write the failing test**

ต่อท้าย `scripts/menu-motion.test.ts`

```ts
test("fine pointer hover lifts the grid card", () => {
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(css, /translateY\(-8px\) scale\(1\.03\)/);
  assert.match(css, /translateY\(-4px\) scale\(1\.12\)/);
  assert.match(css, /translateX\(2px\) scale\(1\.07\)/);
  assert.match(css, /translateX\(3px\)/);
  assert.match(css, /0 0 0 4px color-mix\(in srgb, var\(--accent-primary\) 55%/);
  assert.equal(css.includes("pointer: coarse"), false);
});

test("press scale is stronger on touch than on a mouse", () => {
  assert.match(css, /\.menu-grid-tile:active\s*\{[^}]*scale\(0\.96\)/);
  assert.match(css, /\.menu-grid-tile:active \.menu-grid-icon\s*\{[^}]*scale\(0\.94\)/);
  assert.match(css, /translateY\(0\) scale\(0\.97\)/);
  assert.match(css, /\.menu-grid-tile:active \.menu-grid-icon\s*\{[^}]*scale\(1\.04\)/);
  assert.match(css, /\.menu-list-row:active\s*\{[^}]*scale\(0\.995\)/);
});

test("reduced motion clears transform after the hover rules", () => {
  const hoverAt = css.indexOf("translateY(-8px)");
  const reducedAt = css.lastIndexOf("prefers-reduced-motion: reduce");
  assert.ok(hoverAt > -1);
  assert.ok(reducedAt > hoverAt);
  const tail = css.slice(reducedAt);
  assert.match(tail, /\.menu-grid-tile:active[\s\S]*?transform:\s*none/);
  assert.match(tail, /\.menu-list-row:active[\s\S]*?transform:\s*none/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm dlx tsx --test scripts/menu-motion.test.ts`

Expected: FAIL ที่เทสต์ใหม่ เพราะไฟล์ยังมี `pointer: coarse` และยังไม่มี `translateY(-8px)` เทสต์ entrance จาก Task 1 ยัง PASS

- [ ] **Step 3: Write minimal implementation**

ลบบล็อก `@media (prefers-reduced-motion: reduce)` ก้อนเก่าที่อยู่ระหว่าง `.menu-enter-item` กับ `.menu-grid-tile` และลบกติกา `.menu-grid-tile` จนจบ `.menu-list-row:focus-visible` (ก่อน `.menu-drawer-promo-card`) แล้วใส่ก้อนนี้แทน

```css
.menu-grid-tile {
  border-radius: 1.125rem;
  background: #17151a;
  box-shadow: 0 0 0 1px rgb(255 255 255 / 0.03);
  transition:
    transform var(--motion-fast) var(--ease-out),
    background var(--motion-fast) ease,
    box-shadow var(--motion-fast) var(--ease-out);
}

.menu-grid-tile .menu-grid-icon {
  filter: drop-shadow(0 2px 6px rgb(0 0 0 / 0.35));
  transition:
    transform var(--motion-fast) var(--ease-out),
    filter var(--motion-fast) ease;
}

.menu-grid-tile .menu-grid-label {
  transition:
    color var(--motion-fast) ease,
    transform var(--motion-fast) var(--ease-out);
}

.menu-grid-tile:active {
  transform: scale(0.96);
  transition-timing-function: var(--ease-in);
}

.menu-grid-tile:active .menu-grid-icon {
  transform: scale(0.94);
}

@media (hover: hover) and (pointer: fine) {
  .menu-grid-tile:is(:hover, :focus-visible) {
    transform: translateY(-8px) scale(1.03);
    background: linear-gradient(
      168deg,
      rgb(34 30 48 / 1) 0%,
      rgb(26 22 36 / 1) 55%,
      rgb(20 17 28 / 1) 100%
    );
    box-shadow:
      0 14px 28px rgb(0 0 0 / 0.38),
      0 0 0 1px rgb(255 255 255 / 0.09),
      0 0 22px color-mix(in srgb, var(--accent-primary) 24%, transparent);
  }

  .menu-grid-tile:is(:hover, :focus-visible) .menu-grid-icon {
    transform: translateY(-4px) scale(1.12);
    filter: drop-shadow(0 4px 12px color-mix(in srgb, var(--accent-primary) 35%, rgb(0 0 0 / 0.4)));
  }

  .menu-grid-tile:is(:hover, :focus-visible) .menu-grid-label {
    color: #fff;
    transform: translateY(-1px);
  }

  .menu-grid-tile:active {
    transform: translateY(0) scale(0.97);
  }

  .menu-grid-tile:active .menu-grid-icon {
    transform: scale(1.04);
  }

  .menu-list-row:is(:hover, :focus-visible) {
    background: rgb(255 255 255 / 0.05);
  }

  .menu-list-row:is(:hover, :focus-visible) .menu-list-icon {
    transform: translateX(2px) scale(1.07);
    filter: drop-shadow(0 3px 8px color-mix(in srgb, var(--accent-primary) 28%, rgb(0 0 0 / 0.35)));
  }

  .menu-list-row:is(:hover, :focus-visible) .menu-list-label {
    color: #fff;
  }

  .menu-list-row:is(:hover, :focus-visible) .menu-list-chevron {
    transform: translateX(3px);
    background: rgb(255 255 255 / 0.14);
    color: #fff;
  }
}

.menu-grid-tile:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--cosmic-page-base, #0c0b11),
    0 0 0 4px color-mix(in srgb, var(--accent-primary) 55%, transparent);
}

.menu-list-row {
  transition:
    background-color var(--motion-fast) ease,
    transform var(--motion-fast) var(--ease-out);
}

.menu-list-row .menu-list-icon {
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 0.3));
  transition:
    transform var(--motion-fast) var(--ease-out),
    filter var(--motion-fast) ease;
}

.menu-list-row .menu-list-label {
  transition: color var(--motion-fast) ease;
}

.menu-list-row .menu-list-chevron {
  transition:
    transform var(--motion-fast) var(--ease-out),
    background-color var(--motion-fast) ease,
    color var(--motion-fast) ease;
}

.menu-list-row:active {
  background: rgb(255 255 255 / 0.08);
  transform: scale(0.995);
}

.menu-list-row:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--accent-primary) 45%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .menu-enter-logo,
  .menu-enter-avatar,
  .menu-enter-item {
    animation: none;
  }

  .menu-grid-tile,
  .menu-grid-tile .menu-grid-icon,
  .menu-grid-tile .menu-grid-label,
  .menu-list-row,
  .menu-list-row .menu-list-icon,
  .menu-list-row .menu-list-chevron {
    transition: none;
  }

  .menu-grid-tile:hover,
  .menu-grid-tile:focus-visible,
  .menu-grid-tile:active,
  .menu-grid-tile:hover .menu-grid-icon,
  .menu-grid-tile:focus-visible .menu-grid-icon,
  .menu-grid-tile:active .menu-grid-icon,
  .menu-grid-tile:hover .menu-grid-label,
  .menu-grid-tile:focus-visible .menu-grid-label,
  .menu-list-row:hover,
  .menu-list-row:focus-visible,
  .menu-list-row:active,
  .menu-list-row:hover .menu-list-icon,
  .menu-list-row:focus-visible .menu-list-icon,
  .menu-list-row:hover .menu-list-chevron,
  .menu-list-row:focus-visible .menu-list-chevron {
    transform: none;
  }
}
```

กติกา `@media (max-width: 1023px)` ที่ตั้ง `min-height` และ `border-radius` ของ `.menu-grid-tile` ไว้ท้ายไฟล์ ไม่ต้องลบ

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm dlx tsx --test scripts/menu-motion.test.ts`

Expected: PASS 4 tests

- [ ] **Step 5: Commit**

```bash
git add scripts/menu-motion.test.ts app/styles/menu-drawer.css
git commit -m "$(cat <<'EOF'
feat(menu): lift desktop tiles and squash mobile presses

EOF
)"
```

---

### Task 3: ตรวจด้วยตา

**Files:**
- ไม่มีไฟล์ใหม่ ใช้ `pnpm dev` ที่รันอยู่แล้ว

**Interfaces:**
- Consumes: CSS จาก Task 2
- Produces: ไม่มี — งานนี้ไม่ commit ถ้าวงตาผ่านและไม่มีไฟล์เปลี่ยน

- [ ] **Step 1: เดสก์ท็อป**

เปิด `http://localhost:3000` กว้างอย่างน้อย 1024px แล้วเปิดเมนู

- รายการโผล่ทีละช่อง
- วางเมาส์บนการ์ดกริด: การ์ดขึ้นประมาณ 8px มี glow ม่วง ไอคอนขยาย
- วางเมาส์บนแถวแนวตั้ง: ไอคอนกับลูกศรขยับ แถวไม่ลอย
- กดเมาส์ค้างบนการ์ด: ยุบลง ปล่อยแล้วยังลอยถ้าเมาส์อยู่

- [ ] **Step 2: มือถือ**

ย่อความกว้างต่ำกว่า 1024px แล้วเปิดเมนู

- ยัง stagger
- แตะค้างการ์ดแล้วการ์ดยุบ
- ปล่อยนิ้วแล้วการ์ดไม่ค้างท่าลอย

- [ ] **Step 3: ขอบ**

เปิด reduced motion ในระบบ แล้วเปิดเมนูใหม่: ไม่มี stagger และชี้หรือกดแล้วไม่ขยับ เหลือสีพื้น ปิด reduced motion กลับ แล้วกด Tab เข้าการ์ด: มีวงโฟกัสม่วง
