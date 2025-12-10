import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-slideUp">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <FiAlertTriangle className="text-red-600 text-2xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{title || "ยืนยันการดำเนินการ"}</h3>
            <p className="text-slate-600">{message || "คุณแน่ใจหรือไม่ว่าต้องการดำเนินการนี้?"}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
            aria-label="ปิด"
          >
            <FiX className="text-lg" />
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-md shadow-red-500/30"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}

