import React from 'react';
import './ComingSoon.css';

function ComingSoon({ title }) {
    return (
        <div className="coming-soon-container">
            <div className="coming-soon-content">
                <div className="icon-wrapper">
                    🚧
                </div>
                <h1>{title}</h1>
                <p>This feature is currently under development.</p>
                <p className="sub-text">Check back soon for updates!</p>
            </div>
        </div>
    );
}

export default ComingSoon;
