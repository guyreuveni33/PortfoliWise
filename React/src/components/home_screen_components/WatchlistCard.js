import React, { useState, useEffect, useRef } from 'react';
import WatchlistService from '../../services/WatchlistService';
import styles from '../../styleMenu/homeScreen.module.css';
import StocksTable from './StocksTable';  // Import the new table component

const WatchlistCard = ({ email }) => {
    const [newSymbol, setNewSymbol] = useState('');
    const [watchlist, setWatchlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [symbolSuggestions, setSymbolSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddSymbol = async (symbol = newSymbol) => {
        if (symbol.trim()) {
            setIsLoading(true);
            const trimmedSymbol = symbol.trim().toUpperCase();
            const optimisticWatchlist = [...watchlist, { symbol: trimmedSymbol, price: { price: 'N/A', percentage_change: 'N/A' } }];

            setWatchlist(optimisticWatchlist);
            setNewSymbol('');
            setSymbolSuggestions([]);
            setShowSuggestions(false);

            try {
                await WatchlistService.addSymbol(email, trimmedSymbol);
                const updatedWatchlist = await WatchlistService.getWatchlist(email);
                setWatchlist(updatedWatchlist);
            } catch (error) {
                console.error('Error adding symbol to watchlist', error);
                setWatchlist(watchlist);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const fetchSymbolSuggestions = async (symbolPrefix) => {
        if (symbolPrefix.trim()) {
            const suggestions = await WatchlistService.getSymbolSuggestions(symbolPrefix);
            setSymbolSuggestions(suggestions);
            setShowSuggestions(true);
        } else {
            setSymbolSuggestions([]);
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                if (email) {
                    const fetchedWatchlist = await WatchlistService.getWatchlist(email);
                    setWatchlist(fetchedWatchlist);
                }
            } catch (error) {
                console.error('Error fetching watchlist:', error);
            }
        };

        fetchWatchlist();
    }, [email]);

    // Map watchlist data to match StocksTable expected format, with price rounded to 2 decimal places
    const watchlistData = watchlist.map((item) => ({
        symbol: item.symbol,
        price: item.price?.price ? item.price.price.toFixed(2) : 'N/A',  // Ensure two decimal places
        percentageChange: item.price?.percentage_change,
    }));


    return (
        <div className={`${styles.watchlist_section} ${styles.section_container}`}>
            <header className={styles.border_line}>
                <h1>Watchlist</h1>
                <div className={styles.search_container}>
                    <div className={styles.search_wrapper}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={newSymbol}
                            onChange={(e) => {
                                setNewSymbol(e.target.value);
                                fetchSymbolSuggestions(e.target.value);
                            }}
                            placeholder="symbol..."
                            className={styles.search_input}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSymbol()}
                        />
                        {showSuggestions && symbolSuggestions.length > 0 && (
                            <div className={styles.suggestions_dropdown} ref={dropdownRef}>
                                {symbolSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className={styles.suggestion_item}
                                        onClick={() => {
                                            handleAddSymbol(suggestion.symbol);
                                            setSymbolSuggestions([]);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        <div className={styles.suggestion_symbol}>
                                            {suggestion.symbol}
                                        </div>
                                        <div className={styles.suggestion_name}>
                                            {suggestion.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>
            {watchlistData.length === 0 ? (
                <div>No symbols in watchlist</div>
            ) : (
                <StocksTable marketDataArray={watchlistData} />  // Render the StocksTable
            )}
        </div>
    );
};

export default WatchlistCard;
