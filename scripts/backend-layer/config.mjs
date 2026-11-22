/**
 * ขอบเขต "ชั้นเชื่อม back-end" ที่ทุกโปรเจคต้องเหมือน glass + ตำแหน่งไฟล์ของแต่ละโปรเจค
 * แก้ไฟล์นี้เมื่อ: เพิ่มโฟลเดอร์/ไฟล์เข้าชั้นนี้ · เพิ่มโปรเจคใหม่ · ประกาศส่วนขยายเฉพาะโปรเจค (ดู docs/api/shared-backend-layer.md §6)
 */

/** โฟลเดอร์ที่ซิงก์ทั้งโฟลเดอร์ (path แบบ glass) */
export const LAYER_DIRS = [
  "lib/api",
  "lib/auth",
  "lib/server",
  "lib/domain",
  "lib/lottery",
  "lib/promotions",
  "app/api",
  "app/hooks/api",
  "app/types",
];

/** ไฟล์เดี่ยวที่ซิงก์ */
export const LAYER_FILES = [
  "proxy.ts",
  "eslint.backend-layer.mjs",
  "app/hooks/useApi.ts",
  "app/hooks/apiStatus.ts",
  "app/hooks/apiStatus.test.ts",
  "app/hooks/useApiErrorText.ts",
  "app/hooks/useRequireAuthAction.ts",
  "app/hooks/useLotteryBetSubmit.ts",
];

/** อยู่ในโฟลเดอร์ข้างบนแต่เป็นของเฉพาะโปรเจค — ไม่ซิงก์ */
export const LAYER_EXCLUDE = [
  /(^|\/)lib\/api\/mockDataImports\.test\.ts$/, // รายการหนี้ (ALLOWED_LEGACY) ต่างกันในแต่ละโปรเจค
];

export const MANIFEST_FILE = "backend-layer.manifest.json";

const same = (p) => p;
/** cas วางโค้ดใต้ src/ และ hooks/types อยู่ที่ src/hooks · src/types (alias @/app/... ชี้มาที่นี่ผ่าน tsconfig paths) */
const casMap = (p) => {
  if (p.startsWith("app/hooks")) return `src/hooks${p.slice("app/hooks".length)}`;
  if (p.startsWith("app/types")) return `src/types${p.slice("app/types".length)}`;
  if (p.startsWith("lib/") || p.startsWith("app/") || p === "proxy.ts") return `src/${p}`;
  return p;
};

/**
 * dir = ตำแหน่งเทียบกับ glass · map = path แบบ glass → path ในโปรเจคนี้
 * extensions = ไฟล์ในชั้นนี้ที่โปรเจคขยายจาก glass โดยเจตนา (ไม่ถูกทับ · ไม่อยู่ใน manifest) — ควรมีให้น้อยที่สุด
 * paths = ตารางตำแหน่งที่ต่างจาก glass (ใส่ต้นเอกสารที่ซิงก์ไป)
 */
export const TARGETS = [
  {
    name: "black-purple",
    dir: "../black-purple",
    map: same,
    skillDirs: ["agent/skills", ".cursor/skills"],
    extensions: [
      "lib/api/endpoints.ts",
      "lib/api/endpoints.test.ts",
      "lib/api/lobby.ts",
      "lib/api/lobby.test.ts",
      "lib/api/actions.test.ts",
      "lib/api/games.ts",
      "lib/api/gamingProviders.ts",
      "app/hooks/api/games.ts",
    ],
    extensionNote:
      "ค่ายเกม/ค้นหาเกม/เปิดเกม (`fetchGamingProviders` · `fetchProviderGames` · `fetchGameSearch` · `fetchGameLaunch`) และ Hot Jackpot (`fetchHotJackpots`) ยังไม่มีใน glass — `endpoints.ts` · `lobby.ts` ของโปรเจคนี้ = ของ glass + รายการเหล่านี้",
    paths: [
      ["`app/providers.tsx` (SWR defaults)", "`components/AppProviders.tsx`"],
      ["UI component", "`app/components/*` และ `components/*`"],
    ],
  },
  {
    name: "lotto",
    dir: "../lotto",
    map: same,
    skillDirs: ["agent/skills"],
    extensions: [],
    paths: [
      ["`app/providers.tsx` (SWR defaults)", "`components/AppProviders.tsx`"],
      ["UI component", "`app/components/*` และ `components/*`"],
      ["`pnpm test` · `pnpm lint`", "`npm test` · `npm run lint`"],
    ],
  },
  {
    name: "cas",
    dir: "../cas",
    map: casMap,
    skillDirs: ["agent/skills"],
    extensions: [],
    paths: [
      ["`lib/*` (api · auth · server · domain · lottery · promotions)", "`src/lib/*`"],
      ["`app/hooks/*` · `app/hooks/api/*`", "`src/hooks/*` · `src/hooks/api/*`"],
      ["`app/types/*`", "`src/types/*`"],
      ["`app/data/*MockData.ts`", "`src/data/*MockData.ts`"],
      ["import `@/app/data|hooks|types|lib/...`", "ใช้ได้เหมือน glass — `tsconfig.json` paths ชี้ไป `src/data|hooks|types|lib` (โค้ดเดิมของ cas ใช้ `@/data/...` ได้ด้วย)"],
      ["`app/api/*` (mock route)", "`src/app/api/*`"],
      ["`app/components/ui/ResourceGate.tsx`", "`src/components/ui/ResourceGate.tsx`"],
      ["`app/providers.tsx` (SWR defaults)", "`src/components/providers/AppProviders.tsx`"],
      ["`proxy.ts`", "`src/proxy.ts`"],
      ["UI component", "`src/components/*`"],
      ["`pnpm test` · `pnpm lint`", "`npm test` · `npm run lint`"],
    ],
  },
];

function preface(target, sourcePath) {
  const rows = [["(ทั่วไป)", "ตำแหน่งเดียวกับ glass"], ...target.paths];
  const table = ["| ใน glass | ในโปรเจคนี้ |", "|---|---|", ...rows.map(([a, b]) => `| ${a} | ${b} |`)].join("\n");
  const ext = target.extensions.length
    ? `\n\nส่วนขยายเฉพาะโปรเจคนี้ (ประกาศใน \`glass/scripts/backend-layer/config.mjs\`): ${target.extensionNote ?? ""}\nไฟล์: ${target.extensions.map((f) => `\`${f}\``).join(" · ")}`
    : "";
  return `<!-- ซิงก์จาก glass/${sourcePath} ด้วย glass/scripts/backend-layer/sync.mjs — ห้ามแก้ที่นี่ แก้ที่ glass แล้วซิงก์ -->

> **มาตรฐานเดียวกันทุกโปรเจค** (glass · black-purple · lotto · cas) — เนื้อหาใต้เส้นคั่นตรงกับ glass ทุกตัวอักษร
> โปรเจคนี้: **${target.name}** · ตำแหน่งไฟล์ที่ต่างจาก glass:

${table}${ext}

---

`;
}

/** เอกสารที่ซิงก์ — source = path ใน glass */
export const DOCS = [
  {
    source: "docs/api/shared-backend-layer.md",
    dests: () => ["docs/api/shared-backend-layer.md"],
    render: (body, target) => preface(target, "docs/api/shared-backend-layer.md") + body,
  },
  {
    source: "docs/api/backend-integration.md",
    dests: () => ["docs/api/backend-integration.md"],
    render: (body, target) => preface(target, "docs/api/backend-integration.md") + body,
  },
  {
    source: "agent/skills/cosmicbet-backend/SKILL.md",
    dests: (target) => target.skillDirs.map((d) => `${d}/cosmicbet-backend/SKILL.md`),
    render: (body) =>
      body.replace(
        /\n# Cosmicbet Back-end Integration\n/,
        "\n# Cosmicbet Back-end Integration\n\n> ซิงก์จาก glass — ตำแหน่งไฟล์ที่ต่างจาก glass ดูตารางต้น `docs/api/shared-backend-layer.md` · ห้ามแก้ที่นี่\n",
      ),
  },
];
