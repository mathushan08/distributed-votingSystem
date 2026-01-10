import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import { useMe } from "./useMe";
import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from "./user/UserDashboard";
import LandingPage from "./LandingPage";
import ForgotPassword from "./ForgotPassword";

function DashboardGuard() {
  const user = useMe();

  if (user === null) return null; // loading
  if (!user) return <Navigate to="/login" />;

  return user.role === "ADMIN"
    ? <AdminDashboard />
    : <UserDashboard />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login onLogin={() => window.location.href = "/dashboard"} onSwitchToSignup={() => window.location.href = "/signup"} />} />
      <Route path="/signup" element={<Signup onSwitchToLogin={() => window.location.href = "/login"} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<DashboardGuard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
