import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import GrievanceLanding from './components/GrievanceLanding';
import HRDashboard from './components/HRDashboard';
import GrievanceForm from './components/GrievanceForm';
import TrackRequest1 from './components/TrackRequest1';
import HRGrievanceTable from './components/HRRegistrationReport';
import PendingReports from './components/PendingReports';
import CompletedReports from './components/CompletedReports';
import ProtectedRoute from './components/ProtectedRoute';
import HRCharts from './components/HRCharts';
import AuditorLanding from './components/AuditorLanding'; 
import AuditorCharts from './components/AuditorCharts';
import AuditorReport from './components/AuditorReport'; 

function App() {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />

                <Route
                    path="/emp"
                    element={
                        <ProtectedRoute>
                            <GrievanceLanding />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/submit-grievance"
                    element={
                        <ProtectedRoute>
                            <GrievanceForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/track-requests"
                    element={
                        <ProtectedRoute>
                            <TrackRequest1 />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/hr"
                    element={
                        <ProtectedRoute>
                            <HRDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/hrregistration-report"
                    element={
                        <ProtectedRoute>
                            <HRGrievanceTable />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pending-reports"
                    element={
                        <ProtectedRoute>
                            <PendingReports />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/completed-reports"
                    element={
                        <ProtectedRoute>
                            <CompletedReports />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/all-reports"
                    element={
                        <ProtectedRoute>
                            <HRGrievanceTable />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/hr-charts"
                    element={
                        <ProtectedRoute>
                            <HRCharts />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/audit"
                    element={
                        <ProtectedRoute>
                            <AuditorLanding />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/auditor/charts"
                    element={
                        <ProtectedRoute>
                            <AuditorCharts />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/auditor-reports"
                    element={
                        <ProtectedRoute>
                            <AuditorReport />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
