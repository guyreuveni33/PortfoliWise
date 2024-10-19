import React from 'react';
import styles from '../styleMenu/homeScreen.module.css';
import BalanceCard from "./BalanceCard";

const WatchlistCard = ({ watchlistData }) => {
    return (
        <div className={`${styles.watchlist_section} ${styles.section_container}`}>
            <header className={styles.border_line}><h1>Watchlist</h1></header>
            <table className={styles.watchlist_table}>
                <tbody>
                <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>%Change</th>
                </tr>
                {watchlistData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.symbol}</td>
                        <td>{item.price}</td>
                        <td className={item.change >= 0 ? styles.positive_change : styles.negative_change}>
                            {item.change}%
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default WatchlistCard;