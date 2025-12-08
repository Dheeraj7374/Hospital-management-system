package com.HMS.Hospitalmanagement.billing;

import com.HMS.Hospitalmanagement.appointment.Appointment;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    private Double consultationFee;
    private Double testCharges;
    private Double totalAmount; 

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private LocalDateTime billDate;

    public enum PaymentStatus {
        PENDING, PAID, CANCELLED
    }

    
    public void calculateTotal() {
        this.totalAmount = (consultationFee != null ? consultationFee : 0.0) +
                (testCharges != null ? testCharges : 0.0);
    }
}
