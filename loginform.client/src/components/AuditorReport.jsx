import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuditorReport.css'; // create a separate CSS for styling

const AuditorReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://localhost:7136/api/Grievance/all')
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch grievance data");
                return res.json();
            })
            .then(grievances => {
                const visibleGrievances = grievances.filter(g =>
                    g.visibility === true || g.visibility === 'true'
                );
                setData(visibleGrievances);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Error fetching data. Please check server.");
                setLoading(false);
            });
    }, []);

    return (
        <div className="auditor-report-container">
            <div className="report-header">
                <h2>🛡️ Auditor Grievance Report</h2>
                <button className="back-btn" onClick={() => navigate('/audit')}>Back</button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : data.length === 0 ? (
                <p>No visible grievances found.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="auditor-table">
                        <thead>
                            <tr>
                                <th>Emp No</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Grievance Type</th>
                                <th>Description</th>
                                <th>Response</th>
                                <th>Response Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(row => (
                                <tr key={row.id}>
                                    <td>{row.empNo}</td>
                                    <td>{row.name}</td>
                                    <td>{row.department}</td>
                                    <td>{row.designation}</td>
                                    <td>{row.grievanceType}</td>
                                    <td>{row.description}</td>
                                    <td>{row.response || 'Pending'}</td>
                                    <td>{row.responseDate ? new Date(row.responseDate).toLocaleString() : 'Pending'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AuditorReport;
