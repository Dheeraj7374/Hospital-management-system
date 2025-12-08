import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    MdDashboard,
    MdPeople,
    MdPerson,
    MdEventNote,
    MdAttachMoney,
    MdAssessment,
    MdSettings
} from 'react-icons/md';
import './Sidebar.css';

function Sidebar({ role }) {
    const allMenuItems = [
        { path: '/dashboard', icon: MdDashboard, label: 'Dashboard', roles: ['ADMIN', 'PATIENT', 'DOCTOR'] },
        { path: '/doctors', icon: MdPeople, label: 'Doctors', roles: ['ADMIN', 'PATIENT'] },
        { path: '/patients', icon: MdPerson, label: 'Patients', roles: ['ADMIN', 'DOCTOR'] },
        { path: '/appointments', icon: MdEventNote, label: 'Appointments', roles: ['ADMIN', 'PATIENT', 'DOCTOR'] },
        { path: '/billing', icon: MdAttachMoney, label: 'Billing', roles: ['ADMIN', 'PATIENT'] },
        { path: '/reports', icon: MdAssessment, label: 'Reports', roles: ['ADMIN', 'PATIENT'] },
        { path: '/profile', icon: MdPerson, label: 'Profile', roles: ['ADMIN', 'PATIENT', 'DOCTOR'] },
        { path: '/settings', icon: MdSettings, label: 'Settings', roles: ['ADMIN'] },
    ];


    const menuItems = allMenuItems.filter(item => item.roles.includes(role));

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">🏥</div>
                <h2>HMS</h2>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? 'nav-item active' : 'nav-item'
                        }
                    >
                        <item.icon className="nav-icon" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar;
