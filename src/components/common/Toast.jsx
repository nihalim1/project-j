import { useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertCircle, FiX } from "react-icons/fi";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: FiCheckCircle,
    error: FiXCircle,
    info: FiInfo,
    warning: FiAlertCircle,
  };

  const colors = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  const Icon = icons[toast.type] || FiInfo;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideUp">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-md ${colors[toast.type]}`}
      >
        <Icon className={`text-xl flex-shrink-0 ${toast.type === "success" ? "text-emerald-600" : toast.type === "error" ? "text-red-600" : toast.type === "info" ? "text-blue-600" : "text-yellow-600"}`} />
        <div className="flex-1">
          <p className="font-semibold text-sm">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/10 rounded transition-colors flex-shrink-0"
          aria-label="ปิด"
        >
          <FiX className="text-base" />
        </button>
      </div>
    </div>
  );
}

