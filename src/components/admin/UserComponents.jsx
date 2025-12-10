import { FiEdit2, FiTrash2, FiUser, FiMail, FiShield, FiX } from "react-icons/fi";

export function UserTable({ users, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <FiUser className="text-4xl text-slate-300" />
          <p className="text-slate-500 font-medium">ไม่มีข้อมูลผู้ใช้</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              {/* Name */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <FiUser className="text-slate-600 text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-1">ชื่อ</p>
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user.name || <span className="text-slate-400">-</span>}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <FiMail className="text-slate-600 text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-1">อีเมล</p>
                  <p className="text-sm text-slate-700 truncate">{user.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <FiShield className="text-slate-600 text-lg" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">บทบาท</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onEdit(user)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <FiEdit2 className="text-base" />
                  <span>แก้ไข</span>
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <FiTrash2 className="text-base" />
                  <span>ลบ</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-slate-400" />
                      <span>ชื่อ</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiMail className="text-slate-400" />
                      <span>อีเมล</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiShield className="text-slate-400" />
                      <span>บทบาท</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {user.name || <span className="text-slate-400">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                          title="แก้ไข"
                        >
                          <FiEdit2 className="text-sm" />
                          <span>แก้ไข</span>
                        </button>
                        <button
                          onClick={() => onDelete(user.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                          title="ลบ"
                        >
                          <FiTrash2 className="text-sm" />
                          <span>ลบ</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export function UserModal({ show, editingUser, formData, setFormData, onSubmit, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-slate-800">
            {editingUser ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
            aria-label="ปิด"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <FiUser className="inline mr-2 text-slate-400" />
              ชื่อ
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              placeholder="กรอกชื่อ"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <FiMail className="inline mr-2 text-slate-400" />
              อีเมล
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              placeholder="กรอกอีเมล"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <FiShield className="inline mr-2 text-slate-400" />
              บทบาท
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all bg-white"
            >
              <option value="user">ผู้ใช้</option>
              <option value="admin">ผู้ดูแลระบบ</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-semibold shadow-md shadow-emerald-500/30"
            >
              {editingUser ? "อัปเดต" : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
