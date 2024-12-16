import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styleMenu/homeScreen.module.css';

const PortfolioTable = ({ portfolioData }) => {
    const [blinkStates, setBlinkStates] = useState({});
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const previousData = useRef([]);

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 768);
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

    const formatBalance = (value) => {
        // Format balance dynamically based on screen size
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: isSmallScreen ? 0 : 2, // Remove decimals on small screens
            maximumFractionDigits: isSmallScreen ? 0 : 2,
        }).format(value);
    };

    const formatPrice = (value) => {
        // Always include two decimal places for price
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const formatPercentage = (value) => {
        return `${value.toFixed(2)}%`; // Always show two decimals for percentage values
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
                    <th className={styles.today_column}>Today</th>
                    <th>Week</th>
                </tr>
                {portfolioData.map((item, index) => (
                    <tr key={`${item.name}-${item.price}-${index}`}>
                        <td>{item.name}</td>
                        <td>{formatBalance(item.balance)}</td> {/* Balance with dynamic formatting */}
                        <td className={`${styles.price_cell} ${
                            blinkStates[item.name] === 'green'
                                ? styles.price_blink_green
                                : blinkStates[item.name] === 'red'
                                    ? styles.price_blink_red
                                    : ''
                        }`}>
                            {formatPrice(item.price)} {/* Price always with two decimals */}
                        </td>
                        <td className={`${styles.today_column} ${
                            item.todayChange >= 0 ? styles.positive_background : styles.negative_background
                        }`}>
                            {formatPercentage(item.todayChange)}
                        </td>
                        <td className={item.weekChange >= 0 ? styles.positive_background : styles.negative_background}>
                            {formatPercentage(item.weekChange)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PortfolioTable;
