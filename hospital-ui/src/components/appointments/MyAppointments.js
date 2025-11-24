import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../../services/api';
import AppointmentCard from './AppointmentCard';
import { MdEventNote, MdHistory, MdAdd } from 'react-icons/md';
import './MyAppointments.css';

function MyAppointments() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const response = await appointmentAPI.getAll();
            const allAppointments = response.data;
            const username = localStorage.getItem('username');
            const role = localStorage.getItem('role');

            if (role === 'PATIENT' && username) {
                // Filter appointments for the logged-in patient
                const myAppointments = allAppointments.filter(apt =>
                    apt.patient?.name?.toLowerCase() === username.toLowerCase()
                );
                setAppointments(myAppointments);
            } else {
                // Admin/Doctor sees all (or handle Doctor specific logic later)
                setAppointments(allAppointments);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading appointments:', error);
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        try {
            await appointmentAPI.update(appointmentId, { status: 'CANCELLED' });
            loadAppointments();
            alert('Appointment cancelled successfully');
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            alert('Failed to cancel appointment');
        }
    };

    const filterAppointments = () => {
        const now = new Date();

        if (activeTab === 'upcoming') {
            return appointments.filter(apt => {
                const aptDate = new Date(apt.appointmentDate);
                return aptDate >= now && apt.status !== 'CANCELLED';
            });
        } else {
            return appointments.filter(apt => {
                const aptDate = new Date(apt.appointmentDate);
                return aptDate < now || apt.status === 'CANCELLED' || apt.status === 'COMPLETED';
            });
        }
    };

    const filteredAppointments = filterAppointments();

    if (loading) {
        return (
            <div className="my-appointments-container">
                <div className="loading">Loading appointments...</div>
            </div>
        );
    }

    return (
        <div className="my-appointments-container">
            <div className="page-header">
                <div className="header-content">
                    <div>
                        <h1>My Appointments</h1>
                        <p>View and manage your appointments</p>
                    </div>
                    <button
                        onClick={() => navigate('/appointments/book')}
                        className="btn-book-new"
                    >
                        <MdAdd />
                        Book Appointment
                    </button>
                </div>
            </div>

            <div className="tabs-container">
                <button
                    className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    <MdEventNote />
                    <span>Upcoming ({appointments.filter(a => new Date(a.appointmentDate) >= new Date() && a.status !== 'CANCELLED').length})</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    <MdHistory />
                    <span>Past ({appointments.filter(a => new Date(a.appointmentDate) < new Date() || a.status === 'COMPLETED' || a.status === 'CANCELLED').length})</span>
                </button>
            </div>

            <div className="appointments-list">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(appointment => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            onCancel={handleCancelAppointment}
                            isUpcoming={activeTab === 'upcoming'}
                            showPatient={localStorage.getItem('role') === 'ADMIN'}
                        />
                    ))
                ) : (
                    <div className="no-appointments">
                        <p>{activeTab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}</p>
                        <p className="hint">Book an appointment to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyAppointments;
