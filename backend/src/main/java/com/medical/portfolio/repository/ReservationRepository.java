package com.medical.portfolio.repository;

import com.medical.portfolio.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUsernameOrderByReservationDateAscReservationTimeAsc(String username);
    List<Reservation> findAllByOrderByReservationDateAscReservationTimeAsc();
}
