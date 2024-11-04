import React from 'react';
import styles from '../../components_style/stocksTable.module.css';

const StocksTable = ({ marketDataArray }) => {
    return (
        <table className={styles.market_table}>
            <thead>
            <tr>
                <th>Symbol</th>
                <th>Price</th>
                <th>%Change</th>
            </tr>
            </thead>
            <tbody>
            {marketDataArray.map((item, index) => (
                <tr key={index} className={styles.row_spacing}>
                    <td>{item.symbol}</td>
                    <td>{item.price ? item.price : 'N/A'}</td>
                    <td className={item.percentageChange >= 0 ? styles.positive_background : styles.negative_background}>
                        {typeof item.percentageChange === 'number'
                            ? `${item.percentageChange.toFixed(2)}%`
                            : 'N/A'}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default StocksTable;
