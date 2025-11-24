import React from 'react';
import { MdEdit, MdDelete, MdVisibility, MdScience } from 'react-icons/md';
import './PatientsTable.css';

function PatientsTable({ patients, onEdit, onDelete, onView, onAddLabTests }) {
    const getGenderIcon = (gender) => {
        if (gender?.toLowerCase() === 'male') return '👨';
        if (gender?.toLowerCase() === 'female') return '👩';
        return '👤';
    };

    const truncateText = (text, maxLength = 30) => {
        if (!text) return '-';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className="patients-table-container">
            <table className="patients-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Contact</th>
                        <th>Doctor</th>
                        <th>Medical History</th>
                        <th>Lab Tests</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <tr key={patient.id}>
                            <td className="patient-id-cell">#{patient.id}</td>
                            <td className="patient-name-cell">{patient.name}</td>
                            <td>{patient.age || '-'}</td>
                            <td>
                                <span className="gender-cell">
                                    {getGenderIcon(patient.gender)} {patient.gender || '-'}
                                </span>
                            </td>
                            <td>{patient.contactNumber || '-'}</td>
                            <td className="doctor-cell">
                                {patient.doctor ? patient.doctor.name : 'Not assigned'}
                            </td>
                            <td className="medical-history-cell" title={patient.medicalHistory}>
                                {truncateText(patient.medicalHistory)}
                            </td>
                            <td className="lab-tests-cell">
                                {patient.labTestsRequired ? (
                                    <span className="has-tests">✓ Required</span>
                                ) : (
                                    <span className="no-tests">-</span>
                                )}
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button
                                        onClick={() => onView(patient)}
                                        className="btn-action view"
                                        title="View Details"
                                    >
                                        <MdVisibility />
                                    </button>
                                    <button
                                        onClick={() => onEdit(patient)}
                                        className="btn-action edit"
                                        title="Edit"
                                    >
                                        <MdEdit />
                                    </button>
                                    <button
                                        onClick={() => onAddLabTests(patient)}
                                        className="btn-action lab-tests"
                                        title="Add Lab Tests"
                                    >
                                        <MdScience />
                                    </button>
                                    <button
                                        onClick={() => onDelete(patient.id)}
                                        className="btn-action delete"
                                        title="Delete"
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PatientsTable;
