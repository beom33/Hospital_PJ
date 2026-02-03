import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideMenu from "../components/SideMenu";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await apiFetch(`/notices/${id}`);
        if (res.ok) {
          const data = await res.json();
          setNotice(data);
        } else {
          setNotice(null);
        }
      } catch (err) {
        console.error("공지사항 조회 실패:", err);
        setNotice(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        const res = await apiFetch(`/notices/${id}`, { method: "DELETE" });
        if (res.ok) {
          alert("삭제되었습니다.");
          navigate("/notice");
        } else {
          alert("삭제에 실패했습니다.");
        }
      } catch (err) {
        alert("삭제 중 오류가 발생했습니다.");
      }
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="page-container">
          <div className="page-content">
            <SideMenu />
            <main className="main-content">
              <p style={{ textAlign: "center", padding: "40px" }}>로딩 중...</p>
            </main>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
                  <span>작성일: {formatDate(notice.createdAt)}</span>
                  <span>조회수: {notice.viewCount}</span>
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
            </article>

            <div className="detail-buttons">
              <Link to="/notice" className="list-btn">목록</Link>
              {isAdmin && (
                <div className="edit-buttons">
                  <Link to={`/notice/edit/${notice.id}`} className="edit-btn">수정</Link>
                  <button onClick={handleDelete} className="delete-btn">삭제</button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
