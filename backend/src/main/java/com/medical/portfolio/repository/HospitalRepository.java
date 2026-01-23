package com.medical.portfolio.repository;

import com.medical.portfolio.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    // 병원명으로 정확히 조회
    Optional<Hospital> findByName(String name);

    // 병원명으로 검색 (부분 일치)
    List<Hospital> findByNameContaining(String name);

    // 주소로 검색 (부분 일치)
    List<Hospital> findByAddressContaining(String address);

    // 병원명 또는 주소로 검색
    @Query("SELECT h FROM Hospital h WHERE h.name LIKE %:keyword% OR h.address LIKE %:keyword%")
    List<Hospital> searchByKeyword(@Param("keyword") String keyword);

    // 지역으로 검색
    List<Hospital> findByRegion(String region);

    // 의료기관 규모로 검색
    List<Hospital> findByType(String type);
}
