import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideMenu from "../components/SideMenu";

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 임시 데이터 (나중에 백엔드 연동)
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    // TODO: 백엔드 API 연동
    // 임시 데이터
    const dummyNotices = {
      1: {
        id: 1,
        title: "2026년 설 연휴 진료 안내",
        content: `안녕하세요. Medi-best 병원입니다.

2026년 설 연휴 진료 안내드립니다.

■ 설 연휴 기간: 2026년 1월 28일(수) ~ 1월 30일(금)

■ 진료 안내
- 1월 28일(수): 휴진
- 1월 29일(목, 설날): 휴진
- 1월 30일(금): 휴진
- 1월 31일(토): 정상 진료

응급 환자의 경우 응급실을 이용해 주시기 바랍니다.

감사합니다.`,
        author: "관리자",
        date: "2026-01-20",
        views: 156,
        attachments: [
          { name: "설연휴안내문.pdf", size: "245KB" },
        ],
      },
      2: {
        id: 2,
        title: "신규 의료장비 도입 안내",
        content: `안녕하세요. Medi-best 병원입니다.

저희 병원에서 최신 의료장비를 도입하였습니다.

■ 도입 장비
- 최신 MRI 장비
- 고해상도 CT 스캐너
- 디지털 X-ray 시스템

더 나은 의료 서비스를 제공하기 위해 노력하겠습니다.

감사합니다.`,
        author: "관리자",
        date: "2026-01-18",
        views: 89,
        attachments: [],
      },
    };

    setNotice(dummyNotices[id] || null);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      // TODO: 백엔드 API 연동
      alert("삭제되었습니다.");
      navigate("/notice");
    }
  };

  if (!notice) {
    return (
      <>
        <Header />
        <div className="page-container">
          <div className="page-content">
            <SideMenu />
            <main className="main-content">
              <p>해당 공지사항을 찾을 수 없습니다.</p>
              <Link to="/notice">목록으로 돌아가기</Link>
            </main>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">공지사항</h1>
          <div className="breadcrumb">
            <Link to="/">홈</Link> &gt; <Link to="/notice">공지사항</Link> &gt; <span>상세보기</span>
          </div>
        </div>

        <div className="page-content">
          <SideMenu />

          <main className="main-content">
            <div className="content-header">
              <h2>공지사항</h2>
            </div>

            <article className="notice-detail">
              <div className="notice-detail-header">
                <h3 className="notice-detail-title">{notice.title}</h3>
                <div className="notice-detail-info">
                  <span>작성자: {notice.author}</span>
                  <span>작성일: {notice.date}</span>
                  <span>조회수: {notice.views}</span>
                </div>
              </div>

              <div className="notice-detail-content">
                {notice.content.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>

              {notice.attachments && notice.attachments.length > 0 && (
                <div className="notice-detail-attachments">
                  <h4>첨부파일</h4>
                  <ul>
                    {notice.attachments.map((file, index) => (
                      <li key={index}>
                        <a href="#" download>
                          📎 {file.name} ({file.size})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            <div className="detail-buttons">
              <Link to="/notice" className="list-btn">목록</Link>
              <div className="edit-buttons">
                <Link to={`/notice/edit/${notice.id}`} className="edit-btn">수정</Link>
                <button onClick={handleDelete} className="delete-btn">삭제</button>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
