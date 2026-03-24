package com.medical.portfolio.service;

import com.medical.portfolio.dto.ReservationRequest;
import com.medical.portfolio.dto.ReservationResponse;
import com.medical.portfolio.entity.Reservation;
import com.medical.portfolio.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    @Transactional
    public ReservationResponse create(ReservationRequest req, String username, String name) {
        Reservation r = new Reservation();
        r.setUsername(username);
        r.setName(name);
        r.setDepartment(req.getDepartment());
        r.setReservationDate(LocalDate.parse(req.getReservationDate()));
        r.setReservationTime(LocalTime.parse(req.getReservationTime()));
        r.setSymptom(req.getSymptom());
        return ReservationResponse.fromEntity(reservationRepository.save(r));
    }

    public List<ReservationResponse> getMyReservations(String username) {
        return reservationRepository
                .findByUsernameOrderByReservationDateAscReservationTimeAsc(username)
                .stream().map(ReservationResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public void cancel(Long id, String username) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
        if (!r.getUsername().equals(username)) throw new RuntimeException("본인의 예약만 취소할 수 있습니다.");
        r.setStatus("CANCELLED");
    }

    public List<ReservationResponse> getAll() {
        return reservationRepository.findAllByOrderByReservationDateAscReservationTimeAsc()
                .stream().map(ReservationResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public ReservationResponse updateStatus(Long id, String status) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
        r.setStatus(status);
        return ReservationResponse.fromEntity(r);
    }
}
