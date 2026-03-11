import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("새 비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError("현재 비밀번호와 새 비밀번호가 같습니다.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("비밀번호가 성공적으로 변경되었습니다.");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message || "비밀번호 변경 중 오류가 발생했습니다.");
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
              <h2 className="h3" style={{ textAlign: "center", marginBottom: "10px", color: "#1a1a2e" }}>
                비밀번호 변경
              </h2>
              {user && (
                <p className="p1" style={{ textAlign: "center", marginBottom: "30px", color: "#666" }}>
                  {user.name}님의 비밀번호를 변경합니다
                </p>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                    현재 비밀번호 *
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="현재 비밀번호를 입력하세요"
                    disabled={isLoading}
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                    새 비밀번호 *
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="새 비밀번호를 입력하세요 (최소 6자)"
                    disabled={isLoading}
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                    새 비밀번호 확인 *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    disabled={isLoading}
                    style={inputStyle}
                  />
                </div>

                {error && (
                  <div style={{ padding: "12px", background: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>
                    {error}
                  </div>
                )}
                {success && (
                  <div style={{ padding: "12px", background: "#efe", color: "#363", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  className="btnset btnset-primary"
                  disabled={isLoading}
                  style={{ width: "100%", padding: "16px", fontSize: "16px", fontWeight: "600", borderRadius: "8px", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? "변경 중..." : "비밀번호 변경"}
                </button>
              </form>

              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  style={{ background: "none", border: "none", color: "#888", fontSize: "13px", cursor: "pointer" }}
                >
                  뒤로 가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
