import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function FindAccount() {
  const [tab, setTab] = useState("username"); // "username" | "password"

  // 아이디 찾기
  const [findName, setFindName] = useState("");
  const [findEmail, setFindEmail] = useState("");
  const [foundUsername, setFoundUsername] = useState("");

  // 비밀번호 찾기
  const [resetUsername, setResetUsername] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetDone, setResetDone] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
    marginBottom: "16px",
  };

  const handleTabChange = (t) => {
    setTab(t);
    setError("");
    setFoundUsername("");
    setResetDone(false);
  };

  // 아이디 찾기 요청
  const handleFindUsername = async (e) => {
    e.preventDefault();
    setError("");
    setFoundUsername("");
    if (!findName || !findEmail) {
      setError("이름과 이메일을 모두 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/find-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: findName, email: findEmail }),
      });
      if (!res.ok) throw new Error(await res.text());
      const username = await res.text();
      setFoundUsername(username);
    } catch (err) {
      setError(err.message || "아이디 찾기 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 찾기 요청
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setResetDone(false);
    if (!resetUsername || !resetEmail) {
      setError("아이디와 이메일을 모두 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: resetUsername, email: resetEmail }),
      });
      if (!res.ok) throw new Error(await res.text());
      setResetDone(true);
    } catch (err) {
      setError(err.message || "비밀번호 찾기 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="th-layout-main">
        <div className="th-layout-content">
          <div style={{
            minHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            padding: "40px 20px"
          }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "16px",
              padding: "50px 40px",
              width: "100%",
              maxWidth: "450px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
            }}>
              <h2 className="h3" style={{ textAlign: "center", marginBottom: "24px", color: "#1a1a2e" }}>
                아이디 / 비밀번호 찾기
              </h2>

              {/* 탭 */}
              <div style={{ display: "flex", marginBottom: "30px", borderBottom: "2px solid #eee" }}>
                <button
                  type="button"
                  onClick={() => handleTabChange("username")}
                  style={{
                    flex: 1, padding: "12px", border: "none", background: "none",
                    fontSize: "15px", fontWeight: "600", cursor: "pointer",
                    color: tab === "username" ? "#e63946" : "#999",
                    borderBottom: tab === "username" ? "2px solid #e63946" : "2px solid transparent",
                    marginBottom: "-2px"
                  }}
                >
                  아이디 찾기
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("password")}
                  style={{
                    flex: 1, padding: "12px", border: "none", background: "none",
                    fontSize: "15px", fontWeight: "600", cursor: "pointer",
                    color: tab === "password" ? "#e63946" : "#999",
                    borderBottom: tab === "password" ? "2px solid #e63946" : "2px solid transparent",
                    marginBottom: "-2px"
                  }}
                >
                  비밀번호 찾기
                </button>
              </div>

              {/* 에러 */}
              {error && (
                <div style={{ padding: "12px", background: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>
                  {error}
                </div>
              )}

              {/* 아이디 찾기 */}
              {tab === "username" && (
                <form onSubmit={handleFindUsername}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>이름</label>
                  <input
                    type="text"
                    value={findName}
                    onChange={(e) => { setFindName(e.target.value); setError(""); }}
                    placeholder="가입 시 입력한 이름"
                    disabled={isLoading}
                    style={inputStyle}
                  />
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>이메일</label>
                  <input
                    type="email"
                    value={findEmail}
                    onChange={(e) => { setFindEmail(e.target.value); setError(""); }}
                    placeholder="가입 시 입력한 이메일"
                    disabled={isLoading}
                    style={inputStyle}
                  />
                  <button
                    type="submit"
                    className="btnset btnset-primary"
                    disabled={isLoading}
                    style={{ width: "100%", padding: "16px", fontSize: "16px", fontWeight: "600", borderRadius: "8px", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
                  >
                    {isLoading ? "찾는 중..." : "아이디 찾기"}
                  </button>

                  {foundUsername && (
                    <div style={{ marginTop: "20px", padding: "16px", background: "#f0f8ff", borderRadius: "8px", textAlign: "center" }}>
                      <p className="p2" style={{ color: "#666", marginBottom: "6px" }}>회원님의 아이디는</p>
                      <p style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a2e" }}>{foundUsername}</p>
                      <p className="p2" style={{ color: "#999", marginTop: "6px", fontSize: "12px" }}>보안을 위해 일부 문자는 *로 표시됩니다</p>
                    </div>
                  )}
                </form>
              )}

              {/* 비밀번호 찾기 */}
              {tab === "password" && (
                <form onSubmit={handleResetPassword}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>아이디</label>
                  <input
                    type="text"
                    value={resetUsername}
                    onChange={(e) => { setResetUsername(e.target.value); setError(""); }}
                    placeholder="가입 시 사용한 아이디"
                    disabled={isLoading}
                    style={inputStyle}
                  />
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>이메일</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => { setResetEmail(e.target.value); setError(""); }}
                    placeholder="가입 시 입력한 이메일"
                    disabled={isLoading}
                    style={inputStyle}
                  />
                  <button
                    type="submit"
                    className="btnset btnset-primary"
                    disabled={isLoading}
                    style={{ width: "100%", padding: "16px", fontSize: "16px", fontWeight: "600", borderRadius: "8px", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
                  >
                    {isLoading ? "처리 중..." : "임시 비밀번호 발송"}
                  </button>

                  {resetDone && (
                    <div style={{ marginTop: "20px", padding: "16px", background: "#f0fff4", borderRadius: "8px", textAlign: "center" }}>
                      <p style={{ color: "#2a9d8f", fontWeight: "600" }}>✓ 임시 비밀번호가 이메일로 발송되었습니다</p>
                      <p className="p2" style={{ color: "#666", marginTop: "6px", fontSize: "13px" }}>로그인 후 반드시 비밀번호를 변경해주세요</p>
                    </div>
                  )}
                </form>
              )}

              <div style={{ marginTop: "24px", textAlign: "center", paddingTop: "20px", borderTop: "1px solid #eee" }}>
                <Link to="/login" style={{ color: "#e63946", fontWeight: "600", textDecoration: "none", fontSize: "14px" }}>
                  로그인으로 돌아가기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
