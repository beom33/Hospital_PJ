import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
    nickname: "",
    role: "USER",
  });
  const [verifyCode, setVerifyCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    // 이메일 변경 시 인증 초기화
    if (name === "email") {
      setCodeSent(false);
      setEmailVerified(false);
      setVerifyCode("");
      setEmailMsg("");
    }
  };

  // 인증 코드 발송
  const handleSendCode = async () => {
    setEmailMsg("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setEmailMsg("error:유효한 이메일 주소를 입력해주세요.");
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch("http://localhost:8080/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      if (!res.ok) throw new Error(await res.text());
      setCodeSent(true);
      setEmailMsg("success:인증 코드가 발송되었습니다. (5분 유효)");
    } catch (err) {
      setEmailMsg("error:" + (err.message || "코드 발송 중 오류가 발생했습니다."));
    } finally {
      setIsSending(false);
    }
  };

  // 코드 검증
  const handleVerifyCode = async () => {
    setEmailMsg("");
    if (!verifyCode || verifyCode.length !== 6) {
      setEmailMsg("error:6자리 인증 코드를 입력해주세요.");
      return;
    }
    setIsVerifying(true);
    try {
      const res = await fetch("http://localhost:8080/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: verifyCode }),
      });
      if (!res.ok) throw new Error(await res.text());
      setEmailVerified(true);
      setEmailMsg("success:이메일 인증이 완료되었습니다!");
    } catch (err) {
      setEmailMsg("error:" + (err.message || "인증 코드가 올바르지 않습니다."));
    } finally {
      setIsVerifying(false);
    }
  };

  // 최종 회원가입
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password || !formData.name || !formData.nickname || !formData.email) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    if (!emailVerified) {
      setError("이메일 인증을 완료해주세요.");
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
          email: formData.email,
          name: formData.name,
          nickname: formData.nickname,
          role: formData.role,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const emailMsgType = emailMsg.startsWith("success:") ? "success" : emailMsg.startsWith("error:") ? "error" : "";
  const emailMsgText = emailMsg.replace(/^(success:|error:)/, "");

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
              <p className="p1" style={{ textAlign: "center", marginBottom: "30px", color: "#666" }}>
                회원가입 후 다양한 서비스를 이용하세요
              </p>

              <form onSubmit={handleSubmit}>
                {/* 회원 유형 */}
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

                {/* 아이디 */}
                <div style={{ marginBottom: "16px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>아이디 *</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="아이디를 입력하세요" required disabled={isLoading} style={inputStyle} />
                </div>

                {/* 이름 */}
                <div style={{ marginBottom: "16px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>이름 *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="이름을 입력하세요" required disabled={isLoading} style={inputStyle} />
                </div>

                {/* 닉네임 */}
                <div style={{ marginBottom: "16px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>닉네임 *</label>
                  <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="닉네임을 입력하세요" required disabled={isLoading} style={inputStyle} />
                </div>

                {/* 이메일 + 인증 */}
                <div style={{ marginBottom: "16px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                    이메일 *
                    {emailVerified && (
                      <span style={{ marginLeft: "8px", color: "#2a9d8f", fontSize: "13px", fontWeight: "600" }}>✓ 인증 완료</span>
                    )}
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="이메일을 입력하세요"
                      required
                      disabled={isLoading || emailVerified}
                      style={{ ...inputStyle, flex: 1, background: emailVerified ? "#f0fff4" : "white" }}
                    />
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={isSending || emailVerified}
                      style={{
                        padding: "14px 16px",
                        background: emailVerified ? "#ccc" : "#e63946",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: emailVerified ? "default" : "pointer",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {isSending ? "발송중..." : codeSent ? "재발송" : "코드 발송"}
                    </button>
                  </div>

                  {/* 인증 코드 입력 */}
                  {codeSent && !emailVerified && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      <input
                        type="text"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="인증 코드 6자리"
                        maxLength={6}
                        style={{ ...inputStyle, flex: 1, textAlign: "center", letterSpacing: "6px", fontSize: "18px" }}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={isVerifying}
                        style={{
                          padding: "14px 16px",
                          background: "#1a1a2e",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {isVerifying ? "확인중..." : "인증 확인"}
                      </button>
                    </div>
                  )}

                  {/* 이메일 관련 메시지 */}
                  {emailMsgText && (
                    <p style={{ margin: "6px 0 0", fontSize: "13px", color: emailMsgType === "success" ? "#2a9d8f" : "#c33" }}>
                      {emailMsgText}
                    </p>
                  )}
                </div>

                {/* 비밀번호 */}
                <div style={{ marginBottom: "16px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>비밀번호 *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력하세요 (최소 6자)" required disabled={isLoading} style={inputStyle} />
                </div>

                {/* 비밀번호 확인 */}
                <div style={{ marginBottom: "20px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>비밀번호 확인 *</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="비밀번호를 다시 입력하세요" required disabled={isLoading} style={inputStyle} />
                </div>

                {error && (
                  <div style={{ padding: "12px", background: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", textAlign: "center" }}>
                    {error}
                  </div>
                )}

                {!emailVerified && (
                  <p style={{ textAlign: "center", fontSize: "13px", color: "#999", marginBottom: "10px" }}>
                    이메일 인증 완료 후 회원가입이 가능합니다
                  </p>
                )}

                <button
                  type="submit"
                  className="btnset btnset-primary"
                  disabled={isLoading || !emailVerified}
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: "16px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    cursor: (!emailVerified || isLoading) ? "not-allowed" : "pointer",
                    opacity: (!emailVerified || isLoading) ? 0.4 : 1,
                    background: !emailVerified ? "#999" : undefined
                  }}
                >
                  {isLoading ? "가입 중..." : "회원가입"}
                </button>
              </form>

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
