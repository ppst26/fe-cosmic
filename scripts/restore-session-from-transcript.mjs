import fs from "fs";
import path from "path";

const transcriptPath =
  "C:/Users/PP/.cursor/projects/c-Users-PP-Desktop-production-cm/agent-transcripts/82e156db-15e9-465f-8807-60d98891843d/82e156db-15e9-465f-8807-60d98891843d.jsonl";
const repoRoot = path.resolve("C:/Users/PP/Desktop/production/cm");
const minLine = Number(process.argv[2] || 1490);

function norm(p) {
  return path.resolve(p).replace(/\\/g, "/").toLowerCase();
}

function isProjectFile(p) {
  const n = norm(p);
  const root = norm(repoRoot);
  return (n === root || n.startsWith(root + "/")) && !n.includes("/node_modules/");
}

function rel(p) {
  return norm(p).slice(norm(repoRoot).length + 1);
}

const files = new Map();
const lines = fs.readFileSync(transcriptPath, "utf8").split("\n");

for (let i = minLine - 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  let j;
  try {
    j = JSON.parse(line);
  } catch {
    continue;
  }
  if (j.role !== "assistant") continue;
  for (const item of j.message?.content || []) {
    if (item.type !== "tool_use") continue;
    const input = item.input || {};
    const fp = input.path;
    if (!fp || !isProjectFile(fp)) continue;
    const key = rel(fp);
    if (!key.startsWith("app/")) continue;
    if (item.name === "Write") {
      files.set(key, input.contents ?? "");
    } else if (item.name === "StrReplace") {
      let cur = files.get(key);
      if (cur === undefined) {
        const abs = path.join(repoRoot, key);
        cur = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : "";
      }
      const { old_string: oldS, new_string: newS } = item.input;
      if (oldS !== undefined && cur.includes(oldS)) {
        files.set(key, cur.replace(oldS, newS));
      }
    }
  }
}

for (const [key, content] of files) {
  const abs = path.join(repoRoot, key);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, "utf8");
}

console.log(
  JSON.stringify(
    { minLine, files: files.size, keys: [...files.keys()].sort() },
    null,
    2,
  ),
);
