import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Analytics } from '@vercel/analytics/next';

import {ToastContainer, Zoom} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Login from './Login';
import Register from './Register';
import TaxScreen from './TaxScreen';
import PortfoliosScreen from "./PortfoliosScreen";
import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";
import Sidebar from "./components/Sidebar";
import './App.css';

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <TransitionGroup>
            <CSSTransition
                key={location.pathname}
                classNames="blur-fade"
                timeout={300}
            >
                <Routes location={location}>
                    <Route path="/sidebar" element={<Sidebar/>}/>
                    <Route path="/home" element={<HomeScreen/>}/>
                    <Route path="/portfolios" element={<PortfoliosScreen/>}/>
                    <Route path="/settings" element={<SettingsScreen/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/tax" element={<TaxScreen/>}/>
                    <Route path="/" element={<Login/>}/>
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
};

const App = () => {
    return (
        <Router>
            <AnimatedRoutes />
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
            <Analytics />
        </Router>
    );
};

export default App;
