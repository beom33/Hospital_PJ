package com.medical.portfolio.repository;

import com.medical.portfolio.entity.Hospital;
import com.medical.portfolio.entity.MedicalFee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalFeeRepository extends JpaRepository<MedicalFee, Long> {

    // 병원과 항목명으로 중복 체크
    boolean existsByHospitalAndItemName(Hospital hospital, String itemName);

    // 병원 ID로 조회
    List<MedicalFee> findByHospitalId(Long hospitalId);

    // 카테고리로 조회
    List<MedicalFee> findByCategory(String category);

    // 항목명으로 검색 (부분 일치)
    List<MedicalFee> findByItemNameContaining(String itemName);

    // 병원명으로 비급여 항목 검색
    @Query("SELECT mf FROM MedicalFee mf JOIN mf.hospital h WHERE h.name LIKE %:hospitalName%")
    List<MedicalFee> findByHospitalNameContaining(@Param("hospitalName") String hospitalName);

    // 병원명과 항목명으로 검색
    @Query("SELECT mf FROM MedicalFee mf JOIN mf.hospital h WHERE " +
           "(h.name LIKE %:hospitalName% OR :hospitalName IS NULL OR :hospitalName = '') AND " +
           "(mf.itemName LIKE %:itemName% OR mf.category LIKE %:itemName% OR :itemName IS NULL OR :itemName = '')")
    List<MedicalFee> searchByHospitalAndItem(
            @Param("hospitalName") String hospitalName,
            @Param("itemName") String itemName);

    // 급여/비급여 여부로 조회
    List<MedicalFee> findByIsCovered(Boolean isCovered);

    // 카테고리와 급여 여부로 조회
    List<MedicalFee> findByCategoryAndIsCovered(String category, Boolean isCovered);
}
