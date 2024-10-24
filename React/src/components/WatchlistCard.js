import React, { useState, useEffect } from 'react';
import WatchlistService from '../services/WatchlistService';
import styles from '../styleMenu/homeScreen.module.css';  // Import the main CSS file
const WatchlistCard = ({ email }) => {
    const [newSymbol, setNewSymbol] = useState('');
    const [watchlist, setWatchlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle adding a symbol
    const handleAddSymbol = async () => {
        if (newSymbol.trim()) {
            setIsLoading(true);
            const trimmedSymbol = newSymbol.trim().toUpperCase();
            const optimisticWatchlist = [...watchlist, { symbol: trimmedSymbol, price: { price: 'N/A', percentage_change: 'N/A' } }];

            setWatchlist(optimisticWatchlist);
            setNewSymbol('');

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


    // Fetch the watchlist when the email changes or when the component mounts
    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                if (email) {  // Ensure email is available before fetching
                    const fetchedWatchlist = await WatchlistService.getWatchlist(email);
                    setWatchlist(fetchedWatchlist);
                }
            } catch (error) {
                console.error('Error fetching watchlist:', error);
            }
        };

        fetchWatchlist();
    }, [email]); // Depend on email so that the effect re-runs if email changes

    return (
        <div className={`${styles.watchlist_section} ${styles.section_container}`}>
            <header className={styles.border_line}>
                <h1>Watchlist</h1>
            <div className={styles.search_container}>
                <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    placeholder="Enter stock symbol..."
                    className={styles.search_input}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSymbol()}
                />
                <button
                    onClick={handleAddSymbol}
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
