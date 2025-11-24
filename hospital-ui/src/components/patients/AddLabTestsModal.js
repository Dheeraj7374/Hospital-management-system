import React, { useState } from 'react';
import { patientAPI } from '../../services/api';
import { MdClose, MdScience } from 'react-icons/md';
import LabTestSelector from './LabTestSelector';
import './AddLabTestsModal.css';

function AddLabTestsModal({ patient, onClose, onSuccess }) {
    const [labTests, setLabTests] = useState(patient.labTestsRequired || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const updatedPatient = {
                ...patient,
                labTestsRequired: labTests.trim()
            };

            await patientAPI.update(patient.id, updatedPatient);
            alert('Lab tests updated successfully!');
            onSuccess();
        } catch (err) {
            console.error('Error updating lab tests:', err);
            setError('Failed to update lab tests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content lab-tests-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2><MdScience /> Add Lab Tests</h2>
                        <p className="patient-info">For: {patient.name} (ID: #{patient.id})</p>
                    </div>
                    <button onClick={onClose} className="close-btn">
                        <MdClose />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="lab-tests-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Lab Tests Required</label>
                        <LabTestSelector
                            selectedTests={labTests}
                            onChange={setLabTests}
                        />
                        <small className="helper-text">
                            Search and select tests from the dropdown
                        </small>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Tests'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddLabTestsModal;
