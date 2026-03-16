import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideMenu from "../components/SideMenu";
import { apiFetch } from "../utils/api";

export default function NoticeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [currentImagePath, setCurrentImagePath] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await apiFetch(`/notices/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({ title: data.title, content: data.content });
          setCurrentImagePath(data.imagePath || null);
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("이미지 파일만 업로드 가능합니다."); return; }
    if (file.size > 5 * 1024 * 1024) { alert("파일 크기는 5MB 이하여야 합니다."); return; }
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveNewImage = () => {
    setNewImageFile(null);
    setNewImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { alert("제목을 입력해주세요."); return; }
    if (!formData.content.trim()) { alert("내용을 입력해주세요."); return; }
    setIsLoading(true);
    try {
      const res = await apiFetch(`/notices/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      if (!res.ok) { alert(await res.text() || "수정에 실패했습니다."); return; }

      if (newImageFile) {
        const fd = new FormData();
        fd.append("file", newImageFile);
        const token = sessionStorage.getItem("token");
        await fetch(`http://localhost:8080/api/notices/${id}/image`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: fd,
        });
      }

      alert("수정되었습니다.");
      navigate(`/notice/${id}`);
    } catch {
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

              {/* 이미지 첨부 */}
              <div className="form-group">
                <label>이미지 <span style={{ fontSize: "12px", color: "#888", fontWeight: "normal" }}>(선택, 최대 5MB)</span></label>

                {/* 기존 이미지 표시 */}
                {currentImagePath && !newImagePreview && (
                  <div style={{ marginTop: "8px" }}>
                    <p style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>현재 이미지</p>
                    <img src={`http://localhost:8080/uploads/${currentImagePath}`} alt="현재 이미지"
                      style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", border: "1px solid #ddd", display: "block" }} />
                    <button type="button" onClick={() => fileInputRef.current.click()}
                      style={{ marginTop: "8px", padding: "6px 14px", background: "#555", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>
                      이미지 변경
                    </button>
                  </div>
                )}

                {/* 새 이미지 미리보기 */}
                {newImagePreview && (
                  <div style={{ marginTop: "8px" }}>
                    <p style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>새 이미지 (저장 시 적용)</p>
                    <img src={newImagePreview} alt="미리보기"
                      style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", border: "1px solid #ddd", display: "block" }} />
                    <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                      <button type="button" onClick={() => fileInputRef.current.click()}
                        style={{ padding: "6px 14px", background: "#555", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>
                        이미지 변경
                      </button>
                      <button type="button" onClick={handleRemoveNewImage}
                        style={{ padding: "6px 14px", background: "#e63946", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>
                        취소
                      </button>
                    </div>
                  </div>
                )}

                {/* 이미지 없을 때 */}
                {!currentImagePath && !newImagePreview && (
                  <button type="button" onClick={() => fileInputRef.current.click()}
                    style={{ marginTop: "8px", padding: "10px 20px", background: "#f5f5f5", border: "1px dashed #ccc", borderRadius: "8px", fontSize: "14px", cursor: "pointer", color: "#666" }}>
                    + 이미지 선택
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
              </div>

              <div className="form-buttons">
                <button type="button" onClick={handleCancel} className="cancel-btn" disabled={isLoading}>취소</button>
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
