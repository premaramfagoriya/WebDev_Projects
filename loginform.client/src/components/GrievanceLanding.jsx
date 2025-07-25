import React, { useEffect, useState } from 'react';
import './GrievanceLanding.css';
import { useNavigate } from 'react-router-dom';
import ProfileImg from '../assets/GrievanceLandingprof.jpg'; // New image

const GrievanceLanding = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        const employeeData = JSON.parse(localStorage.getItem('employeeData'));
        if (employeeData?.name) {
            const name = employeeData.name;
            setUserName(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('employeeData');
        navigate('/login');
    };

    return (
        <div className="grievance-landing">
            {/* Navbar */}
            <header className="navbar">
                <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
                <nav className="nav-links">
                    <a onClick={() => navigate('/emp')}>Home</a>
                    <span className="welcome">Welcome, {userName}</span>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="main-section">
                <div className="text-section">
                    <h1>Your Voice, <span>Our Priority.</span></h1>
                    <p>
                        Efficiently manage and resolve your concerns with our intuitive Grievance Management System.
                    </p>
                    <div className="button-group">
                        <button className="track-btn" onClick={() => navigate('/track-requests')}>
                            Track Requests
                        </button>
                        <button className="grievance-btn" onClick={() => navigate('/submit-grievance')}>
                            Raise Grievance
                        </button>
                    </div>
                </div>

                <div className="image-section">
                    <img src={ProfileImg} alt="Grievance Illustration" />
                </div>
            </main>
        </div>
    );
};

export default GrievanceLanding;
