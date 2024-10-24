import React from 'react';
import styles from '../../styleMenu/taxScreen.module.css';

const PortfolioCard = () => {
    return (
        <div className={`${styles.portfolio_card} ${styles.section}`}>
            <div className={styles.portfolio_header}>
                <div className={styles.header_content}>
                    <h1>Your Portfolio</h1>
                    <div className={styles.right_header_container}>
                        <span className={styles.year}>Year: 2024</span>
                        <img src="/rotate-right.png" className={styles.icon_style_arrow} alt="Rotate Icon" />
                    </div>
                </div>
            </div>
            <div>
                <span className={styles.profit}>Total Profit:</span>
                <span className={`${styles.profit} ${styles.positive}`}> +$1300</span>
            </div>
        </div>
    );
};

export default PortfolioCard;
