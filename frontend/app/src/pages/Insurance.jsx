import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE_URL = "http://localhost:8080/api/medical-fees";

export default function Insurance() {
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubItems, setSelectedSubItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 카테고리 데이터 (이미지 + 이름 + 검색키워드)
  const categories = [
    { id: "hospital", name: "상급병실료", image: "/resources/icons2/hospital.png", searchTerm: "상급병실" },
    { id: "education", name: "교육상담료", image: "/resources/icons2/교육상담.png", searchTerm: "교육상담" },
    { id: "lab", name: "검체, 병리\n검사료", image: "/resources/icons2/검체병리.png", searchTerm: "검체검사" },
    { id: "function", name: "기능검사료", image: "/resources/icons2/기능검사.png", searchTerm: "기능검사" },
    { id: "endoscopy", name: "내시경, 천자\n및 생검료", image: "/resources/icons2/내시경.png", searchTerm: "내시경" },
    { id: "ultrasound", name: "초음파", image: "/resources/icons2/초음파.png", searchTerm: "초음파" },
    { id: "radiology", name: "영상진단 및\n방사선치료료", image: "/resources/icons2/영상진단.png", searchTerm: "영상진단" },
    { id: "mri", name: "MRI", image: "/resources/icons2/MRI.png", searchTerm: "MRI" },
    { id: "injection", name: "주사료", image: "/resources/icons2/주사료.png", searchTerm: "주사" },
    { id: "physical", name: "물리치료", image: "/resources/icons2/물리치료.png", searchTerm: "도수치료" },
    { id: "mental", name: "정신요법료", image: "/resources/icons2/정신요법.png", searchTerm: "정신요법" },
    { id: "surgery", name: "처치 및 수술료", image: "/resources/icons2/처치및수술.png", searchTerm: "수술" },
    { id: "hair", name: "모발 이식술료", image: "/resources/icons2/모발이식.png", searchTerm: "모발이식" },
    { id: "eye", name: "시력 교정술료", image: "/resources/icons2/시력교정술.png", searchTerm: "라식" },
    { id: "dental", name: "치과", image: "/resources/icons2/치과.png", searchTerm: "치과" },
    { id: "oriental", name: "한방", image: "/resources/icons2/한방.png", searchTerm: "한방" },
    { id: "vaccine", name: "예방접종료", image: "/resources/icons2/예방접종.png", searchTerm: "예방접종" },
    { id: "material", name: "치료재료", image: "/resources/icons2/치료재료.png", searchTerm: "치료재료" },
    { id: "assistant", name: "보장구", image: "/resources/icons2/보장구.png", searchTerm: "보장구" },
    { id: "certificate", name: "제증명 수수료", image: "/resources/icons2/제증명.png", searchTerm: "제증명" },
  ];

  // 상세 분야 데이터
  const subCategories = {
    function: [
      { id: "func1", name: "추가기능(인지 및 역치)검사" },
      { id: "func2", name: "초기 산화질소 측정" },
      { id: "func3", name: "교감신경피부반응검사" },
      { id: "func4", name: "성기능장애평가" },
      { id: "func5", name: "섭식장애평가" },
      { id: "func6", name: "발음 및 발성검사" },
      { id: "func7", name: "언어전반진단검사" },
      { id: "func8", name: "주의력검사" },
      { id: "func9", name: "영유아발달검사" },
      { id: "func10", name: "덴버발달검사" },
    ],
    physical: [
      { id: "phy1", name: "도수치료" },
      { id: "phy2", name: "증식치료" },
      { id: "phy3", name: "체외충격파" },
      { id: "phy4", name: "근막이완술" },
    ],
    dental: [
      { id: "den1", name: "치아미백" },
      { id: "den2", name: "치아교정" },
      { id: "den3", name: "임플란트" },
      { id: "den4", name: "라미네이트" },
      { id: "den5", name: "틀니" },
    ],
    eye: [
      { id: "eye1", name: "라식수술" },
      { id: "eye2", name: "라섹수술" },
      { id: "eye3", name: "스마일라식" },
      { id: "eye4", name: "렌즈삽입술" },
    ],
  };


  // 카테고리 선택
  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setSelectedSubItems([]); // 기존 선택 초기화

    if (subCategories[category.id]) {
      // 하위 항목이 있는 카테고리면 모달 열기
      setShowModal(true);
    } else {
      // 하위 항목이 없는 카테고리면 바로 검색 실행
      await handleCategorySearch(category.searchTerm || category.name);
    }
  };

  // 카테고리명으로 바로 검색
  const handleCategorySearch = async (categoryName) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1);

    try {
      const response = await fetch(`${API_BASE_URL}/item?name=${encodeURIComponent(categoryName)}`);
      if (!response.ok) {
        throw new Error("검색 중 오류가 발생했습니다.");
      }
      const data = await response.json();
      console.log(`${categoryName} 검색 결과:`, data.length, "건");
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 상세 분야 선택/해제
  const toggleSubItem = (item) => {
    setSelectedSubItems(prev =>
      prev.includes(item.id)
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id]
    );
  };

  // 선택된 하위 항목의 이름들을 가져오는 함수
  const getSelectedSubItemNames = () => {
    if (!selectedCategory || !subCategories[selectedCategory.id]) {
      return [];
    }
    return subCategories[selectedCategory.id]
      .filter(item => selectedSubItems.includes(item.id))
      .map(item => item.name);
  };

  // 검색 실행 (백엔드 API 호출)
  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1);

    try {
      // 선택된 하위 항목이 있으면 그 항목들로 검색, 없으면 입력된 검색어나 카테고리로 검색
      const selectedNames = getSelectedSubItemNames();
      let searchItemName = itemSearch.trim() || null;

      // 하위 항목이 선택되었으면 첫 번째 선택 항목으로 검색 (여러 개면 첫 번째)
      if (selectedNames.length > 0) {
        searchItemName = selectedNames[0];
      }
      // 카테고리만 선택한 경우 - 하위 항목이 없는 카테고리는 카테고리 이름으로 검색
      // 하위 항목이 있는 카테고리인데 선택 안 한 경우는 검색어 없이 진행 (전체 목록)

      console.log("검색 조건:", {
        selectedCategory: selectedCategory?.name,
        selectedSubItems,
        selectedNames,
        searchItemName,
        hospitalSearch: hospitalSearch.trim()
      });

      const response = await fetch(`${API_BASE_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospitalName: hospitalSearch.trim() || null,
          itemName: searchItemName,
          category: selectedCategory?.name || null,
        }),
      });

      if (!response.ok) {
        throw new Error("검색 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      console.log("검색 결과:", data.length, "건");
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 병원명으로 빠른 검색
  const handleHospitalQuickSearch = async (hospitalName) => {
    setHospitalSearch(hospitalName);
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1);

    try {
      const response = await fetch(`${API_BASE_URL}/hospital?name=${encodeURIComponent(hospitalName)}`);
      if (!response.ok) {
        throw new Error("검색 중 오류가 발생했습니다.");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 항목명으로 빠른 검색
  const handleItemQuickSearch = async (itemName) => {
    setItemSearch(itemName);
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1);

    try {
      const response = await fetch(`${API_BASE_URL}/item?name=${encodeURIComponent(itemName)}`);
      if (!response.ok) {
        throw new Error("검색 중 오류가 발생했습니다.");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 가격 포맷
  const formatPrice = (price) => {
    return price.toLocaleString() + "원";
  };

  // 페이지네이션 관련 계산
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = searchResults.slice(startIndex, endIndex);

  // 페이지 변경
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 페이지 번호 배열 생성 (현재 페이지 기준 최대 5개)
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <>
      <Header simplified />
      <div className="page-container">
        <div className="page-header insurance-header">
          <div className="page-tabs">
            <button className="tab-btn active">비급여 진료비용 정보</button>
          </div>
        </div>

        <div className="insurance-content">
          {/* 왼쪽 검색 패널 */}
          <aside className="insurance-sidebar">
            <div className="sidebar-header">
              <h3>비급여 진료비용 상세 검색</h3>
            </div>

            {/* 병원 검색 */}
            <div className="search-section">
              <label className="search-label">
                <span className="label-icon">🏥</span>
                병·의원으로 조회하기
              </label>
              <div className="search-input-wrap">
                <input
                  type="text"
                  placeholder="병·의원 이름 또는 도로명 주소 입력"
                  value={hospitalSearch}
                  onChange={(e) => setHospitalSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && hospitalSearch.trim()) {
                      handleHospitalQuickSearch(hospitalSearch.trim());
                    }
                  }}
                  className="search-input-full"
                />
                <button
                  className="search-icon-btn"
                  onClick={() => hospitalSearch.trim() && handleHospitalQuickSearch(hospitalSearch.trim())}
                >
                  🔍
                </button>
              </div>
            </div>

            {/* 항목으로 조회 */}
            <div className="search-section">
              <label className="search-label">
                <span className="label-icon">📋</span>
                항목으로 조회하기
              </label>

              {/* 비급여 진료비 항목 검색 */}
              <div className="search-subsection">
                <span className="subsection-label">비급여 진료비 항목 <span className="required">*</span></span>
                <div className="search-input-wrap">
                  <input
                    type="text"
                    placeholder="비급여진료비 항목명 또는 병명으로 검색 가능 예시)독감"
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && itemSearch.trim()) {
                        handleItemQuickSearch(itemSearch.trim());
                      }
                    }}
                    className="search-input-full"
                  />
                  <button
                    className="search-icon-btn"
                    onClick={() => itemSearch.trim() && handleItemQuickSearch(itemSearch.trim())}
                  >
                    🔍
                  </button>
                </div>
              </div>

              {/* 카테고리 그리드 */}
              <div className="category-grid">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-btn ${selectedCategory?.id === cat.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    <img src={cat.image} alt={cat.name} className="category-icon" />
                    <span className="category-name">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 검색 버튼 */}
            <button className="main-search-btn" onClick={handleSearch}>
              선택항목 검색
            </button>

            {/* 다빈도항목 빠른 조회 */}
            <div className="quick-search">
              <h4>다빈도항목 빠른 조회</h4>
              <div className="quick-tags">
                <button className="quick-tag" onClick={() => handleItemQuickSearch("도수치료")}>도수치료</button>
                <button className="quick-tag" onClick={() => handleItemQuickSearch("대상포진")}>대상포진</button>
                <button className="quick-tag" onClick={() => handleItemQuickSearch("폐렴구균")}>폐렴구균</button>
                <button className="quick-tag" onClick={() => handleItemQuickSearch("MRI")}>MRI</button>
                <button className="quick-tag" onClick={() => handleItemQuickSearch("임플란트")}>임플란트</button>
              </div>
            </div>
          </aside>

          {/* 오른쪽 결과 패널 */}
          <main className="insurance-main">
            {/* 안내 배너 */}
            <div className="info-banner">
              <span className="banner-icon">📢</span>
              <p>
                현재 보건복지부 고시*에 따라 공개중인 '인플루엔자(독감) 예방접종' 항목은 4가 백신임을 알려드립니다.
                <br />
                * 「비급여 진료비용 등의 보고 및 공개에 관한 기준」 (보건복지부 고시 제2025-48호)
              </p>
            </div>

            {/* 검색 결과 영역 */}
            <div className="results-section">
              <div className="results-header">
                <span className="results-count">
                  검색결과 총 <strong>{hasSearched ? searchResults.length : 0}</strong>건
                </span>
                <div className="results-actions">
                  <button className="action-btn active">목록으로 보기</button>
                  <button className="action-btn">지도로 보기</button>
                </div>
              </div>

              {/* 결과 테이블 */}
              {isLoading ? (
                <div className="no-results-box">
                  <span className="no-results-icon">⏳</span>
                  <p>검색 중입니다...</p>
                </div>
              ) : error ? (
                <div className="no-results-box">
                  <span className="no-results-icon">⚠️</span>
                  <p>{error}</p>
                </div>
              ) : hasSearched ? (
                searchResults.length > 0 ? (
                  <div className="results-table-wrap">
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>의료기관명</th>
                          <th>의료기관규모</th>
                          <th>소재지</th>
                          <th>중분류</th>
                          <th>항목명</th>
                          <th>최소금액</th>
                          <th>최대금액</th>
                          <th>비고</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((item, index) => (
                          <tr key={item.id || index}>
                            <td>{item.hospitalName}</td>
                            <td>{item.hospitalType}</td>
                            <td>{item.hospitalAddress}</td>
                            <td>{item.category}</td>
                            <td>{item.itemName}</td>
                            <td className="price">{formatPrice(item.minPrice)}</td>
                            <td className="price">{formatPrice(item.maxPrice)}</td>
                            <td>{item.note || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-results-box">
                    <span className="no-results-icon">!</span>
                    <p>검색 결과가 존재하지 않습니다.</p>
                  </div>
                )
              ) : (
                <div className="no-results-box">
                  <span className="no-results-icon">🔍</span>
                  <p>검색 조건을 입력하고 검색 버튼을 클릭해주세요.</p>
                </div>
              )}

              {/* 페이지네이션 */}
              {hasSearched && searchResults.length > 0 && totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                  <button
                    className="page-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>
                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </button>
                  <button
                    className="page-btn"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                </div>
              )}
            </div>

            {/* 안내 문구 */}
            <div className="notice-box">
              <p>
                <span className="notice-dot red">●</span>
                같은 비급여 항목이라도 인력, 시설, 장비 및 시술 난이도 등에 따라 의료기관마다 금액 차이가 있을 수 있으며 함께 제공되는 다른 진료나 치료재료에 따라
                <span className="highlight"> 실제 총 진료비는 다를 수 있습니다.</span>
                공개된 비급여 가격은 의료기관에서 자율적으로 정한 것으로 특이사항 기재내용(세부정보)를 함께 참고하시기 바랍니다.
              </p>
              <p>
                <span className="notice-dot blue">●</span>
                공개항목의 금액 등이 변경된 경우, 해당 의료기관의 변경사항 보고와 관련한 행정처리 기간에 따라
                <span className="highlight"> 실시간으로 반영되지 않으므로</span>
                조회 시점의 정보와 의료기관에서 실제 운영중인 금액 등의 정보 차이가 있을 수 있습니다.
                <span className="highlight">조회내용의 정확한 정보는 해당 의료기관에 확인하여 주시기 바랍니다.</span>
              </p>
            </div>
          </main>
        </div>
      </div>

      {/* 상세분야 선택 모달 */}
      {showModal && selectedCategory && subCategories[selectedCategory.id] && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>상세분야 선택</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="subcategory-section">
                <h4>{selectedCategory.name}</h4>
                <div className="subcategory-list">
                  {subCategories[selectedCategory.id].map(item => (
                    <label key={item.id} className="subcategory-item">
                      <input
                        type="checkbox"
                        checked={selectedSubItems.includes(item.id)}
                        onChange={() => toggleSubItem(item)}
                      />
                      <span>{item.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-search-btn" onClick={() => {
                // 모달을 닫기 전에 검색 실행 (상태가 유지된 상태에서)
                handleSearch();
                setShowModal(false);
              }}>
                선택항목 검색
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
