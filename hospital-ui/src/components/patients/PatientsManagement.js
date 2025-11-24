import React, { useState, useEffect } from 'react';
import { patientAPI, doctorAPI, appointmentAPI } from '../../services/api';
import { MdAdd, MdSearch } from 'react-icons/md';
import PatientsTable from './PatientsTable';
import AddPatientModal from './AddPatientModal';
import EditPatientModal from './EditPatientModal';
import PatientDetailsModal from './PatientDetailsModal';
import AddLabTestsModal from './AddLabTestsModal';
import './PatientsManagement.css';

function PatientsManagement() {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('all');
    const [filterDoctor, setFilterDoctor] = useState('all');
    const [filterAge, setFilterAge] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [loading, setLoading] = useState(true);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showLabTestsModal, setShowLabTestsModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        loadPatients();
        loadDoctors();
    }, []);

    useEffect(() => {
        filterAndSortPatients();
    }, [patients, searchTerm, filterGender, filterDoctor, filterAge, sortBy]);

    const loadPatients = async () => {
        try {
            const response = await patientAPI.getAll();
            setPatients(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading patients:', error);
            setLoading(false);
        }
    };

    const loadDoctors = async () => {
        try {
            const response = await doctorAPI.getAll();
            setDoctors(response.data.filter(d => (d.status || 'ACTIVE').toUpperCase() === 'ACTIVE'));
        } catch (error) {
            console.error('Error loading doctors:', error);
        }
    };

    const filterAndSortPatients = () => {
        let filtered = [...patients];

        // Search filter - includes ID, name, contact, doctor
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(patient => {
                const idMatch = patient.id?.toString() === searchTerm; // Exact ID match
                const nameMatch = patient.name?.toLowerCase().includes(term);
                const contactMatch = patient.contactNumber?.toLowerCase().includes(term);
                const doctorMatch = patient.doctor?.name?.toLowerCase().includes(term);
                return idMatch || nameMatch || contactMatch || doctorMatch;
            });
        }

        // Gender filter
        if (filterGender !== 'all') {
            filtered = filtered.filter(p => p.gender?.toLowerCase() === filterGender.toLowerCase());
        }

        // Doctor filter
        if (filterDoctor !== 'all') {
            filtered = filtered.filter(p => p.doctor?.id?.toString() === filterDoctor);
        }

        // Age filter
        if (filterAge !== 'all') {
            filtered = filtered.filter(p => {
                const age = p.age || 0;
                if (filterAge === '0-18') return age >= 0 && age <= 18;
                if (filterAge === '18-60') return age > 18 && age <= 60;
                if (filterAge === '60+') return age > 60;
                return true;
            });
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'name') {
                return (a.name || '').localeCompare(b.name || '');
            } else if (sortBy === 'age') {
                return (a.age || 0) - (b.age || 0);
            }
            return 0;
        });

        setFilteredPatients(filtered);
    };

    const handleAddPatient = () => {
        setShowAddModal(true);
    };

    const handleEditPatient = (patient) => {
        setSelectedPatient(patient);
        setShowEditModal(true);
    };

    const handleViewPatient = (patient) => {
        setSelectedPatient(patient);
        setShowDetailsModal(true);
    };

    const handleAddLabTests = (patient) => {
        setSelectedPatient(patient);
        setShowLabTestsModal(true);
    };

    const handleDeletePatient = async (patientId) => {
        if (!window.confirm('Are you sure you want to delete this patient?')) {
            return;
        }

        try {
            await patientAPI.delete(patientId);
            alert('Patient deleted successfully');
            loadPatients();
        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Failed to delete patient');
        }
    };

    const handleModalSuccess = () => {
        loadPatients();
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDetailsModal(false);
        setShowLabTestsModal(false);
    };

    const stats = {
        total: patients.length,
        male: patients.filter(p => p.gender?.toLowerCase() === 'male').length,
        female: patients.filter(p => p.gender?.toLowerCase() === 'female').length,
        withDoctor: patients.filter(p => p.doctor).length
    };

    if (loading) {
        return <div className="patients-management-loading">Loading patients...</div>;
    }

    return (
        <div className="patients-management-container">
            {/* Header */}
            <div className="patients-header">
                <div>
                    <h1>Patients Management</h1>
                    <p>Manage patient records and medical information</p>
                </div>
                <button onClick={handleAddPatient} className="btn-add-patient">
                    <MdAdd />
                    Add Patient
                </button>
            </div>

            {/* Statistics */}
            <div className="patients-stats">
                <div className="stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Patients</div>
                </div>
                <div className="stat-card male">
                    <div className="stat-value">{stats.male}</div>
                    <div className="stat-label">Male</div>
                </div>
                <div className="stat-card female">
                    <div className="stat-value">{stats.female}</div>
                    <div className="stat-label">Female</div>
                </div>
                <div className="stat-card assigned">
                    <div className="stat-value">{stats.withDoctor}</div>
                    <div className="stat-label">With Doctor</div>
                </div>
            </div>

            {/* Filters */}
            <div className="patients-filters">
                <div className="search-box">
                    <MdSearch />
                    <input
                        type="text"
                        placeholder="Search by ID, name, contact, or doctor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>

                <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)}>
                    <option value="all">All Doctors</option>
                    {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                    ))}
                </select>

                <select value={filterAge} onChange={(e) => setFilterAge(e.target.value)}>
                    <option value="all">All Ages</option>
                    <option value="0-18">Children (0-18)</option>
                    <option value="18-60">Adults (18-60)</option>
                    <option value="60+">Seniors (60+)</option>
                </select>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="name">Sort by Name</option>
                    <option value="age">Sort by Age</option>
                </select>
            </div>

            {/* Content */}
            {filteredPatients.length > 0 ? (
                <PatientsTable
                    patients={filteredPatients}
                    onEdit={handleEditPatient}
                    onDelete={handleDeletePatient}
                    onView={handleViewPatient}
                    onAddLabTests={handleAddLabTests}
                />
            ) : (
                <div className="no-patients">
                    <p>No patients found</p>
                    <button onClick={handleAddPatient} className="btn-add-first">
                        <MdAdd /> Add First Patient
                    </button>
                </div>
            )}

            {/* Modals */}
            {showAddModal && (
                <AddPatientModal
                    doctors={doctors}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleModalSuccess}
                />
            )}

            {showEditModal && selectedPatient && (
                <EditPatientModal
                    patient={selectedPatient}
                    doctors={doctors}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleModalSuccess}
                />
            )}

            {showDetailsModal && selectedPatient && (
                <PatientDetailsModal
                    patient={selectedPatient}
                    onClose={() => setShowDetailsModal(false)}
                    onEdit={() => {
                        setShowDetailsModal(false);
                        setShowEditModal(true);
                    }}
                    onDelete={handleDeletePatient}
                />
            )}

            {showLabTestsModal && selectedPatient && (
                <AddLabTestsModal
                    patient={selectedPatient}
                    onClose={() => setShowLabTestsModal(false)}
                    onSuccess={handleModalSuccess}
                />
            )}
        </div>
    );
}

export default PatientsManagement;
