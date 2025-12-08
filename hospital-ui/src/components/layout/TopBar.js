import React from 'react';
import { MdPerson, MdCalendarToday } from 'react-icons/md';
import './TopBar.css';

function TopBar({ onLogout, username, role }) {
    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="topbar">
            <div className="topbar-left">
                {}
            </div>

            <div className="topbar-right">
                <div className="date-display">
                    <MdCalendarToday />
                    <span>{currentDate}</span>
                </div>

                <div className="user-profile">
                    <button className="profile-btn" onClick={() => window.location.href = '/profile'}>
                        <MdPerson />
                    </button>
                    <div className="profile-dropdown">
                        <div className="profile-info">
                            <p className="profile-name">{username}</p>
                            <p className="profile-role">{role}</p>
                        </div>
                        <button onClick={onLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopBar;
