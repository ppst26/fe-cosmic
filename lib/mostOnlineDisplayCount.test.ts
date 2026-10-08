import assert from "node:assert/strict";
import test from "node:test";
import { getMostOnlineDisplayCount } from "./mostOnlineDisplayCount";

test("getMostOnlineDisplayCount is stable for the same id", () => {
  const item = { id: "pg-soft", onlineCount: 18_200 };
  assert.equal(getMostOnlineDisplayCount(item), getMostOnlineDisplayCount(item));
});

test("getMostOnlineDisplayCount stays within display bounds", () => {
  const value = getMostOnlineDisplayCount({ id: "evo", onlineCount: 7_807 });
  assert.ok(value >= 1_200 && value <= 48_000);
});
