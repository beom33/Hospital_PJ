package com.medical.portfolio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "medical_fees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Column(nullable = false)
    private String category;  // 중분류 (예: 이학요법료, 예방접종료, MRI 등)

    private String subCategory;  // 소분류

    @Column(nullable = false)
    private String itemName;  // 항목명 (예: 도수치료, 대상포진 등)

    @Column(nullable = false)
    private Integer minPrice;  // 최소금액

    @Column(nullable = false)
    private Integer maxPrice;  // 최대금액

    private String note;  // 특이사항

    private Boolean isCovered;  // 급여 여부 (true: 급여, false: 비급여)
}
