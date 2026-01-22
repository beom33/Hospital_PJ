import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="th-layout-main">
        <div className="th-layout-content">
          {/* 비주얼 슬라이더 섹션 */}
          <div className="temhamain1-N3" id="QPMk1AlhV7">
            <div className="contents-container container-md fullscreen">
              <div className="contents-inner">
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  spaceBetween={0}
                  slidesPerView={1}
                  autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                  }}
                  speed={1000}
                  pagination={{
                    clickable: true,
                    el: ".visual-pagination",
                  }}
                  loop={true}
                  allowTouchMove={false}
                  simulateTouch={false}
                  className="visual-slider"
                >
                  <SwiperSlide>
                    <div className="visual-image">
                      <picture>
                        <source srcSet="/resources/images/medical3.jpg" media="(max-width: 992px)" />
                        <img src="/resources/images/medical3.jpg" alt="비주얼 이미지1" />
                      </picture>
                    </div>
                    <div className="visual-body">
                      <div className="textset">
                        <p className="h5 textset-text">MEDICAL CARE 2026</p>
                        <h2 className="h1 textset-tit">건강한 내일을 위한<br />의료 서비스</h2>
                        <p className="h5 textset-desc">최첨단 의료 기술과 전문 의료진이 함께합니다.</p>
                      </div>
                      <Link className="p1 btnset btnset-lg btnset-light" to="/login">로그인하기</Link>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="visual-image">
                      <picture>
                        <source srcSet="/resources/images/medical1.jpg" media="(max-width: 992px)" />
                        <img src="/resources/images/medical1.jpg" alt="비주얼 이미지2" />
                      </picture>
                    </div>
                    <div className="visual-body">
                      <div className="textset">
                        <p className="h5 textset-text">HEALTH CHECK 2026</p>
                        <h2 className="h1 textset-tit">체계적인 건강검진<br />프로그램</h2>
                        <p className="h5 textset-desc">정밀한 검진으로 건강을 미리 확인하세요.</p>
                      </div>
                      <Link className="p1 btnset btnset-lg btnset-light" to="/register">회원가입</Link>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="visual-image">
                      <picture>
                        <source srcSet="/resources/images/medical2.jpg" media="(max-width: 992px)" />
                        <img src="/resources/images/medical2.jpg" alt="비주얼 이미지3" />
                      </picture>
                    </div>
                    <div className="visual-body">
                      <div className="textset">
                        <p className="h5 textset-text">EXPERT CONSULTATION</p>
                        <h2 className="h1 textset-tit">전문의 1:1 상담<br />서비스</h2>
                        <p className="h5 textset-desc">각 분야 전문의와 직접 상담하세요.</p>
                      </div>
                      <Link className="p1 btnset btnset-lg btnset-light" to="/login">상담 예약</Link>
                    </div>
                  </SwiperSlide>
                </Swiper>
                <div className="visual-pagination"></div>
              </div>
            </div>
          </div>

          {/* 서비스 소개 섹션 */}
          <div className="temhamain1-N4" id="uNmk1AlI1M">
            <div className="contents-container container-md">
              <div className="contents-inner">
                <h2 className="h2 contents-tit">전문 의료 서비스</h2>
                <ul className="cardset-list">
                  <li className="cardset-item">
                    <figure className="cardset-figure">
                      <img src="/resources/icons/ico_N4_01.svg" alt="진료 예약" />
                    </figure>
                    <div className="cardset-body">
                      <strong className="h4 cardset-tit">진료 예약</strong>
                      <p className="p1 cardset-desc">
                        간편하게 온라인으로
                        <br />
                        진료 예약을 할 수 있습니다.
                      </p>
                    </div>
                  </li>
                  <li className="cardset-item">
                    <figure className="cardset-figure">
                      <img src="/resources/icons/ico_N4_02.svg" alt="건강검진" />
                    </figure>
                    <div className="cardset-body">
                      <strong className="h4 cardset-tit">건강검진</strong>
                      <p className="p1 cardset-desc">
                        체계적인 건강검진으로
                        <br />
                        건강을 관리하세요.
                      </p>
                    </div>
                  </li>
                  <li className="cardset-item">
                    <figure className="cardset-figure">
                      <img src="/resources/icons/ico_N4_03.svg" alt="전문 상담" />
                    </figure>
                    <div className="cardset-body">
                      <strong className="h4 cardset-tit">전문 상담</strong>
                      <p className="p1 cardset-desc">
                        전문 의료진과 1:1
                        <br />
                        상담을 받아보세요.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 배너 섹션 */}
          <div className="temhamain1-N5" id="KFMK1alI9N">
            <div className="contents-container container-md">
              <div className="contents-inner">
                <div className="imageset">
                  <picture>
                    <source srcSet="/resources/images/medical4.jpg" media="(max-width: 992px)" />
                    <img className="imageset-img" src="/resources/images/medical4.jpg" alt="배너 이미지" />
                  </picture>
                </div>
                <div className="textset">
                  <h3 className="h3 textset-tit">
                    최고의 의료진과 함께
                    <br />
                    건강한 삶을 시작하세요.
                  </h3>
                  <Link className="p1 btnset btnset-lg btnset-primary btnset-icon ff-ico ico-right ico-27" to="/register">
                    회원가입 하기
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 프로그램 소개 섹션 */}
          <div className="temhamain1-N6" id="NXmk1aLid1">
            <div className="contents-container container-md">
              <div className="contents-inner">
                <div className="contents-left">
                  <h2 className="h2 contents-tit">프로그램 소개</h2>
                  <div className="textset-group">
                    <div className="textset">
                      <p className="h4 textset-subtit">맞춤형 건강검진 프로그램</p>
                      <p className="p1 textset-desc">
                        개인별 맞춤형 건강검진 프로그램으로 체계적인 건강관리를 제공합니다.
                        최신 의료장비와 전문 의료진이 정밀한 검진을 진행합니다.
                      </p>
                    </div>
                    <Link className="p1 btnset btnset-md btnset-primary" to="/register">자세히보기</Link>
                  </div>
                </div>
                <div className="contents-right">
                  <h2 className="h2 contents-tit">진료 안내</h2>
                  <Swiper
                    modules={[Autoplay, Navigation]}
                    spaceBetween={20}
                    slidesPerView={3}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                    }}
                    speed={800}
                    loop={true}
                    breakpoints={{
                      320: { slidesPerView: 1 },
                      768: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 },
                    }}
                    allowTouchMove={false}
                    simulateTouch={false}
                    className="contents-slide"
                  >
                    <SwiperSlide>
                      <img className="slide-img" src="/resources/images/medical5.jpg" alt="이미지" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img className="slide-img" src="/resources/images/medical6.jpg" alt="이미지" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img className="slide-img" src="/resources/images/medical7.jpg" alt="이미지" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img className="slide-img" src="/resources/images/medical8.jpg" alt="이미지" />
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
          </div>

          {/* 공지사항 섹션 */}
          <div className="temhamain1-N7" id="YlMk1aliiu">
            <div className="contents-container container-md">
              <div className="contents-inner">
                <div className="contents-top">
                  <h2 className="h2 contents-tit">공지사항</h2>
                  <a className="p1 contents-link" href="#">VIEW MORE</a>
                </div>
                <div className="cardset-wrap">
                  <a className="cardset" href="#">
                    <figure className="cardset-figure">
                      <img src="/resources/images/img_N7_01.png" alt="카드 이미지" />
                    </figure>
                    <div className="cardset-body">
                      <h5 className="h5 cardset-tit">온라인 진료 예약 서비스 오픈</h5>
                      <p className="p1 cardset-desc">편리한 온라인 진료 예약 서비스를 시작합니다.</p>
                      <span className="p2 cardset-date">2024.01.14</span>
                    </div>
                  </a>
                  <a className="cardset" href="#">
                    <figure className="cardset-figure">
                      <img className="cardset-img" src="/resources/images/img_N7_02.png" alt="카드 이미지" />
                    </figure>
                    <div className="cardset-body">
                      <h5 className="h5 cardset-tit">건강검진 패키지 안내</h5>
                      <p className="p1 cardset-desc">다양한 건강검진 패키지를 확인해보세요.</p>
                      <span className="p2 cardset-date">2024.01.10</span>
                    </div>
                  </a>
                  <a className="cardset" href="#">
                    <figure className="cardset-figure">
                      <img className="cardset-img" src="/resources/images/img_N7_03.png" alt="카드 이미지" />
                    </figure>
                    <div className="cardset-body">
                      <h5 className="h5 cardset-tit">진료 시간 변경 안내</h5>
                      <p className="p1 cardset-desc">진료 시간이 변경되었습니다. 확인해주세요.</p>
                      <span className="p2 cardset-date">2024.01.05</span>
                    </div>
                  </a>
                  <a className="cardset" href="#">
                    <figure className="cardset-figure">
                      <img className="cardset-img" src="/resources/images/img_N7_04.png" alt="카드 이미지" />
                    </figure>
                    <div className="cardset-body">
                      <h5 className="h5 cardset-tit">신규 전문의 영입 안내</h5>
                      <p className="p1 cardset-desc">새로운 전문의가 합류했습니다.</p>
                      <span className="p2 cardset-date">2024.01.02</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
