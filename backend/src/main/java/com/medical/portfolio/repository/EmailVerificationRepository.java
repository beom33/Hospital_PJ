package com.medical.portfolio.repository;

import com.medical.portfolio.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    Optional<EmailVerification> findByEmailAndCode(String email, String code);
    Optional<EmailVerification> findTopByEmailOrderByExpiresAtDesc(String email);
    void deleteByEmail(String email);
}
