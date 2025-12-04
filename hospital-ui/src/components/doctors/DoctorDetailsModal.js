import React, { useState, useEffect } from 'react';
import { appointmentAPI } from '../../services/api';
import { MdClose, MdEdit, MdDelete, MdEmail, MdPhone } from 'react-icons/md';
import './DoctorDetailsModal.css';

function DoctorDetailsModal({ doctor, onClose, onEdit, onDelete }) {
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, upcoming: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, [doctor.id]);

    const loadAppointments = async () => {
        try {
            const response = await appointmentAPI.getAll({ doctorId: doctor.id });
            const aptList = response.data;
            setAppointments(aptList.slice(0, 5)); // Recent 5

            const now = new Date();
            const stats = {
                total: aptList.length,
                completed: aptList.filter(a => a.status === 'COMPLETED').length,
                upcoming: aptList.filter(a => new Date(a.appointmentDate) >= now && a.status === 'SCHEDULED').length
            };
            setStats(stats);
            setLoading(false);
        } catch (error) {
            console.error('Error loading appointments:', error);
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content doctor-details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Doctor Details</h2>
                    <button onClick={onClose} className="close-btn">
                        <MdClose />
                    </button>
                </div>

                <div className="doctor-details-content">
                    {/* Header with Photo */}
                    <div className="doctor-header-section">
                        {doctor.imageUrl ? (
                            <img src={doctor.imageUrl} alt={doctor.name} className="doctor-photo-large" />
                        ) : (
                            <div className="doctor-avatar-large">{getInitials(doctor.name)}</div>
                        )}
                        <div className="doctor-header-info">
                            <h3>{doctor.name}</h3>
                            <p className="specialization">{doctor.specialization || 'General Practitioner'}</p>
                            <span className={`status-badge ${(doctor.status || 'ACTIVE').toLowerCase()}`}>
                                {doctor.status || 'ACTIVE'}
                            </span>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="info-section">
                        <h4>Contact Information</h4>
                        <div className="info-grid">
                            <div className="info-item">
                                <MdEmail className="info-icon" />
                                <div>
                                    <span className="info-label">Email</span>
                                    <span className="info-value">{doctor.email || 'Not provided'}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <MdPhone className="info-icon" />
                                <div>
                                    <span className="info-label">Phone</span>
                                    <span className="info-value">{doctor.contactNumber || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="info-section">
                        <h4>Professional Information</h4>
                        <div className="info-grid">
                            <div className="info-item">
                                <div>
                                    <span className="info-label">Experience</span>
                                    <span className="info-value">{doctor.experience ? `${doctor.experience} years` : 'Not specified'}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <div>
                                    <span className="info-label">Qualification</span>
                                    <span className="info-value">{doctor.qualification || 'Not specified'}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bio */}
                    {doctor.bio && (
                        <div className="info-section">
                            <h4>About</h4>
                            <p className="bio-text">{doctor.bio}</p>
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
                                <div className="stat-number">{stats.completed}</div>
                                <div className="stat-label">Completed</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-number">{stats.upcoming}</div>
                                <div className="stat-label">Upcoming</div>
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
                                            <strong>{apt.patient?.name || 'Patient'}</strong>
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

                {localStorage.getItem('role') !== 'PATIENT' && (
                    <div className="modal-footer">
                        <button onClick={() => onDelete(doctor.id)} className="btn-delete">
                            <MdDelete /> Delete
                        </button>
                        <button onClick={onEdit} className="btn-edit">
                            <MdEdit /> Edit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoctorDetailsModal;
