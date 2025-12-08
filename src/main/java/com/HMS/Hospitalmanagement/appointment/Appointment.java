package com.HMS.Hospitalmanagement.appointment;

import com.HMS.Hospitalmanagement.patient.Patient;
import com.HMS.Hospitalmanagement.doctor.Doctor;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    private LocalDateTime appointmentDate;
    private String reason;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private String labTestsRequired;

    public enum AppointmentStatus {
        SCHEDULED, COMPLETED, CANCELLED
    }
}
