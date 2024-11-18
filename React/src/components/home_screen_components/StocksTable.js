import React, { useEffect, useState } from 'react';
import styles from '../../components_style/stocksTable.module.css';

const StocksTable = ({ marketDataArray }) => {
    const [blinkStates, setBlinkStates] = useState({});

    useEffect(() => {
        if (!Array.isArray(marketDataArray)) {
            return;
        }

        const newBlinkStates = {};
        marketDataArray.forEach(item => {
            if (item.priceDirection) {
                newBlinkStates[item.symbol] = item.priceDirection;
            }
        });
        setBlinkStates(newBlinkStates);

        const timer = setTimeout(() => {
            setBlinkStates({});
        }, 30000);
        return () => clearTimeout(timer);
    }, [marketDataArray]);

    // Calculate max-height based on number of rows
    const getScrollableStyle = () => {
        if (Array.isArray(marketDataArray) && marketDataArray.length > 9) {
            return {
                maxHeight: '336px',
                overflowY: 'auto'
            };
        }
        return {
            maxHeight: 'none',
            overflowY: 'visible'
        };
    };

    if (!Array.isArray(marketDataArray) || marketDataArray.length === 0) {
        return <div>No market data available to display.</div>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.market_table}>
                <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>%Change</th>
                </tr>
                </thead>
            </table>
            <div
                className={styles.scrollableBody}
                style={getScrollableStyle()}
            >
                <table className={styles.market_table}>
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
                            <td className={`${
                                item.percentageChange >= 0
                                    ? styles.positive_background
                                    : styles.negative_background
                            } ${styles.percentage_cell}`}>
                                {typeof item.percentageChange === 'number'
                                    ? `${item.percentageChange.toFixed(2)}%`
                                    : 'N/A'}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StocksTable;
