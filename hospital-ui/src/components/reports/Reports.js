import React, { useState, useEffect } from 'react';
import { reportAPI } from '../../services/api';
import { MdCloudUpload, MdCloudDownload, MdSearch, MdDescription } from 'react-icons/md';
import UploadReportModal from './UploadReportModal';
import './Reports.css';

function Reports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            let params = {};
            if (role === 'PATIENT') {
                params.patientName = username;
            }
            const response = await reportAPI.getAll(params);
            setReports(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading reports:', error);
            setLoading(false);
        }
    };

    const handleDownload = async (report) => {
        try {
            const response = await reportAPI.download(report.id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', report.fileName); // or report.testName + '.pdf'
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Failed to download report');
        }
    };

    const filteredReports = reports.filter(report =>
        report.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="reports-container">
            <div className="page-header">
                <div className="header-content">
                    <div>
                        <h1>Lab Reports</h1>
                        <p>View and manage medical test reports</p>
                    </div>
                    {role === 'ADMIN' && (
                        <button
                            className="btn-upload"
                            onClick={() => setShowUploadModal(true)}
                        >
                            <MdCloudUpload /> Upload Report
                        </button>
                    )}
                </div>
            </div>

            <div className="reports-controls">
                <div className="search-box">
                    <MdSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by test, doctor, or patient..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading reports...</div>
            ) : (
                <div className="reports-grid">
                    {filteredReports.length > 0 ? (
                        filteredReports.map(report => (
                            <div key={report.id} className="report-card">
                                <div className="report-icon">
                                    <MdDescription />
                                </div>
                                <div className="report-details">
                                    <h3>{report.testName}</h3>
                                    <div className="report-meta">
                                        <p><strong>Patient:</strong> {report.patientName}</p>
                                        <p><strong>Doctor:</strong> {report.doctorName}</p>
                                        <p><strong>Date:</strong> {new Date(report.reportDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {role === 'PATIENT' && (
                                    <button
                                        className="btn-download"
                                        onClick={() => handleDownload(report)}
                                    >
                                        <MdCloudDownload /> Download
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-reports">
                            <p>No reports found.</p>
                        </div>
                    )}
                </div>
            )}

            {showUploadModal && (
                <UploadReportModal
                    onClose={() => setShowUploadModal(false)}
                    onSuccess={() => {
                        setShowUploadModal(false);
                        loadReports();
                    }}
                />
            )}
        </div>
    );
}

export default Reports;
