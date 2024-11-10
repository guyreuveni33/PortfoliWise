import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styleMenu/homeScreen.module.css';
import StocksTable from './StocksTable';
import LoadingSpinner from './LoadingSpinner';

const MarketplaceCard = ({ fetchMarketData }) => {
    const [marketData, setMarketData] = useState({});
    const [loading, setLoading] = useState(true); // Controls initial loading spinner
    const [blink, setBlink] = useState(false); // Controls periodic "blink" refresh
    const previousDataRef = useRef({});
    const firstLoad = useRef(true);

    const loadData = async () => {
        if (firstLoad.current) {
            setLoading(true);
            firstLoad.current = false;
        } else {
            setBlink(true); // Trigger "blink" on subsequent loads
        }

        try {
            const newData = await fetchMarketData();

            // Compare with previous data and add price direction
            const processedData = Object.keys(newData).reduce((acc, symbol) => {
                const currentPrice = newData[symbol]?.price;
                const previousPrice = previousDataRef.current[symbol]?.price;

                acc[symbol] = {
                    ...newData[symbol],
                    priceDirection: previousPrice !== undefined && currentPrice !== previousPrice
                        ? currentPrice > previousPrice ? 'green' : 'red'
                        : null
                };
                return acc;
            }, {});

            previousDataRef.current = newData;
            setMarketData(processedData);
        } catch (error) {
            console.error('Error fetching market data:', error);
        } finally {
            setLoading(false);
            setTimeout(() => setBlink(false), 500); // Turn off "blink" after 500ms
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 3000);
        return () => clearInterval(interval);
    }, []);

    const marketDataArray = Object.keys(marketData).map((symbol) => ({
        symbol,
        price: marketData[symbol]?.price?.toFixed(2),
        percentageChange: marketData[symbol]?.percentage_change,
        priceDirection: marketData[symbol]?.priceDirection
    }));

    return (
        <div className={`${styles.marketplace_section} ${styles.section_container}`}>
            <header className={styles.border_line}>
                <h1>Marketplace</h1>

            </header>

            {loading ? (
                <div className={styles.loading_container}>
                    <LoadingSpinner />
                </div>
            ) : (
                <StocksTable marketDataArray={marketDataArray} />
            )}
        </div>
    );
};

export default MarketplaceCard;
