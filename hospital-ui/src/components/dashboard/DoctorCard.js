import React, { useRef, useState } from 'react';
import { MdPerson, MdCameraAlt } from 'react-icons/md';
import { doctorAPI } from '../../services/api';
import DoctorProfileModal from './DoctorProfileModal';
import './DoctorCard.css';

function DoctorCard({ doctor, appointmentStats }) {
    const fileInputRef = useRef(null);
    const [showProfile, setShowProfile] = useState(false);
    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'ADMIN';

    const handleImageClick = (e) => {
        if (isAdmin && fileInputRef.current) {
            e.stopPropagation();
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await doctorAPI.uploadPhoto(doctor.id, formData);
            window.location.reload();
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Failed to upload photo');
        }
    };

    const imageUrl = doctor.imageUrl ? (doctor.imageUrl.startsWith('http') ? doctor.imageUrl : `http://localhost:8081${doctor.imageUrl}`) : null;

    return (
        <>
            <div className="doctor-card">
                <div className="doctor-image-container" onClick={handleImageClick}>
                    {imageUrl ? (
                        <img src={imageUrl} alt={doctor.name} className="doctor-image" />
                    ) : (
                        <div className="doctor-placeholder">
                            <MdPerson />
                        </div>
                    )}

                    {isAdmin && (
                        <div className="upload-overlay">
                            <MdCameraAlt />
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <div className="doctor-specialization">{doctor.specialization}</div>
                </div>

                <div className="doctor-details">
                    <div className="detail-item">
                        <span className="detail-label">Experience</span>
                        <span className="detail-value">{doctor.experience} Years</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Patients</span>
                        <span className="detail-value">{appointmentStats?.completed || 0}</span>
                    </div>
                </div>

                <div className="doctor-actions">
                    <button
                        className="btn-view-profile"
                        onClick={() => setShowProfile(true)}
                    >
                        View Profile
                    </button>
                </div>
            </div>

            {showProfile && (
                <DoctorProfileModal
                    doctor={doctor}
                    onClose={() => setShowProfile(false)}
                />
            )}
        </>
    );
}

export default DoctorCard;
