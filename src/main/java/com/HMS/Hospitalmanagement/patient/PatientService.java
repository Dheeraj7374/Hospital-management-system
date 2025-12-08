package com.HMS.Hospitalmanagement.patient;

import com.HMS.Hospitalmanagement.doctor.Doctor;
import com.HMS.Hospitalmanagement.doctor.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Autowired
    public PatientService(PatientRepository patientRepository, DoctorRepository doctorRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Patient updatePatient(Long id, Patient patientDetails) {
        return patientRepository.findById(id).map(patient -> {
            patient.setName(patientDetails.getName());
            patient.setAge(patientDetails.getAge());
            patient.setGender(patientDetails.getGender());
            patient.setContactNumber(patientDetails.getContactNumber());
            patient.setMedicalHistory(patientDetails.getMedicalHistory());
            
            
            Doctor newDoctor = patientDetails.getDoctor();
            if (newDoctor != null && newDoctor.getId() != null) {
                Doctor persistedDoctor = doctorRepository.findById(newDoctor.getId()).orElse(null);
                patient.setDoctor(persistedDoctor);
            }
            patient.setLabTestsRequired(patientDetails.getLabTestsRequired());
            return patientRepository.save(patient);
        }).orElse(null);
    }

    public boolean deletePatient(Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
