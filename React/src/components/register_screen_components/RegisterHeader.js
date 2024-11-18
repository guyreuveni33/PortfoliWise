import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styleMenu/Register.module.css';

const RegisterHeader = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.button_group}>
            <button id={styles.signInBtn} className={styles.btn} onClick={() => navigate('/login')}>Sign In</button>
            <button id={styles.signUpBtn} className={styles.btn}>Sign Up</button>
        </div>
    );
};

export default RegisterHeader;
