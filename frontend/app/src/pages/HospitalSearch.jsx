import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// ※ 카카오 개발자 콘솔(https://developers.kakao.com)에서 발급받은 JavaScript 키로 교체하세요
const KAKAO_APP_KEY = "edf4ef8eb3fc341901f0d49a3a819574";

export default function HospitalSearch() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infowindowRef = useRef(null);
  const currentCircleRef = useRef(null);

  const [hospitals, setHospitals] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState(null); // 현재 위치 저장

  // Kakao Maps SDK 동적 로드
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => setMapReady(true));
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => setMapReady(true));
    };
    script.onerror = () => {
      setLocationError("카카오 지도를 불러오지 못했습니다. API 키를 확인해주세요.");
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 5,
    };

    const map = new window.kakao.maps.Map(mapRef.current, options);
    mapInstanceRef.current = map;
    infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });

    // 지도 클릭 시 인포윈도우 닫기
    window.kakao.maps.event.addListener(map, "click", () => {
      infowindowRef.current.close();
    });

    // 현재 위치로 이동 후 병원 검색
    requestCurrentLocation(map);
  }, [mapReady]);

  // 현재 위치 요청
  const requestCurrentLocation = (map) => {
    const targetMap = map || mapInstanceRef.current;
    if (!targetMap) return;

    if (!navigator.geolocation) {
      setLocationError("이 브라우저는 위치 서비스를 지원하지 않습니다.");
      return;
    }

    setLoading(true);
    setLocationError("");

    const onSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      const latlng = new window.kakao.maps.LatLng(latitude, longitude);

      targetMap.setCenter(latlng);
      targetMap.setLevel(4);

      if (currentCircleRef.current) {
        currentCircleRef.current.setMap(null);
      }

      const circle = new window.kakao.maps.Circle({
        center: latlng,
        radius: 30,
        strokeWeight: 3,
        strokeColor: "#1a73e8",
        strokeOpacity: 1,
        strokeStyle: "solid",
        fillColor: "#4da6ff",
        fillOpacity: 0.6,
      });
      circle.setMap(targetMap);
      currentCircleRef.current = circle;

      setUserLocation({ lat: latitude, lng: longitude });
      searchNearby(latitude, longitude, targetMap);
    };

    const onError = (err) => {
      if (err.code === 1) {
        setLocationError("위치 권한이 거부되었습니다. 브라우저 주소창 왼쪽 자물쇠 아이콘에서 위치 권한을 허용해주세요.");
      } else {
        setLocationError("위치 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.");
      }
      setLoading(false);
    };

    // GPS 정밀 위치 우선 시도 → 실패 시 네트워크 기반으로 fallback
    navigator.geolocation.getCurrentPosition(onSuccess, () => {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      });
    }, {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    });
  };

  // 전국 키워드 검색 (위치 제한 없음)
  const searchByKeyword = () => {
    if (!mapInstanceRef.current || !window.kakao) return;
    runSearch(keyword.trim() || "병원", null, null, mapInstanceRef.current);
  };

  // 내 위치 기준 주변 검색
  const searchNearby = (lat, lng, map) => {
    runSearch(keyword.trim() || "병원", lat, lng, map);
  };

  // 실제 카카오 장소 검색 실행
  const runSearch = (searchKeyword, lat, lng, map) => {
    setLoading(true);
    clearMarkers();
    setSelectedHospital(null);

    const ps = new window.kakao.maps.services.Places();

    const options = { size: 15 };
    // lat/lng 있으면 주변 검색, 없으면 전국 검색
    if (lat !== null && lng !== null) {
      options.location = new window.kakao.maps.LatLng(lat, lng);
      options.radius = 20000; // 20km 반경
      options.sort = window.kakao.maps.services.SortBy.DISTANCE;
    } else {
      options.sort = window.kakao.maps.services.SortBy.ACCURACY;
    }

    ps.keywordSearch(
      searchKeyword,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const bounds = new window.kakao.maps.LatLngBounds();
          const results = [];

          data.forEach((place, i) => {
            const position = new window.kakao.maps.LatLng(place.y, place.x);

            const marker = new window.kakao.maps.Marker({
              map,
              position,
              title: place.place_name,
            });

            const infoContent = `
              <div style="padding:10px 14px;min-width:180px;font-family:sans-serif;">
                <strong style="font-size:14px;color:#1a5f7a;">${place.place_name}</strong><br/>
                <span style="font-size:12px;color:#555;line-height:1.6;">
                  ${place.road_address_name || place.address_name}
                </span>
                ${place.phone ? `<br/><span style="font-size:12px;color:#1a73e8;">☎ ${place.phone}</span>` : ""}
              </div>
            `;

            window.kakao.maps.event.addListener(marker, "click", () => {
              infowindowRef.current.setContent(infoContent);
              infowindowRef.current.open(map, marker);
              setSelectedHospital({ ...place, index: i + 1 });
            });

            markersRef.current.push(marker);
            bounds.extend(position);
            results.push({ ...place, index: i + 1 });
          });

          map.setBounds(bounds);
          setHospitals(results);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          setHospitals([]);
        } else {
          setLocationError("검색 중 오류가 발생했습니다.");
        }
        setLoading(false);
      },
      options
    );
  };

  const clearMarkers = () => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  };

  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital);
    if (!mapInstanceRef.current) return;

    const position = new window.kakao.maps.LatLng(hospital.y, hospital.x);
    mapInstanceRef.current.setCenter(position);
    mapInstanceRef.current.setLevel(3);

    const marker = markersRef.current[hospital.index - 1];
    if (marker) {
      const infoContent = `
        <div style="padding:10px 14px;min-width:180px;font-family:sans-serif;">
          <strong style="font-size:14px;color:#1a5f7a;">${hospital.place_name}</strong><br/>
          <span style="font-size:12px;color:#555;line-height:1.6;">
            ${hospital.road_address_name || hospital.address_name}
          </span>
          ${hospital.phone ? `<br/><span style="font-size:12px;color:#1a73e8;">☎ ${hospital.phone}</span>` : ""}
        </div>
      `;
      infowindowRef.current.setContent(infoContent);
      infowindowRef.current.open(mapInstanceRef.current, marker);
    }
  };

  const formatDistance = (distance) => {
    if (!distance) return "";
    const d = parseInt(distance);
    return d >= 1000 ? `${(d / 1000).toFixed(1)}km` : `${d}m`;
  };


  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">병원 찾기</h1>
          <div className="breadcrumb">
            <Link to="/">홈</Link> &gt; <span>병원 찾기</span>
          </div>
        </div>

        <div className="page-content" style={{ display: "block", padding: "24px" }}>
          <h2 style={{ marginBottom: "16px", fontSize: "20px", color: "#1a5f7a" }}>내 주변 병원 찾기</h2>

          {/* 검색 바 */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="지역 + 진료과목 (예: 서울 정형외과, 부산 내과, 강남 치과)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchByKeyword()}
              style={{
                flex: 1,
                minWidth: "220px",
                padding: "10px 14px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
              }}
            />
            <button
              onClick={searchByKeyword}
              style={{
                padding: "10px 20px",
                background: "#1a5f7a",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              검색
            </button>
            <button
              onClick={() => requestCurrentLocation(null)}
              style={{
                padding: "10px 16px",
                background: "#2196f3",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              📍 내 위치
            </button>
          </div>

          {/* 오류 메시지 */}
          {locationError && (
            <div style={{
              marginBottom: "12px",
              padding: "10px 14px",
              background: "#fff3f3",
              border: "1px solid #f5c6c6",
              borderRadius: "6px",
              color: "#c0392b",
              fontSize: "13px",
            }}>
              {locationError}
            </div>
          )}

          {/* 지도 + 목록 */}
          <div style={{ display: "flex", gap: "16px", height: "520px" }}>

            {/* 병원 목록 */}
            <div style={{
              width: "300px",
              flexShrink: 0,
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflowY: "auto",
              background: "#fff",
            }}>
              <div style={{
                padding: "10px 14px",
                background: "#1a5f7a",
                color: "#fff",
                fontSize: "13px",
                fontWeight: "600",
                borderRadius: "8px 8px 0 0",
              }}>
                검색 결과 {hospitals.length > 0 ? `(${hospitals.length}건)` : ""}
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#888", fontSize: "14px" }}>
                  검색 중...
                </div>
              ) : hospitals.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: "14px" }}>
                  검색 결과가 없습니다.
                </div>
              ) : (
                hospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    onClick={() => handleHospitalClick(hospital)}
                    style={{
                      padding: "12px 14px",
                      borderBottom: "1px solid #f0f0f0",
                      cursor: "pointer",
                      background: selectedHospital?.id === hospital.id ? "#e8f4fd" : "#fff",
                      transition: "background 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span style={{
                        background: selectedHospital?.id === hospital.id ? "#1a73e8" : "#1a5f7a",
                        color: "#fff",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        flexShrink: 0,
                        marginTop: "2px",
                        fontWeight: "700",
                      }}>
                        {hospital.index}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: "600", fontSize: "14px", color: "#1a1a1a", marginBottom: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {hospital.place_name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666", marginBottom: "3px", lineHeight: "1.4" }}>
                          {hospital.road_address_name || hospital.address_name}
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {hospital.phone && (
                            <span style={{ fontSize: "12px", color: "#1a73e8" }}>☎ {hospital.phone}</span>
                          )}
                          {hospital.distance && (
                            <span style={{ fontSize: "11px", color: "#999" }}>
                              {formatDistance(hospital.distance)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 카카오 지도 */}
            <div style={{ flex: 1, borderRadius: "8px", overflow: "hidden", border: "1px solid #ddd", position: "relative" }}>
              <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
              {!mapReady && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f5f5f5",
                  color: "#888",
                  fontSize: "14px",
                  flexDirection: "column",
                  gap: "8px",
                }}>
                  <span style={{ fontSize: "32px" }}>🗺️</span>
                  <span>지도 불러오는 중...</span>
                </div>
              )}
            </div>
          </div>

          {/* 선택된 병원 상세 정보 */}
          {selectedHospital && (
            <div style={{
              marginTop: "16px",
              padding: "16px 20px",
              background: "#f0f7ff",
              border: "1px solid #b3d4f5",
              borderRadius: "8px",
            }}>
              {/* 병원명 + 버튼 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                <h4 style={{ margin: 0, fontSize: "16px", color: "#1a5f7a" }}>
                  🏥 {selectedHospital.place_name}
                </h4>
                <div style={{ display: "flex", gap: "8px" }}>
                  {userLocation && (
                    <a
                      href={`https://map.kakao.com/link/from/내위치,${userLocation.lat},${userLocation.lng}/to/${encodeURIComponent(selectedHospital.place_name)},${selectedHospital.y},${selectedHospital.x}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: "7px 12px", background: "#2196f3", color: "#fff", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}
                    >
                      🗺️ 길찾기
                    </a>
                  )}
                  {selectedHospital.place_url && (
                    <a
                      href={selectedHospital.place_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: "7px 12px", background: "#fee500", color: "#3c1e1e", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}
                    >
                      카카오맵
                    </a>
                  )}
                </div>
              </div>

              {/* 주소 + 전화 */}
              <div style={{ fontSize: "13px", color: "#555", display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {selectedHospital.road_address_name && <span>📍 {selectedHospital.road_address_name}</span>}
                {selectedHospital.phone && (
                  <span>☎ <a href={`tel:${selectedHospital.phone}`} style={{ color: "#1a73e8", textDecoration: "none" }}>{selectedHospital.phone}</a></span>
                )}
                {selectedHospital.distance && (
                  <span>🚶 {formatDistance(selectedHospital.distance)}</span>
                )}
              </div>
            </div>
          )}

          {/* 안내 문구 */}
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#aaa" }}>
            * 카카오 장소 데이터 기준이며 실제 운영 시간과 다를 수 있습니다. 방문 전 전화 확인을 권장합니다.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
