import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './HRRegistrationReport.css';

const HRGrievanceTable = () => {
    const [data, setData] = useState([]);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // 🔹 Fetch grievances
    useEffect(() => {
        fetch('https://localhost:7136/api/Grievance/all')
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch grievance data");
                return res.json();
            })
            .then(grievances => {
                const sanitized = grievances.map(g => ({
                    ...g,
                    visibility: g.visibility === true || g.visibility === 'true'
                }));

                // ✅ Use sanitized data for both setData and response init
                setData(sanitized);

                const initialResponses = {};
                sanitized.forEach(g => {
                    initialResponses[g.id] = g.response || '';
                });
                setResponses(initialResponses);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Error fetching data. Please check server.");
                setLoading(false);
            });
    }, []);

    const filteredData = data.filter(row =>
        row.empNo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleResponseChange = (e, id) => {
        setResponses(prev => ({
            ...prev,
            [id]: e.target.value
        }));
    };

    const handleVisibilityToggle = (id) => {
        setData(prev => {
            const updatedData = prev.map(row =>
                row.id === id ? { ...row, visibility: !row.visibility } : row
            );

            const updatedRow = updatedData.find(r => r.id === id);
            const responseText = responses[id] || '';

            const updated = {
                ...updatedRow,
                response: responseText,
                responseDate: updatedRow.response ? updatedRow.responseDate : new Date().toISOString(),
                visibility: updatedRow.visibility
            };

            fetch(`https://localhost:7136/api/Grievance/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to update visibility");
                    console.log("Visibility updated");
                })
                .catch(err => {
                    console.error("Visibility update failed", err);
                    alert("Error updating visibility.");
                });

            return updatedData;
        });
    };

    const handleSave = (id) => {
        const row = data.find(r => r.id === id);
        const responseText = responses[id];

        if (!responseText.trim()) {
            alert("Response cannot be empty.");
            return;
        }

        const updated = {
            ...row,
            response: responseText,
            responseDate: new Date().toISOString(),
            visibility: row.visibility
        };

        fetch(`https://localhost:7136/api/Grievance/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to save response");
                alert("Response saved successfully!");
                setData(prev =>
                    prev.map(r => r.id === id ? { ...updated } : r)
                );
            })
            .catch(err => {
                console.error(err);
                alert("Error saving response.");
            });
    };

    const handleExportToExcel = () => {
        const exportData = filteredData.map(row => ({
            'Emp No': row.empNo,
            'Name': row.name,
            'Department': row.department,
            'Designation': row.designation,
            'Division': row.division,
            'Building No': row.buildingNo,
            'Supervisor': row.supervisor,
            'Grievance Date': row.grievanceDate?.split('T')[0],
            'Grievance Type': row.grievanceType,
            'Description': row.description,
            'Response': row.response || 'Pending',
            'Response Date': row.responseDate
                ? new Date(row.responseDate).toLocaleString()
                : 'Pending',
            'Visibility': row.visibility ? 'Visible' : 'Hidden'
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'HR Grievance Report');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(dataBlob, 'HR_Grievance_Report.xlsx');
    };

    return (
        <div className="table-container">
            <div className="table-header">
                <h2>HR Grievance Report Table</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Search by Emp No"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button className="export-btn" onClick={handleExportToExcel}>Export to Excel</button>
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
                                <th>Visibility</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(row => (
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
                                    <td>
                                        <textarea
                                            rows={3}
                                            value={responses[row.id] || ''}
                                            onChange={(e) => handleResponseChange(e, row.id)}
                                            disabled={!!row.response}
                                            style={{
                                                backgroundColor: row.response ? '#e9ecef' : '#fff',
                                                cursor: row.response ? 'not-allowed' : 'text',
                                                color: row.response ? '#6c757d' : '#212529'
                                            }}
                                        />
                                    </td>
                                    <td>
                                        {row.responseDate
                                            ? new Date(row.responseDate).toLocaleString()
                                            : <span className="pending-badge">Pending</span>}
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={row.visibility}
                                            onChange={() => handleVisibilityToggle(row.id)}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleSave(row.id)}
                                            disabled={!!row.response}
                                            style={{
                                                backgroundColor: row.response ? '#adb5bd' : '#0d6efd',
                                                color: 'white',
                                                cursor: row.response ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            Save
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default HRGrievanceTable;
