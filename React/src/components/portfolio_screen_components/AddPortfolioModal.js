import React from 'react';
import styles from '../../styleMenu/portfoliosScreen.module.css';

function AddPortfolioModal({ handleClose }) {
    return (
        <div className={`${styles.portModal} ${styles.show}`}>
            <div className={styles.portModalContent}>
                <div className={styles.portClose} onClick={handleClose}>&times;</div>
                <h1 className={styles.borderLine}>Add a new portfolio</h1>
                <h5>API Address</h5>
                <input type="text" id="apiAddress" name="apiAddress" className={styles.inputText} />
                <button className={styles.addButton} onClick={handleClose}>
                    <img className={styles.portIconStyle} src="/plus.png" alt="Add Portfolio Icon" />Add
                </button>
            </div>
        </div>
    );
}

export default AddPortfolioModal;
