import React, { useState, useEffect, useRef } from 'react';
import WatchlistService from '../../services/WatchlistService';
import styles from '../../styleMenu/homeScreen.module.css';
import StocksTable from './StocksTable';
import LoadingSpinner from './LoadingSpinner';
import SearchModal from './SearchModal';
import ModifyWatchlistModal from "./ModifyWatchlistModal";

const WatchlistCard = ({ email }) => {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isModifyModalOpen, setIsModifyModalOpen] = useState(false); // State for modification modal
    const [watchlist, setWatchlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const previousWatchlistRef = useRef({});
    const isFirstLoad = useRef(true); // Track if it's the initial load

    const handleRemoveSymbol = async (symbol) => {
        await WatchlistService.removeSymbol(email, symbol);
        await fetchWatchlist();
    };

    const handleUpdateSymbol = (symbol) => {
        // Implement update logic or open a new modal for editing if needed
    };

    const handleAddSymbol = async (symbol) => {
        setIsLoading(true);
        try {
            await WatchlistService.addSymbol(email, symbol);
            await fetchWatchlist();
        } catch (error) {
            console.error('Error adding symbol:', error);
        } finally {
            setIsLoading(false);
            setIsSearchModalOpen(false);
        }
    };

    const fetchWatchlist = async () => {
        if (isFirstLoad.current) {
            setIsLoading(true); // Set loading only for the first load
            isFirstLoad.current = false; // Mark first load as complete
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
            setIsLoading(false); // Ensure loading is set to false after the first load
        }
    };

    useEffect(() => {
        fetchWatchlist();
        const interval = setInterval(fetchWatchlist, 5000); // Fetch updated prices every 5 seconds
        return () => clearInterval(interval); // Clean up on unmount
    }, [email]);

    return (
        <div className={`${styles.watchlist_section} ${styles.section_container}`}>
            <header className={styles.border_line}>
                <h1>Watchlist</h1>
                <div className={styles.iconContainer}>
                    <img
                        src="/pencil.png" // Absolute path starting from the root of the public folder
                        alt="Search"
                        className={styles.iconImage}
                        title="Modify"
                        onClick={() => {
                            console.log("Modify icon clicked"); // Debugging log
                            setIsModifyModalOpen(true);
                        }}
                    />
                    <img
                        title="Search"
                        src="/search.png" // Absolute path starting from the root of the public folder
                        alt="Modify"
                        className={styles.iconImage}
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
                    <div>No symbols in watchlist</div>
                ) : (
                    <StocksTable marketDataArray={watchlist} />
                )
            )}

            <ModifyWatchlistModal
                isOpen={isModifyModalOpen}
                onClose={() => setIsModifyModalOpen(false)} // Close modify modal
                watchlist={watchlist}
                onRemoveSymbol={handleRemoveSymbol}
                onUpdateSymbol={handleUpdateSymbol}
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
