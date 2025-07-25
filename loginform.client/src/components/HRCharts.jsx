import React, { useEffect, useState } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import './HRCharts.css';

const COLORS = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7'];

const HRCharts = () => {
    const [grievanceData, setGrievanceData] = useState([]);
    const [activeTab, setActiveTab] = useState('type');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://localhost:7136/api/Grievance/all')
            .then(res => res.json())
            .then(data => setGrievanceData(data))
            .catch(err => console.error("Error fetching grievance data", err));
    }, []);

    const grievanceTypeData = () => {
        const count = {};
        grievanceData.forEach(g => {
            const type = g.grievanceType || 'Unknown';
            count[type] = (count[type] || 0) + 1;
        });
        const total = Object.values(count).reduce((sum, v) => sum + v, 0);
        return Object.keys(count).map((type, index) => ({
            name: type,
            value: count[type],
            percent: ((count[type] / total) * 100).toFixed(1) + '%'
        }));
    };

    const responseStatusData = () => {
        let pending = 0, completed = 0;
        grievanceData.forEach(g => {
            g.response ? completed++ : pending++;
        });
        return [
            { name: 'Completed', value: completed },
            { name: 'Pending', value: pending }
        ];
    };

    const trendData = () => {
        const trends = {};
        grievanceData.forEach(g => {
            const date = new Date(g.grievanceDate).toISOString().split('T')[0];
            trends[date] = (trends[date] || 0) + 1;
        });
        return Object.keys(trends).sort().map(date => ({ date, count: trends[date] }));
    };

    const renderTabContent = () => {
        if (activeTab === 'type') {
            const data = grievanceTypeData();
            return (
                <div className="chart-box">
                    <h3 className="chart-title">Grievance Type Breakdown</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={120}
                                label={({ name, percent }) => `${name}: ${percent}`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (activeTab === 'response') {
            return (
                <div className="chart-box">
                    <h3 className="chart-title">Request Resolution Status</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={responseStatusData()}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                dataKey="value"
                                label
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
            );
        }

        if (activeTab === 'trend') {
            return (
                <div className="chart-box">
                    <h3 className="chart-title">Grievance Submission Trend</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={trendData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#4e79a7" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h2>📊 HR Grievance Insights Dashboard</h2>
                <button className="close-btn" onClick={() => navigate('/hr')}>×</button>
            </div>

            <div className="tab-bar">
                <button className={activeTab === 'type' ? 'active' : ''} onClick={() => setActiveTab('type')}>
                    Grievance Types
                </button>
                <button className={activeTab === 'response' ? 'active' : ''} onClick={() => setActiveTab('response')}>
                    Response Status
                </button>
                <button className={activeTab === 'trend' ? 'active' : ''} onClick={() => setActiveTab('trend')}>
                    Submission Trend
                </button>
            </div>

            {renderTabContent()}
        </div>
    );
};

export default HRCharts;
