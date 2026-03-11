package com.medical.portfolio.service;

import com.medical.portfolio.entity.EmailVerification;
import com.medical.portfolio.repository.EmailVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailVerificationRepository emailVerificationRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Transactional
    public void sendVerificationEmail(String email) {
        // 기존 인증 코드 삭제
        emailVerificationRepository.deleteByEmail(email);

        // 6자리 랜덤 코드 생성
        String code = String.format("%06d", new Random().nextInt(1000000));

        // DB에 저장 (5분 유효)
        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();
        emailVerificationRepository.save(verification);

        // 이메일 발송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("[Medi-best] 이메일 인증 코드");
        message.setText("안녕하세요! Medi-best입니다.\n\n" +
                "이메일 인증 코드: " + code + "\n\n" +
                "이 코드는 5분간 유효합니다.\n" +
                "본인이 요청하지 않은 경우 이 메일을 무시하세요.");
        mailSender.send(message);
    }

    @Transactional
    public boolean verifyCode(String email, String code) {
        EmailVerification verification = emailVerificationRepository
                .findByEmailAndCode(email, code)
                .orElseThrow(() -> new RuntimeException("인증 코드가 올바르지 않습니다."));

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            emailVerificationRepository.deleteByEmail(email);
            throw new RuntimeException("인증 코드가 만료되었습니다. 다시 발송해주세요.");
        }

        // 인증 완료 표시
        verification.setVerified(true);
        emailVerificationRepository.save(verification);
        return true;
    }

    public void sendTempPassword(String email, String username, String tempPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("[Medi-best] 임시 비밀번호 안내");
        message.setText("안녕하세요! Medi-best입니다.\n\n" +
                "아이디: " + username + "\n" +
                "임시 비밀번호: " + tempPassword + "\n\n" +
                "로그인 후 반드시 비밀번호를 변경해주세요.");
        mailSender.send(message);
    }

    public boolean isEmailVerified(String email) {
        return emailVerificationRepository
                .findTopByEmailOrderByExpiresAtDesc(email)
                .map(EmailVerification::isVerified)
                .orElse(false);
    }
}
