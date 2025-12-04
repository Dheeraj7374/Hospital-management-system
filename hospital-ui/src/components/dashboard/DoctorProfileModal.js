import React from 'react';
import { MdClose, MdEmail, MdPhone, MdWork } from 'react-icons/md';
import './DoctorProfileModal.css';

function DoctorProfileModal({ doctor, onClose }) {
    if (!doctor) return null;

    const imageUrl = doctor.imageUrl ? `http://localhost:8081${doctor.imageUrl}` : null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="doctor-profile-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <MdClose />
                </button>

                <div className="profile-header">
                    <div className="profile-image-container">
                        {imageUrl ? (
                            <img src={imageUrl} alt={doctor.name} className="profile-image" />
                        ) : (
                            <div className="profile-placeholder">
                                {doctor.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <h2>{doctor.name}</h2>
                    <span className="profile-specialization">{doctor.specialization}</span>
                </div>

                <div className="profile-body">
                    <div className="profile-section">
                        <h3>About</h3>
                        <p className="profile-bio">{doctor.bio || "No biography available."}</p>
                    </div>

                    <div className="profile-details-grid">
                        <div className="detail-card">
                            <MdWork className="detail-icon" />
                            <div className="detail-info">
                                <label>Experience</label>
                                <span>{doctor.experience} Years</span>
                            </div>
                        </div>

                        <div className="detail-card">
                            <MdEmail className="detail-icon" />
                            <div className="detail-info">
                                <label>Email</label>
                                <span>{doctor.email || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="detail-card">
                            <MdPhone className="detail-icon" />
                            <div className="detail-info">
                                <label>Contact</label>
                                <span>{doctor.contactNumber || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-qualification">
                        <h3>Qualification</h3>
                        <p>{doctor.qualification || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorProfileModal;
