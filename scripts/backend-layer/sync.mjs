#!/usr/bin/env node
/**
 * ซิงก์ "ชั้นเชื่อม back-end" + เอกสาร จาก glass (ต้นแบบ) ไปโปรเจคในเครือ
 *
 *   node scripts/backend-layer/sync.mjs --check            ตรวจว่าทุกโปรเจคตรงกับ glass (exit 1 ถ้าไม่ตรง)
 *   node scripts/backend-layer/sync.mjs --apply [ชื่อ...]   เขียนไฟล์ + manifest ไปปลายทาง (ไม่ใส่ชื่อ = ทุกโปรเจค)
 *
 * อ่านจาก git HEAD ของ glass เท่านั้น — งานที่ยังไม่ commit ใน glass จะไม่ถูกส่งออกไป
 * โปรเจคปลายทางต้องอยู่ข้างๆ glass (../black-purple · ../lotto · ../cas) · ไม่ commit ให้ — ตรวจ diff แล้ว commit เองในแต่ละ repo
 * รายละเอียด: docs/api/shared-backend-layer.md §5
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DOCS, LAYER_DIRS, LAYER_FILES, LAYER_EXCLUDE, MANIFEST_FILE, TARGETS } from "./config.mjs";

const GLASS = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const mode = args.includes("--apply") ? "apply" : args.includes("--check") ? "check" : null;
if (!mode) {
  console.error("ใช้: node scripts/backend-layer/sync.mjs --check | --apply [black-purple lotto cas]");
  process.exit(2);
}
const only = args.filter((a) => !a.startsWith("--"));

const git = (...a) => execFileSync("git", ["-C", GLASS, ...a], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const lf = (s) => s.replace(/\r\n/g, "\n");
const sha256 = (s) => createHash("sha256").update(lf(s)).digest("hex");
const commit = git("rev-parse", "--short", "HEAD").trim();
const headFile = (path) => lf(git("show", `HEAD:${path}`));

/** ไฟล์ในชั้นเชื่อม back-end ตาม HEAD ของ glass (path แบบ glass) */
const layer = git("ls-tree", "-r", "--name-only", "HEAD", "--", ...LAYER_DIRS, ...LAYER_FILES)
  .split("\n")
  .filter(Boolean)
  .filter((p) => !LAYER_EXCLUDE.some((re) => re.test(p)));

/** ไฟล์ในโฟลเดอร์ชั้นเชื่อม back-end ของปลายทาง (ใช้หาไฟล์เกินที่ไม่ได้ประกาศเป็นส่วนขยาย) */
function listTargetLayer(root, target) {
  const out = [];
  const walk = (rel) => {
    const abs = join(root, rel);
    if (!existsSync(abs)) return;
    for (const name of readdirSync(abs)) {
      const r = `${rel}/${name}`;
      if (statSync(join(root, r)).isDirectory()) walk(r);
      else out.push(r);
    }
  };
  for (const d of LAYER_DIRS) walk(target.map(d));
  return out.filter((p) => !LAYER_EXCLUDE.some((re) => re.test(p)));
}

function writeKeepingEol(abs, content) {
  const cur = existsSync(abs) ? readFileSync(abs, "utf8") : null;
  const crlf = cur ? cur.includes("\r\n") : false;
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, crlf ? content.replace(/\n/g, "\r\n") : content);
}

let problems = 0;
for (const target of TARGETS) {
  if (only.length && !only.includes(target.name)) continue;
  const root = resolve(GLASS, target.dir);
  if (!existsSync(root)) {
    console.log(`- ${target.name}: ไม่พบ ${root} (ข้าม)`);
    continue;
  }
  const report = [];
  const files = {};

  // 1) โค้ดชั้นเชื่อม back-end
  for (const src of layer) {
    const dest = target.map(src);
    if (target.extensions.includes(dest)) continue; // ไฟล์ที่โปรเจคนี้ขยายจาก glass โดยเจตนา
    const want = headFile(src);
    files[dest] = sha256(want);
    const abs = join(root, dest);
    const cur = existsSync(abs) ? readFileSync(abs, "utf8") : null;
    if (cur !== null && lf(cur) === want) continue;
    report.push(`${cur === null ? "ADD " : "SYNC"} ${dest}`);
    if (mode === "apply") writeKeepingEol(abs, want);
  }
  const known = new Set([...Object.keys(files), ...target.extensions]);
  for (const extra of listTargetLayer(root, target)) {
    if (!known.has(extra)) report.push(`EXTRA ${extra}  (ไม่มีใน glass — ย้ายเข้า glass หรือประกาศใน config.mjs extensions)`);
  }

  // 2) เอกสาร (เนื้อหาเดียวกับ glass + ตารางตำแหน่งไฟล์ของโปรเจคนี้)
  for (const doc of DOCS) {
    const body = headFile(doc.source);
    for (const dest of doc.dests(target)) {
      const want = doc.render(body, target);
      const abs = join(root, dest);
      const cur = existsSync(abs) ? readFileSync(abs, "utf8") : null;
      if (cur !== null && lf(cur) === want) continue;
      report.push(`${cur === null ? "ADD " : "SYNC"} ${dest}`);
      if (mode === "apply") writeKeepingEol(abs, want);
    }
  }

  // 3) manifest — เทสต์ lib/api/backendLayer.test.ts ของปลายทางใช้ตรวจว่าไม่มีใครแก้ชั้นนี้ตรงๆ
  const manifest = `${JSON.stringify({ source: "glass", commit, files, extensions: target.extensions }, null, 2)}\n`;
  const manifestAbs = join(root, MANIFEST_FILE);
  const curManifest = existsSync(manifestAbs) ? JSON.parse(readFileSync(manifestAbs, "utf8")) : null;
  const sameFiles = curManifest && JSON.stringify(curManifest.files) === JSON.stringify(files)
    && JSON.stringify(curManifest.extensions) === JSON.stringify(target.extensions);
  if (!sameFiles) report.push(`${curManifest ? "SYNC" : "ADD "} ${MANIFEST_FILE}`);
  if (mode === "apply" && (!sameFiles || curManifest.commit !== commit)) writeFileSync(manifestAbs, manifest);

  const changes = report.filter((r) => !r.startsWith("EXTRA")).length;
  const extras = report.length - changes;
  if (mode === "check") problems += report.length;
  else problems += extras;
  console.log(`\n${target.name}: ${report.length ? report.length + " รายการ" : "ตรงกับ glass " + commit}`);
  for (const r of report) console.log("  " + r);
  if (mode === "apply" && changes) console.log(`  → เขียนแล้ว ${changes} ไฟล์ · ตรวจ diff + tsc + test แล้ว commit ใน ${target.name}`);
}
process.exit(problems ? 1 : 0);
