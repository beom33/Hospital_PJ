package com.medical.portfolio.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReservationRequest {
    private String department;
    private String reservationDate; // "yyyy-MM-dd"
    private String reservationTime; // "HH:mm"
    private String symptom;
}
