import React, {useState, useEffect} from 'react';
import axios from 'axios';
import styles from './styleMenu/settings.module.css';
import Sidebar from "./components/Sidebar";
import ProfileIcon from "./components/ProfileIcon";
import ChangeNickname from "./components/settings screen components/ChangeNickname";
import ChangeFullName from "./components/settings screen components/ChangeFullName";
import ChangePassword from "./components/settings screen components/ChangePassword";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL; // Fetch the base URL from the .env file

const SettingsScreen = () => {
    const [nickname, setNickname] = useState('');
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const tempNickname = localStorage.getItem('nickname');
        setNickname(tempNickname);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/users/profile`, {
                    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                });
                setNickname(response.data.nickname);
                setFullName(response.data.fullName);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleDeleteAccount = async () => {
        const confirmDeletion = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );

        if (confirmDeletion) {
            try {
                await axios.delete(`${API_URL}/api/users/delete-account`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                });
                localStorage.clear();
                toast.success('Account Deleted');
                navigate('/login');
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('An error occurred while deleting your account.');
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            <Sidebar activeLink="settings"/>
            <div className={styles.main_content}>
                <ProfileIcon nickname={nickname}/>
                <div className={styles.settings_container}>
                    <ChangeNickname setNickname={setNickname}/>
                    <ChangeFullName fullName={fullName} setFullName={setFullName}/>
                    <ChangePassword/>
                    <button className={styles.delete_button} onClick={handleDeleteAccount}>
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
