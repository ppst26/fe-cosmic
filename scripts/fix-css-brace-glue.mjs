import fs from "node:fs";
import path from "node:path";

const files = process.argv.slice(2);
for (const rel of files) {
  const abs = path.resolve(rel);
  let css = fs.readFileSync(abs, "utf8");
  css = css.replace(/\}\s*(\.[a-zA-Z_-])/g, "}\n\n$1");
  fs.writeFileSync(abs, css);
  console.log("fixed", rel);
}
