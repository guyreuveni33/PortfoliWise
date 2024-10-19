import React from 'react';
import styles from '../styleMenu/homeScreen.module.css';
import TimeFilter from './TimeFilter';

const BalanceCard = ({ balance, activeTimeFilter, onTimeFilterClick }) => {
    return (
        <div className={`${styles.balance_graph} ${styles.section_container}`}>
            <header>
                <p>Your Balance</p>
                <h1 className={styles.balance_text}>{balance}</h1>
            </header>
            <canvas id="balanceChart"></canvas>
            <TimeFilter
                activeTimeFilter={activeTimeFilter}
                onFilterClick={onTimeFilterClick}
            />
        </div>
    );
};

export default BalanceCard;