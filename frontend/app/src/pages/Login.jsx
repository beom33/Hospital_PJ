import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "로그인에 실패했습니다.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message || "로그인 중 오류가 발생했습니다.");
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
                로그인
              </h2>
              <p className="p1" style={{ textAlign: "center", marginBottom: "30px", color: "#666" }}>
                서비스 이용을 위해 로그인해주세요
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                    아이디
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="아이디를 입력하세요"
                    required
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "15px",
                      transition: "border-color 0.3s",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>
                    비밀번호
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력하세요"
                    required
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "15px",
                      transition: "border-color 0.3s",
                      boxSizing: "border-box"
                    }}
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
                  {isLoading ? "로그인 중..." : "로그인"}
                </button>
              </form>

              <div style={{
                marginTop: "24px",
                textAlign: "center",
                paddingTop: "20px",
                borderTop: "1px solid #eee"
              }}>
                <p className="p2" style={{ color: "#666" }}>
                  아직 회원이 아니신가요?{" "}
                  <Link to="/register" style={{ color: "#e63946", fontWeight: "600", textDecoration: "none" }}>
                    회원가입
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
