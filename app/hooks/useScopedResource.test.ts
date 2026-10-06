import assert from "node:assert/strict";
import test from "node:test";
import { resolveResourceState, type ResourceEntry } from "./useScopedResource";

const err = { code: "NETWORK" as const, status: 0, message: "offline" };
const entry = (over: Partial<ResourceEntry<number>>): ResourceEntry<number> => ({
  scope: "u1",
  key: 0,
  data: 100,
  error: null,
  ...over,
});

test("no scope is idle", () => {
  assert.equal(resolveResourceState(null, entry({}), 0).status, "idle");
});

test("first load and another user's data both count as loading", () => {
  assert.equal(resolveResourceState("u1", null, 0).status, "loading");
  const other = resolveResourceState("u2", entry({ scope: "u1" }), 0);
  assert.equal(other.status, "loading");
  assert.equal(other.current, null);
});

test("refreshing keeps showing data as ready", () => {
  const s = resolveResourceState("u1", entry({ key: 0 }), 1);
  assert.equal(s.status, "ready");
  assert.equal(s.isRefreshing, true);
});

test("failed first load is error, and retrying it is loading", () => {
  const failed = entry({ data: null, error: err, key: 0 });
  assert.equal(resolveResourceState("u1", failed, 0).status, "error");
  assert.equal(resolveResourceState("u1", failed, 1).status, "loading");
});

test("failed refresh keeps stale data but reports error", () => {
  const s = resolveResourceState("u1", entry({ error: err, key: 1 }), 1);
  assert.equal(s.status, "error");
  assert.equal(s.current?.data, 100);
});
