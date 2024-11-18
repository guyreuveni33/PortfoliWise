import React, { useState } from 'react';
import PortfolioRow from './PortfolioRow';
import styles from '../../styleMenu/portfoliosScreen.module.css';

function PortfolioTable({ portfolioData, handleAnalyzerClick, index, portfolioId, deletePortfolio, isActive, setActivePortfolio }) {
    const [showTooltip, setShowTooltip] = useState(false);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const handleDelete = () => {
        deletePortfolio(portfolioId);
    };

    const handleActivate = () => {
        setActivePortfolio(portfolioId);
    };

    return (
        <div className={`${styles.portfolio} ${styles.section}`}>
            <header className={styles.header}>
                <h1>Portfolio {index + 1}</h1>
                <div className={styles.buttonContainer}>
                    <div
                        className={isActive ? styles.activeButton : styles.inactiveButton}
                        onClick={handleActivate}
                        onMouseEnter={() => !isActive && setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        {isActive ? "Display in Home" : "Set to Display in Home"}
                        {showTooltip && !isActive && (
                            <div className={styles.tooltip}>
                                Clicking on this button will display this portfolio in the Home Screen
                            </div>
                        )}
                    </div>
                    <button className={styles.deleteButton} onClick={handleDelete} title="Delete Portfolio">×</button>
                </div>
            </header>
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
                {portfolioData && portfolioData.map((item, index) => (
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
