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
        <ActivitiesMobileHub />
      </div>
    </>
  );
}
