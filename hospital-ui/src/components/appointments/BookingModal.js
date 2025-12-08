import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { appointmentAPI } from '../../services/api';
import { MdClose } from 'react-icons/md';
import "react-datepicker/dist/react-datepicker.css";
import './BookingModal.css';

function BookingModal({ doctor, onClose, onSuccess }) {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00',
        '14:00', '15:00', '16:00', '17:00'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedDate || !selectedTime) {
            setError('Please select both date and time');
            return;
        }

        if (!reason.trim()) {
            setError('Please enter a reason for visit');
            return;
        }

        setLoading(true);

        try {
            const username = localStorage.getItem('username');



            const patientsRes = await import('../../services/api').then(m => m.patientAPI.getAll());
            let patient = patientsRes.data.find(p => p.name.toLowerCase() === username?.toLowerCase());




            const appointmentDateTime = new Date(selectedDate);
            const [hours, minutes] = selectedTime.split(':');
            appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
            const isoDateTime = appointmentDateTime.toISOString();


            const appointmentData = {
                patient: { id: patient.id },
                doctor: { id: doctor.id },
                appointmentDate: isoDateTime,
                reason: reason,
                status: 'SCHEDULED',
                labTestsRequired: ''
            };

            await appointmentAPI.create(appointmentData);

            alert('Appointment booked successfully!');
            onClose();
            onSuccess();

            setTimeout(() => {
                navigate('/appointments');
            }, 100);

        } catch (err) {
            console.error('Booking Error:', err);
            setError(err.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2>Book Appointment</h2>
                        <p>with {doctor.name}</p>
                    </div>
                    <button onClick={onClose} className="close-btn">
                        <MdClose />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="booking-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="doctor-info-modal">
                        <div className="info-row">
                            <span className="label">Specialization:</span>
                            <span className="value">{doctor.specialization}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Experience:</span>
                            <span className="value">{doctor.experience} years</span>
                        </div>
                    </div>

                    <div className="form-section">
                        <label>Select Date</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            minDate={new Date()}
                            dateFormat="MMMM d, yyyy"
                            placeholderText="Choose a date"
                            className="date-input"
                            inline
                        />
                    </div>

                    <div className="form-section">
                        <label>Select Time</label>
                        <div className="time-slots">
                            {timeSlots.map(time => (
                                <button
                                    key={time}
                                    type="button"
                                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <label>Reason for Visit</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Describe your symptoms or reason for visit..."
                            rows="4"
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BookingModal;
