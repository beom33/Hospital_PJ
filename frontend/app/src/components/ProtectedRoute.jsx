import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isLoggedIn) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    alert("관리자 권한이 필요합니다.");
    return <Navigate to="/" replace />;
  }

  return children;
}
