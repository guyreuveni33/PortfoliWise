import React from 'react';
import styles from '../../styleMenu/taxScreen.module.css';

const TaxModal = ({ isTaxModalOpen, handleCloseModal }) => {
    if (!isTaxModalOpen) return null;

    return (
        <div className={`${styles.port_modal} ${isTaxModalOpen ? styles.show : ''}`} onClick={handleCloseModal}>
            <div className={styles.port_modal_content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.port_close} onClick={handleCloseModal}>&times;</div>
                <h1 className={styles.border_line}>Tax Summary for This Year</h1>
                <p className={styles.tax_modal_text}>
                    Your combined portfolios profit for the year is <span className={styles.profit_amount}>$1,570</span>
                </p>
                <p className={styles.tax_modal_text}>Tax due: <span className={styles.tax_due}>$392.50</span></p>
                <button id={styles.got_it} onClick={handleCloseModal}>
                    <img className={styles.icon_style_like} src="/like.png" alt="Like Icon" />
                    Got it
                </button>
            </div>
        </div>
    );
};

export default TaxModal;
