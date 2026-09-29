/**
 * หลัง copy dist/ ไปโปรเจกต์ — รันจาก root โปรเจกต์ปลายทาง:
 *   node integration/apply-standalone-shell.mjs
 * (หรือ copy integration/ ไปด้วยจาก dist)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();

const SHELL_SRC = path.join(__dirname, "LotteryRouteShell.tsx");
const SHELL_DEST = path.join(ROOT, "app/components/layout/LotteryRouteShell.tsx");

const LOBBY_IMPORT = `@/app/components/layout/LobbyDesktopPageShell`;
const ROUTE_SHELL_IMPORT = `@/app/components/layout/LotteryRouteShell`;

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts)$/.test(name)) acc.push(full);
  }
  return acc;
}

function patchFile(filePath, replacements) {
  let text = fs.readFileSync(filePath, "utf8");
  let changed = false;
  for (const [from, to] of replacements) {
    if (text.includes(from)) {
      text = text.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, text, "utf8");
    console.log(`[patched] ${path.relative(ROOT, filePath)}`);
  }
}

function main() {
  fs.mkdirSync(path.dirname(SHELL_DEST), { recursive: true });
  fs.copyFileSync(SHELL_SRC, SHELL_DEST);
  console.log(`[install] ${path.relative(ROOT, SHELL_DEST)}`);

  const lotteryFiles = walk(path.join(ROOT, "app/lottery"));
  const playShell = path.join(ROOT, "app/components/lottery/LotteryPlayPageShell.tsx");
  if (fs.existsSync(playShell)) lotteryFiles.push(playShell);

  for (const file of lotteryFiles) {
    patchFile(file, [
      [LOBBY_IMPORT, ROUTE_SHELL_IMPORT],
      ["LobbyDesktopPageShell", "LotteryRouteShell"],
    ]);
  }

  const hubPage = path.join(ROOT, "integration/lottery-hub-page.tsx");
  const lotteryPage = path.join(ROOT, "app/lottery/page.tsx");
  if (fs.existsSync(hubPage)) {
    fs.copyFileSync(hubPage, lotteryPage);
    console.log(`[install] app/lottery/page.tsx (hub standalone)`);
  }

  const iconPatches = walk(path.join(ROOT, "app/components/lottery"));
  for (const file of iconPatches) {
    patchFile(file, [
      ['from "../ui/Icons"', 'from "../ui/LotteryKitIcons"'],
      ['from "@/app/components/ui/Icons"', 'from "@/app/components/ui/LotteryKitIcons"'],
    ]);
  }

  console.log("\nเสร็จ — ตรวจ globals ว่า import styles/globals-lottery.css แล้ว");
}

main();
