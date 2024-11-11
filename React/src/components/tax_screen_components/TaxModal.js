// TaxModal.js

import React from 'react';
import styles from '../../styleMenu/taxScreen.module.css';

const TaxModal = ({isTaxModalOpen, handleCloseModal, annualTax, netGain, totalGains, totalLosses}) => {
    if (!isTaxModalOpen) return null;

    return (
        <div className={`${styles.port_modal} ${isTaxModalOpen ? styles.show : ''}`} onClick={handleCloseModal}>
            <div className={styles.port_modal_content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.port_close} onClick={handleCloseModal}>&times;</div>
                <h1 className={styles.border_line}>Yearly Tax Summary</h1>

                <p className={styles.tax_modal_text}>
                    {netGain > 0 ? (
                        <>
                            Nice work! You’ve earned <span
                            className={styles.positive}>${totalGains.toFixed(2)}</span> this year, with
                            <span className={styles.negative}> ${totalLosses.toFixed(2)}</span> in losses.
                        </>
                    ) : (
                        <>
                            This year’s been a bit tough, with <span
                            className={styles.negative}>${totalLosses.toFixed(2)}</span> in losses
                            against <span className={styles.positive}>${totalGains.toFixed(2)}</span> in gains.
                        </>
                    )}
                </p>

                <p className={styles.tax_modal_text}>
                    Net {netGain > 0 ? 'Profit' : 'Loss'}: <span
                    className={netGain > 0 ? styles.positive : styles.negative}>
                        ${Math.abs(netGain).toFixed(2)}
                    </span>
                </p>
                <p className={styles.tax_modal_text}>
                    Tax Due: <span className={styles.tax_due}>${annualTax.toFixed(2)}</span>
                </p>

                <button id={styles.got_it} onClick={handleCloseModal}>
                    <img className={styles.icon_style_like} src="/like.png" alt="Like Icon"/>
                    Got it
                </button>
            </div>
        </div>
    );
};

export default TaxModal;
