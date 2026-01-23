package com.medical.portfolio.service;

import com.medical.portfolio.dto.MedicalFeeResponse;
import com.medical.portfolio.dto.MedicalFeeSearchRequest;
import com.medical.portfolio.entity.MedicalFee;
import com.medical.portfolio.repository.MedicalFeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MedicalFeeService {

    private final MedicalFeeRepository medicalFeeRepository;

    // 검색 조건으로 비급여 진료비 조회
    public List<MedicalFeeResponse> search(MedicalFeeSearchRequest request) {
        List<MedicalFee> results;

        String hospitalName = request.getHospitalName();
        String itemName = request.getItemName();

        // 병원명 또는 항목명으로 검색
        if ((hospitalName != null && !hospitalName.isEmpty()) ||
            (itemName != null && !itemName.isEmpty())) {
            results = medicalFeeRepository.searchByHospitalAndItem(
                    hospitalName != null ? hospitalName : "",
                    itemName != null ? itemName : ""
            );
        } else {
            results = medicalFeeRepository.findAll();
        }

        return results.stream()
                .map(MedicalFeeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 병원명으로 검색
    public List<MedicalFeeResponse> searchByHospitalName(String hospitalName) {
        List<MedicalFee> results = medicalFeeRepository.findByHospitalNameContaining(hospitalName);
        return results.stream()
                .map(MedicalFeeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 항목명으로 검색
    public List<MedicalFeeResponse> searchByItemName(String itemName) {
        List<MedicalFee> results = medicalFeeRepository.findByItemNameContaining(itemName);
        return results.stream()
                .map(MedicalFeeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 카테고리로 검색
    public List<MedicalFeeResponse> searchByCategory(String category) {
        List<MedicalFee> results = medicalFeeRepository.findByCategory(category);
        return results.stream()
                .map(MedicalFeeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 전체 목록 조회
    public List<MedicalFeeResponse> findAll() {
        return medicalFeeRepository.findAll().stream()
                .map(MedicalFeeResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
