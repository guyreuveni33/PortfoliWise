// components/settings/ChangeNickname.js

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import styles from '../../styleMenu/settings.module.css';

const ChangeNickname = ({nickname, setNickname}) => {
    const [inputValue, setInputValue] = useState('');

    const handleNicknameChange = async () => {
        try {
            await axios.put('http://localhost:3001/api/users/update-profile', {nickname: inputValue}, {
                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
            });
            localStorage.setItem('nickname', inputValue);
            setNickname(inputValue); // Update the nickname in the parent component
            setInputValue(''); // Clear the input field
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
