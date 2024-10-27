import React, { useState, useEffect } from 'react';
import styles from '../../styleMenu/homeScreen.module.css';
//import styles from '../../components_style/marketplaceCard.module.css';
import StocksTable from './StocksTable';  // Import the new table component

const MarketplaceCard = ({ fetchMarketData }) => {
    const [marketData, setMarketData] = useState({});
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchMarketData();
            setMarketData(data);
        } catch (error) {
            console.error('Error fetching market data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const marketDataArray = Object.keys(marketData).map((symbol) => ({
        symbol,
        price: marketData[symbol]?.price?.toFixed(2),
        change: marketData[symbol]?.change?.toFixed(2),
        percentageChange: marketData[symbol]?.percentage_change,
    }));

    return (
        <div className={`${styles.marketplace_section} ${styles.section_container}`}>
            <header className={styles.border_line}>
                <h1>Marketplace</h1>
                <button onClick={loadData} className={styles.reload_button}>
                    &#x21bb;
                </button>
            </header>

            {loading || marketDataArray.length === 0 ? (
                <div className={styles.loading_spinner}>Loading...</div>
            ) : (
                <StocksTable marketDataArray={marketDataArray} />  // Use the new table component
            )}
        </div>
    );
};

export default MarketplaceCard;
