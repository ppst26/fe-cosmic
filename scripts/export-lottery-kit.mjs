/**
 * รวมไฟล์หวย (hub, ยี่กี, รัฐ, โพย + mock API) ไปที่ exports/lottery-kit/dist/
 * รัน: pnpm export:lottery-kit
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "exports", "lottery-kit", "dist");

/** คัดลอกทีละไฟล์หรือโฟลเดอร์ (recursive) */
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

/** path จาก root โปรเจกต์ — โฟลเดอร์ลงท้าย / จะ copy recursive */
const COPY_PATHS = [
  "app/lottery",
  "app/components/lottery",
  "lib/lottery",
  "app/api/lottery",
  "app/hooks/useLotteryBetSubmit.ts",
  "app/types/lottery.ts",
  "app/types/lotterySlip.ts",
  "app/types/lotteryBetApi.ts",
  "app/types/yiki.ts",
  "app/data/lotteryHubMockData.ts",
  "app/data/lotteryCatalogMockData.ts",
  "app/data/lotteryRoundsMockData.ts",
  "app/data/lotteryMarketsMockData.ts",
  "app/data/thaiLottoMockData.ts",
  "app/data/yikiMockData.ts",
  "app/data/lotteryIconAssets.ts",
  "app/components/lottery/LotteryMarketIcon.tsx",
  "public/lottery",
  "app/lib/bangkokTime.ts",
  "lib/utils.ts",
  "app/components/ui/cosmicButtonClasses.ts",
  "app/components/ui/responsiveSheetDialog.ts",
  "app/components/ui/LotteryKitIcons.tsx",
];

const STYLE_PATHS = [
  "app/styles/tokens.css",
  "app/styles/base.css",
  "app/styles/scrollbars.css",
  "app/styles/glass-cards.css",
  "app/styles/buttons.css",
  "app/styles/layout.css",
  "app/styles/modals.css",
  "app/styles/lottery.css",
  "app/styles/focus-input.css",
];

function rmOut() {
  if (fs.existsSync(OUT)) {
    fs.rmSync(OUT, { recursive: true, force: true });
  }
  fs.mkdirSync(OUT, { recursive: true });
}

function main() {
  rmOut();

  for (const rel of COPY_PATHS) {
    const src = path.join(ROOT, rel);
    if (!fs.existsSync(src)) {
      console.warn(`[skip] missing: ${rel}`);
      continue;
    }
    const dest = path.join(OUT, rel);
    copyRecursive(src, dest);
    console.log(`[copy] ${rel}`);
  }

  for (const rel of STYLE_PATHS) {
    const src = path.join(ROOT, rel);
    if (!fs.existsSync(src)) {
      console.warn(`[skip] missing style: ${rel}`);
      continue;
    }
    const dest = path.join(OUT, rel);
    copyRecursive(src, dest);
    console.log(`[copy] ${rel}`);
  }

  const integrationSrc = path.join(ROOT, "exports", "lottery-kit", "integration");
  if (fs.existsSync(integrationSrc)) {
    copyRecursive(integrationSrc, path.join(OUT, "integration"));
    console.log("[copy] integration/");
  }

  const readme = path.join(ROOT, "exports", "lottery-kit", "README.md");
  if (fs.existsSync(readme)) {
    fs.copyFileSync(readme, path.join(OUT, "README.md"));
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: "cosmicbet-glass",
    flows: ["hub", "yiki-5/15/30", "thai-government", "market-rounds", "slips", "mock-api"],
    copyIntoTarget: "Merge เนื้อหาใน dist/ กับ root โปรเจกต์ Next (คง path app/, lib/)",
    routes: [
      "/lottery",
      "/lottery/thai-government",
      "/lottery/thai-government/[roundId]",
      "/lottery/yiki-5",
      "/lottery/yiki-5/[roundId]",
      "/lottery/yiki-15",
      "/lottery/yiki-15/[roundId]",
      "/lottery/yiki-30",
      "/lottery/yiki-30/[roundId]",
      "/lottery/[marketId]",
      "/lottery/[marketId]/[roundId]",
      "/lottery/slips",
      "/lottery/slips/[slipId]",
    ],
    api: ["/api/lottery/bets", "/api/lottery/slips", "/api/lottery/slips/[slipId]"],
    dependencies: {
      npm: ["next", "react", "react-dom", "radix-ui", "tailwindcss", "class-variance-authority", "cn"],
      note: "โปรเจกต์ปลายทางต้องมี @/ alias ชี้ root เหมือน Cosmicbet",
    },
  };
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");

  console.log(`\nDone → ${OUT}`);
  console.log("อ่าน exports/lottery-kit/dist/README.md แล้วรัน apply-standalone-shell.mjs ถ้าไม่มี Lobby shell");
}

main();
