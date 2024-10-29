import React from 'react';
import styles from '../../styleMenu/homeScreen.module.css';

const PortfolioTable = ({ portfolioData }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    return (
        <div className={`${styles.portfolio_container} ${styles.section_container}`}>
            <header className={styles.border_line}><h1>Your Portfolio</h1></header>
            <table className={styles.portfolio_table}>
                <tbody>
                <tr>
                    <th>Name</th>
                    <th>Balance</th>
                    <th>Price</th>
                    <th>Today</th>
                    <th>Week</th>
                </tr>
                {portfolioData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{formatCurrency(item.balance)}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td className={item.todayChange >= 0 ? styles.positive_background : styles.negative_background}>
                            {item.todayChange.toFixed(2)}%
                        </td>
                        <td className={item.weekChange >= 0 ? styles.positive_background : styles.negative_background}>
                            {item.weekChange.toFixed(2)}%
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PortfolioTable;
