import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiChevronDown, FiLogOut, FiGlobe, FiMenu } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";
import logoUrl from "../../assets/react.svg";

/**
 * @param {Object} props
 * @param {string} props.brand - ชื่อแบรนด์/โลโก้ข้อความ
 * @param {Array<{id:string,label:string,icon:React.ComponentType}>} props.menuItems
 * @param {string} props.activeSection
 * @param {(id:string)=>void} props.onChangeSection
 * @param {()=>void} props.onLogout
 * @param {string} [props.userName]
 * @param {React.ReactNode} props.children
 */
export default function UserLayout({
  brand = "เปลียนเอาเอง",
  menuItems = [],
  activeSection,
  onChangeSection,
  onLogout,
  onProfileClick,
  userName,
  children,
}) {
  const { t } = useTranslation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-4 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="md:hidden p-2 rounded-full hover:bg-slate-100 text-slate-600"
            onClick={() => setNavOpen(true)}
            aria-label={t("user.layout.openMainMenu")}
          >
            <FiMenu className="text-lg" />
          </button>
          <Link to="/user" className="flex items-center gap-2 min-w-0">
            <div className="shrink-0">
              <img
                src={logoUrl}
                alt={brand}
                className="block h-7 w-auto md:h-8"
                loading="eager"
                decoding="async"
              />
            </div>
            <span className="hidden sm:block leading-none text-slate-800 text-sm md:text-base font-semibold truncate max-w-[160px] md:max-w-[240px]">
              {brand}
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
          </div>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <FiUser className="text-lg" />
            </div>
            {userName && (
              <span className="hidden sm:inline text-sm font-medium text-slate-800 max-w-[200px] md:max-w-[260px] leading-snug break-words">
                {userName}
              </span>
            )}
            <FiChevronDown className="text-slate-600" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-20">
              <button
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setProfileOpen(false);
                  onProfileClick?.();
                }}
              >
                {t("user.layout.profile")}
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <FiLogOut className="text-base" />
                {t("user.layout.logout")}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Nav drawer for mobile (เมนูหลัก) */}
      {navOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setNavOpen(false)}
            aria-label={t("user.layout.closeMainMenu")}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-xl md:hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2 min-w-0">
                <img src={logoUrl} alt={brand} className="h-8 w-auto shrink-0" loading="eager" decoding="async" />
                <span className="text-base font-semibold text-slate-800 truncate">{brand}</span>
              </div>
              <button
                onClick={() => setNavOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
                aria-label="ปิดเมนู"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 px-4 py-4 space-y-3 text-slate-800 text-base overflow-y-auto">
              <p className="text-xs uppercase tracking-wide text-slate-500">{t("user.layout.mainMenu")}</p>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onChangeSection(item.id);
                    setNavOpen(false);
                  }}
                  className={`text-left w-full transition-colors flex items-center gap-2 ${
                    activeSection === item.id ? "text-emerald-600 font-semibold" : "hover:text-emerald-600"
                  }`}
                >
                  <item.icon className="text-lg text-slate-600" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between gap-3 text-slate-600">
              <div className="flex items-center gap-2">
                <FiGlobe className="text-lg" />
                <span className="text-sm">{t("common.language")}</span>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </>
      )}

      <div className="flex min-h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200">
          <nav className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-slate-100 text-slate-900 border border-slate-200"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 px-4 md:px-8 py-6">
          <div className="space-y-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

