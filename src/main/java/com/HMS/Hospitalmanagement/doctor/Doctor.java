package com.HMS.Hospitalmanagement.doctor;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String specialization;
    private String qualification;
    private Integer experience; // years of experience
    private String contactNumber;
    private String email;
    private String imageUrl; // Doctor profile photo URL
    private String bio; // Doctor's biography/description
    private Double consultationFee; // Consultation fee in currency
    private String status; // ACTIVE or INACTIVE
}
