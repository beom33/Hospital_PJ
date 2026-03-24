import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const DEPARTMENTS = [
  "내과", "외과", "정형외과", "신경과", "피부과",
  "안과", "이비인후과", "산부인과", "소아과", "정신건강의학과",
  "치과", "비뇨기과", "흉부외과", "응급의학과", "재활의학과",
];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00",
];

export default function ReservationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    department: "",
    reservationDate: "",
    reservationTime: "",
    symptom: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.department) { setError("진료과를 선택해주세요."); return; }
    if (!form.reservationDate) { setError("날짜를 선택해주세요."); return; }
    if (!form.reservationTime) { setError("시간을 선택해주세요."); return; }
    if (!window.confirm("예약을 신청하시겠습니까?")) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess(true);
    } catch (err) {
      setError(err.message || "예약 신청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { display: "block", marginBottom: "8px", color: "#333", fontWeight: "600", fontSize: "14px" };
  const selectStyle = {
    width: "100%", padding: "12px 14px", border: "1px solid #ddd",
    borderRadius: "8px", fontSize: "15px", boxSizing: "border-box",
    background: "#fff", cursor: "pointer",
  };
  const inputStyle = { ...selectStyle, cursor: "text" };

  return (
    <>
      <Header />
      <main className="th-layout-main">
        <div className="th-layout-content">
          <div style={{
            minHeight: "70vh", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            padding: "50px 20px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              background: "rgba(255,255,255,0.97)", borderRadius: "16px",
              padding: "40px", width: "100%", maxWidth: "520px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              {success ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: "60px", marginBottom: "16px" }}>✅</div>
                  <h2 style={{ color: "#1a1a2e", marginBottom: "12px" }}>예약이 신청되었습니다</h2>
                  <p style={{ color: "#666", marginBottom: "28px", fontSize: "15px" }}>
                    마이페이지에서 예약 현황을 확인하실 수 있습니다.
                  </p>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <button onClick={() => navigate("/mypage")}
                      className="btnset btnset-primary"
                      style={{ padding: "12px 24px", fontSize: "15px", borderRadius: "8px" }}>
                      내 예약 확인
                    </button>
                    <button onClick={() => { setSuccess(false); setForm({ department: "", reservationDate: "", reservationTime: "", symptom: "" }); }}
                      style={{ padding: "12px 24px", fontSize: "15px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>
                      추가 예약
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 style={{ color: "#1a1a2e", marginBottom: "6px", fontSize: "24px", fontWeight: "700" }}>진료 예약</h2>
                  <p style={{ color: "#888", marginBottom: "28px", fontSize: "14px" }}>
                    원하시는 진료과와 일정을 선택해주세요.
                  </p>

                  <form onSubmit={handleSubmit}>
                    {/* 진료과 */}
                    <div style={{ marginBottom: "20px" }}>
                      <label style={labelStyle}>진료과 *</label>
                      <select value={form.department}
                        onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                        style={selectStyle}>
                        <option value="">진료과 선택</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    {/* 날짜 */}
                    <div style={{ marginBottom: "20px" }}>
                      <label style={labelStyle}>예약 날짜 *</label>
                      <input type="date" value={form.reservationDate} min={today}
                        onChange={e => setForm(p => ({ ...p, reservationDate: e.target.value }))}
                        style={inputStyle} />
                    </div>

                    {/* 시간 */}
                    <div style={{ marginBottom: "20px" }}>
                      <label style={labelStyle}>예약 시간 *</label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                        {TIME_SLOTS.map(t => (
                          <button key={t} type="button"
                            onClick={() => setForm(p => ({ ...p, reservationTime: t }))}
                            style={{
                              padding: "10px 4px", border: form.reservationTime === t ? "2px solid #e63946" : "1px solid #ddd",
                              borderRadius: "8px", fontSize: "13px", cursor: "pointer",
                              background: form.reservationTime === t ? "#fff0f0" : "#fff",
                              color: form.reservationTime === t ? "#e63946" : "#333",
                              fontWeight: form.reservationTime === t ? "600" : "400",
                            }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 증상 */}
                    <div style={{ marginBottom: "24px" }}>
                      <label style={labelStyle}>증상 (선택)</label>
                      <textarea value={form.symptom}
                        onChange={e => setForm(p => ({ ...p, symptom: e.target.value }))}
                        placeholder="주요 증상이나 진료 목적을 입력해주세요."
                        rows={3}
                        style={{ ...inputStyle, resize: "vertical", cursor: "text" }} />
                    </div>

                    {error && (
                      <div style={{ padding: "12px", background: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>
                        {error}
                      </div>
                    )}

                    <button type="submit" disabled={loading}
                      className="btnset btnset-primary"
                      style={{ width: "100%", padding: "16px", fontSize: "16px", fontWeight: "600", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                      {loading ? "예약 신청 중..." : "예약 신청"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
