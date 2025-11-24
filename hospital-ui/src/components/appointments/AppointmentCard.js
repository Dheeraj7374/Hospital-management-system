import React from 'react';
import { MdCancel, MdCheckCircle, MdAccessTime, MdPerson } from 'react-icons/md';
import './AppointmentCard.css';

function AppointmentCard({ appointment, onCancel, isUpcoming, showPatient }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            SCHEDULED: { color: '#667eea', label: 'Scheduled', icon: MdAccessTime },
            COMPLETED: { color: '#10b981', label: 'Completed', icon: MdCheckCircle },
            CANCELLED: { color: '#ef4444', label: 'Cancelled', icon: MdCancel }
        };

        const config = statusConfig[status] || statusConfig.SCHEDULED;
        const Icon = config.icon;

        return (
            <div className="status-badge" style={{ background: `${config.color}20`, color: config.color }}>
                <Icon />
                <span>{config.label}</span>
            </div>
        );
    };

    return (
        <div className="appointment-card">
            <div className="appointment-card-header">
                <div className="doctor-info-compact">
                    <div className="doctor-avatar-small">
                        {appointment.doctor?.name?.charAt(0) || 'D'}
                    </div>
                    <div className="doctor-details">
                        <h3>{appointment.doctor?.name || 'Unknown Doctor'}</h3>
                        <p>{appointment.doctor?.specialization || 'Specialization'}</p>
                    </div>
                </div>
                {getStatusBadge(appointment.status)}
            </div>

            <div className="appointment-card-body">
                <div className="info-item">
                    <span className="info-label">Date & Time:</span>
                    <span className="info-value">
                        {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentDate)}
                    </span>
                </div>

                {showPatient && (
                    <div className="info-item">
                        <span className="info-label">Patient:</span>
                        <span className="info-value highlight-patient">
                            <MdPerson style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            {appointment.patient?.name || 'Unknown Patient'}
                        </span>
                    </div>
                )}

                {appointment.reason && (
                    <div className="info-item">
                        <span className="info-label">Reason:</span>
                        <span className="info-value">{appointment.reason}</span>
                    </div>
                )}
            </div>

            {isUpcoming && appointment.status === 'SCHEDULED' && (
                <div className="appointment-card-footer">
                    <button
                        onClick={() => onCancel(appointment.id)}
                        className="btn-cancel-appointment"
                    >
                        <MdCancel />
                        Cancel Appointment
                    </button>
                </div>
            )}
        </div>
    );
}

export default AppointmentCard;
