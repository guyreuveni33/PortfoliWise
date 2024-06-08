import './register.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/register', { email, password });
            alert('User registered successfully');
            navigate('/login');
        } catch (error) {
            alert('Error registering user');
        }
    };

    return (
        <div className="form-container">
            <div className="button-group">
                <button id="signInBtn" className="btn" onClick={() => navigate('/login')}>Sign In</button>
                <button id="signUpBtn" className="btn">Sign Up</button>
            </div>
            <h2>Let’s Get Started</h2>
            <p className="enterTitle">Enter your Credentials to access your account</p>
            <form onSubmit={handleSubmit}>
                <p className="detailsTitle">Email Address</p>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="username@mail.com" />
                <p className="detailsTitle">Password</p>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" id="passwordInput" />
                <div className="checkbox check-transparent">
                    <input type="checkbox" id="checkbox" />
                    <label htmlFor="checkbox"> I agree to the terms & policy</label>
                </div>
                <button id="sub" type="submit">Sign Up</button>
                <div className="divider">
                    <hr className="line" />
                    <span className="text">or</span>
                    <hr className="line" />
                </div>
                <button className="google-btn"><span id="googleSign">G</span> Sign in with Google</button>
            </form>
        </div>
    );
};

export default Register;
