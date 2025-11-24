package com.HMS.Hospitalmanagement.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class LabReportService {

    private final Path root = Paths.get("uploads");

    @Autowired
    private LabReportRepository labReportRepository;

    public LabReportService() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    public LabReport save(MultipartFile file, String patientName, String doctorName, String testName) {
        try {
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.root.resolve(filename));

            LabReport report = new LabReport(
                    patientName,
                    doctorName,
                    testName,
                    LocalDate.now(),
                    this.root.resolve(filename).toString(),
                    filename);

            return labReportRepository.save(report);
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public List<LabReport> getAllReports() {
        return labReportRepository.findAll();
    }

    public List<LabReport> getReportsByPatient(String patientName) {
        return labReportRepository.findByPatientName(patientName);
    }

    public Resource load(String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    public LabReport getReportById(Long id) {
        return labReportRepository.findById(id).orElseThrow(() -> new RuntimeException("Report not found"));
    }
}
