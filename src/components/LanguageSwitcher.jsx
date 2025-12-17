import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = ({ mobileUp = true }) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleSelect = (lng) => {
    setOpen(false);
    if (lng !== currentLanguage) {
      changeLanguage(lng);
    }
  };

  const displayCode = currentLanguage === 'ms' ? 'MS' : 'TH';

  const mobilePositionClass = mobileUp
    ? 'bottom-9 origin-bottom-right'
    : 'top-full mt-1 origin-top-right';

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        <span className="text-sm">🌐</span>
        <span>{displayCode}</span>
        <span className="text-[10px]">▾</span>
      </button>

      {open && (
        <div
          className={`absolute right-0 ${mobilePositionClass} md:bottom-auto md:top-full md:mt-1 w-20 md:origin-top-right rounded-md border border-slate-200 bg-white shadow-lg z-20 max-h-48 overflow-y-auto`}
        >
          <button
            type="button"
            onClick={() => handleSelect('th')}
            className={`block w-full px-3 py-2 text-xs font-semibold text-left ${
              currentLanguage === 'th' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            TH
          </button>
          <button
            type="button"
            onClick={() => handleSelect('ms')}
            className={`block w-full px-3 py-2 text-xs font-semibold text-left border-t border-slate-100 ${
              currentLanguage === 'ms' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            MS
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
