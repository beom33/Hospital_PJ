package com.medical.portfolio.service;

import com.medical.portfolio.dto.LoginRequest;
import com.medical.portfolio.dto.LoginResponse;
import com.medical.portfolio.dto.RegisterRequest;
import com.medical.portfolio.dto.RegisterResponse;
import com.medical.portfolio.entity.User;
import com.medical.portfolio.repository.EmailVerificationRepository;
import com.medical.portfolio.repository.UserRepository;
import com.medical.portfolio.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailVerificationRepository emailVerificationRepository;

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
                user.getNickname(),
                user.getProfileImage(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        // 이메일 인증 확인
        boolean verified = emailVerificationRepository
                .findTopByEmailOrderByExpiresAtDesc(request.getEmail())
                .map(v -> v.isVerified())
                .orElse(false);
        if (!verified) {
            throw new RuntimeException("이메일 인증이 완료되지 않았습니다.");
        }


        String role = "USER";
        if (request.getRole() != null && request.getRole().equals("ADMIN")) {
            role = "ADMIN";
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .name(request.getName())
                .nickname(request.getNickname())
                .role(role)
                .build();

        userRepository.save(user);

        // 인증 레코드 삭제
        emailVerificationRepository.deleteByEmail(request.getEmail());

        return new RegisterResponse("회원가입이 완료되었습니다.", user.getUsername());
    }

    // 비밀번호 변경 (로그인된 사용자)
    @Transactional
    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 올바르지 않습니다.");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // 내 정보 조회
    public User getMyInfo(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    // 내 정보 수정 (이름, 이메일)
    @Transactional
    public void updateMyInfo(String username, String name, String email) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        user.setName(name);
        user.setEmail(email);
        userRepository.save(user);
    }

    // 프로필 수정 (닉네임)
    @Transactional
    public void updateNickname(String username, String nickname) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        user.setNickname(nickname);
        userRepository.save(user);
    }

    // 현재 프로필 이미지 파일명 조회
    public String getProfileImage(String username) {
        return userRepository.findByUsername(username)
                .map(User::getProfileImage)
                .orElse(null);
    }

    // 프로필 이미지 수정
    @Transactional
    public void updateProfileImage(String username, String filename) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        user.setProfileImage(filename);
        userRepository.save(user);
    }

    // 회원탈퇴
    @Transactional
    public String deleteUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        String profileImage = user.getProfileImage();
        userRepository.delete(user);
        return profileImage; // 컨트롤러에서 파일 삭제용
    }

    // 아이디 찾기: 이름 + 이메일로 아이디 반환
    public String findUsername(String name, String email) {
        User user = userRepository.findFirstByNameAndEmail(name, email)
                .orElseThrow(() -> new RuntimeException("일치하는 회원 정보가 없습니다."));
        String username = user.getUsername();
        // 아이디 마스킹: 앞 2자리만 보여주고 나머지는 *
        if (username.length() <= 2) return username;
        return username.substring(0, 2) + "*".repeat(username.length() - 2);
    }

    // 비밀번호 찾기: 아이디 + 이메일로 임시 비밀번호 발급 및 이메일 발송
    @Transactional
    public String resetPassword(String username, String email) {
        User user = userRepository.findFirstByUsernameAndEmail(username, email)
                .orElseThrow(() -> new RuntimeException("일치하는 회원 정보가 없습니다."));
        // 임시 비밀번호 생성 (8자리)
        String tempPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);
        return tempPassword;
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
