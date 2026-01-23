package com.medical.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalFeeSearchRequest {
    private String hospitalName;  // 병원명
    private String itemName;      // 항목명
    private String category;      // 카테고리
    private Boolean isCovered;    // 급여 여부
}
