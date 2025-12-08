package com.HMS.Hospitalmanagement.appointment;

import com.HMS.Hospitalmanagement.patient.Patient;
import com.HMS.Hospitalmanagement.patient.PatientRepository;
import com.HMS.Hospitalmanagement.doctor.Doctor;
import com.HMS.Hospitalmanagement.doctor.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public Appointment createAppointment(Appointment appointment) {
        if (appointment.getDoctor() != null && appointment.getDoctor().getId() != null
                && appointment.getAppointmentDate() != null) {
            List<Appointment> existingAppointments = appointmentRepository
                    .findByDoctorId(appointment.getDoctor().getId());

            for (Appointment existing : existingAppointments) {
                if (existing.getStatus() != Appointment.AppointmentStatus.CANCELLED) {
                    java.time.Duration duration = java.time.Duration.between(appointment.getAppointmentDate(),
                            existing.getAppointmentDate());
                    long diffMinutes = Math.abs(duration.toMinutes());

                    if (diffMinutes < 30) {
                        throw new RuntimeException("Doctor is already booked at this time");
                    }
                }
            }
        }

        
        
        if (appointment.getPatient() != null && appointment.getPatient().getId() != null) {
            Patient patient = patientRepository.findById(appointment.getPatient().getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Patient not found with ID: " + appointment.getPatient().getId()));
            appointment.setPatient(patient);
        } else {
            throw new RuntimeException("Patient ID is required");
        }

        if (appointment.getDoctor() != null && appointment.getDoctor().getId() != null) {
            Doctor doctor = doctorRepository.findById(appointment.getDoctor().getId())
                    .orElseThrow(
                            () -> new RuntimeException("Doctor not found with ID: " + appointment.getDoctor().getId()));
            appointment.setDoctor(doctor);
        } else {
            throw new RuntimeException("Doctor ID is required");
        }
        
        if (appointment.getStatus() == null) {
            appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        }
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        return appointmentRepository.findById(id).map(appointment -> {
            if (appointmentDetails.getAppointmentDate() != null) {
                appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
            }
            if (appointmentDetails.getReason() != null) {
                appointment.setReason(appointmentDetails.getReason());
            }
            if (appointmentDetails.getStatus() != null) {
                appointment.setStatus(appointmentDetails.getStatus());
            }
            if (appointmentDetails.getLabTestsRequired() != null) {
                appointment.setLabTestsRequired(appointmentDetails.getLabTestsRequired());
            }
            
            if (appointmentDetails.getPatient() != null && appointmentDetails.getPatient().getId() != null) {
                Patient patient = patientRepository.findById(appointmentDetails.getPatient().getId()).orElse(null);
                appointment.setPatient(patient);
            }
            
            if (appointmentDetails.getDoctor() != null && appointmentDetails.getDoctor().getId() != null) {
                Doctor doctor = doctorRepository.findById(appointmentDetails.getDoctor().getId()).orElse(null);
                appointment.setDoctor(doctor);
            }
            return appointmentRepository.save(appointment);
        }).orElse(null);
    }

    public boolean deleteAppointment(Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
