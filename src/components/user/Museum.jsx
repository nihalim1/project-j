import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Museum() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null);
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "content_museum"), orderBy("title"));
        const snap = await getDocs(q);
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setItems(list);
      } catch (error) {
        console.error("fetch museum content error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">{t("user.museum.title")}</h3>
        <p className="text-sm text-slate-600">{t("user.museum.subtitle")}</p>
      </div>
      {loading ? (
        <p className="text-sm text-slate-500">{t("common.loading")}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">{t("common.noContent")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center">
          {items.map((item) => {
            const displayTitle = currentLanguage === "ms" && item.title_ms ? item.title_ms : item.title;
            const displayDescription = currentLanguage === "ms" && item.description_ms ? item.description_ms : item.description;
            return (
              <article
              key={item.id}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all max-w-xl w-full cursor-pointer group"
              onClick={() => setModalItem(item)}
            >
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={displayTitle}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                    {t("common.noImage")}
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-slate-800 line-clamp-1">{displayTitle}</h4>
                  <p className="text-sm text-slate-600 line-clamp-2">{displayDescription}</p>
                </div>
                {item.link && <span className="inline-flex items-center text-xs text-blue-600 font-semibold">{t("common.hasMoreLink")} →</span>}
              </div>
            </article>
          );
        })}
        </div>
      )}

      {modalItem && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 py-8"
          onClick={() => setModalItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <button
                onClick={() => setModalItem(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 shadow"
                aria-label={t("common.close")}
              >
                ✕
              </button>
              {modalItem.image ? (
                <img
                  src={modalItem.image}
                  alt={currentLanguage === "ms" && modalItem.title_ms ? modalItem.title_ms : modalItem.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">{t("common.noImage")}</div>
              )}
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-xl font-semibold text-slate-800">{currentLanguage === "ms" && modalItem.title_ms ? modalItem.title_ms : modalItem.title}</h4>
                </div>
                <div className="w-9" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {currentLanguage === "ms" && modalItem.description_ms ? modalItem.description_ms : modalItem.description}
              </p>
              {modalItem.link && (
                <a
                  href={modalItem.link}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600"
                >
                  {t("common.openLink")}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

