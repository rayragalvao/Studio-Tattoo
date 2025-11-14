    import React from 'react';
import './dashboardCard.css';

const DashboardCard = ({ titulo, children, className = '' }) => (
    <div className={`dashboard-card ${className}`}>
        {titulo && <h3>{titulo}</h3>}
        <div className="card-content">
            {children}
        </div>
    </div>
);

export default DashboardCard;