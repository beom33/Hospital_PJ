import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header({ simplified = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // 비급여 페이지용 간소화된 헤더
  if (simplified) {
    return (
      <header className="th-layout-header">
        <div className="temhamain1-N1" id="XYmk1ALhP3">
          <div className="header-container container-full">
            <div className="header-left">
              <h1 className="header-title">
                <Link to="/">
                  <img src="/resources/images/medi_logo.png" alt="Medi-best" style={{ height: "80px", width: "auto" }} />
                </Link>
              </h1>
              <nav className="header-gnb">
                <ul className="header-gnblist">
                  <li className="header-gnbitem">
                
                  </li>
                </ul>
              </nav>
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
                    <Link className="p1 header-gnblink" to="/">
                      <span>병원찾기</span>
                    </Link>
                  </li>
                  <li className="header-gnbitem">
                    <Link className="p1 header-gnblink" to="/">
                      <span>예약하기</span>
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
          <Link to="/login" onClick={() => setMenuOpen(false)}>→ 로그인을 해주세요.</Link>
        </div>
        <ul className="mobile-menu-list">
          <li className="mobile-menu-item">
            <Link to="/" onClick={() => setMenuOpen(false)}>진료 안내</Link>
          </li>
          <li className="mobile-menu-item">
            <Link to="/" onClick={() => setMenuOpen(false)}>병원찾기</Link>
          </li>
          <li className="mobile-menu-item">
            <Link to="/" onClick={() => setMenuOpen(false)}>예약하기</Link>
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
