package com.medical.portfolio.service;

import com.medical.portfolio.dto.LoginRequest;
import com.medical.portfolio.dto.LoginResponse;
import com.medical.portfolio.entity.User;
import com.medical.portfolio.repository.UserRepository;
import com.medical.portfolio.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public LoginResponse login(LoginRequest loginRequest) {
        // 사용자 찾기
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다."));

        // 비밀번호 확인
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        // JWT 토큰 생성
        String token = jwtUtil.generateToken(user.getUsername());

        // 응답 생성
        return new LoginResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Transactional
    public User registerTestUser() {
        // 테스트용 사용자 생성 (이미 존재하면 반환)
        if (userRepository.existsByUsername("admin")) {
            return userRepository.findByUsername("admin").get();
        }

        User user = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .email("admin@medical.com")
                .name("관리자")
                .role("ADMIN")
                .build();

        return userRepository.save(user);
    }
}
