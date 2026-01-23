package com.medical.portfolio.controller;

import com.medical.portfolio.dto.MedicalFeeResponse;
import com.medical.portfolio.dto.MedicalFeeSearchRequest;
import com.medical.portfolio.service.HiraApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-fees")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicalFeeController {

    private final HiraApiService hiraApiService;

    // 검색 조건으로 비급여 진료비 조회 (공공 API)
    @PostMapping("/search")
    public ResponseEntity<List<MedicalFeeResponse>> search(@RequestBody MedicalFeeSearchRequest request) {
        List<MedicalFeeResponse> results = hiraApiService.searchByHospitalAndItem(
                request.getHospitalName(),
                request.getItemName()
        );
        return ResponseEntity.ok(results);
    }

    // 병원명으로 검색 (공공 API)
    @GetMapping("/hospital")
    public ResponseEntity<List<MedicalFeeResponse>> searchByHospital(@RequestParam String name) {
        List<MedicalFeeResponse> results = hiraApiService.searchByHospitalName(name);
        return ResponseEntity.ok(results);
    }

    // 항목명으로 검색 (공공 API)
    @GetMapping("/item")
    public ResponseEntity<List<MedicalFeeResponse>> searchByItem(@RequestParam String name) {
        List<MedicalFeeResponse> results = hiraApiService.searchByItemName(name);
        return ResponseEntity.ok(results);
    }

    // 공공 API 전체 데이터 동기화
    @PostMapping("/sync")
    public ResponseEntity<String> syncData() {
        int count = hiraApiService.syncAllDataFromApi();
        return ResponseEntity.ok("동기화 완료: " + count + "건 저장됨");
    }
}
