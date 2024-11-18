import React from 'react';
import styles from './styleMenu/Register.module.css';
import RegisterHeader from './components/register_screen_components/RegisterHeader';
import RegisterForm from './components/register_screen_components/RegisterForm';

const Register = () => {
    return (
        <div className={styles.registerWrapper}>
            <div className={styles.form_container}>
                <RegisterHeader />
                <h2>Let’s Get Started</h2>
                <p className={styles.enter_title}>Enter your Credentials to access your account</p>
                <RegisterForm />
            </div>
        </div>
    );
};

export default Register;
