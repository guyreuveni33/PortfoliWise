// AnalyzerModal.js
import React from 'react';
import styles from '../../styleMenu/portfoliosScreen.module.css';
import Gauge from './Gauge';

const AnalyzerModal = ({ handleClose, isVisible, stockSymbol }) => {
    return (
        <div className={`${styles.modal} ${isVisible ? styles.show : ''}`}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={handleClose}>&times;</span>
                <h2 className={`${styles.stockName} ${styles.boldText}`}>{stockSymbol}</h2>
                <div className={styles.borderLine}></div>
                <div className={styles.svgContainer}>
                    <Gauge value={0.7} />
                </div>
                <p className={styles.disclaimer}>
                    This should not be seen as an investment recommendation
                </p>
            </div>
        </div>
    );
};

export default AnalyzerModal;
