import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideMenu from "../components/SideMenu";

export default function Notice() {
  // 임시 데이터 (나중에 백엔드 연동)
  const [notices] = useState([
    { id: 1, title: "2026년 설 연휴 진료 안내", author: "관리자", date: "2026-01-20", views: 156 },
    { id: 2, title: "신규 의료장비 도입 안내", author: "관리자", date: "2026-01-18", views: 89 },
    { id: 3, title: "건강검진 예약 시스템 업데이트", author: "관리자", date: "2026-01-15", views: 234 },
    { id: 4, title: "주차장 이용 안내", author: "관리자", date: "2026-01-10", views: 312 },
    { id: 5, title: "진료시간 변경 안내", author: "관리자", date: "2026-01-05", views: 445 },
  ]);

  const [searchType, setSearchType] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">공지사항</h1>
          <div className="breadcrumb">
            <Link to="/">홈</Link> &gt; <span>공지사항</span>
          </div>
        </div>

        <div className="page-content">
          <SideMenu />

          <main className="main-content">
            <div className="content-header">
              <h2>공지사항</h2>
            </div>

            {/* 검색 영역 */}
            <div className="search-area">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="search-select"
              >
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="all">전체</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="search-input"
              />
              <button className="search-btn">검색</button>
            </div>

            {/* 목록 정보 */}
            <div className="list-info">
              <span>전체: <strong>{notices.length}</strong>건</span>
              <Link to="/notice/write" className="write-btn">글쓰기</Link>
            </div>

            {/* 공지사항 테이블 */}
            <table className="notice-table">
              <thead>
                <tr>
                  <th className="col-no">번호</th>
                  <th className="col-title">제목</th>
                  <th className="col-author">작성자</th>
                  <th className="col-date">작성일</th>
                  <th className="col-views">조회수</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice, index) => (
                  <tr key={notice.id}>
                    <td className="col-no">{notices.length - index}</td>
                    <td className="col-title">
                      <Link to={`/notice/${notice.id}`}>{notice.title}</Link>
                    </td>
                    <td className="col-author">{notice.author}</td>
                    <td className="col-date">{notice.date}</td>
                    <td className="col-views">{notice.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="pagination">
              <button className="page-btn">&laquo;</button>
              <button className="page-btn">&lt;</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">&gt;</button>
              <button className="page-btn">&raquo;</button>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
