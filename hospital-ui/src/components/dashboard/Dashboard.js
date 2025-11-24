import React, { useState, useEffect } from 'react';
import { MdPeople, MdPerson, MdEventNote } from 'react-icons/md';
import StatCard from './StatCard';
import DoctorCard from './DoctorCard';
import { patientAPI, doctorAPI, appointmentAPI } from '../../services/api';
import './Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState({
        totalPatients: 0,
        activeDoctors: 0,
        todaysAppointments: 0
    });
    const [doctors, setDoctors] = useState([]);
    const [doctorAppointments, setDoctorAppointments] = useState({});

    useEffect(() => {
        loadStats();
        loadDoctors();
    }, []);

    const loadStats = async () => {
        try {
            const [patients, doctors, appointments] = await Promise.all([
                patientAPI.getAll(),
                doctorAPI.getAll(),
                appointmentAPI.getAll()
            ]);

            setStats({
                totalPatients: patients.data.length,
                activeDoctors: doctors.data.length,
                todaysAppointments: appointments.data.filter(a => {
                    const today = new Date().toISOString().split('T')[0];
                    return a.appointmentDate.startsWith(today);
                }).length,
                allAppointments: appointments.data
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadDoctors = async () => {
        try {
            const [doctorsRes, appointmentsRes] = await Promise.all([
                doctorAPI.getAll(),
                appointmentAPI.getAll()
            ]);

            setDoctors(doctorsRes.data);

            // Calculate appointment stats for each doctor
            const appointmentsByDoctor = {};
            appointmentsRes.data.forEach(apt => {
                const doctorId = apt.doctor?.id;
                if (doctorId) {
                    if (!appointmentsByDoctor[doctorId]) {
                        appointmentsByDoctor[doctorId] = { completed: 0, pending: 0 };
                    }
                    if (apt.status === 'COMPLETED') {
                        appointmentsByDoctor[doctorId].completed++;
                    } else {
                        appointmentsByDoctor[doctorId].pending++;
                    }
                }
            });

            setDoctorAppointments(appointmentsByDoctor);
        } catch (error) {
            console.error('Error loading doctors:', error);
        }
    };

    // Calculate chart data from appointments
    const getAppointmentChartData = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const last7Days = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            last7Days.push({
                date: d.toISOString().split('T')[0],
                dayName: days[d.getDay()],
                count: 0
            });
        }

        // Count appointments for each day
        if (stats.allAppointments) {
            stats.allAppointments.forEach(apt => {
                const aptDate = apt.appointmentDate.split('T')[0];
                const dayStat = last7Days.find(d => d.date === aptDate);
                if (dayStat) {
                    dayStat.count++;
                }
            });
        }

        // Find max value for scaling
        const maxCount = Math.max(...last7Days.map(d => d.count), 1); // Avoid divide by zero

        return last7Days.map(d => ({
            label: d.dayName,
            value: (d.count / maxCount) * 100, // Scale to percentage for bar height
            actualValue: d.count
        }));
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Overview</h1>
            </div>

            <div className="stats-grid">
                <StatCard
                    title="Total Patients"
                    value={stats.totalPatients}
                    icon={MdPerson}
                    color="#10b981"
                />
                <StatCard
                    title="Active Doctors"
                    value={stats.activeDoctors}
                    icon={MdPeople}
                    color="#ef4444"
                />
                <StatCard
                    title="Today's Appointments"
                    value={stats.todaysAppointments}
                    icon={MdEventNote}
                    color="#f59e0b"
                />
            </div>

            <div className="doctors-section">
                <div className="section-header">
                    <h2>Doctors Available</h2>
                </div>

                <div className="doctors-grid">
                    {doctors.length > 0 ? (
                        doctors.map(doctor => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                appointmentStats={doctorAppointments[doctor.id]}
                            />
                        ))
                    ) : (
                        <div className="no-doctors">
                            <p>No doctors available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
