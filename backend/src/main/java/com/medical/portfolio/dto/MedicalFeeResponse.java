package com.medical.portfolio.dto;

import com.medical.portfolio.entity.MedicalFee;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalFeeResponse {
    private Long id;
    private String hospitalName;   // 병원명
    private String hospitalType;   // 의료기관 규모
    private String hospitalAddress;// 주소
    private String category;       // 중분류
    private String subCategory;    // 소분류
    private String itemName;       // 항목명
    private Integer minPrice;      // 최소금액
    private Integer maxPrice;      // 최대금액
    private String note;           // 특이사항
    private Boolean isCovered;     // 급여 여부

    public static MedicalFeeResponse fromEntity(MedicalFee medicalFee) {
        return MedicalFeeResponse.builder()
                .id(medicalFee.getId())
                .hospitalName(medicalFee.getHospital().getName())
                .hospitalType(medicalFee.getHospital().getType())
                .hospitalAddress(medicalFee.getHospital().getAddress())
                .category(medicalFee.getCategory())
                .subCategory(medicalFee.getSubCategory())
                .itemName(medicalFee.getItemName())
                .minPrice(medicalFee.getMinPrice())
                .maxPrice(medicalFee.getMaxPrice())
                .note(medicalFee.getNote())
                .isCovered(medicalFee.getIsCovered())
                .build();
    }
}
