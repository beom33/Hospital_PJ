import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NARCOTIC_LABELS = {
  "1": { text: "마약", color: "#c0392b", bg: "#fdecea" },
  "2": { text: "향정신성의약품", color: "#8e24aa", bg: "#f3e5f5" },
  "3": { text: "대마", color: "#6d4c41", bg: "#efebe9" },
};

const ETC_LABELS = {
  "전문": { text: "전문의약품", color: "#1565c0", bg: "#e3f2fd" },
  "일반": { text: "일반의약품", color: "#2e7d32", bg: "#e8f5e9" },
};

export default function MedicinePage() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [permitResults, setPermitResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    setPermitResults([]);
    setSearched(true);
    setExpandedId(null);

    try {
      const [easyRes, permitRes] = await Promise.allSettled([
        fetch(`/api/drugs/search?keyword=${encodeURIComponent(keyword)}&size=15`),
        fetch(`/api/drugs/permit?keyword=${encodeURIComponent(keyword)}&size=15`),
      ]);

      if (easyRes.status === "fulfilled" && easyRes.value.ok) {
        const data = await easyRes.value.json();
        const items = data?.body?.items || [];
        setResults(Array.isArray(items) ? items : [items]);
      }

      if (permitRes.status === "fulfilled" && permitRes.value.ok) {
        const data = await permitRes.value.json();
        const items = data?.body?.items || [];
        setPermitResults(Array.isArray(items) ? items : [items]);
      }
    } catch (e) {
      setError("검색 중 오류가 발생했습니다. API 키를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 허가정보에서 해당 약품 찾기
  const getPermitInfo = (itemName) => {
    return permitResults.find(p =>
      p.ITEM_NAME?.includes(itemName) || itemName?.includes(p.ITEM_NAME)
    );
  };

  // 안전등급 계산
  const getSafetyLevel = (permit) => {
    if (!permit) return null;
    const nc = permit.NARCOTIC_KIND_CODE;
    if (nc && NARCOTIC_LABELS[nc]) return { type: "narcotic", ...NARCOTIC_LABELS[nc] };
    const etcOtc = permit.ETC_OTC_CODE;
    if (etcOtc?.includes("전문")) return ETC_LABELS["전문"];
    if (etcOtc?.includes("일반")) return ETC_LABELS["일반"];
    return null;
  };

  const stripHtml = (html) => {
    if (!html) return null;
    return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
  };

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">내 약 확인</h1>
          <div className="breadcrumb">
            <Link to="/">홈</Link> &gt; <span>내 약 확인</span>
          </div>
        </div>

        <div className="page-content" style={{ display: "block", padding: "24px", maxWidth: "900px", margin: "0 auto" }}>

          {/* 안내 배너 */}
          <div style={{ background: "linear-gradient(135deg, #1a5f7a, #2196f3)", borderRadius: "12px", padding: "20px 24px", marginBottom: "24px", color: "#fff", display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "40px" }}>💊</span>
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: "18px" }}>내가 먹는 약 확인하기</h2>
              <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>
                약품명을 검색하면 성분·효능·주의사항과 <strong>마약류 여부</strong>를 확인할 수 있습니다.
              </p>
            </div>
          </div>

          {/* 검색 바 */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="약품명 검색 (예: 타이레놀, 아스피린, 판콜)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{ flex: 1, padding: "12px 16px", border: "2px solid #ddd", borderRadius: "8px", fontSize: "15px", outline: "none" }}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{ padding: "12px 24px", background: "#1a5f7a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "600", whiteSpace: "nowrap" }}
            >
              {loading ? "검색 중..." : "🔍 검색"}
            </button>
          </div>

          {/* 분류 안내 */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
            {[
              { text: "마약", color: "#c0392b", bg: "#fdecea" },
              { text: "향정신성의약품", color: "#8e24aa", bg: "#f3e5f5" },
              { text: "전문의약품", color: "#1565c0", bg: "#e3f2fd" },
              { text: "일반의약품", color: "#2e7d32", bg: "#e8f5e9" },
            ].map(b => (
              <span key={b.text} style={{ padding: "4px 12px", borderRadius: "20px", background: b.bg, color: b.color, fontSize: "12px", fontWeight: "600" }}>
                {b.text}
              </span>
            ))}
            <span style={{ fontSize: "12px", color: "#999", alignSelf: "center", marginLeft: "4px" }}>← 검색 결과에 표시되는 분류입니다</span>
          </div>

          {/* 오류 */}
          {error && (
            <div style={{ padding: "12px 16px", background: "#fff3f3", border: "1px solid #f5c6c6", borderRadius: "8px", color: "#c0392b", marginBottom: "16px", fontSize: "14px" }}>
              ⚠️ {error}
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#888" }}>
                ※ data.go.kr에서 「의약품 복약정보」 API 키를 발급받아 application.properties의 mfds.api.key에 입력해주세요.
              </p>
            </div>
          )}

          {/* 로딩 */}
          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>💊</div>
              <p>약품 정보를 검색 중입니다...</p>
            </div>
          )}

          {/* 결과 없음 */}
          {!loading && searched && results.length === 0 && !error && (
            <div style={{ textAlign: "center", padding: "40px", color: "#aaa" }}>
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>🔍</div>
              <p>"{keyword}"에 대한 검색 결과가 없습니다.</p>
              <p style={{ fontSize: "13px" }}>정확한 약품명으로 다시 검색해보세요.</p>
            </div>
          )}

          {/* 검색 결과 */}
          {!loading && results.length > 0 && (
            <div>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
                총 <strong>{results.length}</strong>건 검색됨
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {results.map((item, idx) => {
                  const permit = getPermitInfo(item.itemName);
                  const safety = getSafetyLevel(permit);
                  const isExpanded = expandedId === idx;
                  const isNarcotic = permit?.NARCOTIC_KIND_CODE && NARCOTIC_LABELS[permit.NARCOTIC_KIND_CODE];

                  return (
                    <div
                      key={idx}
                      style={{
                        border: isNarcotic ? "2px solid #e57373" : "1px solid #e0e0e0",
                        borderRadius: "10px",
                        overflow: "hidden",
                        background: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }}
                    >
                      {/* 카드 헤더 */}
                      <div
                        onClick={() => setExpandedId(isExpanded ? null : idx)}
                        style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", background: isNarcotic ? "#fff8f8" : "#fff" }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                            <h3 style={{ margin: 0, fontSize: "16px", color: "#1a1a1a" }}>{item.itemName}</h3>
                            {safety && (
                              <span style={{ padding: "2px 10px", borderRadius: "12px", background: safety.bg, color: safety.color, fontSize: "12px", fontWeight: "700" }}>
                                {safety.text}
                              </span>
                            )}
                            {isNarcotic && (
                              <span style={{ padding: "2px 10px", borderRadius: "12px", background: "#ffebee", color: "#c0392b", fontSize: "12px", fontWeight: "700" }}>
                                ⚠️ 마약류
                              </span>
                            )}
                          </div>
                          {item.entpName && <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>{item.entpName}</p>}
                          {permit?.ITEM_PERMIT_DATE && (
                            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#aaa" }}>허가일: {permit.ITEM_PERMIT_DATE}</p>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {item.itemImage && (
                            <img src={item.itemImage} alt="약 이미지" style={{ width: "50px", height: "50px", objectFit: "contain", borderRadius: "6px", border: "1px solid #eee" }} />
                          )}
                          <span style={{ fontSize: "18px", color: "#999" }}>{isExpanded ? "▲" : "▼"}</span>
                        </div>
                      </div>

                      {/* 마약류 경고 */}
                      {isNarcotic && (
                        <div style={{ padding: "10px 20px", background: "#ffebee", borderTop: "1px solid #ffcdd2", fontSize: "13px", color: "#c0392b", fontWeight: "600" }}>
                          ⚠️ 이 약품은 <strong>{NARCOTIC_LABELS[permit.NARCOTIC_KIND_CODE]?.text}</strong>으로 분류된 약품입니다. 반드시 의사·약사의 지도하에 복용하세요.
                        </div>
                      )}

                      {/* 상세 정보 */}
                      {isExpanded && (
                        <div style={{ padding: "16px 20px", borderTop: "1px solid #f0f0f0", display: "flex", flexDirection: "column", gap: "14px" }}>
                          {[
                            { label: "💡 효능·효과", text: stripHtml(item.efcyQesitm) },
                            { label: "📋 복용방법", text: stripHtml(item.useMethodQesitm) },
                            { label: "⚠️ 주의사항 (경고)", text: stripHtml(item.atpnWarnQesitm), warn: true },
                            { label: "📌 주의사항", text: stripHtml(item.atpnQesitm) },
                            { label: "🔄 상호작용", text: stripHtml(item.intrcQesitm) },
                            { label: "🩺 부작용", text: stripHtml(item.seQesitm) },
                            { label: "📦 보관방법", text: stripHtml(item.depositMethodQesitm) },
                          ].filter(s => s.text).map(section => (
                            <div key={section.label}>
                              <div style={{ fontSize: "13px", fontWeight: "700", color: section.warn ? "#c0392b" : "#1a5f7a", marginBottom: "6px" }}>
                                {section.label}
                              </div>
                              <p style={{ margin: 0, fontSize: "13px", color: "#444", lineHeight: "1.7", background: section.warn ? "#fff8f8" : "#f9f9f9", padding: "10px 14px", borderRadius: "6px" }}>
                                {section.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 안내문 */}
          <p style={{ marginTop: "24px", fontSize: "12px", color: "#aaa", lineHeight: "1.6" }}>
            ※ 본 정보는 식품의약품안전처 공공데이터를 기반으로 제공됩니다.<br />
            ※ 의약품 복용 전 반드시 의사·약사와 상담하시고, 본 정보를 의료적 판단의 근거로 사용하지 마세요.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
