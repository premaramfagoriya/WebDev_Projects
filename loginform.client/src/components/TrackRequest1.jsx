import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrackRequest1.css';

const TrackRequest1 = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const employee = JSON.parse(localStorage.getItem("employeeData"));
        if (!employee?.empNo) {
            setError("⚠️ Employee not logged in.");
            setLoading(false);
            return;
        }

        fetch(`https://localhost:7136/api/Grievance/requests?empNo=${employee.empNo}`)
            .then(res => res.ok ? res.json() : Promise.reject("Fetch failed"))
            .then(data => {
                setRecords(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("❌ Failed to fetch grievance data. Please try again.");
                setLoading(false);
            });
    }, []);

    const handleBack = () => navigate('/emp');

    const formatDate = (isoString) => {
        if (!isoString) return "—";
        return new Date(isoString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className="track-container">
            <header className="track-header">
                <h2>📋 My Grievance Requests</h2>
                <button className="close-btn" onClick={handleBack}>×</button>
            </header>

            <main>
                {loading && <p className="status-message">Loading...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && records.length === 0 && (
                    <p className="no-records">No grievance requests found.</p>
                )}

                <div className="card-list">
                    {records.map((record, index) => (
                        <div className="grievance-card" key={index}>
                            <div className="card-header">
                                <span className={`badge ${record.response ? 'resolved' : 'pending'}`}>
                                    {record.response ? "Resolved" : "Pending"}
                                </span>
                                <span className="emp-no">#{record.empNo}</span>
                            </div>
                            <div className="card-body">
                                <p><strong>Name:</strong> {record.name}</p>
                                <p><strong>Grievance Type:</strong> {record.grievanceType}</p>
                                <p><strong>Grievance Date:</strong> {formatDate(record.grievanceDate)}</p>
                                <p><strong>Description:</strong> {record.description}</p>
                                <p><strong>Response:</strong> {record.response || 'Pending'}</p>
                                <p><strong>Response Date:</strong> {formatDate(record.responseDate)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="btn-container-track">
                <button className="back-btn-track" onClick={handleBack}>⬅ Back</button>
            </footer>
        </div>
    );
};

export default TrackRequest1;
