# Auth แบบ JSON file (2026-09-14)

## เป้าหมาย
ให้สมัครสมาชิกแล้ว “ล็อกอินอยู่” ได้ เพื่อเปิดฟีเจอร์ที่ต้องมีบัญชี — **ไม่ใช้ DB จริง**

## แนวทางที่เลือก
- เก็บผู้ใช้ใน **ไฟล์ `.data/users.json`** (gitignore)
- **Route Handlers** `register` / `login` / `logout` / `session`
- **HttpOnly cookie** `cm_session` (signed token)
- **รหัสผ่าน** hash ด้วย Node `scrypt` (ไม่เก็บ plain text)
- **AuthProvider** + `useAuth()` / `AuthGate` ฝั่ง client

## ข้อจำกัด
- เหมาะ dev / demo บนเครื่องเดียว — deploy serverless ต้องเปลี่ยน storage ภายหลัง
- ไม่ใช่มาตรฐาน production security

## API
| Method | Path | หน้าที่ |
|--------|------|--------|
| POST | `/api/auth/register` | สร้างบัญชี + ตั้ง session |
| POST | `/api/auth/login` | เข้าสู่ระบบ |
| POST | `/api/auth/logout` | ล้าง session |
| GET | `/api/auth/session` | อ่านผู้ใช้ปัจจุบัน |
