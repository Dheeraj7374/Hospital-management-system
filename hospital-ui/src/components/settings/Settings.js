import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import './Settings.css';

function Settings() {
    const [activeTab, setActiveTab] = useState('password');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    // Password Change State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

    // Admin Creation State
    const [adminData, setAdminData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [adminMsg, setAdminMsg] = useState({ type: '', text: '' });

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleAdminChange = (e) => {
        setAdminData({ ...adminData, [e.target.name]: e.target.value });
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        try {
            await authAPI.changePassword({
                username: username,
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPasswordMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update password' });
        }
    };

    const submitCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            await authAPI.createAdmin({
                requesterUsername: username,
                ...adminData
            });
            setAdminMsg({ type: 'success', text: 'New Admin created successfully!' });
            setAdminData({ username: '', password: '', email: '' });
        } catch (err) {
            console.error("Create Admin Error:", err);
            const errorMsg = err.response?.data?.error || err.message || 'Failed to create admin';
            setAdminMsg({ type: 'error', text: `Error: ${errorMsg}` });
        }
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>

            <div className="settings-tabs">
                <button
                    className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                >
                    Change Password
                </button>
                {role === 'ADMIN' && (
                    <button
                        className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        User Management
                    </button>
                )}
            </div>

            <div className="settings-content">
                {activeTab === 'password' && (
                    <div className="settings-card">
                        <h2>Change Password</h2>
                        {passwordMsg.text && (
                            <div className={`alert ${passwordMsg.type}`}>{passwordMsg.text}</div>
                        )}
                        <form onSubmit={submitPasswordChange}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary">Update Password</button>
                        </form>
                    </div>
                )}

                {activeTab === 'admin' && role === 'ADMIN' && (
                    <div className="settings-card">
                        <h2>Create New Admin</h2>
                        <p className="hint-text">Create a new administrator account. They will have full access to the system.</p>
                        {adminMsg.text && (
                            <div className={`alert ${adminMsg.type}`}>{adminMsg.text}</div>
                        )}
                        <form onSubmit={submitCreateAdmin}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={adminData.username}
                                    onChange={handleAdminChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={adminData.email}
                                    onChange={handleAdminChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={adminData.password}
                                    onChange={handleAdminChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary">Create Admin</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Settings;
