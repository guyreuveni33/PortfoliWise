import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import TaxScreen from './TaxScreen'; // Import HomeScreen component
import PortfoliosScreen  from "./PortfoliosScreen";
 const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/portfolios" element={<PortfoliosScreen/>}/>
                <Route path="/login" element={<Login/>}/>
                 <Route path="/register" element={<Register/>}/>
                <Route path="/tax" element={<TaxScreen/>}/> {/* Home Screen route */}
                <Route path="/" element={<Login/>}/> {/* Default route */}
            </Routes>
        </Router>
    );
};

export default App;
