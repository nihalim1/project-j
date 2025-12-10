# คู่มือการตั้งค่า Firebase

## ขั้นตอนการตั้งค่า

### 1. สร้างโปรเจกต์ Firebase

1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. คลิก "Add project" หรือเลือกโปรเจกต์ที่มีอยู่
3. ตั้งชื่อโปรเจกต์และทำตามขั้นตอน

### 2. เปิดใช้งาน Authentication

1. ใน Firebase Console ไปที่ **Authentication** > **Sign-in method**
2. เปิดใช้งาน **Email/Password**
3. เปิดใช้งาน **Google** (ถ้าต้องการใช้ Google Sign-in)

### 3. สร้าง Firestore Database

1. ไปที่ **Firestore Database** > **Create database**
2. เลือก **Start in test mode** (สำหรับทดสอบ) หรือ **Start in production mode**
3. เลือก location ที่ใกล้ที่สุด

### 4. ตั้งค่า Firebase Config

#### วิธีที่ 1: ใช้ Environment Variables (แนะนำ)

1. สร้างไฟล์ `.env.local` ในโฟลเดอร์ root ของโปรเจกต์
2. คัดลอกค่าจาก Firebase Console > Project Settings > Your apps > Config
3. ใส่ค่าตามรูปแบบนี้:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### วิธีที่ 2: แก้ไขไฟล์ firebase.js โดยตรง

แก้ไขไฟล์ `src/firebase.js` และแทนที่ค่าต่างๆ ด้วยค่าจาก Firebase Console

### 5. ตั้งค่า Firestore Rules (สำหรับ Production)

ไปที่ **Firestore Database** > **Rules** และตั้งค่า:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - ผู้ใช้สามารถอ่าน/เขียนข้อมูลของตัวเองได้
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Admin สามารถอ่านข้อมูลทั้งหมดได้
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 6. สร้าง Admin User แรก

หลังจากสมัครสมาชิกครั้งแรก คุณสามารถเปลี่ยน role เป็น admin ได้โดย:

1. ไปที่ Firebase Console > Firestore Database
2. คลิกที่ collection `users`
3. คลิกที่ document ของผู้ใช้ที่ต้องการ
4. แก้ไข field `role` จาก `"user"` เป็น `"admin"`

## โครงสร้างข้อมูลใน Firestore

### Collection: `users`

- **Document ID**: `{uid}` (UID ของผู้ใช้จาก Firebase Auth)
- **Fields**:
  - `name` (string): ชื่อผู้ใช้
  - `email` (string): อีเมลผู้ใช้
  - `role` (string): สิทธิ์ผู้ใช้ (`"user"` หรือ `"admin"`)

## การใช้งาน

1. **สมัครสมาชิก**: กรอกข้อมูลและคลิก "สมัครสมาชิก" → ข้อมูลจะถูกบันทึกใน Firestore พร้อม role = "user"
2. **เข้าสู่ระบบ**: กรอกอีเมลและรหัสผ่าน → ระบบจะตรวจสอบ role และ redirect ไปหน้าที่เหมาะสม
3. **Google Sign-in**: คลิก "เข้าสู่ระบบด้วย Google" → ระบบจะสร้างข้อมูลใน Firestore อัตโนมัติ

## Routes

- `/` - หน้า Login/Register
- `/admin` - Admin Dashboard (ต้องมี role = "admin")
- `/user` - User Dashboard (ต้องมี role = "user")

## Protected Routes

ระบบจะตรวจสอบ role ก่อนเข้าถึงหน้า:
- ถ้า role = "admin" → เข้าได้เฉพาะ `/admin`
- ถ้า role = "user" → เข้าได้เฉพาะ `/user`
- ถ้ายังไม่มี role → redirect กลับไปหน้า login

