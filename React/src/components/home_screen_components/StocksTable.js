import React, { useEffect, useState } from 'react';
import styles from '../../components_style/stocksTable.module.css';

const StocksTable = ({ marketDataArray }) => {
    const [blinkStates, setBlinkStates] = useState({});

    useEffect(() => {
        // Update blink states when new data arrives
        const newBlinkStates = {};
        marketDataArray.forEach(item => {
            if (item.priceDirection) {
                newBlinkStates[item.symbol] = item.priceDirection;
            }
        });

        setBlinkStates(newBlinkStates);

        // Clear blink states after animation
        const timer = setTimeout(() => {
            setBlinkStates({});
        }, 1000);

        return () => clearTimeout(timer);
    }, [marketDataArray]);

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
            {marketDataArray.map((item) => (
                <tr key={item.symbol} className={styles.row_spacing}>
                    <td>{item.symbol}</td>
                    <td className={`${styles.price_cell} ${
                        blinkStates[item.symbol] === 'green'
                            ? styles.price_blink_green
                            : blinkStates[item.symbol] === 'red'
                                ? styles.price_blink_red
                                : ''
                    }`}>
                        {item.price ? item.price : 'N/A'}
                    </td>
                    <td className={`${item.percentageChange >= 0
                        ? styles.positive_background
                        : styles.negative_background} ${styles.percentage_cell}`}>
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