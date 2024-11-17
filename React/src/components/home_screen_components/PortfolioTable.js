import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styleMenu/homeScreen.module.css';

const PortfolioTable = ({ portfolioData }) => {
    const [blinkStates, setBlinkStates] = useState({});
    const previousData = useRef([]);  // To store the previous portfolio data for comparison

    useEffect(() => {
        const newBlinkStates = {};

        portfolioData.forEach((item, index) => {
            const prevItem = previousData.current[index];

            if (prevItem) {
                if (item.price > prevItem.price) {
                    newBlinkStates[item.name] = 'green';
                } else if (item.price < prevItem.price) {
                    newBlinkStates[item.name] = 'red';
                }
            }
        });

        setBlinkStates(newBlinkStates);

        // Clear blink states after 1 second to stop animation
        const timer = setTimeout(() => {
            setBlinkStates({});
        }, 1000);

        // Update previousData to the current portfolioData for the next render
        previousData.current = portfolioData.map(item => ({ ...item }));

        return () => clearTimeout(timer);
    }, [portfolioData]);

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
                    <tr key={`${item.name}-${item.price}-${index}`}>
                        <td>{item.name}</td>
                        <td>{formatCurrency(item.balance)}</td>
                        <td className={`${styles.price_cell} ${
                            blinkStates[item.name] === 'green'
                                ? styles.price_blink_green
                                : blinkStates[item.name] === 'red'
                                    ? styles.price_blink_red
                                    : ''
                        }`}>
                            {formatCurrency(item.price)}
                        </td>
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
