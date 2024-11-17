import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styleMenu/homeScreen.module.css';
import StocksTable from './StocksTable';
import LoadingSpinner from './LoadingSpinner';

const symbolMapping = {
    '^GSPC': 'S&P 500',
    '^IXIC': 'NASDAQ',
    '^DJI': 'Dow',
    'BTC-USD':'BTC'
};

const MarketplaceCard = ({ fetchMarketData }) => {
    const [marketData, setMarketData] = useState({});
    const [loading, setLoading] = useState(true);
    const [blink, setBlink] = useState(false);
    const previousDataRef = useRef({});
    const firstLoad = useRef(true);

    const loadData = async () => {
        if (firstLoad.current) {
            setLoading(true);
            firstLoad.current = false;
        } else {
            setBlink(true);
        }

        try {
            const newData = await fetchMarketData();

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
            setTimeout(() => setBlink(false), 500);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 3000);
        return () => clearInterval(interval);
    }, []);

    const marketDataArray = Object.keys(marketData).map((symbol) => ({
        symbol: symbolMapping[symbol] || symbol, // Use mapped name or default to symbol
        price: marketData[symbol]?.price?.toFixed(2),
        percentageChange: marketData[symbol]?.percentage_change,
        priceDirection: marketData[symbol]?.priceDirection
    }));

    // console.log("Market Data Array:", marketDataArray); // Check if symbols are mapped


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
