package com.HMS.Hospitalmanagement.report;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "lab_reports")
public class LabReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;
    private String doctorName;
    private String testName;
    private LocalDate reportDate;
    private String filePath;
    private String fileName;

    public LabReport() {
    }

    public LabReport(String patientName, String doctorName, String testName, LocalDate reportDate, String filePath,
            String fileName) {
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.testName = testName;
        this.reportDate = reportDate;
        this.filePath = filePath;
        this.fileName = fileName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public LocalDate getReportDate() {
        return reportDate;
    }

    public void setReportDate(LocalDate reportDate) {
        this.reportDate = reportDate;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
