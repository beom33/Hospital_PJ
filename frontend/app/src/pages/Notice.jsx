import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideMenu from "../components/SideMenu";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

export default function Notice() {
  const { isAdmin } = useAuth();
  const [notices, setNotices] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchType, setSearchType] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNotices = async (page = 0) => {
    setLoading(true);
    try {
      let url = `/notices?page=${page}&size=10&searchType=${searchType}`;
      if (searchKeyword.trim()) {
        url += `&keyword=${encodeURIComponent(searchKeyword)}`;
      }
      const res = await apiFetch(url);
      if (res.ok) {
        const data = await res.json();
        setNotices(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
        setCurrentPage(data.number);
      }
    } catch (err) {
      console.error("공지사항 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSearch = () => {
    fetchNotices(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      fetchNotices(page);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, startPage + 4);

    return (
      <div className="pagination">
        <button className="page-btn" onClick={() => handlePageChange(0)} disabled={currentPage === 0}>
          &laquo;
        </button>
        <button className="page-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
          &lt;
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <button
            key={page}
            className={`page-btn ${page === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page + 1}
          </button>
        ))}
        <button className="page-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>
          &gt;
        </button>
        <button className="page-btn" onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage >= totalPages - 1}>
          &raquo;
        </button>
      </div>
    );
  };

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
                onKeyDown={handleKeyDown}
                className="search-input"
              />
              <button className="search-btn" onClick={handleSearch}>검색</button>
            </div>

            {/* 목록 정보 */}
            <div className="list-info">
              <span>전체: <strong>{totalElements}</strong>건</span>
              {isAdmin && (
                <Link to="/notice/write" className="write-btn">글쓰기</Link>
              )}
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
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                      로딩 중...
                    </td>
                  </tr>
                ) : notices.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                      등록된 공지사항이 없습니다.
                    </td>
                  </tr>
                ) : (
                  notices.map((notice, index) => (
                    <tr key={notice.id}>
                      <td className="col-no">{totalElements - (currentPage * 10) - index}</td>
                      <td className="col-title">
                        <Link to={`/notice/${notice.id}`}>{notice.title}</Link>
                      </td>
                      <td className="col-author">{notice.author}</td>
                      <td className="col-date">{formatDate(notice.createdAt)}</td>
                      <td className="col-views">{notice.viewCount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            {renderPagination()}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
