import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styleMenu/Login.module.css';

const LoginHeader = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.button_group}>
            <button id={styles.signInBtn} className={styles.btn}>Sign In</button>
            <button id={styles.signUpBtn} className={styles.btn} onClick={() => navigate('/register')}>Sign Up</button>
        </div>
    );
};

export default LoginHeader;
