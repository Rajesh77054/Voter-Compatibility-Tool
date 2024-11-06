import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import VoterPage from './pages/VoterPage';
import LoginPage from './pages/LoginPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<VoterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;