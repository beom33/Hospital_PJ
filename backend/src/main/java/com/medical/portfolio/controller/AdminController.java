package com.medical.portfolio.controller;

import com.medical.portfolio.entity.User;
import com.medical.portfolio.repository.UserRepository;
import com.medical.portfolio.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    // 회원 목록 조회
    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = users.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("username", u.getUsername());
            map.put("name", u.getName() != null ? u.getName() : "");
            map.put("nickname", u.getNickname() != null ? u.getNickname() : "");
            map.put("email", u.getEmail() != null ? u.getEmail() : "");
            map.put("role", u.getRole());
            map.put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : "");
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // 강제 탈퇴
    @DeleteMapping("/users/{username}")
    public ResponseEntity<?> forceDeleteUser(@PathVariable String username) {
        try {
            String profileImage = authService.deleteUser(username);
            if (profileImage != null && !profileImage.isBlank()) {
                File oldFile = new File(uploadDir, profileImage);
                if (oldFile.exists()) oldFile.delete();
            }
            return ResponseEntity.ok("회원이 강제 탈퇴되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
