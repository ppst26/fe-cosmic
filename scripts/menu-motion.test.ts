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

test("fine pointer hover lifts the grid card", () => {
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(css, /translateY\(-8px\) scale\(1\.03\)/);
  assert.match(css, /translateY\(-4px\) scale\(1\.12\)/);
  assert.match(css, /translateX\(2px\) scale\(1\.07\)/);
  assert.match(css, /translateX\(3px\)/);
  assert.match(css, /0 0 0 4px color-mix\(in srgb, var\(--accent-primary\) 55%/);
  assert.equal(css.includes("pointer: coarse"), false);
});

test("press scale is stronger on touch than on a mouse", () => {
  assert.match(css, /\.menu-grid-tile:active\s*\{[^}]*scale\(0\.96\)/);
  assert.match(css, /\.menu-grid-tile:active \.menu-grid-icon\s*\{[^}]*scale\(0\.94\)/);
  assert.match(css, /translateY\(0\) scale\(0\.97\)/);
  assert.match(css, /\.menu-grid-tile:active \.menu-grid-icon\s*\{[^}]*scale\(1\.04\)/);
  assert.match(css, /\.menu-list-row:active\s*\{[^}]*scale\(0\.995\)/);
});

test("reduced motion clears transform after the hover rules", () => {
  const hoverAt = css.indexOf("translateY(-8px)");
  const reducedAt = css.lastIndexOf("prefers-reduced-motion: reduce");
  assert.ok(hoverAt > -1);
  assert.ok(reducedAt > hoverAt);
  const tail = css.slice(reducedAt);
  assert.match(tail, /\.menu-grid-tile:active[\s\S]*?transform:\s*none/);
  assert.match(tail, /\.menu-list-row:active[\s\S]*?transform:\s*none/);
});
