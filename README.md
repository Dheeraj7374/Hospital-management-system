# Hospital Management System

A comprehensive web application for managing hospital operations, including patient appointments, doctor management, and billing.

## Prerequisites

Before running the application, ensure you have the following installed:
- **Java JDK 17** or higher
- **Node.js** (v14 or higher) and **npm**
- **MySQL Server**

## Step 1: Database Setup

1.  Open your MySQL Workbench or command line.
2.  Create a new database named `hospital_db`:
    ```sql
    CREATE DATABASE hospital_db;
    ```
3.  The application is configured to use the following credentials (update `src/main/resources/application.properties` if yours differ):
    - **Username**: `root`
    - **Password**: `root`

## Step 2: Run the Backend (Spring Boot)

1.  Open a terminal.
2.  Navigate to the project root directory:
    ```bash
    cd "Hospital-management-System"
    ```
3.  Run the application using the Maven wrapper:
    - **Windows**:
        ```powershell
        .\mvnw.cmd spring-boot:run
        ```
    - **Mac/Linux**:
        ```bash
        ./mvnw spring-boot:run
        ```
4.  The backend server will start on `http://localhost:8081`.

## Step 3: Run the Frontend (React)

1.  Open a **new** terminal window.
2.  Navigate to the frontend directory:
    ```bash
    cd "Hospital-management-System/hospital-ui"
    ```
3.  Install dependencies (only needed the first time):
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm start
    ```
5.  The application will automatically open in your browser at `http://localhost:3000`.

## Usage

1.  **Register**: Create a new account as a **Patient** or **Admin**.
2.  **Login**: Use your credentials to log in.
    - **Patients** can book appointments, view their history, and see bills.
    - **Admins** can manage doctors, view all appointments, and manage billing.

## Troubleshooting

- **Port Conflicts**: Ensure ports `8081` (backend) and `3000` (frontend) are free.
- **Database Connection**: If the backend fails to start, double-check your MySQL username/password in `application.properties`.
- **CORS Errors**: If the frontend cannot talk to the backend, ensure the backend is running and CORS is configured (already handled in `SecurityConfig.java`).
