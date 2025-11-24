import React from 'react';
import './StatCard.css';

function StatCard({ title, value, icon: Icon, color, data }) {
    return (
        <div className="stat-card">
            <div className="stat-header">
                <div className="stat-info">
                    <p className="stat-title">{title}</p>
                    <h2 className="stat-value">{value}</h2>
                </div>
                <div className="stat-icon" style={{ background: `${color}20`, color }}>
                    <Icon />
                </div>
            </div>

            {/* Chart removed per user request */}

            {/* Legend removed as it was hardcoded and incorrect */}
        </div>
    );
}

export default StatCard;
