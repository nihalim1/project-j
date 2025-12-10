import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Toast from "../components/common/Toast";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function LoginPage() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  
  // Function to change language
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ email: "", password: "", name: "", confirm: "" });
  const [errors, setErrors] = useState({ email: "", password: "", name: "", confirm: "" });
  const [toast, setToast] = useState(null);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const emailValid = useMemo(() => /.+@.+\..+/.test(form.email), [form.email]);
  const passwordValid = useMemo(() => form.password.length >= 6, [form.password]);
  const nameValid = useMemo(() => form.name.trim().length >= 2, [form.name]);
  const confirmValid = useMemo(() => form.confirm === form.password && form.confirm.length > 0, [form.confirm, form.password]);

  const validate = () => {
    const nextErrors = { email: "", password: "", name: "", confirm: "" };
    if (!emailValid) nextErrors.email = "กรุณากรอกอีเมลให้ถูกต้อง";
    if (!passwordValid) nextErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    if (mode === "register") {
      if (!nameValid) nextErrors.name = "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร";
      if (!confirmValid) nextErrors.confirm = "ยืนยันรหัสผ่านไม่ตรงกัน";
    }
    setErrors(nextErrors);
    return nextErrors;
  };

  const onForgotPassword = async () => {
    const email = forgotEmail.trim();
    if (!email) {
      setToast({ message: "กรุณากรอกอีเมล", type: "error" });
      return;
    }
    if (!/.+@.+\..+/.test(email)) {
      setToast({ message: "รูปแบบอีเมลไม่ถูกต้อง", type: "error" });
      return;
    }

    try {
      setForgotSubmitting(true);
      await sendPasswordResetEmail(auth, email);
      setToast({ message: "ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว", type: "success" });
      setForgotOpen(false);
      setForgotEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);
      let message = "ไม่สามารถส่งลิงก์รีเซ็ตรหัสผ่านได้";
      if (error.code === "auth/user-not-found") {
        message = "ไม่พบผู้ใช้ที่ใช้อีเมลนี้";
      }
      setToast({ message, type: "error" });
    } finally {
      setForgotSubmitting(false);
    }
  };

  const checkUserRoleAndNavigate = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const role = userData.role || "user";
        
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        // ถ้ายังไม่มีข้อมูลใน Firestore ให้ไปหน้า user
        navigate("/user");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      navigate("/user");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.values(nextErrors).some(Boolean)) return;

    try {
      setSubmitting(true);

      if (mode === "register") {
        // สมัครสมาชิก
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        const user = userCredential.user;

        // บันทึกข้อมูลผู้ใช้ใน Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: form.name,
          email: form.email,
          role: "user" // ตั้งค่าเริ่มต้นเป็น user
        });

        // Navigate ไปหน้า user (เพราะ role เริ่มต้นเป็น user)
        navigate("/user");
      } else {
        // เข้าสู่ระบบ
        const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
        const user = userCredential.user;

        // ตรวจสอบ role และ navigate
        await checkUserRoleAndNavigate(user.uid);
      }
    } catch (error) {
      console.error("Auth error:", error);
      let errorMessage = "เกิดข้อผิดพลาด";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "อีเมลนี้ถูกใช้งานแล้ว";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "รูปแบบอีเมลไม่ถูกต้อง";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "รหัสผ่านอ่อนแอเกินไป";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "ไม่พบผู้ใช้";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "รหัสผ่านไม่ถูกต้อง";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      }
      
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogleLogin = async () => {
    try {
      setSubmitting(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ตรวจสอบว่ามีข้อมูลใน Firestore หรือยัง
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // ถ้ายังไม่มี ให้สร้างข้อมูลใหม่
        await setDoc(userDocRef, {
          name: user.displayName || "",
          email: user.email || "",
          role: "user" // ตั้งค่าเริ่มต้นเป็น user
        });
      }

      // ตรวจสอบ role และ navigate
      await checkUserRoleAndNavigate(user.uid);
    } catch (error) {
      console.error("Google login error:", error);
      if (error.code !== "auth/popup-closed-by-user") {
        setToast({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google", type: "error" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLogin = mode === "login";

  // Change this filename to swap background quickly; file must exist in src/assets
  const bgFileName = "bg2.jpg";
  const bgUrl = useMemo(
    () => new URL(`../assets/${bgFileName}`, import.meta.url).href,
    [bgFileName]
  );

  return (
    <main
      className="relative min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-blue-50 flex items-center justify-center px-3 py-4 md:px-4 md:py-12"
      style={{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        
      
      }}
    >

      {/* Centered card container */}
      <div className={`relative w-full max-w-5xl transition-all duration-500 ease-out ${mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-xl border border-slate-200/50">
          {/* Left: Hero */}
          <section className="relative flex items-center justify-center overflow-hidden bg-emerald-400 p-6 md:p-12 min-h-48 md:min-h-auto">
            <div className="absolute top-4 left-4 z-20">
              <LanguageSwitcher />
            </div>

            {/* Center text */}
            <div className="relative z-10 text-center text-white max-w-md">
              <h1 className="text-[22px] md:text-[30px] font-bold leading-tight mb-4">
                {isLogin ? t("hero.titleLogin") : t("hero.titleRegister")}
              </h1>
              <div className="h-0.5 w-12 bg-white/60 mx-auto mb-5" />
              <p className="text-[15px] md:text-[17px] text-white/90 leading-relaxed">
                {isLogin ? t("hero.subtitleLogin") : t("hero.subtitleRegister")}
              </p>
            </div>
          </section>

          {/* Right: Form */}
          <section className="relative flex items-center justify-center bg-white p-5 md:p-8 lg:p-10">
            <div className="w-full max-w-md">
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1 mb-3">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`px-4 py-1.5 rounded-md text-[13px] md:text-[15px] font-medium transition-all ${
                      isLogin
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    {t("tabs.login")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={`px-4 py-1.5 rounded-md text-[13px] md:text-[15px] font-medium transition-all ${
                      !isLogin
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    {t("tabs.register")}
                  </button>
                </div>
                <h2 className="text-[20px] md:text-[26px] font-bold text-slate-800 mb-1.5">
                  {isLogin ? t("form.headingLogin") : t("form.headingRegister")}
                </h2>
                <p className="text-[13px] md:text-[15px] text-slate-500">
                  {isLogin ? t("form.descLogin") : t("form.descRegister")}
                </p>
              </div>

              <form
                onSubmit={onSubmit}
                className="space-y-3"
              >
                    {/* Name - only for register */}
                    {!isLogin && (
                      <div className="space-y-1">
                        <label htmlFor="name" className="block text-[13px] md:text-[15px] font-medium text-slate-700">
                          {t("form.name")}
                        </label>
                        <input
                          id="name"
                          type="text"
                          placeholder={t("placeholder.name")}
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={`w-full rounded-lg border px-4 py-2 text-[15px] md:text-[17px] text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                            errors.name
                              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                              : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                          }`}
                          autoComplete="name"
                        />
                        {errors.name && <p className="text-[11px] md:text-[13px] text-red-600 mt-0.5">{errors.name}</p>}
                      </div>
                    )}

                    {/* Email */}
                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-[13px] md:text-[15px] font-medium text-slate-700">
                        {t("form.email")}
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder={t("placeholder.email")}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={`w-full rounded-lg border px-4 py-2 text-[15px] md:text-[17px] text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          errors.email
                            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        }`}
                        autoComplete={isLogin ? "email" : "new-email"}
                      />
                      {errors.email && <p className="text-[11px] md:text-[13px] text-red-600 mt-0.5">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <label htmlFor="password" className="block text-[13px] md:text-[15px] font-medium text-slate-700">
                        {t("form.password")}
                      </label>
                      <input
                        id="password"
                        type="password"
                        placeholder={t("placeholder.password")}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className={`w-full rounded-lg border px-4 py-2 text-[15px] md:text-[17px] text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          errors.password
                            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        }`}
                        autoComplete={isLogin ? "current-password" : "new-password"}
                      />
                      {errors.password && (
                        <p className="text-[11px] md:text-[13px] text-red-600 mt-0.5">{errors.password}</p>
                      )}
                      {isLogin && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setForgotEmail(form.email || "");
                              setForgotOpen(true);
                            }}
                            className="mt-1 text-[11px] md:text-[13px] text-emerald-600 hover:text-emerald-700 underline"
                          >
                            ลืมรหัสผ่าน?
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Confirm - only for register */}
                    {!isLogin && (
                      <div className="space-y-1">
                        <label htmlFor="confirm" className="block text-[13px] md:text-[15px] font-medium text-slate-700">
                          {t("form.confirm")}
                        </label>
                        <input
                          id="confirm"
                          type="password"
                          placeholder={t("placeholder.confirm")}
                          value={form.confirm}
                          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                          className={`w-full rounded-lg border px-4 py-2 text-[15px] md:text-[17px] text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                            errors.confirm
                              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                              : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                          }`}
                          autoComplete="new-password"
                        />
                        {errors.confirm && <p className="text-[11px] md:text-[13px] text-red-600 mt-0.5">{errors.confirm}</p>}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-white text-[15px] md:text-[17px] shadow-sm transition-all hover:shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting
                        ? isLogin
                          ? "กำลังเข้าสู่ระบบ..."
                          : "กำลังสมัครสมาชิก..."
                        : isLogin
                        ? t("button.submitLogin")
                        : t("button.submitRegister")}
                    </button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-[11px] md:text-[13px] text-slate-500">หรือ</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onGoogleLogin}
                      disabled={submitting}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 text-[15px] md:text-[17px] shadow-sm transition-all hover:border-slate-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center justify-center gap-2.5">
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path fill="#EA4335" d="M12 10.8v3.84h5.31c-.21 1.2-.96 2.22-2.04 2.88l3.29 2.56c1.92-1.77 3.04-4.38 3.04-7.44 0-.72-.06-1.41-.18-2.08H12Z"/>
                          <path fill="#34A853" d="M6.62 14.28a5.45 5.45 0 0 1 0-3.56L3.2 7.92a9 9 0 0 0 0 8.16z"/>
                          <path fill="#4285F4" d="M12 6.24c1.32 0 2.51.45 3.45 1.32l2.58-2.58A8.97 8.97 0 0 0 3.2 7.92l3.42 2.8C7.39 8.15 9.5 6.24 12 6.24Z"/>
                          <path fill="#FBBC05" d="M12 21c2.46 0 4.53-.81 6.04-2.2l-3.29-2.56c-.91.58-2.07.92-3.25.92-2.5 0-4.61-1.9-5.38-4.48L3.2 16.08C4.5 19.2 8 21 12 21Z"/>
                          <path fill="none" d="M3 3h18v18H3z"/>
                        </svg>
                        {isLogin ? t("button.googleLogin") : t("button.googleRegister")}
                      </span>
                    </button>

                    <p className="mt-4 text-center text-[13px] md:text-[15px] text-slate-600">
                      {isLogin ? (
                        <>
                          {t("link.toRegister")}
                          <button
                            type="button"
                            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                            onClick={() => setMode("register")}
                          >
                            {t("button.switchToRegister")}
                          </button>
                        </>
                      ) : (
                        <>
                          {t("link.toLogin")}
                          <button
                            type="button"
                            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                            onClick={() => setMode("login")}
                          >
                            {t("button.switchToLogin")}
                          </button>
                        </>
                      )}
                    </p>
                  </form>
            </div>
          </section>
        </div>
      </div>

      {forgotOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => !forgotSubmitting && setForgotOpen(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-1">ลืมรหัสผ่าน</h3>
            <p className="text-sm text-slate-600 mb-4">กรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน</p>
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-slate-700">อีเมล</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none"
                placeholder="example@email.com"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => !forgotSubmitting && setForgotOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-100"
                disabled={forgotSubmitting}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={onForgotPassword}
                disabled={forgotSubmitting}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-60"
              >
                {forgotSubmitting ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ต"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </main>
  );
}
