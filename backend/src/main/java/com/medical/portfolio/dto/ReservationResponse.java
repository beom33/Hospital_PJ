package com.medical.portfolio.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.medical.portfolio.entity.Reservation;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter @Setter
public class ReservationResponse {
    private Long id;
    private String username;
    private String name;
    private String department;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate reservationDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime reservationTime;

    private String symptom;
    private String status;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    public static ReservationResponse fromEntity(Reservation r) {
        ReservationResponse res = new ReservationResponse();
        res.setId(r.getId());
        res.setUsername(r.getUsername());
        res.setName(r.getName());
        res.setDepartment(r.getDepartment());
        res.setReservationDate(r.getReservationDate());
        res.setReservationTime(r.getReservationTime());
        res.setSymptom(r.getSymptom());
        res.setStatus(r.getStatus());
        res.setCreatedAt(r.getCreatedAt());
        return res;
    }
}
