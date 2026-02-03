import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideMenu from "../components/SideMenu";
import { apiFetch } from "../utils/api";

export default function NoticeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await apiFetch(`/notices/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title,
            content: data.content,
          });
        } else {
          alert("공지사항을 찾을 수 없습니다.");
          navigate("/notice");
        }
      } catch (err) {
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
        navigate("/notice");
      } finally {
        setLoadingData(false);
      }
    };
    fetchNotice();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiFetch(`/notices/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("공지사항이 수정되었습니다.");
        navigate(`/notice/${id}`);
      } else {
        const errorText = await res.text();
        alert(errorText || "수정에 실패했습니다.");
      }
    } catch (err) {
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("수정을 취소하시겠습니까?")) {
      navigate(`/notice/${id}`);
    }
  };

  if (loadingData) {
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

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">공지사항</h1>
          <div className="breadcrumb">
            <Link to="/">홈</Link> &gt; <Link to="/notice">공지사항</Link> &gt; <span>수정</span>
          </div>
        </div>

        <div className="page-content">
          <SideMenu />

          <main className="main-content">
            <div className="content-header">
              <h2>공지사항 수정</h2>
            </div>

            <form onSubmit={handleSubmit} className="write-form">
              <div className="form-group">
                <label htmlFor="title">제목 <span className="required">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="제목을 입력하세요"
                  className="form-input"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">내용 <span className="required">*</span></label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="내용을 입력하세요"
                  className="form-textarea"
                  rows="15"
                  disabled={isLoading}
                />
              </div>

              <div className="form-buttons">
                <button type="button" onClick={handleCancel} className="cancel-btn" disabled={isLoading}>
                  취소
                </button>
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? "수정 중..." : "수정"}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
