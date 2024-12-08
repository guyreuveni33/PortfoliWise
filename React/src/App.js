import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ToastContainer, Zoom} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Login from './Login';
import Register from './Register';
import TaxScreen from './TaxScreen';
import PortfoliosScreen from "./PortfoliosScreen";
import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";
import Sidebar from "./components/Sidebar";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/sidebar" element={<Sidebar/>}/>
                <Route path="/home" element={<HomeScreen/>}/>
                <Route path="/portfolios" element={<PortfoliosScreen/>}/>
                <Route path="/settings" element={<SettingsScreen/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/tax" element={<TaxScreen/>}/>
                <Route path="/" element={<Login/>}/>
            </Routes>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Zoom}
            />
        </Router>
    );
};

export default App;
