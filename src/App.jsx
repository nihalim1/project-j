import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserRole(userData.role || null);
          } else {
            setUserRole(null);
          }
        } catch (error) {
          // ถ้ามี permission error ให้ลองใช้ default role
          if (error.code === "permission-denied" || error.message?.includes("permissions")) {
            console.warn("Permission denied - using default role. Please check Firestore rules.");
            setUserRole("user"); // ใช้ default role
          } else {
            console.error("Error fetching user role:", error);
            setUserRole(null);
          }
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-emerald-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              userRole === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/user" replace />
              )
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
