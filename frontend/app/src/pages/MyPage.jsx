import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function MyPage() {
  const [tab, setTab] = useState("info"); // "info" | "password"
  const [info, setInfo] = useState({ username: "", name: "", nickname: "", email: "", role: "" });
  const [infoMsg, setInfoMsg] = useState("");
  const [infoError, setInfoError] = useState("");

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  // 내 정보 불러오기 - AuthContext의 user로 초기값 설정 후 API로 최신 정보 가져오기
  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    // AuthContext user 정보로 먼저 채우기
    if (user) {
      setInfo({ username: user.username || "", name: user.name || "", nickname: user.nickname || "", email: user.email || "", role: user.role || "" });
    }
    // 백엔드에서 최신 정보 가져오기
    fetch("http://localhost:8080/api/mypage", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => setInfo(data))
      .catch(() => {}); // 실패해도 AuthContext 정보 유지
  }, []);

  // 회원정보 수정
  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setInfoMsg(""); setInfoError("");
    if (!info.name || !info.nickname || !info.email) { setInfoError("이름, 닉네임, 이메일을 입력해주세요."); return; }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/mypage", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: info.name, nickname: info.nickname, email: info.email }),
      });
      if (!res.ok) throw new Error(await res.text());
      setInfoMsg("회원정보가 수정되었습니다.");
      // AuthContext의 user 정보도 업데이트
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const updated = { ...stored, name: info.name, nickname: info.nickname, email: info.email };
      localStorage.setItem("user", JSON.stringify(updated));
      login({ token, ...updated });
    } catch (err) {
      setInfoError(err.message || "수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 변경
  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwMsg(""); setPwError("");
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwError("모든 필드를 입력해주세요."); return;
    }
    if (pwForm.newPassword.length < 6) { setPwError("새 비밀번호는 최소 6자 이상이어야 합니다."); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError("새 비밀번호가 일치하지 않습니다."); return; }
    if (pwForm.currentPassword === pwForm.newPassword) { setPwError("현재 비밀번호와 새 비밀번호가 같습니다."); return; }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      if (!res.ok) throw new Error(await res.text());
      setPwMsg("비밀번호가 성공적으로 변경되었습니다.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err.message || "비밀번호 변경 중 오류가 발생했습니다.");
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
              background: "rgba(255,255,255,0.95)",
              borderRadius: "16px",
              padding: "50px 40px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}>
              <h2 className="h3" style={{ textAlign: "center", marginBottom: "6px", color: "#1a1a2e" }}>마이페이지</h2>
              <p className="p1" style={{ textAlign: "center", marginBottom: "24px", color: "#666" }}>
                {info.username && `${info.nickname || info.username}님`}
                {info.role === "ADMIN" && (
                  <span style={{ marginLeft: "8px", background: "#e63946", color: "#fff", padding: "2px 8px", borderRadius: "10px", fontSize: "12px", fontWeight: "600" }}>관리자</span>
                )}
              </p>

              {/* 탭 */}
              <div style={{ display: "flex", marginBottom: "30px", borderBottom: "2px solid #eee" }}>
                {[["info", "회원정보 변경"], ["password", "비밀번호 변경"]].map(([key, label]) => (
                  <button key={key} type="button" onClick={() => { setTab(key); setInfoMsg(""); setInfoError(""); setPwMsg(""); setPwError(""); }}
                    style={{
                      flex: 1, padding: "12px", border: "none", background: "none",
                      fontSize: "15px", fontWeight: "600", cursor: "pointer",
                      color: tab === key ? "#e63946" : "#999",
                      borderBottom: tab === key ? "2px solid #e63946" : "2px solid transparent",
                      marginBottom: "-2px"
                    }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* 회원정보 변경 */}
              {tab === "info" && (
                <form onSubmit={handleInfoSubmit}>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>아이디</label>
                    <input type="text" value={info.username} disabled
                      style={{ ...inputStyle, background: "#f5f5f5", color: "#999" }} />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>이름 *</label>
                    <input type="text" value={info.name} onChange={(e) => setInfo(p => ({ ...p, name: e.target.value }))}
                      placeholder="이름을 입력하세요" disabled={isLoading} style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>닉네임 *</label>
                    <input type="text" value={info.nickname} onChange={(e) => setInfo(p => ({ ...p, nickname: e.target.value }))}
                      placeholder="닉네임을 입력하세요" disabled={isLoading} style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>이메일 *</label>
                    <input type="email" value={info.email} onChange={(e) => setInfo(p => ({ ...p, email: e.target.value }))}
                      placeholder="이메일을 입력하세요" disabled={isLoading} style={inputStyle} />
                  </div>

                  {infoError && <div style={{ padding: "12px", background: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>{infoError}</div>}
                  {infoMsg && <div style={{ padding: "12px", background: "#efe", color: "#363", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>{infoMsg}</div>}

                  <button type="submit" className="btnset btnset-primary" disabled={isLoading}
                    style={{ width: "100%", padding: "16px", fontSize: "16px", fontWeight: "600", borderRadius: "8px", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}>
                    {isLoading ? "수정 중..." : "회원정보 수정"}
                  </button>
                </form>
              )}

              {/* 비밀번호 변경 */}
              {tab === "password" && (
                <form onSubmit={handlePwSubmit}>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>현재 비밀번호 *</label>
                    <input type="password" value={pwForm.currentPassword}
                      onChange={(e) => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                      placeholder="현재 비밀번호를 입력하세요" disabled={isLoading} style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>새 비밀번호 *</label>
                    <input type="password" value={pwForm.newPassword}
                      onChange={(e) => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                      placeholder="새 비밀번호 (최소 6자)" disabled={isLoading} style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>새 비밀번호 확인 *</label>
                    <input type="password" value={pwForm.confirmPassword}
                      onChange={(e) => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                      placeholder="새 비밀번호를 다시 입력하세요" disabled={isLoading} style={inputStyle} />
                  </div>

                  {pwError && <div style={{ padding: "12px", background: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>{pwError}</div>}
                  {pwMsg && <div style={{ padding: "12px", background: "#efe", color: "#363", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>{pwMsg}</div>}

                  <button type="submit" className="btnset btnset-primary" disabled={isLoading}
                    style={{ width: "100%", padding: "16px", fontSize: "16px", fontWeight: "600", borderRadius: "8px", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}>
                    {isLoading ? "변경 중..." : "비밀번호 변경"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
