import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const STATUS_LABEL = { PENDING: "대기중", CONFIRMED: "확인완료", CANCELLED: "취소됨" };
const STATUS_COLOR = { PENDING: { background: "#fff8e1", color: "#f57c00" }, CONFIRMED: { background: "#e8f5e9", color: "#2e7d32" }, CANCELLED: { background: "#fce4ec", color: "#c62828" } };

export default function MyPage() {
  const [tab, setTab] = useState("info"); // "info" | "password" | "reservation"
  const [info, setInfo] = useState({ username: "", name: "", email: "", role: "" });
  const [infoMsg, setInfoMsg] = useState("");
  const [infoError, setInfoError] = useState("");

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [resLoading, setResLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    if (user) {
      setInfo({ username: user.username || "", name: user.name || "", email: user.email || "", role: user.role || "" });
    }
    fetch("http://localhost:8080/api/mypage", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => setInfo({ username: data.username, name: data.name, email: data.email, role: data.role }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === "reservation") {
      setResLoading(true);
      fetch("http://localhost:8080/api/reservations/my", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setReservations(data))
        .catch(() => {})
        .finally(() => setResLoading(false));
    }
  }, [tab]);

  const handleCancelReservation = async (id) => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/reservations/${id}/cancel`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "CANCELLED" } : r));
    } catch {
      alert("취소 중 오류가 발생했습니다.");
    }
  };

  // 회원정보 수정
  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setInfoMsg(""); setInfoError("");
    if (!info.name || !info.email) { setInfoError("이름, 이메일을 입력해주세요."); return; }
    if (!window.confirm("회원정보를 변경하시겠습니까?")) return;
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/mypage", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: info.name, email: info.email }),
      });
      if (!res.ok) throw new Error(await res.text());
      setInfoMsg("회원정보가 수정되었습니다.");
      const stored = JSON.parse(sessionStorage.getItem("user") || "{}");
      const updated = { ...stored, name: info.name, email: info.email };
      sessionStorage.setItem("user", JSON.stringify(updated));
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
      setPwError("비밀번호를 입력해주세요."); return;
    }
    if (pwForm.newPassword.length < 6) { setPwError("새 비밀번호는 최소 6자 이상이어야 합니다."); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError("새 비밀번호가 일치하지 않습니다."); return; }
    if (pwForm.currentPassword === pwForm.newPassword) { setPwError("현재 비밀번호와 새 비밀번호가 같습니다."); return; }
    if (!window.confirm("비밀번호를 변경하시겠습니까?")) return;
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
            minHeight: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            padding: "50px 20px"
          }}>
            <div style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: "16px",
              padding: "30px 40px",
              width: "50%",
              maxWidth: "500px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}>
              <h2 className="h3" style={{ textAlign: "center", marginBottom: "6px", color: "#1a1a2e" }}>마이페이지</h2>


              {/* 탭 */}
              <div style={{ display: "flex", marginBottom: "30px", borderBottom: "2px solid #eee" }}>
                {[["info", "회원정보 변경"], ["password", "비밀번호 변경"], ["reservation", "내 예약"]].map(([key, label]) => (
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

              {/* 내 예약 */}
              {tab === "reservation" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <p style={{ color: "#888", fontSize: "14px" }}>총 <strong>{reservations.length}</strong>건</p>
                    <button onClick={() => navigate("/reservation")}
                      style={{ padding: "8px 16px", background: "#e63946", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}>
                      + 예약 신청
                    </button>
                  </div>
                  {resLoading ? (
                    <p style={{ textAlign: "center", color: "#888", padding: "30px" }}>불러오는 중...</p>
                  ) : reservations.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#aaa", padding: "30px" }}>예약 내역이 없습니다.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {reservations.map(r => (
                        <div key={r.id} style={{ border: "1px solid #eee", borderRadius: "10px", padding: "16px", background: "#fafafa" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <span style={{ fontWeight: "700", fontSize: "16px", color: "#1a1a2e" }}>{r.department}</span>
                            <span style={{ ...STATUS_COLOR[r.status], padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                              {STATUS_LABEL[r.status]}
                            </span>
                          </div>
                          <p style={{ color: "#555", fontSize: "14px", marginBottom: "4px" }}>
                            📅 {r.reservationDate} {r.reservationTime}
                          </p>
                          {r.symptom && <p style={{ color: "#888", fontSize: "13px", marginBottom: "4px" }}>증상: {r.symptom}</p>}
                          {r.status === "PENDING" && (
                            <button onClick={() => handleCancelReservation(r.id)}
                              style={{ marginTop: "8px", padding: "6px 14px", background: "#fff", color: "#e63946", border: "1px solid #e63946", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>
                              예약 취소
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
