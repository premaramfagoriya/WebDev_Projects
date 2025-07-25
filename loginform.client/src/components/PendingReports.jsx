import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GrievanceReports.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';

const PendingReports = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState('');
    const [modalData, setModalData] = useState(null);
    const [responseText, setResponseText] = useState('');
    const [visibility, setVisibility] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://localhost:7136/api/Grievance/all')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(grievances => {
                const pending = grievances.filter(g => !g.response || g.response.trim() === '');
                setData(pending);
                setLoading(false);
            })
            .catch(() => {
                setError("Error fetching data.");
                setLoading(false);
            });
    }, []);

    const openModal = (row) => {
        setModalData(row);
        setResponseText('');
        setVisibility(row.visibility ?? true);
    };

    const closeModal = () => {
        setModalData(null);
        setResponseText('');
        setVisibility(true);
    };

    const handleSave = () => {
        if (!responseText.trim()) {
            alert("Response cannot be empty.");
            return;
        }

        const updated = {
            ...modalData,
            response: responseText,
            visibility: visibility
        };

        fetch(`https://localhost:7136/api/Grievance/${modalData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        })
            .then(res => {
                if (!res.ok) throw new Error();
                setToast("Response saved successfully. Thank you!");
                setTimeout(() => setToast(''), 3000);
                setData(prev => prev.filter(d => d.id !== modalData.id));
                closeModal();
            })
            .catch(() => alert("Error saving response."));
    };

    const filteredData = data.filter(row =>
        row.empNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="table-container">
            <div className="table-header">
                <h2>Pending Grievance Reports</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search by Emp No"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button className="back-btn" onClick={() => navigate('/hr')}>Back</button>
                </div>
            </div>

            {toast && <div className="toast-success">{toast}</div>}

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
                                    <td><span className="pending-status">Pending</span></td>
                                    <td>--</td>
                                    <td>
                                        <button onClick={() => openModal(row)}>
                                            <FontAwesomeIcon icon={faUserPen} style={{ marginRight: '6px' }} />
                                            Respond
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for response input */}
            {modalData && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Respond to Grievance</h3>
                        <table className="modal-info-table">
                            <tbody>
                                <tr>
                                    <th>Emp No</th>
                                    <td>{modalData.empNo}</td>
                                </tr>
                                <tr>
                                    <th>Name</th>
                                    <td>{modalData.name}</td>
                                </tr>
                                <tr>
                                    <th>Grievance Type</th>
                                    <td>{modalData.grievanceType}</td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td>{modalData.description}</td>
                                </tr>
                            </tbody>
                        </table>

                        <label><strong>Response:</strong></label>
                        <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Enter your response here..."
                            rows={4}
                            style={{ minHeight: '100px', resize: 'vertical' }}
                        />

                        <div style={{ marginTop: '10px' }}>
                            <label>
                                <strong>Visible to Employee: </strong>
                                <input
                                    type="checkbox"
                                    checked={visibility}
                                    onChange={(e) => setVisibility(e.target.checked)}
                                    style={{ marginLeft: '8px' }}
                                />
                            </label>
                        </div>

                        <div className="modal-buttons">
                            <button onClick={handleSave}>Save</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingReports;
