import React, { useEffect, useState } from 'react';
import {PieChart, Pie, Cell, Tooltip, Legend,BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,LineChart, Line} from 'recharts';
import { useNavigate } from 'react-router-dom';
import './AuditorCharts.css';

const COLORS = ['#28a745', '#ffc107'];

const AuditorCharts = () => {
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [activeTab, setActiveTab] = useState('status');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://localhost:7136/api/Grievance/all')
            .then(res => res.json())
            .then(data => {
                const visible = data.filter(g => g.visibility === true || g.visibility === 'true');
                setAllData(visible);
            })
            .catch(err => console.error("Error fetching grievance data", err));
    }, []);

    useEffect(() => {
        if (!fromDate || !toDate) return;

        const start = new Date(fromDate);
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);

        const filtered = allData.filter(g => {
            const date = new Date(g.grievanceDate);
            return date >= start && date <= end;
        });

        setFilteredData(filtered);
    }, [fromDate, toDate, allData]);

    // Pie chart data
    const responseStatusData = () => {
        let pending = 0, resolved = 0;
        allData.forEach(g => g.response ? resolved++ : pending++);
        return [
            { name: 'Resolved', value: resolved },
            { name: 'Pending', value: pending }
        ];
    };

    // Bar chart (day-wise request & resolved)
    const getDailyBarData = () => {
        const stats = {};
        const source = (fromDate && toDate) ? filteredData : allData;

        source.forEach(g => {
            const date = new Date(g.grievanceDate).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            });

            if (!stats[date]) {
                stats[date] = { date, requested: 0, resolved: 0 };
            }

            stats[date].requested += 1;
            if (g.response) stats[date].resolved += 1;
        });

        return Object.values(stats).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const getLineChartData = () => {
        const trends = {};
        const source = (fromDate && toDate) ? filteredData : allData;

        source.forEach(g => {
            const date = new Date(g.grievanceDate).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            });

            trends[date] = (trends[date] || 0) + 1;
        });

        return Object.entries(trends).map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    return (
        <div className="auditor-chart-container">
            <div className="chart-header">
                <h2>🛡️ Auditor Insights</h2>
                <button className="close-btn" onClick={() => navigate('/audit')}>×</button>
            </div>

            <div className="chart-tabs">
                <button className={activeTab === 'status' ? 'active' : ''} onClick={() => setActiveTab('status')}>
                    📊 Response Status
                </button>
                <button className={activeTab === 'daily' ? 'active' : ''} onClick={() => setActiveTab('daily')}>
                    📅 Daily Trends
                </button>
                <button className={activeTab === 'line' ? 'active' : ''} onClick={() => setActiveTab('line')}>
                    📈 Line Trends
                </button>
            </div>

            {activeTab === 'status' && (
                <div className="chart-box">
                    <h3>📌 Grievance Response Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={responseStatusData()}
                                cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                                dataKey="value" label
                            >
                                {responseStatusData().map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {activeTab === 'daily' && (
                <div className="chart-box">
                    <h3>📅 Daily Requests vs Resolved</h3>

                    <div className="filter-row">
                        <label>From:
                            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                        </label>
                        <label>To:
                            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                        </label>
                    </div>

                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={getDailyBarData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" angle={-45} textAnchor="end" interval={0} height={70} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="requested" fill="#0d6efd" name="Requests" />
                            <Bar dataKey="resolved" fill="#28a745" name="Resolved" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {activeTab === 'line' && (
                <div className="chart-box">
                    <h3>📈 Grievance Count Trend</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={getLineChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" angle={-45} textAnchor="end" interval={0} height={70} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#0d6efd" name="Grievances" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default AuditorCharts;
