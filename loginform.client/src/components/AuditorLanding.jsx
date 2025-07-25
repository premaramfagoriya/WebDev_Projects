import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuditorLanding.css';
import heroImage from '../assets/GMS.jpeg'; 

const AuditorLanding = () => {
    const navigate = useNavigate();

    return (
        <div className="auditor-landing-wrapper">
            <nav className="auditor-navbar">
                <button className="auditor-signout-btn" onClick={() => navigate('/login')}>Sign Out</button>
                <div className="auditor-navbar-links">
                    <span className="auditor-link" onClick={() => navigate('/')}>Home</span>
                    <span className="auditor-welcome">Welcome, Auditor</span>
                </div>
            </nav>

           
            <div className="auditor-hero-section">
                <div className="auditor-left">
                    <h1 className="auditor-title">
                        Insightful <span>Analysis</span>, <br />Accountable <span>Oversight</span>.
                    </h1>
                    <p className="auditor-description">
                        Gain a deep understanding of grievance resolutions and team responsiveness through our auditor dashboard.
                    </p>
                    <div className="auditor-buttons">
                        <button className="btn-track" onClick={() => navigate('/auditor-reports')}>📊 View Reports</button>
                        <button className="btn-analytics" onClick={() => navigate('/auditor/charts')}>📈 View Charts</button>
                    </div>
                </div>

                <div className="auditor-right">
                    <img src={heroImage} alt="Auditor Dashboard Illustration" />
                </div>
            </div>
        </div>
    );
};

export default AuditorLanding;
