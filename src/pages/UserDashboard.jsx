import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Toast from "../components/common/Toast";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      setToast({ message: "เกิดข้อผิดพลาดในการออกจากระบบ", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-emerald-600">ยินดีต้อนรับผู้ใช้</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">ข้อมูลส่วนตัว</h2>
            <p className="text-slate-600">เนื้อหาสำหรับ User Dashboard</p>
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

