import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header({ simplified = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 비급여 페이지용 간소화된 헤더
  if (simplified) {
    return (
      <header className="th-layout-header header-simplified">
        <div className="temhamain1-N1" id="XYmk1ALhP3">
          <div className="header-container container-full">
            <div className="header-left">
              <h1 className="header-title">
                <Link to="/">
                  <img src="/resources/images/medi_logo.png" alt="Medi-best" style={{ height: "90px", width: "auto" }} />
                </Link>
              </h1>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // 일반 헤더
  return (
    <>
      <header className="th-layout-header">
        <div className="temhamain1-N1" id="XYmk1ALhP3">
          <div className="header-container container-full">
            <div className="header-left">
              <h1 className="header-title">
                <Link to="/">
                  <img src="/resources/images/medi_logo.png" alt="Medi-best" style={{ height: "80px", width: "auto" }} />
                </Link>
              </h1>
              <nav className="header-gnb desktop-only">
                <ul className="header-gnblist">
                  <li className="header-gnbitem">
                    <Link className="p1 header-gnblink" to="/">
                      <span>진료 안내</span>
                    </Link>
                  </li>
                  <li className="header-gnbitem">
                    <Link className="p1 header-gnblink" to="/hospital">
                      <span>병원찾기</span>
                    </Link>
                  </li>
              
                  <li className="header-gnbitem">
                    <Link className="p1 header-gnblink" to="/notice">
                      <span>공지사항</span>
                    </Link>
                  </li>
                  <li className="header-gnbitem">
                    <Link className="p1 header-gnblink" to="/insurance">
                      <span>비급여확인</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="header-right">
              <div className="header-utils desktop-only">
                {isLoggedIn ? (
                  <ul style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <li className="p1" style={{ color: "#fff", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px" }}>
                                 
                <Link to="/profile">
                        {user.profileImage ? (
                          <img
                            src={`http://localhost:8080/uploads/${user.profileImage}`}
                            alt="프로필"
                            style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.5)", cursor: "pointer" }}
                          />
                        ) : (
                          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", cursor: "pointer" }}>
                            👤
                          </div>
                        )}
                        </Link>
                    
                      {user.nickname || user.name}님
                      {isAdmin && (
                        <Link to="/admin" style={{ textDecoration: "none" }}>
                          <span style={{
                            marginLeft: "6px",
                            background: "#e63946",
                            color: "#fff",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}>
                            관리자
                          </span>
                        </Link>
                      )}
                    </li>
                    <li className="button">
                      <Link to="/mypage" className="p1 btnset btnset-sm" style={{ background: "transparent", border: "rgba(255,255,255,0.5)", color: "#fff" }}>
                        마이페이지
                      </Link>
                    </li>
                    <li className="button">
                      <button
                        onClick={handleLogout}
                        className="p1 btnset btnset-primary btnset-sm"
                        style={{ cursor: "pointer" }}
                      >
                        로그아웃
                      </button>
                    </li>
                  </ul>
                ) : (
                  <ul style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <li className="button">
                      <Link to="/login" className="p1 btnset btnset-primary btnset-sm">
                        로그인
                      </Link>
                    </li>
                    <li className="button">
                      <Link to="/register" className="p1 btnset btnset-primary btnset-sm">
                        회원가입
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
              <button className="btn-momenu mobile-only" onClick={toggleMenu}>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 사이드 메뉴 */}
      <div className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`} onClick={toggleMenu}></div>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <button className="mobile-menu-close" onClick={toggleMenu}>
            <span>✕</span>
          </button>
        </div>
        <div className="mobile-menu-login">
          {isLoggedIn ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>
                {user.nickname || user.name}님
                {isAdmin && (
                  <span style={{
                    marginLeft: "6px",
                    background: "#e63946",
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    관리자
                  </span>
                )}
              </span>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                style={{
                  background: "#e63946",
                  color: "#fff",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>→ 로그인을 해주세요.</Link>
          )}
        </div>
        <ul className="mobile-menu-list">
          <li className="mobile-menu-item">
            <Link to="/" onClick={() => setMenuOpen(false)}>진료 안내</Link>
          </li>
          <li className="mobile-menu-item">
            <Link to="/hospital" onClick={() => setMenuOpen(false)}>병원찾기</Link>
          </li>
      
          <li className="mobile-menu-item">
            <Link to="/notice" onClick={() => setMenuOpen(false)}>공지사항</Link>
          </li>
          <li className="mobile-menu-item">
            <Link to="/insurance" onClick={() => setMenuOpen(false)}>비급여확인</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
