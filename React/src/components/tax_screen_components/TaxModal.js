// TaxModal.js

import React from 'react';
import styles from '../../styleMenu/taxScreen.module.css';

const TaxModal = ({isTaxModalOpen, handleCloseModal, annualTax, netGain, totalGains, totalLosses}) => {
    if (!isTaxModalOpen) return null;

    const formatNumber = (number) => number.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return (
        <div className={`${styles.port_modal} ${isTaxModalOpen ? styles.show : ''}`} onClick={handleCloseModal}>
            <div className={styles.port_modal_content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.port_close} onClick={handleCloseModal}>&times;</div>
                <h1 className={styles.border_line}>Yearly Tax Summary</h1>

                <p className={styles.tax_modal_text}>
                    {netGain > 0 ? (
                        <>
                            Nice work! You’ve earned <span
                            className={styles.positive}>${formatNumber(totalGains)}</span> this year, with
                            <span className={styles.negative}> ${formatNumber(totalLosses)}</span> in losses.
                        </>
                    ) : (
                        <>
                            This year’s been a bit tough, with <span
                            className={styles.negative}>${formatNumber(totalLosses)}</span> in losses
                            against <span className={styles.positive}>${formatNumber(totalGains)}</span> in gains.
                        </>
                    )}
                </p>

                <p className={styles.tax_modal_text}>
                    Net {netGain > 0 ? 'Profit' : 'Loss'}: <span
                    className={netGain > 0 ? styles.positive : styles.negative}>
                        ${formatNumber(Math.abs(netGain))}
                    </span>
                </p>
                <p className={styles.tax_modal_text}>
                    Tax Due: <span className={styles.tax_due}>${formatNumber(annualTax)}</span>
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
