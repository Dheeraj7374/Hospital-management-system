package com.HMS.Hospitalmanagement.config;

import com.HMS.Hospitalmanagement.auth.User;
import com.HMS.Hospitalmanagement.auth.UserRepository;
import com.HMS.Hospitalmanagement.auth.User.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if admin exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@hospital.com");
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);

            userRepository.save(admin);
            System.out.println("Default Admin account created: username=admin, password=admin123");

        }
    }
}
