import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleButton from '../login_screen_components/GoogleButton'; // GoogleButton is now imported here
import styles from '../../Register.module.css';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/users/register', { email, password });
            alert('User registered successfully');
            navigate('/login');
        } catch (error) {
            alert('Error registering user');
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
                id={styles.passwordInput}
            />
            <a href="#" className={styles.register_link}>I agree to the terms & policy</a>
            <button id={styles.sub} type="submit">Sign Up</button>
            <div className={styles.divider}>
                <hr className={styles.line} />
                <span className={styles.text}>or</span>
                <hr className={styles.line} />
            </div>
            <GoogleButton /> {/* GoogleButton is part of the form */}
        </form>
    );
};

export default RegisterForm;
