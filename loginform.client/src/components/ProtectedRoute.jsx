import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const employeeData = JSON.parse(localStorage.getItem('employeeData'));
        if (!employeeData || !employeeData.loginTime) {
            alert('Session expired or not logged in');
            navigate('/login');
            return;
        }

        const currentTime = Date.now();
        const loginDuration = currentTime - employeeData.loginTime;

        if (loginDuration > 30 * 60 * 1000) {
            localStorage.removeItem('employeeData');
            alert('Session expired.');
            navigate('/login');
            return;
        }

        const timeout = setTimeout(() => {
            localStorage.removeItem('employeeData');
            alert('Session expired. Logging out.');
            navigate('/login');
        }, 30 * 60 * 1000 - loginDuration);

        return () => clearTimeout(timeout);
    }, [navigate]);

    return children;
};

export default ProtectedRoute;
