import React from 'react';
import styles from '../../styleMenu/Login.module.css';

const GoogleButton = () => {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3001/api/users/google';
    };

    return (
        <button onClick={handleGoogleLogin} className={styles.google_btn}>
            <span id={styles.googleSign}>G</span> Sign in with Google
        </button>
    );
};

export default GoogleButton;
