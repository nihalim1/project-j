import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { auth, db } from "../firebase";
import AdminSidebar from "../components/admin/AdminSidebar";
import { UserTable, UserModal } from "../components/admin/UserComponents";
import DashboardStats from "../components/admin/DashboardStats";
import Toast from "../components/common/Toast";
import ConfirmModal from "../components/common/ConfirmModal";
import ContentManager from "../components/admin/ContentManager";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "user" });
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, userId: null });

  useEffect(() => {
    // Set sidebar open by default on desktop
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    if (activeMenu === "users" || activeMenu === "dashboard") {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "users"), orderBy("email"));
      const querySnapshot = await getDocs(q);
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("เกิดข้อผิดพลาดในการโหลดข้อมูล", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      showToast("เกิดข้อผิดพลาดในการออกจากระบบ", "error");
    }
  };

  const handleOpenModal = (user) => {
    if (!user) return;
    setEditingUser(user);
    setFormData({ name: user.name || "", email: user.email || "", role: user.role || "user" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "user" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editingUser) return;

      await updateDoc(doc(db, "users", editingUser.id), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
      showToast("อัปเดตข้อมูลสำเร็จ", "success");

      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      showToast("เกิดข้อผิดพลาดในการบันทึกข้อมูล", "error");
    }
  };

  const handleDeleteClick = (userId) => {
    setConfirmModal({ show: true, userId });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDoc(doc(db, "users", confirmModal.userId));
      showToast("ลบข้อมูลสำเร็จ", "success");
      setConfirmModal({ show: false, userId: null });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast("เกิดข้อผิดพลาดในการลบข้อมูล", "error");
      setConfirmModal({ show: false, userId: null });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmModal({ show: false, userId: null });
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 flex">
      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 min-w-0 h-screen overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden mb-4 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            aria-label="เปิดเมนู"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">ยินดีต้อนรับ Admin</h1>
                <p className="text-slate-500 text-sm md:text-base">จัดการระบบและข้อมูลผู้ใช้</p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6">
            {activeMenu === "users" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">จัดการผู้ใช้</h2>
                  <p className="text-sm text-slate-500">รวม {users.length} บัญชี</p>
                </div>
                <UserTable
                  users={users}
                  loading={loading}
                  onEdit={handleOpenModal}
                  onDelete={handleDeleteClick}
                />
              </div>
            )}

            {activeMenu === "dashboard" && (
              <DashboardStats users={users} variant="gradient" />
            )}

            {activeMenu === "settings" && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">ตั้งค่า</h2>
                <p className="text-slate-600">เนื้อหาสำหรับหน้าตั้งค่า</p>
              </div>
            )}

            {activeMenu === "content" && (
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">จัดการเนื้อหา</h2>
                <ContentManager showToast={showToast} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal for Add/Edit */}
      <UserModal
        show={showModal}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Confirm Modal */}
      <ConfirmModal
        show={confirmModal.show}
        title="ยืนยันการลบข้อมูล"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
