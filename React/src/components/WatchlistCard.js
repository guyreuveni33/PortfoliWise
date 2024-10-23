import React, { useState, useEffect } from 'react';
import WatchlistService from '../services/WatchlistService';
import styles from '../styleMenu/homeScreen.module.css';

const WatchlistCard = ({ email }) => {
    const [newSymbol, setNewSymbol] = useState('');
    const [watchlist, setWatchlist] = useState([]);

    // Function to handle adding a symbol
    const handleAddSymbol = async () => {
        if (newSymbol.trim()) {
            try {
                // Call the service to add the symbol to the user's watchlist
                const updatedWatchlist = await WatchlistService.addSymbol(email, newSymbol.trim());
                setWatchlist(updatedWatchlist); // Update the watchlist with the new symbol
                setNewSymbol(''); // Clear the input field
            } catch (error) {
                console.error('Error adding symbol to watchlist');
            }
        }
    };

    // Fetch the watchlist when the email changes or when the component mounts
    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                if (email) {  // Ensure email is available before fetching
                    const fetchedWatchlist = await WatchlistService.getWatchlist(email);
                    console.log(fetchedWatchlist);  // Debugging: check the fetched watchlist
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
            </header>
            <input
                type="text"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                placeholder="Add symbol"
            />
            <button onClick={handleAddSymbol}>Add</button>
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
                        <tr key={index}>
                            <td>{item.symbol}</td>
                            <td>{item.price}</td>
                            <td className={item.change >= 0 ? styles.positive_change : styles.negative_change}>
                                {item.change}%
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
