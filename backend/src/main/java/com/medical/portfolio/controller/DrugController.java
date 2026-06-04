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

    private ResponseEntity<String> callApi(String url) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            String body = response.getBody();
            if (body != null && body.trim().startsWith("<")) {
                return ResponseEntity.status(502)
                        .body("{\"body\":{\"items\":[]},\"xmlError\":true}");
            }
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json; charset=UTF-8")
                    .body(body);
        } catch (Exception e) {
            return ResponseEntity.status(502)
                    .body("{\"body\":{\"items\":[]},\"error\":\"API 호출 실패\"}");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<String> searchDrug(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        String encodedKeyword = URLEncoder.encode(keyword, StandardCharsets.UTF_8);
        String url = "https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList"
                + "?serviceKey=" + mfdsApiKey
                + "&itemName=" + encodedKeyword
                + "&pageNo=" + page
                + "&numOfRows=" + size
                + "&type=json";
        return callApi(url);
    }

    @GetMapping("/permit")
    public ResponseEntity<String> searchPermit(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        String encodedKeyword = URLEncoder.encode(keyword, StandardCharsets.UTF_8);
        String url = "https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService07/getDrugPrdtPrmsnDtlInq06"
                + "?serviceKey=" + mfdsApiKey
                + "&item_name=" + encodedKeyword
                + "&pageNo=" + page
                + "&numOfRows=" + size
                + "&type=json";
        return callApi(url);
    }
}
