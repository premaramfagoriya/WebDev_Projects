import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GrievanceReports.css'; // Reuse same CSS

const CompletedReports = () => {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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
                const completed = grievances.filter(g => g.response && g.response.trim() !== '');
                setData(completed);
                setFiltered(completed);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Error fetching data.");
                setLoading(false);
            });
    }, []);

    // 🔍 Filter by Emp No
    const handleSearch = (e) => {
        const value = e.target.value.trim();
        setSearchTerm(value);
        if (value === '') {
            setFiltered(data);
        } else {
            setFiltered(data.filter(item => item.empNo.toString().includes(value)));
        }
    };

    return (
        <div className="table-container">
            {/* Header with Back + Search */}
            <div className="table-header">
                <h2>Completed Grievance Reports</h2>
                <div className="header-controls">
                    <input
                        type="text"
                        placeholder="Search Emp No"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                    <button className="back-btn" onClick={() => navigate('/hr')}>Back</button>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="table-wrapper">
                    <table className="grievance-table">
                        <thead>
                            <tr>
                                <th>Emp No</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Division</th>
                                <th>Building No</th>
                                <th>Supervisor</th>
                                <th>Grievance Date</th>
                                <th>Grievance Type</th>
                                <th>Description</th>
                                <th>Response</th>
                                <th>Response Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map(row => (
                                    <tr key={row.id}>
                                        <td>{row.empNo}</td>
                                        <td>{row.name}</td>
                                        <td>{row.department}</td>
                                        <td>{row.designation}</td>
                                        <td>{row.division}</td>
                                        <td>{row.buildingNo}</td>
                                        <td>{row.supervisor}</td>
                                        <td>{row.grievanceDate?.split('T')[0]}</td>
                                        <td>{row.grievanceType}</td>
                                        <td>{row.description}</td>
                                        <td>{row.response}</td>
                                        <td>{row.responseDate?.split('T')[0]}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="12" style={{ textAlign: 'center' }}>No matching records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CompletedReports;
