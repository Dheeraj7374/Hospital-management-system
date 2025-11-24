# Hospital Management System Workflow

## Overview
This workflow describes how **Patient**, **Doctor**, **Appointment**, and **Billing** modules interact in the Hospital Management System.

1. **Patient Registration** – Patients are created via `/patient` endpoints.
2. **Doctor Management** – Doctors are managed via `/doctor` endpoints.
3. **Booking an Appointment** – A patient selects a doctor and creates an appointment (`POST /appointment`). The appointment stores references to both patient and doctor.
4. **Doctor View & Test Management** – Doctors can retrieve all their appointments (`GET /appointment?doctorId={id}`) and add medical tests to an appointment (`PUT /appointment/{id}` with `tests` field).
5. **Billing Generation** – After an appointment is completed, the system generates a bill (`POST /bill`) that includes:
   - Consultation fee (configured per doctor)
   - Test charges (based on tests added to the appointment)
6. **Bill Retrieval** – Bills can be listed (`GET /bill`) or fetched by ID (`GET /bill/{id}`).

## Entity Relationships
- **Patient** `1 ── *` **Appointment**
- **Doctor** `1 ── *` **Appointment**
- **Appointment** `1 ── 1` **Bill** (one bill per completed appointment)

## API Summary
### Appointment
- `POST /appointment` – body: `{ "patientId": 1, "doctorId": 2, "date": "2025-12-01T10:00", "reason": "Check‑up" }`
- `GET /appointment` – list all appointments (optional filters `patientId`, `doctorId`).
- `GET /appointment/{id}` – details of a specific appointment.
- `PUT /appointment/{id}` – update (e.g., add `tests`: `["Blood Test", "X‑Ray"]`).
- `DELETE /appointment/{id}` – cancel appointment.

### Billing
- `POST /bill` – body: `{ "appointmentId": 5, "consultationFee": 100, "testCharges": [{ "test": "Blood Test", "price": 30 }] }`
- `GET /bill` – list all bills.
- `GET /bill/{id}` – bill details.
- `PUT /bill/{id}` – adjust charges if needed.
- `DELETE /bill/{id}` – remove a bill.

## Suggested Enhancements
- **Automatic Bill Generation**: Trigger bill creation automatically when an appointment status changes to `COMPLETED`.
- **Doctor Dashboard**: Endpoint `/doctor/{id}/appointments` to fetch all appointments for a doctor.
- **Patient Dashboard**: Endpoint `/patient/{id}/appointments` to view a patient’s upcoming and past appointments.
- **Payment Integration**: Add a payment gateway to settle bills.

---
*This workflow can be refined further based on additional business rules or UI requirements.*
