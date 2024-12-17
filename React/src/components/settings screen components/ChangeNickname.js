import React, {useState} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import styles from '../../styleMenu/settings.module.css';

const API_URL = process.env.REACT_APP_API_URL; // Fetch the base URL from the .env file

const ChangeNickname = ({setNickname}) => {
    const [inputValue, setInputValue] = useState('');

    const handleNicknameChange = async () => {
        try {
            await axios.put(`${API_URL}/api/users/update-profile`, {nickname: inputValue}, {
                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
            });
            localStorage.setItem('nickname', inputValue);
            setNickname(inputValue);
            setInputValue('');
            toast.success('Nickname updated successfully');
        } catch (error) {
            console.error('Error updating nickname:', error);
            toast.error('Failed to update nickname');
        }
    };

    return (
        <div className={styles.setting_section}>
            <h2>Change Nickname</h2>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter new nickname"
            />
            <button onClick={handleNicknameChange}>Update Nickname</button>
        </div>
    );
};

export default ChangeNickname;
