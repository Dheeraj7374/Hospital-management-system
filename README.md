# Hospital Management System

A comprehensive, full-stack web application designed to streamline hospital operations. This system manages patient appointments, doctor profiles, billing, and lab reports, providing a seamless experience for both administrators and patients.

## 🚀 Features

### **For Patients**
*   **User Registration & Login**: Secure account creation and authentication.
*   **Book Appointments**: Easy scheduling with available doctors.
*   **View Medical History**: Access past appointments and treatments.
*   **Download Lab Reports**: View and download uploaded test results.
*   **View Bills**: Check invoice status and details.

### **For Administrators / Doctors**
*   **Doctor Management**: Add, update, and remove doctor profiles (including photos and certificates).
*   **Patient Management**: View and manage patient records.
*   **Appointment Management**: View all scheduled appointments.
*   **Billing System**: Generate and manage bills for consultations and tests.
*   **Lab Reports**: Upload patient lab reports.
*   **Night Mode**: Toggle between light and dark themes for better visibility.

---

## 🛠️ Technology Stack

### **Backend**
*   **Java 17**
*   **Spring Boot 3.x** (Web, Data JPA, Security)
*   **MySQL** (Database)
*   **Hibernate** (ORM)
*   **JWT** (JSON Web Tokens for Security)
*   **Maven** (Build Tool)

### **Frontend**
*   **React.js**
*   **CSS3** (Custom styling with Variables for Theming)
*   **Axios** (HTTP Client)
*   **React Router** (Navigation)

---

## 📋 Prerequisites

Before running the application, ensure you have the following installed:
1.  **Java JDK 21** or higher.
2.  **Node.js** (v14 or higher) and **npm**.
3.  **MySQL Server**.

---

## ⚙️ Installation & Setup

### **1. Database Setup**
1.  Open your MySQL Workbench or command line.
2.  Create a new database named `hospital_db`:
    ```sql
    CREATE DATABASE hospital_db;
    ```
3.  The application is configured with the following default credentials. If yours are different, update `src/main/resources/application.properties`:
    *   **Username**: `root`
    *   **Password**: `root`

### **2. Backend Setup (Spring Boot)**
1.  Open a terminal in the project root directory (`Hospital-management-System`).
2.  Run the application using the Maven wrapper:
    *   **Windows**:
        ```powershell
        .\mvnw.cmd spring-boot:run
        ```
    *   **Mac/Linux**:
        ```bash
        ./mvnw spring-boot:run
        ```
3.  The backend server will start on **`http://localhost:8081`**.

### **3. Frontend Setup (React)**
1.  Open a **new** terminal window.
2.  Navigate to the frontend directory:
    ```bash
    cd hospital-ui
    ```
3.  Install dependencies (first time only):
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm start
    ```
5.  The application will automatically open in your browser at **`http://localhost:3000`**.

---

## 📚 API Documentation

A complete **Postman Collection** is included in the project root for testing all API endpoints.

*   **File**: `Hospital_Management_System.postman_collection.json`
*   **Import**: Open Postman -> Import -> Select this file.

### **Key Endpoints**
*   **Auth**: `/auth/register`, `/auth/login`
*   **Doctors**: `/doctors` (GET, POST, PUT, DELETE)
*   **Patients**: `/patients` (GET, POST, PUT, DELETE)
*   **Appointments**: `/appointments` (GET, POST, PUT, DELETE)
*   **Billing**: `/bills` (GET, POST, PUT, DELETE)
*   **Reports**: `/reports` (Upload, Download)

---

## 🔐 Default Credentials

*   **Admin Account**:
    *   **Username**: `admin`
    *   **Password**: `admin123`
    *   *(Created automatically on first run)*

---

## 📂 Project Structure

```
Hospital-management-System/
├── src/main/java/com/HMS/Hospitalmanagement/  # Backend Source Code
│   ├── auth/           # Authentication (Login/Register)
│   ├── doctor/         # Doctor Management
│   ├── patient/        # Patient Management
│   ├── appointment/    # Appointment Booking
│   ├── billing/        # Billing System
│   └── report/         # Lab Reports
├── hospital-ui/        # Frontend Source Code (React)
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── services/   # API Calls (Axios)
│   │   └── App.js      # Main Component
└── README.md           # Project Documentation
```
