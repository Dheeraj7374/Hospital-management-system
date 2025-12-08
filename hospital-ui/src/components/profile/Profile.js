import React, { useState, useEffect } from 'react';
import { MdPerson, MdEmail, MdPhone, MdWork, MdEdit, MdSave, MdCameraAlt } from 'react-icons/md';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState({
        name: 'Admin User',
        email: 'admin@hospital.com',
        role: 'ADMIN',
        phone: '+1 234 567 8900',
        bio: 'Hospital Administrator with 10+ years of experience in healthcare management.',
        joinDate: '2023-01-15',
        imageUrl: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });

    useEffect(() => {
        
        
        
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setUser(editedUser);
        setIsEditing(false);
        
        alert('Profile updated successfully!');
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="profile-container">
            <div className="profile-header-card">
                <div className="profile-cover"></div>
                <div className="profile-avatar-section">
                    <div className="profile-avatar-wrapper">
                        {user.imageUrl ? (
                            <img src={user.imageUrl} alt={user.name} className="profile-avatar" />
                        ) : (
                            <div className="profile-avatar-placeholder">{getInitials(user.name)}</div>
                        )}
                        {isEditing && (
                            <button className="change-photo-btn">
                                <MdCameraAlt />
                            </button>
                        )}
                    </div>
                    <div className="profile-title">
                        <h1>{user.name}</h1>
                        <span className="role-badge">{user.role}</span>
                    </div>
                    <button
                        className={`edit-profile-btn ${isEditing ? 'saving' : ''}`}
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                        {isEditing ? <><MdSave /> Save Changes</> : <><MdEdit /> Edit Profile</>}
                    </button>
                </div>
            </div>

            <div className="profile-content-grid">
                <div className="profile-card info-card">
                    <h3>Personal Information</h3>
                    <div className="info-list">
                        <div className="info-item">
                            <div className="info-icon"><MdPerson /></div>
                            <div className="info-data">
                                <label>Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedUser.name}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{user.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon"><MdEmail /></div>
                            <div className="info-data">
                                <label>Email Address</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={editedUser.email}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{user.email}</p>
                                )}
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon"><MdPhone /></div>
                            <div className="info-data">
                                <label>Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editedUser.phone}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{user.phone}</p>
                                )}
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon"><MdWork /></div>
                            <div className="info-data">
                                <label>Role</label>
                                <p>{user.role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-card bio-card">
                    <h3>About Me</h3>
                    {isEditing ? (
                        <textarea
                            name="bio"
                            value={editedUser.bio}
                            onChange={handleChange}
                            rows="6"
                            className="bio-input"
                        />
                    ) : (
                        <p className="bio-text">{user.bio}</p>
                    )}

                    <div className="join-date">
                        <span>Member since {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
