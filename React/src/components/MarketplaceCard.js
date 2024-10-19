import React from 'react';
import styles from '../styleMenu/homeScreen.module.css';
import WatchlistCard from "./WatchlistCard";

const MarketplaceCard = ({ marketData }) => {
    return (
        <div className={`${styles.marketplace_section} ${styles.section_container}`}>
            <header className={styles.border_line}><h1>Marketplace</h1></header>
            <table className={styles.market_table}>
                <tbody>
                <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>%Change</th>
                </tr>
                {marketData.map((item, index) => (
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

export default MarketplaceCard;