import React, { useState, useEffect } from 'react';
import styles from '../styleMenu/homeScreen.module.css';  // Import the main CSS file

const MarketplaceCard = ({ fetchMarketData }) => {
    const [marketData, setMarketData] = useState({});
    const [loading, setLoading] = useState(true);

    // Function to load data and set loading state
    const loadData = async () => {
        setLoading(true);  // Start loading animation
        try {
            const data = await fetchMarketData();  // Fetch data from the server
            setMarketData(data);
        } catch (error) {
            console.error('Error fetching market data:', error);
        } finally {
            setLoading(false);  // Stop loading animation
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const marketDataArray = Object.keys(marketData).map((symbol) => ({
        symbol,
        price: marketData[symbol]?.price?.toFixed(2),  // Ensure two decimal places
        change: marketData[symbol]?.change?.toFixed(2),  // Ensure two decimal places for change
        percentageChange: marketData[symbol]?.percentage_change,
    }));

    return (
        <div className={`${styles.marketplace_section} ${styles.section_container}`}>
            <header className={styles.border_line}>
                <h1>Marketplace</h1>
                <button onClick={loadData} className={styles.reload_button}>
                    &#x21bb;  {/* Unicode for reload symbol */}
                </button>
            </header>

            {loading || marketDataArray.length === 0 ? (
                <div className={styles.loading_spinner}>Loading...</div>
            ) : (
                <table className={styles.market_table}>
                    <tbody>
                    <tr>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>%Change</th>
                    </tr>
                    {marketDataArray.map((item, index) => (
                        <tr key={index} className={styles.row_spacing}>
                            <td>{item.symbol}</td>
                            <td>{item.price ? item.price : 'N/A'}</td>
                            <td className={item.percentageChange >= 0 ? styles.positive_background : styles.negative_background}>
                                {item.percentageChange ? `${item.percentageChange.toFixed(2)}%` : 'N/A'}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MarketplaceCard;
