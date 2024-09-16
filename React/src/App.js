import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import HomeScreen from './HomeScreen'; // Import HomeScreen component

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<HomeScreen />} /> {/* Home Screen route */}
                <Route path="/" element={<Login />} /> {/* Default route */}
            </Routes>
        </Router>
    );
};

export default App;
