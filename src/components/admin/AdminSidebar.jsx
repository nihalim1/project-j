import { FiUsers, FiBarChart2, FiSettings, FiLogOut, FiMenu, FiX } from "react-icons/fi";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, activeMenu, setActiveMenu, onLogout }) {
  const menuItems = [
    { id: "dashboard", label: "แดชบอร์ด", icon: FiBarChart2 },
    { id: "users", label: "จัดการผู้ใช้", icon: FiUsers },
    { id: "settings", label: "ตั้งค่า", icon: FiSettings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-xl transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 w-20"
        } fixed md:static h-screen z-50 border-r border-slate-100`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <FiBarChart2 className="text-white text-sm" />
                </div>
                <h1 className="text-lg font-bold text-slate-800">Admin</h1>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-3 md:p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-all group ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`text-lg ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"}`} />
                  {sidebarOpen && (
                    <span className={`font-medium text-sm ${isActive ? "text-white" : "text-slate-700"}`}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-3 md:p-4 border-t border-slate-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors group"
            >
              <FiLogOut className="text-lg text-red-500 group-hover:text-red-600" />
              {sidebarOpen && <span className="font-medium text-sm">ออกจากระบบ</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
