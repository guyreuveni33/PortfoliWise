import styles from './Login.module.css';
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
            const response = await axios.post('http://localhost:3001/api/users/login', { email, password });
            localStorage.setItem('token', response.data.token); // Store token in localStorage
            localStorage.setItem('email', email)

            navigate('/home'); // Redirect to HomeScreen on success
        } catch (error) {
            const errorResponse = error.response ? error.response.data.message : 'Login failed. Please try again.';
            alert(errorResponse); // Show error in an alert
        }
    };

    return (
        <div className={styles.loginWrapper}>
            <div className={styles.form_container}>
                <div className={styles.button_group}>
                    <button id={styles.signInBtn} className={styles.btn}>Sign In</button>
                    <button id={styles.signUpBtn} className={styles.btn} onClick={() => navigate('/register')}>Sign Up</button>
                </div>
                <h2>Welcome Back</h2>
                <p className={styles.enter_title}>Enter your Credentials to access your account</p>
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
                    <button className={styles.google_btn}>
                        <span id={styles.googleSign}>G</span> Sign in with Google
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
