import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const IMAGE_BASE = "http://localhost:8080/uploads/";
const CROP_SIZE = 220; // 크롭 원형 크기 (px)

export default function ProfilePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const fileInputRef = useRef(null);

  const [nickname, setNickname] = useState(user?.nickname || "");
  const [currentImage, setCurrentImage] = useState(
    user?.profileImage ? IMAGE_BASE + user.profileImage : null
  );

  // 크롭 관련 상태
  const [originalUrl, setOriginalUrl] = useState(null); // 선택한 원본 파일 blob URL
  const [selectedFile, setSelectedFile] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const cropContainerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetch("http://localhost:8080/api/mypage", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setNickname(data.nickname || "");
        if (data.profileImage) setCurrentImage(IMAGE_BASE + data.profileImage);
      })
      .catch(() => {});
  }, []);

  // 파일 선택 시 크롭 초기화
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("이미지 파일만 업로드 가능합니다."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("파일 크기는 5MB 이하여야 합니다."); return; }
    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setOriginalUrl(url);
    setPosition({ x: 0, y: 0 });
    setZoom(1);
    setError("");
    setMsg("");
  };

  // ─── 드래그 (마우스) ───
  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...position };
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    setPosition({
      x: posStart.current.x + (e.clientX - dragStart.current.x),
      y: posStart.current.y + (e.clientY - dragStart.current.y),
    });
  }, []);

  const handleMouseUp = () => { isDragging.current = false; };

  // ─── 드래그 (터치) ───
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    isDragging.current = true;
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    posStart.current = { ...position };
  };

  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];
    setPosition({
      x: posStart.current.x + (touch.clientX - dragStart.current.x),
      y: posStart.current.y + (touch.clientY - dragStart.current.y),
    });
  }, []);

  // ─── 마우스 휠 줌 ───
  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(prev => Math.min(3, Math.max(0.5, prev - e.deltaY * 0.001)));
  };

  // ─── Canvas로 크롭 이미지 생성 ───
  const getCroppedBlob = () => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const OUTPUT = 400;
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT;
      canvas.height = OUTPUT;
      const ctx = canvas.getContext("2d");

      // 원형 클립
      ctx.beginPath();
      ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2);
      ctx.clip();

      // 이미지가 크롭 영역을 덮도록 base scale 계산
      const baseScale = Math.max(CROP_SIZE / img.naturalWidth, CROP_SIZE / img.naturalHeight);
      const totalScale = baseScale * zoom;
      const dispX = CROP_SIZE / 2 - (img.naturalWidth * totalScale) / 2 + position.x;
      const dispY = CROP_SIZE / 2 - (img.naturalHeight * totalScale) / 2 + position.y;
      const outScale = OUTPUT / CROP_SIZE;

      ctx.drawImage(
        img,
        dispX * outScale,
        dispY * outScale,
        img.naturalWidth * totalScale * outScale,
        img.naturalHeight * totalScale * outScale
      );

      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("크롭 실패")), "image/jpeg", 0.92);
    };
    img.onerror = reject;
    img.src = originalUrl;
  });

  // ─── 저장 ───
  const handleSave = async () => {
    setMsg(""); setError("");
    if (!nickname.trim()) { setError("닉네임을 입력해주세요."); return; }
    if (!window.confirm("프로필을 저장하시겠습니까?")) return;
    setIsLoading(true);
    try {
      let newProfileImage = user?.profileImage || "";

      if (selectedFile) {
        const croppedBlob = await getCroppedBlob();
        const croppedFile = new File([croppedBlob], selectedFile.name, { type: "image/jpeg" });
        const formData = new FormData();
        formData.append("file", croppedFile);
        const imgRes = await fetch("http://localhost:8080/api/profile/image", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        });
        if (!imgRes.ok) throw new Error(await imgRes.text());
        const imgData = await imgRes.json();
        newProfileImage = imgData.filename;
        setCurrentImage(IMAGE_BASE + newProfileImage);
        setOriginalUrl(null);
        setSelectedFile(null);
      }

      const nickRes = await fetch("http://localhost:8080/api/profile/nickname", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ nickname }),
      });
      if (!nickRes.ok) throw new Error(await nickRes.text());

      const stored = JSON.parse(sessionStorage.getItem("user") || "{}");
      const updated = { ...stored, nickname, profileImage: newProfileImage };
      sessionStorage.setItem("user", JSON.stringify(updated));
      login({ token, ...updated });

      setMsg("프로필이 저장되었습니다.");
    } catch (err) {
      setError(err.message || "저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 크롭용 이미지 스타일 계산 ───
  const getCropImgStyle = () => {
    if (!originalUrl) return {};
    const baseScale = zoom; // baseScale은 이미지 로드 후 계산되나, 여기선 CSS cover를 기본으로 함
    return {
      position: "absolute",
      width: `${100 * zoom}%`,
      height: `${100 * zoom}%`,
      objectFit: "cover",
      left: "50%",
      top: "50%",
      transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
      cursor: isDragging.current ? "grabbing" : "grab",
      userSelect: "none",
      pointerEvents: "none",
    };
  };

  return (
    <>
      <Header />
      <main className="th-layout-main">
        <div className="th-layout-content">
          <div style={{
            minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", padding: "50px 20px"
          }}>
            <div style={{
              background: "rgba(255,255,255,0.95)", borderRadius: "16px", padding: "40px",
              width: "100%", maxWidth: "440px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}>
              <h2 className="h3" style={{ textAlign: "center", marginBottom: "30px", color: "#1a1a2e" }}>프로필 설정</h2>

              {/* ── 크롭 영역 or 현재 이미지 ── */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
                {originalUrl ? (
                  <>
                    <p style={{ fontSize: "12px", color: "#888", marginBottom: "10px" }}>
                      드래그로 위치 조정 · 아래 슬라이더로 크기 조정
                    </p>
                    {/* 크롭 컨테이너 */}
                    <div
                      ref={cropContainerRef}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleMouseUp}
                      onWheel={handleWheel}
                      style={{
                        width: CROP_SIZE, height: CROP_SIZE, borderRadius: "50%",
                        overflow: "hidden", position: "relative",
                        border: "3px solid #e63946", cursor: "grab",
                        background: "#eee", flexShrink: 0,
                      }}
                    >
                      <img src={originalUrl} alt="크롭" style={getCropImgStyle()} draggable={false} />
                    </div>

                    {/* 줌 슬라이더 */}
                    <div style={{ width: CROP_SIZE, marginTop: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "13px", color: "#666" }}>축소</span>
                        <input
                          type="range" min="0.5" max="3" step="0.01"
                          value={zoom}
                          onChange={(e) => setZoom(parseFloat(e.target.value))}
                          style={{ flex: 1, accentColor: "#e63946" }}
                        />
                        <span style={{ fontSize: "13px", color: "#666" }}>확대</span>
                      </div>
                    </div>

                    {/* 다른 이미지 선택 */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      style={{ marginTop: "10px", background: "none", border: "none", color: "#e63946", fontSize: "13px", cursor: "pointer" }}
                    >
                      다른 이미지 선택
                    </button>
                  </>
                ) : (
                  <div
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      width: CROP_SIZE, height: CROP_SIZE, borderRadius: "50%",
                      background: "#f0f0f0", cursor: "pointer", overflow: "hidden",
                      border: "3px solid #e63946", position: "relative",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                  >
                    {currentImage ? (
                      <img src={currentImage} alt="프로필" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "60px" }}>👤</span>
                    )}
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "rgba(0,0,0,0.5)", color: "#fff",
                      fontSize: "12px", textAlign: "center", padding: "6px"
                    }}>
                      클릭하여 변경
                    </div>
                  </div>
                )}

                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                <p style={{ marginTop: "8px", fontSize: "12px", color: "#999" }}>JPG, PNG, GIF (최대 5MB)</p>
              </div>

              {/* 닉네임 */}
              <div style={{ marginBottom: "24px" }}>
                <label className="p2" style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500" }}>닉네임 *</label>
                <input
                  type="text" value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요" disabled={isLoading}
                  style={{ width: "100%", padding: "14px 16px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "15px", boxSizing: "border-box" }}
                />
              </div>

              {error && <div style={{ padding: "12px", background: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>{error}</div>}
              {msg && <div style={{ padding: "12px", background: "#efe", color: "#363", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>{msg}</div>}

              <button onClick={handleSave} className="btnset btnset-primary" disabled={isLoading}
                style={{ width: "100%", padding: "16px", fontSize: "16px", fontWeight: "600", borderRadius: "8px", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? "저장 중..." : "저장"}
              </button>

              <button onClick={() => navigate("/mypage")}
                style={{ width: "100%", marginTop: "12px", padding: "12px", background: "none", border: "none", color: "#888", fontSize: "14px", cursor: "pointer" }}>
                마이페이지로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
