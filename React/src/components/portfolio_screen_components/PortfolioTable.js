import React from 'react';
import PortfolioRow from './PortfolioRow';
import styles from '../../styleMenu/portfoliosScreen.module.css';

function PortfolioTable({ portfolioData, handleAnalyzerClick }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    return (
        <div className={`${styles.portfolio} ${styles.section}`}>
            <header className={styles.borderLine}><h1>Your Portfolio</h1></header>
            <table className={styles.portfolioTable}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Balance</th>
                    <th>Price</th>
                    <th>Today</th>
                    <th>Week</th>
                    <th className={styles.centerAnalyzer}>Price Analyzer</th>
                </tr>
                </thead>
                <tbody>
                {portfolioData.map((item, index) => (
                    <PortfolioRow
                        key={index}
                        item={item}
                        formatCurrency={formatCurrency}
                        handleAnalyzerClick={handleAnalyzerClick}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default PortfolioTable;
