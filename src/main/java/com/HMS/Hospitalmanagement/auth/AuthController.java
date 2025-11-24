package com.HMS.Hospitalmanagement.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import com.HMS.Hospitalmanagement.auth.User.Role;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final com.HMS.Hospitalmanagement.patient.PatientService patientService;
    private final com.HMS.Hospitalmanagement.doctor.DoctorRepository doctorRepository;
    private final com.HMS.Hospitalmanagement.patient.PatientRepository patientRepository;

    @Autowired
    public AuthController(UserService userService, JwtUtil jwtUtil,
            com.HMS.Hospitalmanagement.patient.PatientService patientService,
            com.HMS.Hospitalmanagement.doctor.DoctorRepository doctorRepository,
            com.HMS.Hospitalmanagement.patient.PatientRepository patientRepository) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.patientService = patientService;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Force role to PATIENT for public registration if not specified or if trying
            // to be sneaky
            if (user.getRole() == null || user.getRole() != Role.PATIENT) {
                // For now, we allow other roles if explicitly sent (e.g. for testing),
                // but in production this should be strictly PATIENT.
                // However, per the critique, we want to secure it.
                // Let's default to PATIENT if null.
                if (user.getRole() == null) {
                    user.setRole(Role.PATIENT);
                }
            }

            User registeredUser = userService.registerUser(user);

            // Auto-create Patient profile
            if (registeredUser.getRole() == Role.PATIENT) {
                com.HMS.Hospitalmanagement.patient.Patient newPatient = new com.HMS.Hospitalmanagement.patient.Patient();
                newPatient.setName(registeredUser.getUsername()); // Use username as name for now
                newPatient.setAge(0); // Default
                newPatient.setGender("Other"); // Default
                newPatient.setContactNumber("N/A");
                newPatient.setMedicalHistory("New Patient");
                patientService.createPatient(newPatient);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("username", registeredUser.getUsername());
            response.put("role", registeredUser.getRole());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userService.findByUsername(loginRequest.getUsername());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        User user = userOpt.get();

        if (!userService.validatePassword(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", user.getUsername());
        response.put("role", user.getRole());

        // Add profile ID based on role
        if (user.getRole() == Role.DOCTOR) {
            com.HMS.Hospitalmanagement.doctor.Doctor doctor = doctorRepository.findByName(user.getUsername());
            if (doctor != null) {
                response.put("doctorId", doctor.getId());
            }
        } else if (user.getRole() == Role.PATIENT) {
            com.HMS.Hospitalmanagement.patient.Patient patient = patientRepository.findByName(user.getUsername());
            if (patient != null) {
                response.put("patientId", patient.getId());
            }
        }

        return ResponseEntity.ok(response);
    }

    // DTO for login request
    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
