package com.medical.portfolio.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/drugs")
public class DrugController {

    @Value("${mfds.api.key:}")
    private String mfdsApiKey;

    // 복약정보 검색 (효능, 사용법, 주의사항, 부작용)
    @GetMapping("/search")
    public ResponseEntity<String> searchDrug(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String encodedKeyword = URLEncoder.encode(keyword, StandardCharsets.UTF_8);
            String url = "http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList"
                    + "?serviceKey=" + mfdsApiKey
                    + "&itemName=" + encodedKeyword
                    + "&pageNo=" + page
                    + "&numOfRows=" + size
                    + "&type=json";

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json; charset=UTF-8")
                    .body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    // 허가정보 검색 (마약류 분류 포함)
    @GetMapping("/permit")
    public ResponseEntity<String> searchPermit(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String encodedKeyword = URLEncoder.encode(keyword, StandardCharsets.UTF_8);
            String url = "http://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService04/getDrugPrdtPrmsnDtlInq04"
                    + "?serviceKey=" + mfdsApiKey
                    + "&item_name=" + encodedKeyword
                    + "&pageNo=" + page
                    + "&numOfRows=" + size
                    + "&type=json";

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json; charset=UTF-8")
                    .body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
