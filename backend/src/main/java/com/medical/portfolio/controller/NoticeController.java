package com.medical.portfolio.controller;

import com.medical.portfolio.dto.NoticeRequest;
import com.medical.portfolio.dto.NoticeResponse;
import com.medical.portfolio.entity.User;
import com.medical.portfolio.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NoticeController {

    private final NoticeService noticeService;

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
        User user = (User) authentication.getPrincipal();
        NoticeResponse response = noticeService.createNotice(request, user.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotice(@PathVariable Long id,
                                           @RequestBody NoticeRequest request) {
        try {
            return ResponseEntity.ok(noticeService.updateNotice(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotice(@PathVariable Long id) {
        try {
            noticeService.deleteNotice(id);
            return ResponseEntity.ok("공지사항이 삭제되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
