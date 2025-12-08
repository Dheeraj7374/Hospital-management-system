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
            
            
            user.setRole(Role.PATIENT);

            User registeredUser = userService.registerUser(user);

            
            if (registeredUser.getRole() == Role.PATIENT) {
                com.HMS.Hospitalmanagement.patient.Patient newPatient = new com.HMS.Hospitalmanagement.patient.Patient();
                newPatient.setName(registeredUser.getUsername()); 
                newPatient.setAge(0); 
                newPatient.setGender("Other"); 
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

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        
        
        
        

        Optional<User> userOpt = userService.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        if (!userService.validatePassword(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid current password"));
        }
        userService.updatePassword(request.getUsername(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody CreateAdminRequest request) {
        System.out.println("Received create-admin request");
        System.out.println("Requester: " + request.getRequesterUsername());
        System.out.println("New Admin: " + request.getUsername());

        
        Optional<User> requesterOpt = userService.findByUsername(request.getRequesterUsername());

        if (requesterOpt.isEmpty()) {
            System.out.println("Requester not found in DB");

            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized: Requester not found"));
        }

        if (requesterOpt.get().getRole() != Role.ADMIN) {
            System.out.println("Requester is not ADMIN");

            return ResponseEntity.status(403)
                    .body(Map.of("error", "Unauthorized: Only Admins can create other Admins"));
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(request.getPassword());
        newUser.setEmail(request.getEmail());
        newUser.setRole(Role.ADMIN);

        try {
            userService.registerUser(newUser);
            System.out.println("Admin created successfully");

            return ResponseEntity.ok(Map.of("message", "Admin created successfully"));
        } catch (RuntimeException e) {
            System.out.println("Error creating admin: " + e.getMessage());

            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
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

    public static class ChangePasswordRequest {
        private String username;
        private String currentPassword;
        private String newPassword;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }

    public static class CreateAdminRequest {
        private String requesterUsername;
        private String username;
        private String password;
        private String email;

        public String getRequesterUsername() {
            return requesterUsername;
        }

        public void setRequesterUsername(String requesterUsername) {
            this.requesterUsername = requesterUsername;
        }

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

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}
