import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../app/styles/menu-drawer.css", import.meta.url), "utf8");

function keyframeBody(source: string, name: string): string {
  const start = source.indexOf(`@keyframes ${name}`);
  assert.notEqual(start, -1, `missing @keyframes ${name}`);
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  throw new Error(`unclosed @keyframes ${name}`);
}

test("entrance keyframes do not set transform", () => {
  for (const name of ["menu-enter-logo", "menu-enter-avatar", "menu-enter-item"]) {
    const body = keyframeBody(css, name);
    assert.equal(/\btransform\s*:/.test(body), false, name);
  }
  assert.match(keyframeBody(css, "menu-enter-logo"), /translate:\s*0 -10px/);
  assert.match(keyframeBody(css, "menu-enter-avatar"), /scale:\s*0\.82/);
  assert.match(keyframeBody(css, "menu-enter-item"), /translate:\s*0 14px/);
  assert.match(
    css,
    /\.menu-enter-item\s*\{[^}]*animation-delay:\s*calc\(120ms \+ var\(--menu-enter-i, 0\) \* 42ms\)/,
  );
});
