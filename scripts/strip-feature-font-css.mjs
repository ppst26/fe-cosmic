/**
 * ย้าย font-size / font-weight ออกจาก feature CSS → สร้าง @apply ใน typography-bridge.css
 * ใช้ครั้งเดียว / รันซ้ำเมื่อเพิ่มไฟล์ใน TARGETS
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BRIDGE = path.join(ROOT, "app/styles/typography-bridge.css");

const TARGETS = [
  "app/styles/header.css",
  "app/styles/menu-drawer.css",
  "app/styles/footer.css",
  "app/styles/layout.css",
  "app/styles/hub-modals.css",
  "app/styles/lottery.css",
  "app/styles/modals.css",
  "app/styles/providers-filter.css",
  "app/styles/glass-cards.css",
  "app/styles/lucky-wheel.css",
];

const SIZE_TO_APPLY = [
  [/2\.25rem/, "text-4xl"],
  [/2rem/, "text-3xl"],
  [/1\.75rem/, "text-3xl"],
  [/1\.5rem/, "text-2xl"],
  [/1\.25rem/, "text-xl"],
  [/1\.125rem/, "text-lg"],
  [/1\.0625rem/, "text-lg"],
  [/1rem/, "text-base"],
  [/0\.9375rem/, "text-base"],
  [/0\.875rem/, "text-sm"],
  [/0\.8125rem/, "text-sm"],
  [/0\.75rem/, "text-xs"],
  [/0\.6875rem/, "text-xs"],
  [/0\.65rem/, "text-[0.65rem]"],
  [/0\.625rem/, "text-[0.625rem]"],
  [/0\.5625rem/, "text-[0.5625rem]"],
  [/0\.5rem/, "text-[0.5rem]"],
  [/23px/, "text-2xl"],
  [/14px/, "text-sm"],
  [/13px/, "text-sm"],
  [/12px/, "text-xs"],
  [/11px/, "text-[11px]"],
  [/10\.5px/, "text-[10.5px]"],
  [/10px/, "text-[10px]"],
  [/9\.5px/, "text-[9.5px]"],
  [/9px/, "text-[9px]"],
];

function remToApply(value) {
  const v = value.trim();
  for (const [re, tw] of SIZE_TO_APPLY) {
    if (re.test(v)) return tw;
  }
  return `text-[${v}]`;
}

function weightToApply(value) {
  const n = parseInt(value, 10);
  if (n <= 400) return "font-normal";
  return "font-medium";
}

function parseBlocks(css) {
  const blocks = [];
  const re = /([^{]+)\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const selector = m[1].trim().replace(/\s+/g, " ");
    const body = m[2];
    if (!selector || selector.startsWith("@")) continue;
    blocks.push({ selector, body, start: m.index, end: m.index + m[0].length, raw: m[0] });
  }
  return blocks;
}

function processFile(relPath) {
  const abs = path.join(ROOT, relPath);
  let css = fs.readFileSync(abs, "utf8");
  const blocks = parseBlocks(css);
  const bridgeRules = [];
  let changed = false;

  for (const block of blocks) {
    const fsMatch = block.body.match(/font-size:\s*([^;]+);/);
    const fwMatch = block.body.match(/font-weight:\s*([^;]+);/);
    if (!fsMatch && !fwMatch) continue;

    const applies = [];
    if (fsMatch) applies.push(remToApply(fsMatch[1]));
    if (fwMatch) {
      const w = fwMatch[1].trim();
      if (w === "inherit") applies.push("font-[inherit]");
      else applies.push(weightToApply(w));
    }

    const selectors = block.selector.split(",").map((s) => s.trim()).filter(Boolean);
    for (const sel of selectors) {
      if (sel.includes("@") || sel.includes("}")) continue;
      bridgeRules.push(`${sel} {\n  @apply ${applies.join(" ")};\n}`);
    }

    let newBody = block.body
      .replace(/\s*font-size:\s*[^;]+;/g, "")
      .replace(/\s*font-weight:\s*[^;]+;/g, "");
    const newRaw = `${block.selector} {${newBody}}`;
    css = css.replace(block.raw, newRaw);
    changed = true;
  }

  if (changed) fs.writeFileSync(abs, css);
  return bridgeRules;
}

const header = `/**\n * Typography bridge — สร้างโดย scripts/strip-feature-font-css.mjs\n * โหลดผ่าน base.css (@import layer(components)) — ห้ามใส่ @layer ในไฟล์นี้\n */\n\n`;
const footer = "\n";

function readBridgeBody() {
  if (!fs.existsSync(BRIDGE)) return "";
  const raw = fs.readFileSync(BRIDGE, "utf8");
  return raw.replace(/^\/\*\*[\s\S]*?\*\/\s*\n?/, "").trimEnd();
}

const appendIdx = process.argv.indexOf("--append");
const filesToProcess =
  appendIdx >= 0 ? process.argv.slice(appendIdx + 1).filter((a) => a.endsWith(".css")) : TARGETS;

if (filesToProcess.length === 0) {
  console.error("ไม่มีไฟล์ .css — ใช้: node scripts/strip-feature-font-css.mjs --append app/styles/foo.css");
  process.exit(1);
}

const allRules = [];
for (const t of filesToProcess) {
  allRules.push(...processFile(t));
}

const newBlock = allRules.join("\n\n");
if (appendIdx >= 0) {
  const existing = readBridgeBody();
  const merged = existing && newBlock ? `${existing}\n\n${newBlock}` : existing || newBlock;
  fs.writeFileSync(BRIDGE, header + merged + footer);
  console.log(`Appended ${allRules.length} rules to typography-bridge.css`);
} else {
  fs.writeFileSync(BRIDGE, header + newBlock + footer);
  console.log(`Wrote ${allRules.length} rules to typography-bridge.css (full replace)`);
}
