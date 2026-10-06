"use client";

import useSWR, { type SWRConfiguration } from "swr";
import type { ApiError, ApiResult } from "@/lib/api/http";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { resolveApiStatus, type ResourceStatus } from "./apiStatus";

export type { ResourceStatus };

export interface ApiResource<T> {
  /** ข้อมูลล่าสุด · ระหว่างดึงใหม่ยังคงค่าเดิม (ไม่กระพริบ) */
  data: T | null;
  /** idle = ไม่ได้ขอ (resource ที่ต้อง login แต่ยังไม่ login) · loading = ยังไม่มีข้อมูลรอบแรก */
  status: ResourceStatus;
  error: ApiError | null;
  /** กำลังดึงใหม่ขณะมีข้อมูลเดิมแสดงอยู่ */
  isRefreshing: boolean;
  /** ดึงใหม่ — เรียกหลัง mutation หรือปุ่มลองใหม่ */
  refresh: () => void;
  /** แทนค่าใน cache ทันทีจากผล mutation (ทุก component ที่ใช้ key เดียวกันอัปเดตพร้อมกัน) */
  setData: (data: T) => void;
}

/** @deprecated ชื่อเดิม — ใช้ ApiResource */
export type ScopedResource<T> = ApiResource<T>;

export interface UseApiOptions {
  /** true = ต้อง login · ยังไม่ login จะไม่ยิงและ status = idle · cache แยกตาม user id */
  auth?: boolean;
  /** ส่งต่อให้ SWR (เช่น refreshInterval สำหรับข้อมูลสด) */
  swr?: SWRConfiguration;
}

/** แปลง ApiResult → ค่า/throw ให้ SWR (ApiError ถูก throw เป็น error ของ SWR) */
async function unwrap<T>(load: () => Promise<ApiResult<T>>): Promise<T> {
  const res = await load();
  if (!res.ok) throw res.error;
  return res.data;
}

/**
 * ดึงข้อมูลผ่านฟังก์ชันใน lib/api ด้วย SWR — dedupe / cache ข้าม component ตาม key
 * ใช้ผ่าน hook รายโดเมนใน app/hooks/api/* · ห้ามเรียก fetch*() ตรงจาก component
 *
 * @param key ชื่อ resource (+ พารามิเตอร์) เช่น ["vip-player"] · null = ยังไม่ขอ
 */
export function useApi<T>(
  key: readonly unknown[] | null,
  load: () => Promise<ApiResult<T>>,
  options: UseApiOptions = {},
): ApiResource<T> {
  const { user, isLoading: authLoading } = useAuth();
  const userScope = options.auth ? (user?.id ?? null) : "public";
  const swrKey = key && userScope && !(options.auth && authLoading) ? [...key, userScope] : null;

  const { data, error, isValidating, mutate } = useSWR<T, ApiError>(
    swrKey,
    () => unwrap(load),
    options.swr,
  );

  const hasData = data !== undefined;
  return {
    data: hasData ? data : null,
    status: resolveApiStatus({
      hasKey: swrKey !== null,
      hasData,
      hasError: Boolean(error),
      isValidating,
    }),
    error: error ?? null,
    isRefreshing: hasData && isValidating,
    refresh: () => {
      void mutate();
    },
    setData: (next: T) => {
      void mutate(next, { revalidate: false });
    },
  };
}
