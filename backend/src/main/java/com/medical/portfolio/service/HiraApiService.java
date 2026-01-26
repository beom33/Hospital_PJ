package com.medical.portfolio.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medical.portfolio.dto.MedicalFeeResponse;
import com.medical.portfolio.entity.Hospital;
import com.medical.portfolio.entity.MedicalFee;
import com.medical.portfolio.repository.HospitalRepository;
import com.medical.portfolio.repository.MedicalFeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class HiraApiService {

    @Value("${hira.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://apis.data.go.kr/B551182/nonPaymentDamtInfoService";
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final MedicalFeeService medicalFeeService;
    private final HospitalRepository hospitalRepository;
    private final MedicalFeeRepository medicalFeeRepository;

    /**
     * 비급여 항목으로 병원 목록 조회 (상세 목록 API 사용)
     * 공공 API 실패 시 로컬 데이터베이스 사용
     */
    public List<MedicalFeeResponse> searchByItemName(String itemName) {
        try {
            String url = BASE_URL + "/getNonPaymentItemHospDtlList"
                    + "?serviceKey=" + apiKey
                    + "&npayKorNm=" + URLEncoder.encode(itemName, StandardCharsets.UTF_8.toString())
                    + "&pageNo=1"
                    + "&numOfRows=1000"
                    + "&_type=json";

            log.info("HIRA API 호출 (항목명): {}", itemName);
            log.debug("API URL: {}", url.replace(apiKey, "***"));
            String response = restTemplate.getForObject(url, String.class);
            log.debug("API 응답: {}", response != null ? response.substring(0, Math.min(500, response.length())) : "null");
            List<MedicalFeeResponse> results = parseJsonResponse(response);

            // 클라이언트 측 필터링: 유연한 검색
            final String searchTerm = itemName;
            List<MedicalFeeResponse> filteredResults = results.stream()
                    .filter(r -> matchesSearchTerm(r.getItemName(), searchTerm))
                    .toList();

            log.info("필터링 결과: 전체 {}건 중 {}건 일치", results.size(), filteredResults.size());

            if (!filteredResults.isEmpty()) {
                return filteredResults;
            }
        } catch (HttpClientErrorException e) {
            log.warn("HIRA API 인증 실패 ({}), 로컬 데이터베이스 사용", e.getStatusCode());
        } catch (Exception e) {
            log.error("HIRA API 호출 실패 (항목명 검색): {}", e.getMessage());
        }

        // 공공 API 실패 시 로컬 데이터베이스 검색
        log.info("로컬 데이터베이스에서 검색: {}", itemName);
        return medicalFeeService.searchByItemName(itemName);
    }

    /**
     * 병원명으로 비급여 진료비 조회 (상세 목록 API 사용)
     * 공공 API 실패 시 로컬 데이터베이스 사용
     */
    public List<MedicalFeeResponse> searchByHospitalName(String hospitalName) {
        try {
            // 1차: 병원명 파라미터로 직접 검색
            String url = BASE_URL + "/getNonPaymentItemHospDtlList"
                    + "?serviceKey=" + apiKey
                    + "&yadmNm=" + URLEncoder.encode(hospitalName, StandardCharsets.UTF_8.toString())
                    + "&pageNo=1"
                    + "&numOfRows=100"
                    + "&_type=json";

            log.info("HIRA API 호출 (병원명): {}", hospitalName);
            String response = restTemplate.getForObject(url, String.class);
            List<MedicalFeeResponse> results = parseJsonResponse(response);

            if (!results.isEmpty()) {
                log.info("API 직접 검색 결과: {}건", results.size());
                return results;
            }

            // 2차: 직접 검색 결과가 없으면, 전체 데이터에서 병원명 필터링
            log.info("직접 검색 결과 없음, 전체 데이터에서 필터링 시도: {}", hospitalName);
            List<MedicalFeeResponse> allResults = new ArrayList<>();

            // 여러 페이지에서 데이터 수집 후 필터링
            for (int page = 1; page <= 5; page++) {
                String broadUrl = BASE_URL + "/getNonPaymentItemHospDtlList"
                        + "?serviceKey=" + apiKey
                        + "&pageNo=" + page
                        + "&numOfRows=1000"
                        + "&_type=json";

                String broadResponse = restTemplate.getForObject(broadUrl, String.class);
                List<MedicalFeeResponse> pageResults = parseJsonResponse(broadResponse);

                if (pageResults.isEmpty()) break;

                // 병원명 필터링
                final String searchTerm = hospitalName.toLowerCase();
                List<MedicalFeeResponse> filtered = pageResults.stream()
                        .filter(r -> r.getHospitalName() != null &&
                                     r.getHospitalName().toLowerCase().contains(searchTerm))
                        .toList();

                allResults.addAll(filtered);

                // 충분한 결과가 있으면 중단
                if (allResults.size() >= 100) break;
            }

            if (!allResults.isEmpty()) {
                log.info("필터링 검색 결과: {}건", allResults.size());
                return allResults;
            }

        } catch (HttpClientErrorException e) {
            log.warn("HIRA API 인증 실패 ({}), 로컬 데이터베이스 사용", e.getStatusCode());
        } catch (Exception e) {
            log.error("HIRA API 호출 실패 (병원명 검색): {}", e.getMessage());
        }

        // 공공 API 실패 시 로컬 데이터베이스 검색
        log.info("로컬 데이터베이스에서 검색: {}", hospitalName);
        return medicalFeeService.searchByHospitalName(hospitalName);
    }

    private List<MedicalFeeResponse> parseJsonResponse(String response) {
        List<MedicalFeeResponse> results = new ArrayList<>();

        if (response == null || response.isEmpty()) {
            return results;
        }

        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode body = root.path("response").path("body");
            JsonNode items = body.path("items").path("item");

            // 단일 항목일 경우 배열이 아닐 수 있음
            if (items.isArray()) {
                for (JsonNode item : items) {
                    MedicalFeeResponse fee = parseItem(item);
                    if (fee != null) {
                        results.add(fee);
                    }
                }
            } else if (!items.isMissingNode()) {
                MedicalFeeResponse fee = parseItem(items);
                if (fee != null) {
                    results.add(fee);
                }
            }

            log.info("HIRA API 파싱 완료: {}건", results.size());
        } catch (Exception e) {
            log.error("JSON 파싱 실패: {}", e.getMessage());
        }

        return results;
    }

    /**
     * 유연한 검색어 매칭
     * - 정확히 포함되면 true
     * - 검색어에서 "수술", "치료", "검사" 등을 제거한 키워드로도 검색
     * - 검색어를 2글자씩 분리하여 일부라도 포함되면 true
     */
    private boolean matchesSearchTerm(String itemName, String searchTerm) {
        if (searchTerm == null || searchTerm.isEmpty()) {
            return true;
        }
        if (itemName == null || itemName.isEmpty()) {
            return false;
        }

        String lowerItem = itemName.toLowerCase();
        String lowerSearch = searchTerm.toLowerCase();

        // 1. 정확히 포함되면 true
        if (lowerItem.contains(lowerSearch)) {
            return true;
        }

        // 2. 검색어에서 공통 접미사 제거 후 검색
        String[] suffixes = {"수술", "치료", "검사", "료", "술"};
        String baseSearch = lowerSearch;
        for (String suffix : suffixes) {
            if (baseSearch.endsWith(suffix)) {
                baseSearch = baseSearch.substring(0, baseSearch.length() - suffix.length());
                break;
            }
        }
        if (!baseSearch.isEmpty() && lowerItem.contains(baseSearch)) {
            return true;
        }

        // 3. 검색어를 분리하여 부분 매칭 (예: "스마일라식" -> "스마일", "라식")
        // 한글 키워드 분리
        if (lowerSearch.contains("라식") && lowerItem.contains("라식")) {
            return true;
        }
        if (lowerSearch.contains("라섹") && lowerItem.contains("라섹")) {
            return true;
        }
        if (lowerSearch.contains("스마일") && lowerItem.contains("스마일")) {
            return true;
        }
        if (lowerSearch.contains("렌즈") && lowerItem.contains("렌즈")) {
            return true;
        }
        if (lowerSearch.contains("임플란트") && lowerItem.contains("임플란트")) {
            return true;
        }
        if (lowerSearch.contains("도수") && lowerItem.contains("도수")) {
            return true;
        }
        if (lowerSearch.contains("충격파") && lowerItem.contains("충격파")) {
            return true;
        }

        return false;
    }

    private MedicalFeeResponse parseItem(JsonNode item) {
        try {
            String hospitalName = item.path("yadmNm").asText("");
            String hospitalType = item.path("clCdNm").asText("");
            String hospitalAddress = item.path("addr").asText("");
            String itemName = item.path("npayKorNm").asText("");

            // 금액 파싱 (curAmt 필드)
            Integer price = null;
            JsonNode amtNode = item.path("curAmt");
            if (!amtNode.isMissingNode() && !amtNode.asText().isEmpty()) {
                try {
                    price = Integer.parseInt(amtNode.asText().replaceAll("[^0-9]", ""));
                } catch (NumberFormatException e) {
                    log.debug("금액 파싱 실패: {}", amtNode.asText());
                }
            }

            return MedicalFeeResponse.builder()
                    .hospitalName(hospitalName)
                    .hospitalType(hospitalType)
                    .hospitalAddress(hospitalAddress)
                    .itemName(itemName)
                    .minPrice(price)
                    .maxPrice(price)
                    .isCovered(false)  // 비급여 항목
                    .build();
        } catch (Exception e) {
            log.error("항목 파싱 실패: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 병원명 + 항목명으로 검색 (상세 목록 API 사용)
     * 공공 API 실패 시 로컬 데이터베이스 사용
     */
    public List<MedicalFeeResponse> searchByHospitalAndItem(String hospitalName, String itemName) {
        List<MedicalFeeResponse> allResults = new ArrayList<>();

        try {
            // 여러 페이지에서 데이터 수집 (최대 5페이지)
            for (int page = 1; page <= 5; page++) {
                StringBuilder urlBuilder = new StringBuilder(BASE_URL + "/getNonPaymentItemHospDtlList");
                urlBuilder.append("?serviceKey=").append(apiKey);

                if (hospitalName != null && !hospitalName.isEmpty()) {
                    urlBuilder.append("&yadmNm=").append(URLEncoder.encode(hospitalName, StandardCharsets.UTF_8.toString()));
                }
                if (itemName != null && !itemName.isEmpty()) {
                    urlBuilder.append("&npayKorNm=").append(URLEncoder.encode(itemName, StandardCharsets.UTF_8.toString()));
                }
                urlBuilder.append("&pageNo=").append(page).append("&numOfRows=1000&_type=json");

                log.info("HIRA API 호출 (복합검색) - 페이지: {}, 병원: {}, 항목: {}", page, hospitalName, itemName);
                String response = restTemplate.getForObject(urlBuilder.toString(), String.class);

                List<MedicalFeeResponse> pageResults = parseJsonResponse(response);
                if (pageResults.isEmpty()) {
                    break; // 더 이상 데이터 없음
                }
                allResults.addAll(pageResults);

                // 1000건 미만이면 마지막 페이지
                if (pageResults.size() < 1000) {
                    break;
                }
            }

            log.info("HIRA API 전체 수집: {}건", allResults.size());

            // 클라이언트 측 필터링 (유연한 검색)
            final String searchItemName = itemName;
            final String searchHospitalName = hospitalName;

            List<MedicalFeeResponse> filteredResults = allResults.stream()
                    .filter(r -> {
                        boolean itemMatch = matchesSearchTerm(r.getItemName(), searchItemName);
                        boolean hospitalMatch = searchHospitalName == null || searchHospitalName.isEmpty()
                                || (r.getHospitalName() != null && r.getHospitalName().contains(searchHospitalName));
                        return itemMatch && hospitalMatch;
                    })
                    .toList();

            log.info("필터링 결과: 전체 {}건 중 {}건 일치", allResults.size(), filteredResults.size());

            if (!filteredResults.isEmpty()) {
                return filteredResults;
            }
        } catch (HttpClientErrorException e) {
            log.warn("HIRA API 인증 실패 ({}), 로컬 데이터베이스 사용", e.getStatusCode());
        } catch (Exception e) {
            log.error("HIRA API 호출 실패 (복합 검색): {}", e.getMessage());
        }

        // 공공 API에서 결과가 없으면 로컬 데이터베이스 검색
        log.info("로컬 데이터베이스에서 검색 - 병원: {}, 항목: {}", hospitalName, itemName);

        // 항목명이 있으면 항목명으로 검색, 없으면 병원명으로 검색
        if (itemName != null && !itemName.isEmpty()) {
            return medicalFeeService.searchByItemName(itemName);
        } else if (hospitalName != null && !hospitalName.isEmpty()) {
            return medicalFeeService.searchByHospitalName(hospitalName);
        }

        return medicalFeeService.findAll();
    }

    /**
     * 공공 API에서 전체 데이터를 수집하여 로컬 DB에 저장
     * @return 수집된 데이터 건수
     */
    @Transactional
    public int syncAllDataFromApi() {
        log.info("=== 공공 API 전체 데이터 동기화 시작 ===");
        List<MedicalFeeResponse> allData = new ArrayList<>();

        try {
            // 첫 번째 요청으로 totalCount 확인
            String firstUrl = BASE_URL + "/getNonPaymentItemHospDtlList"
                    + "?serviceKey=" + apiKey
                    + "&pageNo=1&numOfRows=1&_type=json";

            String firstResponse = restTemplate.getForObject(firstUrl, String.class);
            int totalCount = getTotalCount(firstResponse);
            log.info("전체 데이터 건수: {}", totalCount);

            if (totalCount == 0) {
                log.warn("수집할 데이터가 없습니다.");
                return 0;
            }

            // 페이지 수 계산 (한 페이지당 1000건)
            int numOfRows = 1000;
            int totalPages = (int) Math.ceil((double) totalCount / numOfRows);
            log.info("총 페이지 수: {}", totalPages);

            // 모든 페이지에서 데이터 수집
            for (int page = 1; page <= totalPages; page++) {
                try {
                    String url = BASE_URL + "/getNonPaymentItemHospDtlList"
                            + "?serviceKey=" + apiKey
                            + "&pageNo=" + page
                            + "&numOfRows=" + numOfRows
                            + "&_type=json";

                    log.info("페이지 {}/{} 수집 중...", page, totalPages);
                    String response = restTemplate.getForObject(url, String.class);
                    List<MedicalFeeResponse> pageData = parseJsonResponse(response);
                    allData.addAll(pageData);

                    // API 호출 간 딜레이 (서버 부하 방지)
                    Thread.sleep(100);

                } catch (Exception e) {
                    log.error("페이지 {} 수집 실패: {}", page, e.getMessage());
                }
            }

            log.info("총 수집 데이터: {}건", allData.size());

            // 로컬 DB에 저장
            int savedCount = saveToLocalDb(allData);
            log.info("=== 공공 API 전체 데이터 동기화 완료: {}건 저장 ===", savedCount);

            return savedCount;

        } catch (Exception e) {
            log.error("데이터 동기화 실패: {}", e.getMessage());
            return 0;
        }
    }

    /**
     * API 응답에서 totalCount 추출
     */
    private int getTotalCount(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode totalCount = root.path("response").path("body").path("totalCount");
            return totalCount.asInt(0);
        } catch (Exception e) {
            log.error("totalCount 파싱 실패: {}", e.getMessage());
            return 0;
        }
    }

    /**
     * 수집한 데이터를 로컬 DB에 저장
     */
    @Transactional
    protected int saveToLocalDb(List<MedicalFeeResponse> dataList) {
        // 병원 캐시 (이름 -> Hospital)
        Map<String, Hospital> hospitalCache = new HashMap<>();
        int savedCount = 0;

        for (MedicalFeeResponse data : dataList) {
            try {
                // 병원 조회 또는 생성
                String hospitalName = data.getHospitalName();
                if (hospitalName == null || hospitalName.isEmpty()) {
                    continue;
                }

                Hospital hospital = hospitalCache.get(hospitalName);
                if (hospital == null) {
                    hospital = hospitalRepository.findByName(hospitalName)
                            .orElseGet(() -> hospitalRepository.save(Hospital.builder()
                                    .name(hospitalName)
                                    .type(data.getHospitalType() != null ? data.getHospitalType() : "미상")
                                    .address(data.getHospitalAddress() != null ? data.getHospitalAddress() : "")
                                    .region(extractRegion(data.getHospitalAddress()))
                                    .build()));
                    hospitalCache.put(hospitalName, hospital);
                }

                // 비급여 진료비 저장 (중복 체크)
                String itemName = data.getItemName();
                if (itemName == null || itemName.isEmpty()) {
                    continue;
                }

                boolean exists = medicalFeeRepository.existsByHospitalAndItemName(hospital, itemName);
                if (!exists) {
                    medicalFeeRepository.save(MedicalFee.builder()
                            .hospital(hospital)
                            .category(extractCategory(itemName))
                            .itemName(itemName)
                            .minPrice(data.getMinPrice())
                            .maxPrice(data.getMaxPrice())
                            .isCovered(false)
                            .build());
                    savedCount++;
                }

            } catch (Exception e) {
                log.debug("데이터 저장 실패: {}", e.getMessage());
            }
        }

        return savedCount;
    }

    /**
     * 주소에서 지역 추출
     */
    private String extractRegion(String address) {
        if (address == null || address.isEmpty()) {
            return "미상";
        }
        String[] parts = address.split(" ");
        if (parts.length > 0) {
            String region = parts[0];
            if (region.endsWith("시") || region.endsWith("도")) {
                return region;
            }
        }
        return "미상";
    }

    /**
     * 항목명에서 카테고리 추출
     */
    private String extractCategory(String itemName) {
        if (itemName == null) return "기타";

        if (itemName.contains("MRI") || itemName.contains("자기공명")) return "MRI";
        if (itemName.contains("CT") || itemName.contains("컴퓨터단층")) return "CT";
        if (itemName.contains("초음파")) return "초음파";
        if (itemName.contains("내시경")) return "내시경";
        if (itemName.contains("주사")) return "주사료";
        if (itemName.contains("도수") || itemName.contains("물리") || itemName.contains("재활")) return "이학요법료";
        if (itemName.contains("라식") || itemName.contains("라섹") || itemName.contains("시력")) return "시력교정술료";
        if (itemName.contains("치아") || itemName.contains("임플란트") || itemName.contains("교정")) return "치과";
        if (itemName.contains("예방접종") || itemName.contains("백신")) return "예방접종료";
        if (itemName.contains("상급병실")) return "상급병실료";
        if (itemName.contains("검사")) return "검사료";
        if (itemName.contains("수술")) return "수술료";

        return "기타";
    }
}