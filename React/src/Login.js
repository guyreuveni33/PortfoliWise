import './login.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', { email, password });
            console.log(response.data); // Log the response data to check for token
            localStorage.setItem('token', response.data.token); // Save token in localStorage
            navigate('/dashboard'); // Redirect to dashboard or home page
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            alert('Invalid email or password');
        }
    };


    return (
        <div className="form-container">
            <div className="button-group">
                <button id="signInBtn" className="btn">Sign In</button>
                <button id="signUpBtn" className="btn" onClick={() => navigate('/register')}>Sign Up</button>
            </div>
            <h2>Welcome Back</h2>
            <p className="enterTitle">Enter your Credentials to access your account</p>
            <form onSubmit={handleSubmit}>
                <p className="detailsTitle">Email Address</p>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="username@mail.com" />
                <p className="detailsTitle">Password</p>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
                <a href="#">Forgot Password?</a>
                <button id="sub" type="submit">Sign In</button>
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

export default Login;
