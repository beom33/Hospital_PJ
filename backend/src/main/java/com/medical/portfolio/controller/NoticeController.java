package com.medical.portfolio.controller;

import com.medical.portfolio.dto.NoticeRequest;
import com.medical.portfolio.dto.NoticeResponse;
import com.medical.portfolio.entity.User;
import com.medical.portfolio.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NoticeController {

    private final NoticeService noticeService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @GetMapping
    public ResponseEntity<Page<NoticeResponse>> getNotices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String searchType,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(noticeService.getNotices(page, size, searchType, keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNotice(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(noticeService.getNotice(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createNotice(@RequestBody NoticeRequest request,
                                           Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            String authorName = user.getNickname() != null ? user.getNickname()
                    : user.getName() != null ? user.getName() : user.getUsername();
            NoticeResponse response = noticeService.createNotice(request, authorName, user.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotice(@PathVariable Long id,
                                           @RequestBody NoticeRequest request,
                                           Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            boolean isAdmin = "ADMIN".equals(user.getRole());
            return ResponseEntity.ok(noticeService.updateNotice(id, request, user.getUsername(), isAdmin));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotice(@PathVariable Long id, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            boolean isAdmin = "ADMIN".equals(user.getRole());

            // 이미지 파일도 삭제
            String imagePath = noticeService.getImagePath(id);
            if (imagePath != null && !imagePath.isBlank()) {
                File imgFile = new File(uploadDir, imagePath);
                if (imgFile.exists()) imgFile.delete();
            }

            noticeService.deleteNotice(id, user.getUsername(), isAdmin);
            return ResponseEntity.ok("공지사항이 삭제되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 이미지 업로드
    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadNoticeImage(@PathVariable Long id,
                                                @RequestParam("file") MultipartFile file,
                                                Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            boolean isAdmin = "ADMIN".equals(user.getRole());

            // 기존 이미지 삭제
            String oldImage = noticeService.getImagePath(id);
            if (oldImage != null && !oldImage.isBlank()) {
                File oldFile = new File(uploadDir, oldImage);
                if (oldFile.exists()) oldFile.delete();
            }

            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String originalFilename = file.getOriginalFilename();
            String ext = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
            String filename = "notice_" + UUID.randomUUID() + ext;

            Path path = Paths.get(uploadDir, filename);
            Files.write(path, file.getBytes());

            noticeService.setNoticeImage(id, filename);
            return ResponseEntity.ok(Map.of("imagePath", filename));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
