import React, { useState, useEffect, useRef } from 'react';
import WatchlistService from '../../services/WatchlistService';
import styles from '../../styleMenu/homeScreen.module.css';
import StocksTable from './StocksTable';
import LoadingSpinner from './LoadingSpinner';
import SearchModal from './SearchModal';
import ModifyWatchlistModal from "./ModifyWatchlistModal";

const WatchlistCard = ({ email }) => {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
    const [watchlist, setWatchlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Initially true to show spinner on mount
    const [blink, setBlink] = useState(false);
    const previousWatchlistRef = useRef({});
    const isFirstLoad = useRef(true);

    const handleRemoveSymbol = async (symbol) => {
        await WatchlistService.removeSymbol(email, symbol);
        await fetchWatchlist();
    };

    const handleAddSymbol = async (symbol) => {
        setIsLoading(true); // Show loading spinner when adding a new symbol
        try {
            await WatchlistService.addSymbol(email, symbol);
            await fetchWatchlist();
        } catch (error) {
            console.error('Error adding symbol:', error);
        } finally {
            setIsSearchModalOpen(false);
        }
    };

    const fetchWatchlist = async () => {
        if (isFirstLoad.current) {
            setIsLoading(true); // Show spinner on initial load
            isFirstLoad.current = false;
        } else {
            setBlink(true); // Enable blink effect on subsequent updates
        }

        try {
            const fetchedWatchlist = await WatchlistService.getWatchlist(email);

            const updatedWatchlist = fetchedWatchlist.map((item) => {
                const currentPrice = item.price?.price ?? 'N/A';
                const previousPrice = previousWatchlistRef.current[item.symbol]?.price ?? 'N/A';

                const priceDirection =
                    previousPrice !== 'N/A' && currentPrice !== 'N/A' && currentPrice !== previousPrice
                        ? parseFloat(currentPrice) > parseFloat(previousPrice) ? 'green' : 'red'
                        : null;

                return {
                    symbol: item.symbol,
                    price: currentPrice,
                    percentageChange: item.price?.percentage_change ?? 'N/A',
                    priceDirection,
                };
            });

            previousWatchlistRef.current = fetchedWatchlist.reduce((acc, item) => ({
                ...acc,
                [item.symbol]: { price: item.price?.price },
            }), {});

            setWatchlist(updatedWatchlist);
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        } finally {
            setIsLoading(false); // Stop spinner after first load or after reloading data
            setTimeout(() => setBlink(false), 500); // Reset blink effect after a short delay
        }
    };

    useEffect(() => {
        fetchWatchlist();
        const interval = setInterval(fetchWatchlist, 5000); // Fetch updates every 5 seconds
        return () => clearInterval(interval);
    }, [email]);

    return (
        <div className={`${styles.watchlist_section} ${styles.section_container}`}>
            <header className={styles.border_line}>
                <h1>Watchlist</h1>
                <div className={styles.iconContainer}>
                    <img
                        src="/pencil.png"
                        alt="Modify"
                        className={styles.iconImage}
                        title="Modify"
                        onClick={() => setIsModifyModalOpen(true)}
                    />
                    <img
                        src="/search.png"
                        alt="Search"
                        className={styles.iconImage}
                        title="Search"
                        onClick={() => setIsSearchModalOpen(true)}
                    />
                </div>
            </header>

            {isLoading ? (
                <div className={styles.loading_container}>
                    <LoadingSpinner />
                </div>
            ) : (
                watchlist.length === 0 ? (
                    <div className={styles.No_Symbol}>No symbols found in your watchlist.</div>
                ) : (
                    <StocksTable marketDataArray={watchlist} blink={blink} />
                )
            )}

            <ModifyWatchlistModal
                isOpen={isModifyModalOpen}
                onClose={() => setIsModifyModalOpen(false)}
                watchlist={watchlist}
                onRemoveSymbol={handleRemoveSymbol}
            />

            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                onAddSymbol={handleAddSymbol}
                existingSymbols={watchlist.map(item => item.symbol)}
            />
        </div>
    );
};

export default WatchlistCard;
