# คำสั่ง Git สำหรับอัปเดตโค้ด

## ครั้งแรก (Initial Setup)
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/nihalim1/project-j.git
git push -u origin main
```

## อัปเดตโค้ดใหม่ (หลังจาก commit ครั้งแรกแล้ว)

### 1. ตรวจสอบไฟล์ที่เปลี่ยนแปลง
```bash
git status
```

### 2. เพิ่มไฟล์ที่เปลี่ยนแปลง (Stage files)
```bash
git add .
```
หรือเพิ่มเฉพาะไฟล์ที่ต้องการ:
```bash
git add src/pages/LoginPage.jsx
git add src/components/admin/AdminSidebar.jsx
```

### 3. Commit การเปลี่ยนแปลง
```bash
git commit -m "อธิบายการเปลี่ยนแปลง เช่น: ปรับลำดับเมนูใน sidebar"
```

ตัวอย่าง commit messages:
- `git commit -m "ปรับลำดับเมนูใน AdminSidebar"`
- `git commit -m "แก้ไขขนาดข้อความใน LoginPage"`
- `git commit -m "เพิ่มฟีเจอร์ใหม่"`

### 4. Push ขึ้น GitHub
```bash
git push
```

หรือถ้าเป็นครั้งแรกที่ push branch:
```bash
git push -u origin main
```

## คำสั่งที่มีประโยชน์อื่นๆ

### ดูประวัติการ commit
```bash
git log
```

### ยกเลิกการ stage ไฟล์
```bash
git reset
```

### ยกเลิกการเปลี่ยนแปลงในไฟล์ (ระวัง! จะลบการเปลี่ยนแปลง)
```bash
git checkout -- <filename>
```

### ดึงโค้ดล่าสุดจาก GitHub
```bash
git pull
```

