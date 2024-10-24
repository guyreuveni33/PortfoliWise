import React, { useEffect, useState } from 'react';
import styles from '../../styleMenu/homeScreen.module.css';

const PortfolioTable = () => {
    const [portfolioData, setPortfolioData] = useState([]);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                // Fetch data from your server
                const response = await fetch('http://localhost:3001/api/alpaca/portfolio');
                const data = await response.json();
                setPortfolioData(data); // Set the portfolio data into state
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            }
        };

        fetchPortfolioData(); // Call the fetch function when the component mounts
    }, []);

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
                        <td>{formatCurrency(item.balance)}</td> {/* Format balance with $ */}
                        <td>{formatCurrency(item.price)}</td>   {/* Format price with $ */}
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
