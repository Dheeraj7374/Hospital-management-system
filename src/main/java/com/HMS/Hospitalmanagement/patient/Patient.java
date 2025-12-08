package com.HMS.Hospitalmanagement.patient;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.HMS.Hospitalmanagement.doctor.Doctor;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer age; 
    private String gender;
    private String contactNumber;
    private String medicalHistory;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
    private String labTestsRequired;
}
