import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="th-layout-footer">
      <div className="temhamain1-N2" id="uBmk1AlIM1">
        <div className="footer-container container-md">
          <div className="footer-top">
            <ul className="footer-menulist">
              <li className="footer-menulink">
                <a href="#">
                  <span>이용약관</span>
                </a>
              </li>
              <li className="footer-menulink privacy">
                <a href="#">
                  <span>개인정보처리방침</span>
                </a>
              </li>
              <li className="footer-menulink">
                <a href="#">
                  <span>오시는 길</span>
                </a>
              </li>
            </ul>
            <ul className="footer-snslist">
              <li className="footer-snsitem">
                <a className="footer-snslink" href="#">
                  <img src="/resources/icons/ico_instagram_lightgrey.svg" alt="인스타그램" />
                </a>
              </li>
              <li className="footer-snsitem">
                <a className="footer-snslink" href="#">
                  <img src="/resources/icons/ico_youtube_lightgrey.svg" alt="유튜브" />
                </a>
              </li>
              <li className="footer-snsitem">
                <a className="footer-snslink" href="#">
                  <img src="/resources/icons/ico_facebook_lightgrey.svg" alt="페이스북" />
                </a>
              </li>
              <li className="footer-snsitem">
                <a className="footer-snslink" href="#">
                  <img src="/resources/icons/ico_kakao_lightgrey.svg" alt="카카오톡" />
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-bottom">
            <div className="footer-left">
              <h2 className="footer-logo">
                <Link to="/">
                  <img src="/resources/images/medi_logo.png" alt="Medi-best" style={{ height: "85px", width: "auto" }} />
                </Link>
              </h2>
              <div className="footer-txtgroup">
                <address className="footer-txt">
                  <p className="p2">서울시 강남구 테헤란로 123 의료빌딩 5층</p>
                  <p>
                    <span className="p2">T. 02-1234-5678</span>
                    <span className="p2">E. info@medical.co.kr</span>
                  </p>
                </address>
                <div className="footer-txt">
                  <p className="p2">2024 MEDICAL PORTFOLIO. ALL RIGHTS RESERVED</p>
                </div>
              </div>
            </div>
            <div className="footer-right">
              <div className="footer-txt">
                <p className="p2">고객센터</p>
                <a className="h4 footer-tel" href="tel:02-1234-5678">02-1234-5678</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
