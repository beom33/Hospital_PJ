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
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.name || !formData.email) {
      setError("모든 필드를 입력해주세요.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          name: formData.name,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "회원가입에 실패했습니다.");
      }

      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    transition: "border-color 0.3s",
    boxSizing: "border-box"
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
              <p className="p1" style={{ textAlign: "center", marginBottom: "30px", color: "#666" }}>
                회원가입 후 다양한 서비스를 이용하세요
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                    아이디 *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="아이디를 입력하세요"
                    required
                    disabled={isLoading}
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                    이름 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="이름을 입력하세요"
                    required
                    disabled={isLoading}
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                    이메일 *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="이메일을 입력하세요"
                    required
                    disabled={isLoading}
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                    비밀번호 *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력하세요 (최소 6자)"
                    required
                    disabled={isLoading}
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                    비밀번호 확인 *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                    disabled={isLoading}
                    style={inputStyle}
                  />
                </div>

                {error && (
                  <div style={{
                    padding: "12px",
                    background: "#fee",
                    color: "#c33",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "14px",
                    textAlign: "center"
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btnset btnset-primary"
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: "16px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? "가입 중..." : "회원가입"}
                </button>
              </form>

              <div style={{
                marginTop: "24px",
                textAlign: "center",
                paddingTop: "20px",
                borderTop: "1px solid #eee"
              }}>
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
