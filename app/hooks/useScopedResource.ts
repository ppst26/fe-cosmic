"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiError, ApiResult } from "@/lib/api/http";

export type ResourceStatus = "idle" | "loading" | "ready" | "error";

export interface ScopedResource<T> {
  /** ข้อมูลล่าสุดของ scope ปัจจุบัน · ตอนดึงใหม่ยังคงค่าเดิมไว้ (ไม่กระพริบ) */
  data: T | null;
  /** idle = ไม่มี scope (ยังไม่ login) · loading = ยังไม่มีข้อมูลรอบแรก / กำลังลองใหม่หลังพลาด */
  status: ResourceStatus;
  error: ApiError | null;
  /** กำลังดึงใหม่ขณะมีข้อมูลเดิมแสดงอยู่ */
  isRefreshing: boolean;
  /** ดึงใหม่ — เรียกหลัง mutation (ฝาก/ถอน/แลก) หรือปุ่มลองใหม่ */
  refresh: () => void;
  /** แทนค่าทันทีจากผล mutation ที่ server ส่งกลับมา (ไม่ต้องดึงซ้ำ) */
  setData: (data: T) => void;
}

export interface ResourceEntry<T> {
  scope: string;
  /** requestKey ตอนที่ผลนี้ถูกขอ */
  key: number;
  data: T | null;
  error: ApiError | null;
}

type Entry<T> = ResourceEntry<T>;

/**
 * คำนวณสถานะจากผลล่าสุด (pure — มี test ใน useScopedResource.test.ts)
 * - scope ไม่ตรง = ข้อมูลของผู้ใช้คนก่อน → ไม่ใช้
 * - กำลังดึงใหม่ขณะมีข้อมูล = ready (แสดงของเดิม) · พลาดแล้วกดลองใหม่ = loading
 */
export function resolveResourceState<T>(
  scope: string | null,
  entry: ResourceEntry<T> | null,
  requestKey: number,
): { current: ResourceEntry<T> | null; status: ResourceStatus; isRefreshing: boolean } {
  const current = scope && entry?.scope === scope ? entry : null;
  const isRefreshing = current !== null && current.key !== requestKey;

  let status: ResourceStatus;
  if (!scope) status = "idle";
  else if (!current) status = "loading";
  else if (current.error && current.data === null) status = isRefreshing ? "loading" : "error";
  else status = current.error && !isRefreshing ? "error" : "ready";

  return { current, status, isRefreshing };
}

/**
 * โหลดข้อมูลที่ผูกกับ scope (เช่น user id) — เปลี่ยน scope = ทิ้งข้อมูลเก่าแล้วโหลดใหม่ · scope null = idle
 * ใช้ใน ProfileProvider · WalletProvider (เปลี่ยนไปใช้ SWR / React Query ได้โดยคง interface นี้)
 */
export function useScopedResource<T>(
  scope: string | null,
  load: () => Promise<ApiResult<T>>,
): ScopedResource<T> {
  const [entry, setEntry] = useState<Entry<T> | null>(null);
  const [requestKey, setRequestKey] = useState(0);
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    if (!scope) return;
    let cancelled = false;
    void loadRef.current().then((res) => {
      if (cancelled) return;
      setEntry((prev) => {
        const previousData = prev?.scope === scope ? prev.data : null;
        return res.ok
          ? { scope, key: requestKey, data: res.data, error: null }
          : { scope, key: requestKey, data: previousData, error: res.error };
      });
    });
    return () => {
      cancelled = true;
    };
  }, [scope, requestKey]);

  const { current, status, isRefreshing } = resolveResourceState(scope, entry, requestKey);

  const refresh = useCallback(() => setRequestKey((key) => key + 1), []);

  const setData = useCallback(
    (data: T) => {
      if (!scope) return;
      setEntry({ scope, key: requestKey, data, error: null });
    },
    [scope, requestKey],
  );

  return {
    data: current?.data ?? null,
    status,
    error: current?.error ?? null,
    isRefreshing,
    refresh,
    setData,
  };
}
