import React from 'react';
import styles from '../styleMenu/homeScreen.module.css';
import MarketplaceCard from "./MarketplaceCard";

const PortfolioTable = ({ portfolioData }) => {
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
                        <td>{item.balance}</td>
                        <td>{item.price}</td>
                        <td className={item.todayChange >= 0 ? styles.positive_change : styles.negative_change}>
                            {item.todayChange}%
                        </td>
                        <td className={item.weekChange >= 0 ? styles.positive_change : styles.negative_change}>
                            {item.weekChange}%
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PortfolioTable;