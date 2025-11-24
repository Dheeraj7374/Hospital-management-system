import React, { useState } from 'react';
import { doctorAPI } from '../../services/api';
import { MdClose } from 'react-icons/md';
import './EditDoctorModal.css';

function EditDoctorModal({ doctor, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: doctor.name || '',
        email: doctor.email || '',
        contactNumber: doctor.contactNumber || '',
        specialization: doctor.specialization || '',
        experience: doctor.experience || '',
        qualification: doctor.qualification || '',
        consultationFee: doctor.consultationFee || '',
        bio: doctor.bio || '',
        imageUrl: doctor.imageUrl || '',
        status: doctor.status || 'ACTIVE'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [certificateFile, setCertificateFile] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);

    const specializations = [
        'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
        'Dermatology', 'General Medicine', 'Surgery', 'ENT',
        'Psychiatry', 'Gynecology'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Invalid email format');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const doctorData = {
                ...formData,
                experience: formData.experience ? parseInt(formData.experience) : null,
                consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : null
            };

            await doctorAPI.update(doctor.id, doctorData);

            if (certificateFile) {
                const formData = new FormData();
                formData.append('file', certificateFile);
                await doctorAPI.uploadCertificate(doctor.id, formData);
            }

            if (photoFile) {
                const formData = new FormData();
                formData.append('file', photoFile);
                await doctorAPI.uploadPhoto(doctor.id, formData);
            }

            alert('Doctor updated successfully!');
            onSuccess();
        } catch (err) {
            console.error('Error updating doctor:', err);
            setError('Failed to update doctor. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content edit-doctor-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Doctor</h2>
                    <button onClick={onClose} className="close-btn">
                        <MdClose />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="doctor-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Contact Number</label>
                            <input
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Specialization</label>
                            <select
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                            >
                                <option value="">Select Specialization</option>
                                {specializations.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Experience (years)</label>
                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Qualification</label>
                        <input
                            type="text"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Profile Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPhotoFile(e.target.files[0])}
                        />
                        {doctor.imageUrl && (
                            <div className="current-file">
                                <img
                                    src={doctor.imageUrl.startsWith('http') ? doctor.imageUrl : `http://localhost:8081${doctor.imageUrl}`}
                                    alt="Current Profile"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginTop: '5px', borderRadius: '50%' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Bio / Description</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Degree Certificate</label>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setCertificateFile(e.target.files[0])}
                        />
                        {doctor.certificateUrl && (
                            <div className="current-file">
                                <a href={`http://localhost:8081${doctor.certificateUrl}`} target="_blank" rel="noopener noreferrer">
                                    View Current Certificate
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditDoctorModal;
