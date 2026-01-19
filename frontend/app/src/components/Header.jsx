import { Link } from "react-router-dom";

export default function Header() {
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
            <div className="header-gnb">
              <ul className="header-gnblist">
                <li className="header-gnbitem">
                  <Link className="p1 header-gnblink" to="/">
                    <span>병원 소개</span>
                  </Link>
                </li>
                <li className="header-gnbitem">
                  <Link className="p1 header-gnblink" to="/">
                    <span>진료 안내</span>
                  </Link>
                </li>
                <li className="header-gnbitem">
                  <Link className="p1 header-gnblink" to="/">
                    <span>건강검진</span>
                  </Link>
                </li>
                <li className="header-gnbitem">
                  <Link className="p1 header-gnblink" to="/">
                    <span>예약하기</span>
                  </Link>
                </li>
                <li className="header-gnbitem">
                  <Link className="p1 header-gnblink" to="/">
                    <span>공지사항</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="header-right">
            <div className="header-utils">
              <ul>
                <li className="button">
                  <Link to="/login" className="p1 btnset btnset-primary btnset-sm">
                    로그인
                  </Link>
                </li>
              </ul>
            </div>
            <button className="btn-momenu">
              <i className="ico-hamburger"></i>
              <i className="ico-hamburger"></i>
              <i className="ico-hamburger"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
