import React from 'react';
import styles from '../../styleMenu/portfoliosScreen.module.css';

function PortfolioRow({ item, formatCurrency, handleAnalyzerClick }) {
    return (
        <tr>
            <td>{item.name}</td>
            <td>{formatCurrency(item.balance)}</td>
            <td>{formatCurrency(item.price)}</td>
            <td className={item.todayChange >= 0 ? styles.positive_background : styles.negative_background}>
                {item.todayChange.toFixed(2)}%
            </td>
            <td className={item.weekChange >= 0 ? styles.positive_background : styles.negative_background}>
                {item.weekChange.toFixed(2)}%
            </td>
            <td className={styles.centerAnalyzer}>
                <button className={styles.analyzerButton} onClick={handleAnalyzerClick}>
                    <img className={styles.analyzerStyle} src="/price-analyzer.png" alt="Analyzer Icon" />
                </button>
            </td>
        </tr>
    );
}

export default PortfolioRow;
