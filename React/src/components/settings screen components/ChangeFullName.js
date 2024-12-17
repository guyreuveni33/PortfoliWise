import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from '../../styleMenu/settings.module.css';
const API_URL = process.env.REACT_APP_API_URL; // Fetch the base URL from the .env file

const ChangeFullName = ({ fullName, setFullName }) => {
    const handleFullNameChange = async () => {
        try {
            await axios.put(`${API_URL}/api/users/update-profile`, { fullName }, {
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
