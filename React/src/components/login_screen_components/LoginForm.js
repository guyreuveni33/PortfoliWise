import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleButton from './GoogleButton';
import styles from '../../styleMenu/Login.module.css';
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL; // Fetch the base URL from the .env file

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/users/login`, { email, password });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', email);

            const profileResponse = await axios.get(`${API_URL}/api/users/profile`, {
                headers: { 'Authorization': `Bearer ${response.data.token}` }
            });

            localStorage.setItem('nickname', profileResponse.data.nickname);

            navigate('/home');
        } catch (error) {
            const errorResponse = error.response ? error.response.data : 'Login failed. Please try again.';
            toast.error(errorResponse);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <p className={styles.details_title}>Email Address</p>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="username@mail.com"
            />
            <p className={styles.details_title}>Password</p>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
            />
            <a href="#" className={styles.login_link}>Forgot Password?</a>
            <button id={styles.sub} type="submit">Sign In</button>
            <div className={styles.divider}>
                <hr className={styles.line} />
                <span className={styles.text}>or</span>
                <hr className={styles.line} />
            </div>
            <GoogleButton />
        </form>
    );
};

export default LoginForm;
