import React, { useState } from 'react';
import styles from '../../styleMenu/portfoliosScreen.module.css';
import { toast } from 'react-toastify';
const API_URL = process.env.REACT_APP_API_URL; // Fetch the base URL from the .env file

function AddPortfolioModal({ handleClose }) {
    const [apiKey, setApiKey] = useState('');
    const [secretKey, setSecretKey] = useState('');

    const handleAddPortfolio = async () => {
        try {
            const response = await fetch(`${API_URL}/api/portfolios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ apiKey, secretKey })
            });

            if (response.ok) {
                handleClose();
                toast.success('Portfolio Added Successfully');
            } else {
                const errorData = await response.json();
                console.error('Error adding portfolio:', errorData);
                toast.error(errorData.error || 'Failed to add portfolio');
            }
        } catch (error) {
            console.error('Error adding portfolio:', error);
            toast.error('An error occurred while adding the portfolio');
        }
    };

    return (
        <div className={`${styles.portModal} ${styles.show}`}>
            <div className={styles.portModalContent}>
                <div className={styles.portClose} onClick={handleClose}>&times;</div>
                <h1 className={styles.borderLine}>Add a new portfolio</h1>
                <h5>API Key</h5>
                <input
                    type="text"
                    id="apiKey"
                    name="apiKey"
                    className={styles.inputText}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <h5>Secret Key</h5>
                <input
                    type="text"
                    id="secretKey"
                    name="secretKey"
                    className={styles.inputText}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                />
                <button className={styles.addButton} onClick={handleAddPortfolio}>
                    <img className={styles.portIconStyle} src="/plus.png" alt="Add Portfolio Icon" />Add
                </button>
            </div>
        </div>
    );
}

export default AddPortfolioModal;
