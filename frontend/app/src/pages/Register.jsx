import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Register() {
  const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 코드 인증, 3: 나머지 정보
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    transition: "border-color 0.3s",
    boxSizing: "border-box"
  };

  // 1단계: 인증 코드 발송
  const handleSendCode = async () => {
    setError("");
    setSuccessMsg("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      setSuccessMsg("인증 코드가 발송되었습니다. 이메일을 확인해주세요. (5분 유효)");
      setStep(2);
    } catch (err) {
      setError(err.message || "코드 발송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2단계: 코드 검증
  const handleVerifyCode = async () => {
    setError("");
    setSuccessMsg("");
    if (!verifyCode || verifyCode.length !== 6) {
      setError("6자리 인증 코드를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verifyCode }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      setEmailVerified(true);
      setSuccessMsg("이메일 인증이 완료되었습니다!");
      setStep(3);
    } catch (err) {
      setError(err.message || "인증 코드 확인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // 3단계: 최종 회원가입
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password || !formData.name) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email,
          name: formData.name,
          role: formData.role,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
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
              maxWidth: "500px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
            }}>
              <h2 className="h3" style={{ textAlign: "center", marginBottom: "10px", color: "#1a1a2e" }}>
                회원가입
              </h2>

              {/* 단계 표시 */}
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "30px" }}>
                {[1, 2, 3].map((s) => (
                  <div key={s} style={{
                    width: "32px", height: "32px",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", fontWeight: "700",
                    background: step >= s ? "#e63946" : "#ddd",
                    color: step >= s ? "#fff" : "#999"
                  }}>{s}</div>
                ))}
              </div>

              {/* 에러 / 성공 메시지 */}
              {error && (
                <div style={{ padding: "12px", background: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>
                  {error}
                </div>
              )}
              {successMsg && (
                <div style={{ padding: "12px", background: "#efe", color: "#363", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>
                  {successMsg}
                </div>
              )}

              {/* 1단계: 이메일 입력 */}
              {step === 1 && (
                <div>
                  <p className="p1" style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
                    이메일 주소를 입력하고 인증 코드를 발송하세요
                  </p>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                      이메일 *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="이메일을 입력하세요"
                      disabled={isLoading}
                      style={inputStyle}
                    />
                  </div>
                  <button
                    type="button"
                    className="btnset btnset-primary"
                    onClick={handleSendCode}
                    disabled={isLoading}
                    style={{ width: "100%", padding: "16px", fontSize: "16px", fontWeight: "600", borderRadius: "8px", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
                  >
                    {isLoading ? "발송 중..." : "인증 코드 발송"}
                  </button>
                </div>
              )}

              {/* 2단계: 코드 입력 */}
              {step === 2 && (
                <div>
                  <p className="p1" style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
                    <strong>{email}</strong>으로 발송된 6자리 코드를 입력하세요
                  </p>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                      인증 코드 *
                    </label>
                    <input
                      type="text"
                      value={verifyCode}
                      onChange={(e) => { setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                      placeholder="6자리 코드 입력"
                      maxLength={6}
                      disabled={isLoading}
                      style={{ ...inputStyle, textAlign: "center", fontSize: "22px", letterSpacing: "8px" }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btnset btnset-primary"
                    onClick={handleVerifyCode}
                    disabled={isLoading}
                    style={{ width: "100%", padding: "16px", fontSize: "16px", fontWeight: "600", borderRadius: "8px", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1, marginBottom: "12px" }}
                  >
                    {isLoading ? "확인 중..." : "인증 확인"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(""); setSuccessMsg(""); setVerifyCode(""); }}
                    style={{ width: "100%", padding: "12px", fontSize: "14px", background: "none", border: "1px solid #ddd", borderRadius: "8px", cursor: "pointer", color: "#666" }}
                  >
                    이메일 다시 입력
                  </button>
                </div>
              )}

              {/* 3단계: 나머지 정보 */}
              {step === 3 && (
                <form onSubmit={handleSubmit}>
                  <p className="p1" style={{ textAlign: "center", marginBottom: "20px", color: "#2a9d8f", fontWeight: "600" }}>
                    ✓ 이메일 인증 완료 ({email})
                  </p>

                  <div style={{ marginBottom: "16px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                      회원 유형 *
                    </label>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "15px", color: "#333" }}>
                        <input type="radio" name="role" value="USER" checked={formData.role === "USER"} onChange={handleChange} style={{ width: "18px", height: "18px", accentColor: "#e63946" }} />
                        일반회원
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "15px", color: "#333" }}>
                        <input type="radio" name="role" value="ADMIN" checked={formData.role === "ADMIN"} onChange={handleChange} style={{ width: "18px", height: "18px", accentColor: "#e63946" }} />
                        관리자
                      </label>
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>아이디 *</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="아이디를 입력하세요" required disabled={isLoading} style={inputStyle} />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>이름 *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="이름을 입력하세요" required disabled={isLoading} style={inputStyle} />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>비밀번호 *</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력하세요 (최소 6자)" required disabled={isLoading} style={inputStyle} />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>비밀번호 확인 *</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="비밀번호를 다시 입력하세요" required disabled={isLoading} style={inputStyle} />
                  </div>

                  <button
                    type="submit"
                    className="btnset btnset-primary"
                    disabled={isLoading}
                    style={{ width: "100%", padding: "16px", fontSize: "16px", fontWeight: "600", borderRadius: "8px", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
                  >
                    {isLoading ? "가입 중..." : "회원가입 완료"}
                  </button>
                </form>
              )}

              <div style={{ marginTop: "24px", textAlign: "center", paddingTop: "20px", borderTop: "1px solid #eee" }}>
                <p className="p2" style={{ color: "#666" }}>
                  이미 계정이 있으신가요?{" "}
                  <Link to="/login" style={{ color: "#e63946", fontWeight: "600", textDecoration: "none" }}>
                    로그인
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
