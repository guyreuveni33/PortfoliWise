// components/settings/ChangeFullName.js

import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from '../../styleMenu/settings.module.css';

const ChangeFullName = ({ fullName, setFullName }) => {
    const handleFullNameChange = async () => {
        try {
            await axios.put('http://localhost:3001/api/users/update-profile', { fullName }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Full name updated successfully');
            setFullName('');
        } catch (error) {
            console.error('Error updating full name:', error);
            toast.error('Failed to update full name');
        }
    };

    return (
        <div className={styles.setting_section}>
            <h2>Change Full Name</h2>
            <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Update your full name"
            />
            <button onClick={handleFullNameChange}>Update Full Name</button>
        </div>
    );
};

export default ChangeFullName;
