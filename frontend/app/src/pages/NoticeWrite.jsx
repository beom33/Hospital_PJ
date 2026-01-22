import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideMenu from "../components/SideMenu";

export default function NoticeWrite() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);

    // 이미지 미리보기 생성
    selectedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages((prev) => [...prev, { name: file.name, url: reader.result }]);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImages((prev) => [...prev, { name: file.name, url: null }]);
      }
    });
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    // TODO: 백엔드 API 연동
    console.log("등록할 데이터:", formData, files);
    alert("공지사항이 등록되었습니다.");
    navigate("/notice");
  };

  const handleCancel = () => {
    if (formData.title || formData.content || files.length > 0) {
      if (window.confirm("작성 중인 내용이 있습니다. 취소하시겠습니까?")) {
        navigate("/notice");
      }
    } else {
      navigate("/notice");
    }
  };

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">공지사항</h1>
          <div className="breadcrumb">
            <Link to="/">홈</Link> &gt; <Link to="/notice">공지사항</Link> &gt; <span>글쓰기</span>
          </div>
        </div>

        <div className="page-content">
          <SideMenu />

          <main className="main-content">
            <div className="content-header">
              <h2>글쓰기</h2>
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
                />
              </div>

              <div className="form-group">
                <label>첨부파일</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.hwp"
                    className="file-input"
                  />
                  <label htmlFor="file-upload" className="file-upload-btn">
                    파일 선택
                  </label>
                  <span className="file-info">이미지, PDF, 문서 파일을 첨부할 수 있습니다.</span>
                </div>

                {/* 첨부파일 목록 */}
                {files.length > 0 && (
                  <div className="file-list">
                    {previewImages.map((file, index) => (
                      <div key={index} className="file-item">
                        {file.url ? (
                          <img src={file.url} alt={file.name} className="file-preview" />
                        ) : (
                          <div className="file-icon">📄</div>
                        )}
                        <span className="file-name">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="file-remove-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-buttons">
                <button type="button" onClick={handleCancel} className="cancel-btn">
                  취소
                </button>
                <button type="submit" className="submit-btn">
                  등록
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
