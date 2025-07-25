import React, { useState, useEffect } from 'react';
import './HRDashboard.css';
//import WelspunLogo from '../assets/welspunlogo.png';
import HomeBackground from '../assets/HRBG.png';
import { useNavigate } from 'react-router-dom';

const HRDashboard = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [userName, setUserName] = useState('');

    const handleDropdownToggle = () => {
        setShowDropdown(prev => !prev);
    };

    const handleNavigate = (path) => {
        navigate(path);
        setShowDropdown(false);
    };

    useEffect(() => {
        const employeeData = JSON.parse(localStorage.getItem('employeeData'));
        setUserName(employeeData?.name || 'User');
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('employeeData');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="top-header">
                <div className="left">
                    {/*<img src={WelspunLogo} alt="Welspun" className="logo" />*/}
                    <span className="system-title">Grievance Management System</span>
                </div>
                <div className="right">
                    <a onClick={() => navigate('/hr')}>Home</a>
                    <span className="welcome">| Welcome @{userName}</span>
                </div>
            </div>

            <div className="tab-menu">
                <a className="tab-item" onClick={() => navigate('/hr')}>HOME</a>
                <div className="tab-item dropdown-trigger" onClick={handleDropdownToggle}>
                    Registration Report ▾
                    {showDropdown && (
                        <div className="dropdown-content">
                            <a onClick={() => handleNavigate('/pending-reports')}>Pending Reports</a>
                            <a onClick={() => handleNavigate('/completed-reports')}>Completed Report</a>
                            <a onClick={() => handleNavigate('/all-reports')}>All Report</a>
                            <a onClick={() => handleNavigate('/hr-charts')}>All CHarts</a>
                        </div>
                    )}
                </div>
                <a className="tab-item" onClick={handleSignOut}>Sign Out</a>
            </div>

            <div
                className="home-container"
                style={{ backgroundImage: `url(${HomeBackground})` }}
            ></div>

            <footer className="footer">
                <p>This site is best viewed with Internet Explorer 7.0 or higher; Firefox 3.0 or higher at a minimum screen resolution of 1024x768</p>
                <p><strong>Grievance Management System | Welspun</strong></p>
            </footer>
        </div>
    );
};

export default HRDashboard;
