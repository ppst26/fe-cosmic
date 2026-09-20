"use client";

import React from "react";
import { ActivitiesDesktopHubLayout } from "./ActivitiesDesktopHubLayout";
import { ActivitiesMobileHub } from "./ActivitiesMobileHub";

/**
 * เนื้อหาหน้ากิจกรรม (/event) และ desktop hub กิจกรรม
 */
export function ActivitiesHubPageContent({ embedded = false }: { embedded?: boolean }) {
  const showDesktopHub = embedded;

  return (
    <>
      {showDesktopHub ? (
        <div className="hidden pb-2 lg:block">
          <ActivitiesDesktopHubLayout />
        </div>
      ) : null}

      <div className={`pb-4 ${showDesktopHub ? "lg:hidden" : ""}`}>
        {!embedded ? (
          <header className="mb-4">
            <h1 className="text-xl font-medium tracking-tight text-[var(--text-primary)] sm:text-2xl">
              กิจกรรม
            </h1>
            <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
              เลือกกิจกรรมเพื่อดูเงื่อนไขและรับรางวัล
            </p>
          </header>
        ) : null}
        <ActivitiesMobileHub />
      </div>
    </>
  );
}
