import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 앱 시작 시 세션에서 복원 (브라우저/탭 닫으면 자동 삭제)
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  // 탭이 다시 활성화될 때 서버 연결 확인 → 서버 꺼지면 자동 로그아웃
  useEffect(() => {
    const checkServer = async () => {
      if (!sessionStorage.getItem("token")) return;
      try {
        await fetch("http://localhost:8080/api/health", { signal: AbortSignal.timeout(3000) });
      } catch {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setUser(null);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") checkServer();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const login = (loginData) => {
    sessionStorage.setItem("token", loginData.token);
    const userData = {
      id: loginData.id,
      username: loginData.username,
      name: loginData.name,
      nickname: loginData.nickname,
      profileImage: loginData.profileImage,
      email: loginData.email,
      role: loginData.role,
    };
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
