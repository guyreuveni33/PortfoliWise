import React from 'react';
import styles from '../../styleMenu/Login.module.css';
const API_URL = process.env.REACT_APP_API_URL; // Fetch the base URL from the .env file

const GoogleButton = () => {
    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/api/users/google`; // We use href because we just want to trigger the flow
    };

    return (
        <button onClick={handleGoogleLogin} className={styles.google_btn}>
            <span id={styles.googleSign}>G</span> Sign in with Google
        </button>
    );
};

export default GoogleButton;
