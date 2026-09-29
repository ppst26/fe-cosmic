"use client";

import React, { useState } from "react";
import {
  menuMockAvatarImageUrl,
  pickMenuMockAvatarSeed,
} from "@/app/data/menuMockData";

/**
 * Avatar mock วงกลมบนเมนูมือถือ — รูปสุ่มจาก pool (RightMenuDrawer)
 */
export function MenuDrawerUserAvatar() {
  const [seed] = useState(() => pickMenuMockAvatarSeed());
  const src = menuMockAvatarImageUrl(seed);

  return (
    <div className="menu-drawer-avatar">
      <div className="menu-drawer-avatar__ring">
        <img
          src={src}
          alt="รูปโปรไฟล์ตัวอย่าง"
          width={96}
          height={96}
          className="menu-drawer-avatar__img"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}
