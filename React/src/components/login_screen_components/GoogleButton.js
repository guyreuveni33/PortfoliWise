import React from 'react';
import styles from '../../styleMenu/Login.module.css';

const GoogleButton = () => {
    return (
        <button className={styles.google_btn}>
            <span id={styles.googleSign}>G</span> Sign in with Google
        </button>
    );
};

export default GoogleButton;
