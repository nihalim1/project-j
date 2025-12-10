import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Configuration
// วิธีที่ 1: ใช้ environment variables (แนะนำ)
// สร้างไฟล์ .env.local และใส่ค่าตาม .env.example
// วิธีที่ 2: แก้ไขค่าตรงๆ ด้านล่าง
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCbvwHtxop-RRnMIOyYQ7uew59v_zd7Ju4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "project-webapp-da8c5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "project-webapp-da8c5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "project-webapp-da8c5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "451269488146",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:451269488146:web:cb09297819458f575d32cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

