package com.HMS.Hospitalmanagement.doctor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    @Autowired
    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        return doctorRepository.findById(id).map(doctor -> {
            doctor.setName(doctorDetails.getName());
            doctor.setSpecialization(doctorDetails.getSpecialization());
            doctor.setQualification(doctorDetails.getQualification());
            doctor.setExperience(doctorDetails.getExperience());
            doctor.setContactNumber(doctorDetails.getContactNumber());
            doctor.setEmail(doctorDetails.getEmail());
            doctor.setImageUrl(doctorDetails.getImageUrl());
            doctor.setBio(doctorDetails.getBio());
            doctor.setConsultationFee(doctorDetails.getConsultationFee());
            doctor.setStatus(doctorDetails.getStatus());
            return doctorRepository.save(doctor);
        }).orElse(null);
    }

    public Doctor uploadPhoto(Long id, org.springframework.web.multipart.MultipartFile file) {
        return doctorRepository.findById(id).map(doctor -> {
            try {
                // Ensure directory exists
                String uploadDir = "uploads/doctors/";
                java.io.File directory = new java.io.File(uploadDir);
                if (!directory.exists()) {
                    directory.mkdirs();
                }

                // Generate unique filename
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir + fileName);

                // Save file
                java.nio.file.Files.copy(file.getInputStream(), filePath,
                        java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                // Update doctor entity
                doctor.setImageUrl("/uploads/doctors/" + fileName);
                return doctorRepository.save(doctor);
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
            }
        }).orElse(null);
    }

    public boolean deleteDoctor(Long id) {
        if (doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
