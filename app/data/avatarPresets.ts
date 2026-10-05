/**
 * ชุด avatar preset — Dicebear notionists (ไม่มีอัปโหลดรูป)
 * ใช้ใน UserAvatar · ProfileAvatarPicker · resolveAvatarPresetId
 */

export interface AvatarPreset {
  id: string;
  label: string;
}

export const AVATAR_PRESETS: readonly AvatarPreset[] = [
  { id: "cosmic-nova", label: "Nova" },
  { id: "cosmic-orbit", label: "Orbit" },
  { id: "cosmic-pulse", label: "Pulse" },
  { id: "cosmic-vega", label: "Vega" },
  { id: "cosmic-lyra", label: "Lyra" },
  { id: "cosmic-comet", label: "Comet" },
  { id: "cosmic-pluto", label: "Pluto" },
  { id: "cosmic-aurora", label: "Aurora" },
  { id: "cosmic-nebula", label: "Nebula" },
  { id: "cosmic-stellar", label: "Stellar" },
  { id: "cosmic-lunar", label: "Lunar" },
  { id: "cosmic-solar", label: "Solar" },
] as const;

const PRESET_IDS = new Set(AVATAR_PRESETS.map((p) => p.id));

/** ตรวจว่า id อยู่ในชุด preset ที่อนุญาต */
export function isAvatarPresetId(id: string): boolean {
  return PRESET_IDS.has(id);
}

/** URL รูป preset — size ปรับตามการใช้งานใน UI */
export function avatarPresetImageUrl(presetId: string, size = 160): string {
  return `https://api.dicebear.com/9.x/notionists/png?seed=${encodeURIComponent(presetId)}&size=${size}`;
}

/** preset เริ่มต้นแบบคงที่ต่อ user (ไม่สุ่มทุกครั้งที่โหลด) */
export function defaultAvatarPresetIdForUser(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i += 1) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % AVATAR_PRESETS.length;
  return AVATAR_PRESETS[index]?.id ?? AVATAR_PRESETS[0].id;
}

/**
 * คืน preset ที่ใช้แสดง — ถ้ายังไม่ตั้ง ใช้ default จาก userId
 */
export function resolveAvatarPresetId(
  storedPresetId: string | undefined | null,
  userId: string,
): string {
  if (storedPresetId && isAvatarPresetId(storedPresetId)) {
    return storedPresetId;
  }
  return defaultAvatarPresetIdForUser(userId);
}
