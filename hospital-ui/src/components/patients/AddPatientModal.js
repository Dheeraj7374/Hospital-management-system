import React, { useState } from 'react';
import { patientAPI } from '../../services/api';
import { MdClose } from 'react-icons/md';
import LabTestSelector from './LabTestSelector';
import './AddPatientModal.css';

function AddPatientModal({ doctors, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        contactNumber: '',
        medicalHistory: '',
        labTestsRequired: '',
        doctor: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'doctor') {
            const doctorId = value ? parseInt(value) : null;
            setFormData(prev => ({ ...prev, doctor: doctorId ? { id: doctorId } : null }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleLabTestsChange = (value) => {
        setFormData(prev => ({ ...prev, labTestsRequired: value }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.age || formData.age < 1 || formData.age > 120) {
            setError('Valid age is required (1-120)');
            return false;
        }
        if (!formData.gender) {
            setError('Gender is required');
            return false;
        }
        if (!formData.contactNumber.trim()) {
            setError('Contact number is required');
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
            const patientData = {
                ...formData,
                age: parseInt(formData.age)
            };

            await patientAPI.create(patientData);
            alert('Patient added successfully!');
            onSuccess();
        } catch (err) {
            console.error('Error adding patient:', err);
            setError('Failed to add patient. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content add-patient-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Patient</h2>
                    <button onClick={onClose} className="close-btn">
                        <MdClose />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="patient-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="form-group">
                            <label>Age *</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                min="1"
                                max="120"
                                placeholder="25"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Gender *</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

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
                    </div>

                    <div className="form-group">
                        <label>Assign Doctor</label>
                        <select
                            name="doctor"
                            value={formData.doctor?.id || ''}
                            onChange={handleChange}
                        >
                            <option value="">No Doctor Assigned</option>
                            {doctors.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.name} - {doctor.specialization}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Medical History</label>
                        <textarea
                            name="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Previous conditions, allergies, surgeries..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Lab Tests Required</label>
                        <LabTestSelector
                            selectedTests={formData.labTestsRequired}
                            onChange={handleLabTestsChange}
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPatientModal;
