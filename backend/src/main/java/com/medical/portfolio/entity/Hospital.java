package com.medical.portfolio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hospitals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;  // 병원명

    @Column(nullable = false)
    private String type;  // 의료기관 규모 (상급종합, 종합병원, 병원, 의원 등)

    private String address;  // 주소

    private String region;  // 지역 (서울, 경기 등)

    private String phone;  // 전화번호

    private String website;  // 홈페이지
}
