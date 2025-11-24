import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Login.css';

function Login({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [activeTab, setActiveTab] = useState('PATIENT'); // 'PATIENT' or 'ADMIN'
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'PATIENT',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTabChange = (role) => {
        setActiveTab(role);
        setFormData(prev => ({ ...prev, role: role }));
        setError('');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login
                const response = await authAPI.login({
                    username: formData.username,
                    password: formData.password,
                });

                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('role', response.data.role);

                onLoginSuccess();
            } else {
                // Register
                await authAPI.register(formData);
                setIsLogin(true);
                setError('Registration successful! Please login.');
                setFormData({ ...formData, password: '' });
            }
        } catch (err) {
            console.error('Login/Register Error:', err);
            setError(
                err.response?.data?.error ||
                'An error occurred. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>🏥 Hospital Management</h1>
                    <p>{isLogin ? 'Welcome Back' : 'Create Account'}</p>
                </div>

                {/* Login Tabs */}
                {isLogin && (
                    <div className="login-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'PATIENT' ? 'active' : ''}`}
                            onClick={() => handleTabChange('PATIENT')}
                            type="button"
                        >
                            Patient Login
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'ADMIN' ? 'active' : ''}`}
                            onClick={() => handleTabChange('ADMIN')}
                            type="button"
                        >
                            Admin Login
                        </button>
                    </div>
                )}

                {error && (
                    <div className={`alert ${error.includes('successful') ? 'success' : 'error'}`}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter your username"
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Role selection hidden for login, shown for register */}
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="PATIENT">Patient</option>
                                <option value="DOCTOR">Doctor</option>
                                <option value="ADMIN">Administrator</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : (isLogin ? `Login as ${activeTab === 'PATIENT' ? 'Patient' : 'Admin'}` : 'Register')}
                    </button>
                </form>

                <div className="login-footer">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="btn-link"
                    >
                        {isLogin
                            ? "Don't have an account? Register"
                            : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
