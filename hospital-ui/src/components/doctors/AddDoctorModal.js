import React, { useState } from 'react';
import { doctorAPI } from '../../services/api';
import { MdClose } from 'react-icons/md';
import './AddDoctorModal.css';

function AddDoctorModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        specialization: '',
        experience: '',
        qualification: '',
        consultationFee: '',
        bio: '',
        imageUrl: '',
        status: 'ACTIVE'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        if (!formData.contactNumber.trim()) {
            setError('Contact number is required');
            return false;
        }
        if (!formData.specialization) {
            setError('Specialization is required');
            return false;
        }
        if (!formData.experience || formData.experience < 0) {
            setError('Valid experience is required');
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
                experience: parseInt(formData.experience),
                consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : null
            };

            await doctorAPI.create(doctorData);
            alert('Doctor added successfully!');
            onSuccess();
        } catch (err) {
            console.error('Error adding doctor:', err);
            setError('Failed to add doctor. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content add-doctor-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Doctor</h2>
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
                                placeholder="Dr. John Doe"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="doctor@hospital.com"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Contact Number *</label>
                            <input
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="+1234567890"
                            />
                        </div>

                        <div className="form-group">
                            <label>Specialization *</label>
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
                            <label>Experience (years) *</label>
                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                step="0.01"
                                placeholder="100.00"
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
                            placeholder="MBBS, MD"
                        />
                    </div>

                    <div className="form-group">
                        <label>Photo URL</label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/photo.jpg"
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio / Description</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Brief description about the doctor..."
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

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Doctor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddDoctorModal;
