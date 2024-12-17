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
        await loginUser(email, password);
    };

    const handleGuestLogin = async () => {
        const guestEmail = 'guest@gmail.com';
        const guestPassword = 'Gg123456';
        await loginUser(guestEmail, guestPassword);
    };

    const loginUser = async (loginEmail, loginPassword) => {
        try {
            const response = await axios.post(`${API_URL}/api/users/login`, {
                email: loginEmail,
                password: loginPassword
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', loginEmail);

            const profileResponse = await axios.get(`${API_URL}/api/users/profile`, {
                headers: { 'Authorization': `Bearer ${response.data.token}` }
            });

            localStorage.setItem('nickname', profileResponse.data.nickname || 'Guest');

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
            {/* Continue as Guest Button */}
            <button
                id={styles.sub}
                type="button"
                onClick={handleGuestLogin}
                className={styles.guest_button}
            >
                <span className={styles.guest_icon}>👤</span>
                <div className={styles.guest_subtext}>Explore the app without signing in</div>
            </button>
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
