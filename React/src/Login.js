import React from 'react';
import styles from './styleMenu/Login.module.css';
import LoginHeader from './components/login_screen_components/LoginHeader';
import LoginForm from './components/login_screen_components/LoginForm';

const Login = () => {
    return (
        <div className={styles.loginWrapper}>
            <div className={styles.form_container}>
                <LoginHeader />
                <h2>Welcome Back</h2>
                <p className={styles.enter_title}>Enter your Credentials to access your account</p>
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;
