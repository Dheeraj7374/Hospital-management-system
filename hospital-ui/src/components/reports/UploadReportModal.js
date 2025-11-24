import React, { useState, useEffect } from 'react';
import { MdClose, MdCloudUpload } from 'react-icons/md';
import { reportAPI, patientAPI, doctorAPI } from '../../services/api';
import './UploadReportModal.css';

function UploadReportModal({ onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        patientName: '',
        doctorName: '',
        testName: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [patientsRes, doctorsRes] = await Promise.all([
                patientAPI.getAll(),
                doctorAPI.getAll()
            ]);
            setPatients(patientsRes.data);
            setDoctors(doctorsRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !formData.patientName || !formData.doctorName || !formData.testName) {
            alert('Please fill all fields and select a file');
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('patientName', formData.patientName);
        data.append('doctorName', formData.doctorName);
        data.append('testName', formData.testName);

        try {
            await reportAPI.upload(data);
            alert('Report uploaded successfully!');
            onSuccess();
        } catch (error) {
            console.error('Error uploading report:', error);
            alert('Failed to upload report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content upload-modal">
                <div className="modal-header">
                    <h2>Upload Lab Report</h2>
                    <button onClick={onClose} className="close-btn">
                        <MdClose />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Patient Name</label>
                        <select
                            value={formData.patientName}
                            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                            required
                        >
                            <option value="">Select Patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Doctor Name</label>
                        <select
                            value={formData.doctorName}
                            onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                            required
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.name}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Test Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Blood Test, X-Ray"
                            value={formData.testName}
                            onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Report File</label>
                        <div className="file-upload-box">
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                            />
                            <div className="upload-placeholder">
                                <MdCloudUpload />
                                <span>{file ? file.name : 'Click to upload file'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Uploading...' : 'Upload Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UploadReportModal;
