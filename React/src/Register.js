import styles from './Register.module.css';
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
        <div className={styles.registerWrapper}>
            <div className={styles.form_container}>
                <div className={styles.button_group}>
                    <button id={styles.signInBtn} className={styles.btn} onClick={() => navigate('/login')}>Sign In</button>
                    <button id={styles.signUpBtn} className={styles.btn}>Sign Up</button>
                </div>
                <h2>Let’s Get Started</h2>
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
                        id={styles.passwordInput}
                    />
                    <a href="#" className={styles.register_link}>I agree to the terms & policy</a>
                    <button id={styles.sub} type="submit">Sign Up</button>
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

export default Register;
