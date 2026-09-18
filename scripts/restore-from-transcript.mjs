import fs from "fs";
import path from "path";

const transcriptPath =
  "C:/Users/PP/.cursor/projects/c-Users-PP-Desktop-production-cm/agent-transcripts/82e156db-15e9-465f-8807-60d98891843d/82e156db-15e9-465f-8807-60d98891843d.jsonl";
const repoRoot = path.resolve("C:/Users/PP/Desktop/production/cm");

const files = new Map();
let writes = 0;
let patches = 0;
let patchFail = 0;
const patchFailKeys = [];

function norm(p) {
  return p.replace(/\\/g, "/");
}

function isProjectFile(p) {
  const n = norm(path.resolve(p)).toLowerCase();
  const root = norm(repoRoot).toLowerCase();
  return (n === root || n.startsWith(root + "/")) && !n.includes("/node_modules/");
}

function rel(p) {
  const n = norm(path.resolve(p));
  return n.slice(norm(repoRoot).length + 1);
}

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
  const content = j.message?.content;
  if (!Array.isArray(content)) continue;
  for (const item of content) {
    if (item.type !== "tool_use") continue;
    const name = item.name;
    const input = item.input || {};
    const fp = input.path;
    if (!fp || !isProjectFile(fp)) continue;
    const key = rel(fp);
    if (name === "Write") {
      files.set(key, input.contents ?? "");
      writes++;
    } else if (name === "StrReplace") {
      let cur = files.get(key);
      if (cur === undefined) {
        const abs = path.join(repoRoot, key);
        if (fs.existsSync(abs)) cur = fs.readFileSync(abs, "utf8");
        else cur = "";
      }
      const oldS = input.old_string;
      const newS = input.new_string;
      if (oldS === undefined || newS === undefined) continue;
      if (!cur.includes(oldS)) {
        patchFail++;
        patchFailKeys.push(key);
        continue;
      }
      files.set(key, cur.replace(oldS, newS));
      patches++;
    }
  }
}

let written = 0;
for (const [key, content] of files) {
  const abs = path.join(repoRoot, key);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, "utf8");
  written++;
}

console.log(
  JSON.stringify(
    {
      writes,
      patches,
      patchFail,
      filesWritten: written,
      keys: [...files.keys()].sort(),
      patchFailSample: [...new Set(patchFailKeys)].slice(0, 15),
    },
    null,
    2,
  ),
);
