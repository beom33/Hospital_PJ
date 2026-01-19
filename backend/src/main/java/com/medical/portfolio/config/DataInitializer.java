package com.medical.portfolio.config;

import com.medical.portfolio.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AuthService authService;

    @Override
    public void run(String... args) throws Exception {
        // 테스트용 사용자 생성
        authService.registerTestUser();
        System.out.println("=".repeat(50));
        System.out.println("테스트 계정이 생성되었습니다:");
        System.out.println("아이디: admin");
        System.out.println("비밀번호: admin123");
        System.out.println("=".repeat(50));
    }
}
