import React, { useState, useEffect } from 'react';
import { appointmentAPI } from '../../services/api';
import { MdClose, MdEdit, MdDelete, MdEmail, MdPhone } from 'react-icons/md';
import './PatientDetailsModal.css';

function PatientDetailsModal({ patient, onClose, onEdit, onDelete }) {
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, [patient.id]);

    const loadAppointments = async () => {
        try {
            const response = await appointmentAPI.getAll({ patientId: patient.id });
            const aptList = response.data;
            setAppointments(aptList.slice(0, 5)); // Recent 5

            const now = new Date();
            const stats = {
                total: aptList.length,
                upcoming: aptList.filter(a => new Date(a.appointmentDate) >= now && a.status === 'SCHEDULED').length,
                completed: aptList.filter(a => a.status === 'COMPLETED').length
            };
            setStats(stats);
            setLoading(false);
        } catch (error) {
            console.error('Error loading appointments:', error);
            setLoading(false);
        }
    };

    const getGenderIcon = (gender) => {
        if (gender?.toLowerCase() === 'male') return '👨';
        if (gender?.toLowerCase() === 'female') return '👩';
        return '👤';
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content patient-details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Patient Details</h2>
                    <button onClick={onClose} className="close-btn">
                        <MdClose />
                    </button>
                </div>

                <div className="patient-details-content">
                    {/* Header with ID and Name */}
                    <div className="patient-header-section">
                        <div className="patient-icon-large">{getGenderIcon(patient.gender)}</div>
                        <div className="patient-header-info">
                            <h3>{patient.name}</h3>
                            <p className="patient-id-badge">Patient ID: #{patient.id}</p>
                            <div className="patient-meta">
                                <span>{patient.age} years</span>
                                <span>•</span>
                                <span>{patient.gender}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="info-section">
                        <h4>Contact Information</h4>
                        <div className="info-grid">
                            <div className="info-item">
                                <MdPhone className="info-icon" />
                                <div>
                                    <span className="info-label">Phone</span>
                                    <span className="info-value">{patient.contactNumber || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assigned Doctor */}
                    <div className="info-section">
                        <h4>Assigned Doctor</h4>
                        {patient.doctor ? (
                            <div className="doctor-info-box">
                                <div>
                                    <strong>{patient.doctor.name}</strong>
                                    <p>{patient.doctor.specialization || 'General Practitioner'}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="no-data">No doctor assigned</p>
                        )}
                    </div>

                    {/* Medical History */}
                    {patient.medicalHistory && (
                        <div className="info-section">
                            <h4>Medical History</h4>
                            <p className="text-content">{patient.medicalHistory}</p>
                        </div>
                    )}

                    {/* Lab Tests */}
                    {patient.labTestsRequired && (
                        <div className="info-section">
                            <h4>Lab Tests Required</h4>
                            <p className="text-content tests-content">{patient.labTestsRequired}</p>
                        </div>
                    )}

                    {/* Appointment Statistics */}
                    <div className="info-section">
                        <h4>Appointment Statistics</h4>
                        <div className="stats-grid">
                            <div className="stat-box">
                                <div className="stat-number">{stats.total}</div>
                                <div className="stat-label">Total</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-number">{stats.upcoming}</div>
                                <div className="stat-label">Upcoming</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-number">{stats.completed}</div>
                                <div className="stat-label">Completed</div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Appointments */}
                    {appointments.length > 0 && (
                        <div className="info-section">
                            <h4>Recent Appointments</h4>
                            <div className="appointments-list-small">
                                {appointments.map(apt => (
                                    <div key={apt.id} className="appointment-item-small">
                                        <div>
                                            <strong>{apt.doctor?.name || 'Doctor'}</strong>
                                            <p>{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`status-tag ${apt.status.toLowerCase()}`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button onClick={() => onDelete(patient.id)} className="btn-delete">
                        <MdDelete /> Delete
                    </button>
                    <button onClick={onEdit} className="btn-primary">
                        <MdEdit /> Edit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PatientDetailsModal;
