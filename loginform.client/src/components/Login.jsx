import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import bgImage from '../assets/Loginbg.jpg';

const Login = () => {
    const [empId, setEmpId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://localhost:7136/api/Login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ empId, password }),
            });

            if (response.ok) {
                const data = await response.json();

                //  Store employee data with login time
                localStorage.setItem('employeeData', JSON.stringify({
                    empNo: data.empId,
                    name: data.name,
                    userType: data.userType,
                    loginTime: Date.now()
                }));

                if (data.userType === 'emp') {
                    navigate('/emp');
                } else if (data.userType === 'hr') {
                    navigate('/hr');
                } else if (data.userType === 'audit') {
                    navigate('/audit');
                } else {
                    setError('Unknown user type');
                }
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Try again later.');
        }
    };

    return (
        <div className="login-page" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="login-box">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Employee ID"
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
