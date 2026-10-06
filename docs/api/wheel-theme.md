# Wheel theme — สัญญา API ธีมวงล้อ

`GET /api/wheel` ส่ง field `theme` (ไม่บังคับ) มากับข้อมูลวงล้อ เพื่อเปลี่ยนหน้าตาทั้งชุดจากหลังบ้าน โดยไม่ต้อง deploy front-end ใหม่

- type: `app/types/wheelTheme.ts` (`WheelTheme`, `WheelSegmentStyle`)
- ตัวแปลง/กรองค่า: `lib/domain/wheelTheme.ts` — ค่าที่ไม่ผ่านจะถูกทิ้งแล้วใช้ดีไซน์เริ่มต้นแทน
- ไม่ส่ง `theme` หรือส่ง `{}` = ดีไซน์เดิมใน `app/styles/lucky-wheel.css`

## ชิ้นที่ปรับได้

| ชิ้น | field | ตัวอย่าง |
|------|-------|----------|
| วงนอก | `rim.color` · `rim.width` · `rim.glow` · `rim.bandColor` | เส้นทอง + เรืองแสง |
| กรอบทั้งวง (รูป) | `rim.frameImageUrl` | PNG โปร่งใสจัตุรัส ทับวง ไม่หมุน |
| ไฟรอบวง | `lights.count` (4–60) · `lights.color` · `lights.activeColor` · `lights.size` · `lights.animation` (`none` / `blink` / `chase`) · `lights.fastWhileSpinning` | ไฟวิ่ง 32 ดวง |
| ช่องรางวัล | `segments.colors` (2 สี = สลับ, ≥3 = วนชุด) · `segments.borderColor` · `segments.borderWidth` · `segments.labelColor` · `segments.labelSize` · `segments.iconSize` | แดง/ทองสลับ |
| รายช่อง | `segments[i].color` · `segments[i].labelColor` · `segments[i].iconUrl` (ใน array `segments` ของวงล้อ) | ช่องแจ็คพอตสีพิเศษ + ไอคอน |
| เข็มชี้ | `pointer.color` · `pointer.glow` · `pointer.imageUrl` (ปลายชี้ลง) · `pointer.sizePercent` | เข็มรูปเพชร |
| ปุ่มกลาง | `hub.label` · `hub.logoUrl` · `hub.background` · `hub.textColor` · `hub.ringColor` · `hub.glow` · `hub.sizePercent` | โลโก้แบรนด์แทนคำว่า SPIN |
| พื้นหลัง | `background.color` · `background.imageUrl` | วงกลมพื้นหลังวงล้อ |
| เวลาหมุน | `spinDurationMs` (2000–10000) | 5000 |

## รูปแบบค่า

- **สี** — hex / `rgb()` / `rgba()` / `hsl()` / ชื่อสี
- **พื้น** (`hub.background`, `background.color`) — สี หรือ `linear-gradient()` / `radial-gradient()`
- **รูป** — path ในเว็บ (`/wheel/frame.png`) หรือ `https://` เท่านั้น (ไม่รับ `http:`, `data:`, `//host`)
- ห้าม `url()` ในค่าสี และห้ามอักขระ `; { } < > \` — ค่าแบบนี้จะถูกทิ้ง
- จำนวนช่องรองรับ 2–16 (มุมแบ่งเท่ากันอัตโนมัติ)

## ตัวอย่าง response

```json
{
  "segments": [
    { "id": "s1", "label": "เพชร 3", "kind": "gems", "iconUrl": "https://cdn.example.com/wheel/gem.png" },
    { "id": "s2", "label": "10 เครดิต", "kind": "credit" },
    { "id": "s3", "label": "JACKPOT", "kind": "credit", "color": "#facc15", "labelColor": "#1f1300", "iconUrl": "/wheel/jackpot.png" }
  ],
  "theme": {
    "rim": { "color": "#facc15", "width": 4, "glow": "rgba(250, 204, 21, 0.6)", "bandColor": "#2a1600" },
    "lights": { "count": 32, "color": "#7c5a00", "activeColor": "#fff7cc", "size": 2.6, "animation": "chase", "fastWhileSpinning": true },
    "segments": { "colors": ["#7f1d1d", "#b91c1c"], "borderColor": "#facc15", "borderWidth": 1.5, "labelColor": "#fff7cc", "iconSize": 30 },
    "pointer": { "color": "#facc15", "glow": "rgba(250, 204, 21, 0.8)" },
    "hub": { "label": "หมุน", "background": "radial-gradient(circle, #fde68a, #b45309)", "textColor": "#2a1600", "ringColor": "#facc15", "glow": "rgba(250, 204, 21, 0.7)", "sizePercent": 20 },
    "background": { "color": "radial-gradient(circle, #3b0a0a, transparent 70%)" },
    "spinDurationMs": 5000
  }
}
```

## หมายเหตุสำหรับ backend

- ผลรางวัล (`segment index`) ต้องสุ่มฝั่ง server แล้วส่งกลับ — front-end แค่หมุนไปหาช่องนั้น (ตอนนี้ยังสุ่มฝั่ง client ใน mock)
- รูปจากโดเมนภายนอกแสดงด้วย `<img>` / SVG `<image>` ตรง ไม่ผ่าน `next/image` จึงไม่ต้องตั้ง `NEXT_PUBLIC_IMAGE_HOSTS` แต่ต้องเป็น https
