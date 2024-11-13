// RegisterForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleButton from '../login_screen_components/GoogleButton';
import styles from '../../Register.module.css';
import { toast } from "react-toastify";

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/users/register', { email, password, fullName, nickname });
            toast.success('User registered successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Error registering user');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <p className={styles.details_title}>Full Name</p>
            <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
            />
            <p className={styles.details_title}>Nickname</p>
            <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                placeholder="Enter your nickname"
            />
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
            <GoogleButton />
        </form>
    );
};

export default RegisterForm;
