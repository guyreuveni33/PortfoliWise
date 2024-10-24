import React, { useState, useEffect, useRef } from 'react';
import WatchlistService from '../../services/WatchlistService';
import styles from '../../styleMenu/homeScreen.module.css';

const WatchlistCard = ({ email }) => {
    const [newSymbol, setNewSymbol] = useState('');
    const [watchlist, setWatchlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [symbolSuggestions, setSymbolSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    // Function to handle adding a symbol
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
            setSymbolSuggestions([]); // Clear suggestions once a symbol is added
            setShowSuggestions(false); // Hide suggestions dropdown

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

    // Function to handle fetching symbol suggestions
    const fetchSymbolSuggestions = async (symbolPrefix) => {
        if (symbolPrefix.trim()) {
            const suggestions = await WatchlistService.getSymbolSuggestions(symbolPrefix);
            setSymbolSuggestions(suggestions); // Set suggestions to state
            setShowSuggestions(true); // Show the suggestions dropdown
        } else {
            setSymbolSuggestions([]); // Clear suggestions if no input
            setShowSuggestions(false); // Hide the suggestions dropdown
        }
    };

    // Fetch the watchlist when the email changes or when the component mounts
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
                            placeholder="Enter stock symbol..."
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
                    <button
                        onClick={() => handleAddSymbol()}
                        className={styles.add_button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add'}
                    </button>
                </div>
            </header>
            <table className={styles.watchlist_table}>
                <tbody>
                <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>%Change</th>
                </tr>
                {watchlist.length === 0 ? (
                    <tr>
                        <td colSpan="3">No symbols in watchlist</td>
                    </tr>
                ) : (
                    watchlist.map((item, index) => (
                        <tr key={index} className={styles.row_spacing}>
                            <td>{item.symbol}</td>
                            <td>
                                {item.price && typeof item.price.price === 'number'
                                    ? `$${item.price.price.toFixed(2)}`
                                    : 'N/A'}
                            </td>
                            <td className={item.price?.percentage_change >= 0 ? styles.positive_background : styles.negative_background}>
                                {item.price && typeof item.price.percentage_change === 'number'
                                    ? `${item.price.percentage_change.toFixed(2)}%`
                                    : 'N/A'}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default WatchlistCard;
