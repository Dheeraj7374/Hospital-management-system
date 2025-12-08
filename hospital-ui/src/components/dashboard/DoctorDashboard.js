import React, { useState, useEffect } from 'react';
import { MdEventNote, MdPerson, MdScience } from 'react-icons/md';
import { appointmentAPI } from '../../services/api';
import './DoctorDashboard.css';

function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const doctorId = localStorage.getItem('doctorId');
    const doctorName = localStorage.getItem('username');

    useEffect(() => {
        if (doctorId) {
            loadAppointments();
        } else {
            setLoading(false);
        }
    }, [doctorId]);

    const loadAppointments = async () => {
        try {
            
            
            const res = await appointmentAPI.getAll();
            const myAppointments = res.data.filter(apt =>
                apt.doctor?.id === parseInt(doctorId) &&
                apt.status !== 'CANCELLED'
            );

            
            const today = new Date().toISOString().split('T')[0];
            const todaysAppointments = myAppointments.filter(apt =>
                apt.appointmentDate.startsWith(today)
            );

            setAppointments(todaysAppointments);
        } catch (error) {
            console.error('Error loading appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignLabTest = (patientId) => {
        
        alert(`Assigning lab test for patient ID: ${patientId}`);
        
    };

    if (!doctorId) {
        return (
            <div className="doctor-dashboard-container">
                <div className="error-message">
                    <h2>Profile Not Linked</h2>
                    <p>Your user account is not linked to a Doctor profile. Please contact the administrator.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="doctor-dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, Dr. {doctorName}</h1>
                <p>Here is your schedule for today.</p>
            </div>

            <div className="appointments-section">
                <div className="section-header">
                    <h2><MdEventNote /> Today's Appointments</h2>
                    <span className="badge">{appointments.length}</span>
                </div>

                {loading ? (
                    <div className="loading">Loading schedule...</div>
                ) : appointments.length > 0 ? (
                    <div className="appointments-list">
                        {appointments.map(apt => (
                            <div key={apt.id} className="appointment-card">
                                <div className="time-slot">
                                    {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="patient-info">
                                    <h3>{apt.patient?.name || 'Unknown Patient'}</h3>
                                    <span className="reason">{apt.reason}</span>
                                </div>
                                <div className="actions">
                                    <button className="btn-action" onClick={() => alert(`Viewing details for ${apt.patient?.name}`)}>
                                        <MdPerson /> Details
                                    </button>
                                    <button className="btn-action secondary" onClick={() => handleAssignLabTest(apt.patient?.id)}>
                                        <MdScience /> Lab Test
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-appointments">
                        <p>No appointments scheduled for today.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoctorDashboard;
