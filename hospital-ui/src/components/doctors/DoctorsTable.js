import React from 'react';
import { MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import './DoctorsTable.css';

function DoctorsTable({ doctors, onEdit, onDelete, onView }) {
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getStatusBadge = (status) => {
        const isActive = (status || 'ACTIVE').toUpperCase() === 'ACTIVE';
        return (
            <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                {isActive ? 'Active' : 'Inactive'}
            </span>
        );
    };

    return (
        <div className="doctors-table-container">
            <table className="doctors-table">
                <thead>
                    <tr>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Specialization</th>
                        <th>Experience</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map(doctor => (
                        <tr key={doctor.id}>
                            <td>
                                <div className="doctor-photo-cell">
                                    {doctor.imageUrl ? (
                                        <img src={doctor.imageUrl} alt={doctor.name} />
                                    ) : (
                                        <div className="doctor-avatar-small">{getInitials(doctor.name)}</div>
                                    )}
                                </div>
                            </td>
                            <td className="doctor-name-cell">{doctor.name}</td>
                            <td>{doctor.specialization || '-'}</td>
                            <td>{doctor.experience ? `${doctor.experience} years` : '-'}</td>
                            <td>{doctor.contactNumber || '-'}</td>
                            <td className="email-cell">{doctor.email || '-'}</td>
                            <td>{getStatusBadge(doctor.status)}</td>
                            <td>
                                <div className="action-buttons">
                                    <button
                                        onClick={() => onView(doctor)}
                                        className="btn-action view"
                                        title="View Details"
                                    >
                                        <MdVisibility />
                                    </button>
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(doctor)}
                                            className="btn-action edit"
                                            title="Edit"
                                        >
                                            <MdEdit />
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(doctor.id)}
                                            className="btn-action delete"
                                            title="Delete"
                                        >
                                            <MdDelete />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DoctorsTable;
