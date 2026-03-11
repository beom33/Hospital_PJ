package com.medical.portfolio.controller;

import com.medical.portfolio.dto.LoginRequest;
import com.medical.portfolio.dto.LoginResponse;
import com.medical.portfolio.dto.RegisterRequest;
import com.medical.portfolio.dto.RegisterResponse;
import com.medical.portfolio.service.AuthService;
import com.medical.portfolio.service.EmailService;
import com.medical.portfolio.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            RegisterResponse response = authService.register(registerRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerification(@RequestBody Map<String, String> body) {
        try {
            emailService.sendVerificationEmail(body.get("email"));
            return ResponseEntity.ok("인증 코드가 발송되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> body) {
        try {
            emailService.verifyCode(body.get("email"), body.get("code"));
            return ResponseEntity.ok("이메일 인증이 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body,
                                             jakarta.servlet.http.HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }
            String token = authHeader.substring(7);
            String username = jwtUtil.getUsernameFromToken(token);
            authService.changePassword(username, body.get("currentPassword"), body.get("newPassword"));
            return ResponseEntity.ok("비밀번호가 변경되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/mypage")
    public ResponseEntity<?> getMyInfo(jakarta.servlet.http.HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            String username = jwtUtil.getUsernameFromToken(token);
            var user = authService.getMyInfo(username);
            return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "name", user.getName() != null ? user.getName() : "",
                "nickname", user.getNickname() != null ? user.getNickname() : "",
                "email", user.getEmail() != null ? user.getEmail() : "",
                "role", user.getRole()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/mypage")
    public ResponseEntity<?> updateMyInfo(@RequestBody Map<String, String> body,
                                           jakarta.servlet.http.HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            String username = jwtUtil.getUsernameFromToken(token);
            authService.updateMyInfo(username, body.get("name"), body.get("email"), body.get("nickname"));
            return ResponseEntity.ok("회원정보가 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/find-username")
    public ResponseEntity<?> findUsername(@RequestBody Map<String, String> body) {
        try {
            String maskedUsername = authService.findUsername(body.get("name"), body.get("email"));
            return ResponseEntity.ok(maskedUsername);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        try {
            String tempPassword = authService.resetPassword(body.get("username"), body.get("email"));
            emailService.sendTempPassword(body.get("email"), body.get("username"), tempPassword);
            return ResponseEntity.ok("임시 비밀번호가 이메일로 발송되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Server is running!");
    }
}
