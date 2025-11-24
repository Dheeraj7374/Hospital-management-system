package com.HMS.Hospitalmanagement.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class LabReportController {

    @Autowired
    private LabReportService labReportService;

    @PostMapping("/upload")
    public ResponseEntity<LabReport> uploadReport(
            @RequestParam("file") MultipartFile file,
            @RequestParam("patientName") String patientName,
            @RequestParam("doctorName") String doctorName,
            @RequestParam("testName") String testName) {

        try {
            LabReport report = labReportService.save(file, patientName, doctorName, testName);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<LabReport>> getAllReports(@RequestParam(required = false) String patientName) {
        if (patientName != null && !patientName.isEmpty()) {
            return ResponseEntity.ok(labReportService.getReportsByPatient(patientName));
        }
        return ResponseEntity.ok(labReportService.getAllReports());
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadReport(@PathVariable Long id) {
        LabReport report = labReportService.getReportById(id);
        Resource file = labReportService.load(report.getFileName());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + report.getFileName() + "\"")
                .body(file);
    }
}
