import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { LOCALES, type Locale } from "./config";
import type { MessageTree } from "./translate";

/** อ่าน JSON ตรงจากไฟล์ — เลี่ยง JSON import ใน tsx --test */
function read(locale: Locale): MessageTree {
  const file = path.join(process.cwd(), "lib/i18n/messages", `${locale}.json`);
  return JSON.parse(readFileSync(file, "utf8")) as MessageTree;
}

/** leaf key → ข้อความ (plural object ที่มี other นับเป็น leaf เดียว รวมทุก form) */
function leaves(tree: MessageTree, prefix = ""): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") out.set(full, value);
    else if ("other" in value) out.set(full, Object.values(value).join(" "));
    else for (const [k, v] of leaves(value, full)) out.set(k, v);
  }
  return out;
}

function placeholders(text: string): string {
  return [...new Set(text.match(/\{\w+\}/g) ?? [])].sort().join(",");
}

const th = leaves(read("th"));

test("every locale file exists and has no keys missing from th", () => {
  for (const locale of LOCALES) {
    const extra = [...leaves(read(locale)).keys()].filter((key) => !th.has(key));
    assert.deepEqual(extra, [], `${locale}.json has keys not in th.json`);
  }
});

test("placeholders match th in every locale", () => {
  for (const locale of LOCALES) {
    for (const [key, text] of leaves(read(locale))) {
      assert.equal(placeholders(text), placeholders(th.get(key) ?? ""), `${locale}: ${key}`);
    }
  }
});

test("en is complete (source for translators)", () => {
  const en = leaves(read("en"));
  const missing = [...th.keys()].filter((key) => !en.has(key));
  assert.deepEqual(missing, [], "en.json is missing keys");
});

test("coverage report", () => {
  const report = LOCALES.filter((l) => l !== "th").map((locale) => {
    const done = [...leaves(read(locale)).keys()].length;
    return `${locale} ${Math.round((done / Math.max(th.size, 1)) * 100)}%`;
  });
  console.log(`[i18n] coverage: ${report.join(" · ")}`);
});
