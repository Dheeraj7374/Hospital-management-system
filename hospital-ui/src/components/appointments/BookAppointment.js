import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import DoctorCard from '../dashboard/DoctorCard';
import BookingModal from './BookingModal';
import { MdSearch } from 'react-icons/md';
import './BookAppointment.css';

function BookAppointment() {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDoctors();
    }, []);

    useEffect(() => {
        filterDoctors();
    }, [searchTerm, doctors]);

    const loadDoctors = async () => {
        try {
            const response = await doctorAPI.getAll();
            setDoctors(response.data);
            setFilteredDoctors(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading doctors:', error);
            setLoading(false);
        }
    };

    const filterDoctors = () => {
        if (!searchTerm) {
            setFilteredDoctors(doctors);
            return;
        }

        const filtered = doctors.filter(doctor =>
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDoctors(filtered);
    };

    const handleBookClick = (doctor) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    const handleBookingSuccess = () => {
        setShowModal(false);
        setSelectedDoctor(null);
    };

    if (loading) {
        return (
            <div className="book-appointment-container">
                <div className="loading">Loading doctors...</div>
            </div>
        );
    }

    return (
        <div className="book-appointment-container">
            <div className="page-header">
                <h1>Book an Appointment</h1>
                <p>Select a doctor to schedule your visit</p>
            </div>

            <div className="search-section">
                <div className="search-box-large">
                    <MdSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by doctor name or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="doctors-grid-booking">
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doctor => (
                        <div key={doctor.id} className="doctor-card-wrapper">
                            <DoctorCard doctor={doctor} />
                            <button
                                onClick={() => handleBookClick(doctor)}
                                className="btn-book-appointment"
                            >
                                Book Appointment
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No doctors found matching your search.</p>
                    </div>
                )}
            </div>

            {showModal && selectedDoctor && (
                <BookingModal
                    doctor={selectedDoctor}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
}

export default BookAppointment;
