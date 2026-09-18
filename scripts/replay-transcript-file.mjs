import fs from "fs";
import path from "path";

const transcriptPath =
  "C:/Users/PP/.cursor/projects/c-Users-PP-Desktop-production-cm/agent-transcripts/82e156db-15e9-465f-8807-60d98891843d/82e156db-15e9-465f-8807-60d98891843d.jsonl";
const repoRoot = path.resolve("C:/Users/PP/Desktop/production/cm");
const targetKey = process.argv[2] || "app/globals.css";

function norm(p) {
  return path.resolve(p).replace(/\\/g, "/").toLowerCase();
}

const targetAbs = norm(path.join(repoRoot, targetKey));
let cur = fs.readFileSync(path.join(repoRoot, targetKey), "utf8");
let ok = 0;
let fail = 0;

const lines = fs.readFileSync(transcriptPath, "utf8").split("\n");
for (const line of lines) {
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
    const fp = item.input?.path;
    if (!fp || norm(fp) !== targetAbs) continue;
    if (item.name === "Write") {
      cur = item.input.contents ?? cur;
      ok++;
    } else if (item.name === "StrReplace") {
      const { old_string: oldS, new_string: newS } = item.input;
      if (oldS !== undefined && cur.includes(oldS)) {
        cur = cur.replace(oldS, newS);
        ok++;
      } else {
        fail++;
      }
    }
  }
}

fs.writeFileSync(path.join(repoRoot, targetKey), cur);
console.log(JSON.stringify({ targetKey, ok, fail, lines: cur.split("\n").length }));
