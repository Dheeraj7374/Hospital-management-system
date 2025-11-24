import React, { useState, useEffect } from 'react';
import { doctorAPI, appointmentAPI } from '../../services/api';
import { MdAdd, MdSearch, MdViewModule, MdViewList } from 'react-icons/md';
import DoctorsTable from './DoctorsTable';
import AddDoctorModal from './AddDoctorModal';
import EditDoctorModal from './EditDoctorModal';
import DoctorDetailsModal from './DoctorDetailsModal';
import './DoctorsManagement.css';

function DoctorsManagement() {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpec, setFilterSpec] = useState('all');
    const [filterExp, setFilterExp] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
    const [loading, setLoading] = useState(true);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        loadDoctors();
    }, []);

    useEffect(() => {
        filterAndSortDoctors();
    }, [doctors, searchTerm, filterSpec, filterExp, filterStatus, sortBy]);

    const loadDoctors = async () => {
        try {
            const response = await doctorAPI.getAll();
            setDoctors(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading doctors:', error);
            setLoading(false);
        }
    };

    const filterAndSortDoctors = () => {
        let filtered = [...doctors];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(doc =>
                doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Specialization filter
        if (filterSpec !== 'all') {
            filtered = filtered.filter(doc => doc.specialization === filterSpec);
        }

        // Experience filter
        if (filterExp !== 'all') {
            filtered = filtered.filter(doc => {
                const exp = doc.experience || 0;
                if (filterExp === '0-5') return exp >= 0 && exp <= 5;
                if (filterExp === '5-10') return exp > 5 && exp <= 10;
                if (filterExp === '10+') return exp > 10;
                return true;
            });
        }

        // Status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(doc =>
                (doc.status || 'ACTIVE').toUpperCase() === filterStatus.toUpperCase()
            );
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortBy === 'experience') {
                return (b.experience || 0) - (a.experience || 0);
            }
            return 0;
        });

        setFilteredDoctors(filtered);
    };

    const handleAddDoctor = () => {
        setShowAddModal(true);
    };

    const handleEditDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setShowEditModal(true);
    };

    const handleViewDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setShowDetailsModal(true);
    };

    const handleDeleteDoctor = async (doctorId) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) {
            return;
        }

        try {
            await doctorAPI.delete(doctorId);
            alert('Doctor deleted successfully');
            loadDoctors();
        } catch (error) {
            console.error('Error deleting doctor:', error);
            alert('Failed to delete doctor');
        }
    };

    const handleModalSuccess = () => {
        loadDoctors();
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDetailsModal(false);
    };

    const stats = {
        total: doctors.length,
        active: doctors.filter(d => (d.status || 'ACTIVE').toUpperCase() === 'ACTIVE').length,
        inactive: doctors.filter(d => (d.status || '').toUpperCase() === 'INACTIVE').length
    };

    const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];

    if (loading) {
        return <div className="doctors-management-loading">Loading doctors...</div>;
    }

    return (
        <div className="doctors-management-container">
            {/* Header */}
            <div className="doctors-header">
                <div>
                    <h1>Doctors Management</h1>
                    <p>Manage hospital doctors and their information</p>
                </div>
                {localStorage.getItem('role') !== 'PATIENT' && (
                    <button onClick={handleAddDoctor} className="btn-add-doctor">
                        <MdAdd />
                        Add Doctor
                    </button>
                )}
            </div>

            {/* Statistics */}
            <div className="doctors-stats">
                <div className="stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Doctors</div>
                </div>
                <div className="stat-card active">
                    <div className="stat-value">{stats.active}</div>
                    <div className="stat-label">Active</div>
                </div>
                <div className="stat-card inactive">
                    <div className="stat-value">{stats.inactive}</div>
                    <div className="stat-label">Inactive</div>
                </div>
            </div>

            {/* Filters */}
            <div className="doctors-filters">
                <div className="search-box">
                    <MdSearch />
                    <input
                        type="text"
                        placeholder="Search by name, email, or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select value={filterSpec} onChange={(e) => setFilterSpec(e.target.value)}>
                    <option value="all">All Specializations</option>
                    {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>

                <select value={filterExp} onChange={(e) => setFilterExp(e.target.value)}>
                    <option value="all">All Experience</option>
                    <option value="0-5">0-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                </select>

                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </select>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="name">Sort by Name</option>
                    <option value="experience">Sort by Experience</option>
                </select>

                <div className="view-toggle">
                    <button
                        className={viewMode === 'table' ? 'active' : ''}
                        onClick={() => setViewMode('table')}
                    >
                        <MdViewList />
                    </button>
                    <button
                        className={viewMode === 'card' ? 'active' : ''}
                        onClick={() => setViewMode('card')}
                    >
                        <MdViewModule />
                    </button>
                </div>
            </div>

            {/* Content */}
            {filteredDoctors.length > 0 ? (
                <DoctorsTable
                    doctors={filteredDoctors}
                    onEdit={localStorage.getItem('role') === 'PATIENT' ? null : handleEditDoctor}
                    onDelete={localStorage.getItem('role') === 'PATIENT' ? null : handleDeleteDoctor}
                    onView={handleViewDoctor}
                />
            ) : (
                <div className="no-doctors">
                    <p>No doctors found</p>
                    {localStorage.getItem('role') !== 'PATIENT' && (
                        <button onClick={handleAddDoctor} className="btn-add-first">
                            <MdAdd /> Add First Doctor
                        </button>
                    )}
                </div>
            )}

            {/* Modals */}
            {showAddModal && (
                <AddDoctorModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleModalSuccess}
                />
            )}

            {showEditModal && selectedDoctor && (
                <EditDoctorModal
                    doctor={selectedDoctor}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleModalSuccess}
                />
            )}

            {showDetailsModal && selectedDoctor && (
                <DoctorDetailsModal
                    doctor={selectedDoctor}
                    onClose={() => setShowDetailsModal(false)}
                    onEdit={() => {
                        setShowDetailsModal(false);
                        setShowEditModal(true);
                    }}
                    onDelete={handleDeleteDoctor}
                />
            )}
        </div>
    );
}

export default DoctorsManagement;
