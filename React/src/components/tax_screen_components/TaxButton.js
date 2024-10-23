import React from 'react';
import styles from '../../styleMenu/taxScreen.module.css';

const TaxButton = ({ handleCalculateTax }) => {
    return (
        <button id={styles.calculate_tax} className={styles.calculate_tax_button} onClick={handleCalculateTax}>
            <img className={styles.icon_style} src="/tax-icon.png" alt="Calculate Tax Icon" />
            Calculate Tax
        </button>
    );
};

export default TaxButton;
