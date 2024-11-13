// SettingsScreen.js

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import styles from './styleMenu/settings.module.css';
import Sidebar from "./components/Sidebar";
import ProfileIcon from "./components/ProfileIcon";
import ChangeNickname from "./components/settings screen components/ChangeNickname";
import ChangeFullName from "./components/settings screen components/ChangeFullName";
import ChangePassword from "./components/settings screen components/ChangePassword";

const SettingsScreen = () => {
    const [nickname, setNickname] = useState('');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        const tempNickname = localStorage.getItem('nickname');
        setNickname(tempNickname);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/users/profile', {
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

    return (
        <div className={styles.wrapper}>
            <Sidebar activeLink="settings"/>
            <div className={styles.main_content}>
                <ProfileIcon nickname={nickname}/>
                <div className={styles.settings_container}>
                    <ChangeNickname nickname={nickname} setNickname={setNickname}/>
                    <ChangeFullName fullName={fullName} setFullName={setFullName}/>
                    <ChangePassword/>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
