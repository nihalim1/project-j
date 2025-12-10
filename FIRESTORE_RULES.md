# Firestore Rules สำหรับระบบ Login/Register

## ปัญหา: Missing or insufficient permissions

ถ้าเห็น error นี้ใน console หมายความว่า Firestore rules ยังไม่ตั้งค่าถูกต้อง

## วิธีแก้ไข

### 1. ไปที่ Firebase Console
- เปิด [Firebase Console](https://console.firebase.google.com/)
- เลือกโปรเจกต์ `project-webapp-da8c5`
- ไปที่ **Firestore Database** > **Rules**

### 2. ตั้งค่า Rules ตามนี้:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // ผู้ใช้สามารถอ่านและเขียนข้อมูลของตัวเองได้
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Admin สามารถอ่านข้อมูลทั้งหมดได้ (สำหรับอนาคต)
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 3. สำหรับการทดสอบ (ไม่แนะนำสำหรับ Production)

ถ้าต้องการให้ทุกคนอ่านได้ชั่วคราว (สำหรับทดสอบเท่านั้น):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // อนุญาตให้อ่าน/เขียนได้ถ้ามีการ authenticate แล้ว
      allow read, write: if request.auth != null;
    }
  }
}
```

**คำเตือน:** Rules นี้ไม่ปลอดภัยสำหรับ Production ใช้สำหรับทดสอบเท่านั้น!

### 4. คลิก "Publish" เพื่อบันทึก rules

หลังจากตั้งค่า rules แล้ว:
1. คลิก **Publish**
2. รอสักครู่ให้ rules ถูก deploy
3. Refresh หน้าเว็บและลองใหม่

## ตรวจสอบว่า Rules ทำงาน

หลังจากตั้งค่า rules แล้ว:
- ลองสมัครสมาชิกใหม่
- ลองเข้าสู่ระบบ
- ตรวจสอบ console ว่าไม่มี error "Missing or insufficient permissions" แล้ว

