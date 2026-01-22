import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideMenu from "../components/SideMenu";

export default function Insurance() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 의료보험 적용 항목 데이터 (나중에 백엔드 연동)
  const insuranceData = [
    // 내과
    { id: 1, category: "내과", name: "일반 진찰료", covered: true, selfPay: "30%", note: "기본 진료" },
    { id: 2, category: "내과", name: "혈액검사 (일반)", covered: true, selfPay: "30%", note: "기본 혈액검사" },
    { id: 3, category: "내과", name: "종합건강검진", covered: false, selfPay: "100%", note: "비급여 항목" },
    { id: 4, category: "내과", name: "독감 예방접종", covered: false, selfPay: "100%", note: "비급여 (65세 이상 무료)" },

    // 외과
    { id: 5, category: "외과", name: "상처 봉합술", covered: true, selfPay: "30%", note: "응급 처치" },
    { id: 6, category: "외과", name: "피부 양성종양 제거", covered: true, selfPay: "30%", note: "의학적 필요시" },
    { id: 7, category: "외과", name: "지방흡입술", covered: false, selfPay: "100%", note: "미용 목적" },

    // 정형외과
    { id: 8, category: "정형외과", name: "X-ray 촬영", covered: true, selfPay: "30%", note: "진단 목적" },
    { id: 9, category: "정형외과", name: "MRI 검사", covered: true, selfPay: "30~60%", note: "의사 소견 필요" },
    { id: 10, category: "정형외과", name: "물리치료", covered: true, selfPay: "30%", note: "처방 필요" },
    { id: 11, category: "정형외과", name: "도수치료", covered: false, selfPay: "100%", note: "비급여 항목" },

    // 피부과
    { id: 12, category: "피부과", name: "습진/피부염 치료", covered: true, selfPay: "30%", note: "질병 치료" },
    { id: 13, category: "피부과", name: "여드름 치료", covered: false, selfPay: "100%", note: "미용 목적" },
    { id: 14, category: "피부과", name: "레이저 시술", covered: false, selfPay: "100%", note: "미용 목적" },
    { id: 15, category: "피부과", name: "점 제거", covered: false, selfPay: "100%", note: "미용 목적" },

    // 치과
    { id: 16, category: "치과", name: "충치 치료 (레진)", covered: true, selfPay: "30%", note: "12세 이하" },
    { id: 17, category: "치과", name: "스케일링", covered: true, selfPay: "30%", note: "연 1회" },
    { id: 18, category: "치과", name: "임플란트", covered: true, selfPay: "30%", note: "65세 이상, 2개까지" },
    { id: 19, category: "치과", name: "치아 미백", covered: false, selfPay: "100%", note: "미용 목적" },
    { id: 20, category: "치과", name: "치아 교정", covered: false, selfPay: "100%", note: "미용 목적" },

    // 안과
    { id: 21, category: "안과", name: "시력검사", covered: true, selfPay: "30%", note: "진단 목적" },
    { id: 22, category: "안과", name: "백내장 수술", covered: true, selfPay: "30%", note: "질병 치료" },
    { id: 23, category: "안과", name: "라식/라섹 수술", covered: false, selfPay: "100%", note: "시력 교정" },

    // 산부인과
    { id: 24, category: "산부인과", name: "임신 검진", covered: true, selfPay: "30%", note: "정기 검진" },
    { id: 25, category: "산부인과", name: "분만비", covered: true, selfPay: "30%", note: "자연분만/제왕절개" },
    { id: 26, category: "산부인과", name: "난임 시술 (체외수정)", covered: true, selfPay: "30~50%", note: "횟수 제한 있음" },
  ];

  // 카테고리 목록
  const categories = ["all", ...new Set(insuranceData.map(item => item.category))];

  // 필터링된 데이터
  const filteredData = insuranceData.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 카테고리별 그룹화
  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">의료보험 적용 확인</h1>
          <div className="breadcrumb">
            <Link to="/">홈</Link> &gt; <span>의료보험 적용 확인</span>
          </div>
        </div>

        <div className="page-content">
          <SideMenu />

          <main className="main-content">
            <div className="content-header">
              <h2>의료보험 적용 항목 조회</h2>
            </div>

            {/* 안내 문구 */}
            <div className="insurance-notice">
              <p><strong>안내:</strong> 아래 정보는 일반적인 의료보험 적용 기준입니다. 실제 적용 여부는 개인의 상황, 의사의 소견, 보험 종류에 따라 다를 수 있습니다. 정확한 정보는 병원 또는 국민건강보험공단에 문의해 주세요.</p>
            </div>

            {/* 검색 영역 */}
            <div className="search-area">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="search-select"
              >
                <option value="all">전체 진료과목</option>
                {categories.filter(cat => cat !== "all").map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="진료 항목을 검색하세요 (예: MRI, 임플란트)"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="search-input"
              />
              <button className="search-btn" onClick={() => {}}>검색</button>
            </div>

            {/* 범례 */}
            <div className="insurance-legend">
              <span className="legend-item covered">
                <span className="legend-badge covered">급여</span> 건강보험 적용
              </span>
              <span className="legend-item not-covered">
                <span className="legend-badge not-covered">비급여</span> 건강보험 미적용 (전액 본인부담)
              </span>
            </div>

            {/* 검색 결과 */}
            <div className="list-info">
              <span>검색 결과: <strong>{filteredData.length}</strong>건</span>
            </div>

            {/* 카테고리별 목록 */}
            {Object.keys(groupedData).length > 0 ? (
              Object.entries(groupedData).map(([category, items]) => (
                <div key={category} className="insurance-category">
                  <h3 className="category-title">{category}</h3>
                  <table className="insurance-table">
                    <thead>
                      <tr>
                        <th className="col-name">진료 항목</th>
                        <th className="col-covered">보험 적용</th>
                        <th className="col-selfpay">본인부담</th>
                        <th className="col-note">비고</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id} className={item.covered ? "row-covered" : "row-not-covered"}>
                          <td className="col-name">{item.name}</td>
                          <td className="col-covered">
                            <span className={`badge ${item.covered ? "covered" : "not-covered"}`}>
                              {item.covered ? "급여" : "비급여"}
                            </span>
                          </td>
                          <td className="col-selfpay">{item.selfPay}</td>
                          <td className="col-note">{item.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>검색 결과가 없습니다.</p>
              </div>
            )}

            {/* 추가 안내 */}
            <div className="insurance-info-box">
              <h4>의료보험 관련 문의</h4>
              <ul>
                <li><strong>국민건강보험공단:</strong> 1577-1000</li>
                <li><strong>건강보험심사평가원:</strong> 1644-2000</li>
                <li><strong>병원 원무과:</strong> 진료 전 보험 적용 여부 확인 가능</li>
              </ul>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
