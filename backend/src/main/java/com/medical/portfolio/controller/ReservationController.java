package com.medical.portfolio.controller;

import com.medical.portfolio.dto.ReservationRequest;
import com.medical.portfolio.dto.ReservationResponse;
import com.medical.portfolio.entity.User;
import com.medical.portfolio.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // 예약 생성
    @PostMapping
    public ResponseEntity<ReservationResponse> create(@RequestBody ReservationRequest req,
                                                       Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        String name = user.getNickname() != null ? user.getNickname()
                : user.getName() != null ? user.getName() : user.getUsername();
        return ResponseEntity.ok(reservationService.create(req, user.getUsername(), name));
    }

    // 내 예약 목록
    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(reservationService.getMyReservations(user.getUsername()));
    }

    // 예약 취소 (본인만)
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        reservationService.cancel(id, user.getUsername());
        return ResponseEntity.ok().build();
    }

    // 관리자 - 전체 예약 목록
    @GetMapping("/admin")
    public ResponseEntity<List<ReservationResponse>> getAll() {
        return ResponseEntity.ok(reservationService.getAll());
    }

    // 관리자 - 예약 상태 변경
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<ReservationResponse> updateStatus(@PathVariable Long id,
                                                             @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(reservationService.updateStatus(id, body.get("status")));
    }
}
