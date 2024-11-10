import React from 'react';
import styles from './modifyWatchlistModal.module.css';

const ModifyWatchlistModal = ({ isOpen, onClose, watchlist, onRemoveSymbol }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h1>Modify Watchlist</h1>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.scrollableContent}>
                    {watchlist.length > 0 ? (
                        <ul className={styles.watchlistItems}>
                            {watchlist.map((item) => (
                                <li key={item.symbol} className={styles.watchlistItem}>
                                    <span>{item.symbol} - {item.price}</span>
                                    <button
                                        className={styles.removeButton}
                                        onClick={() => onRemoveSymbol(item.symbol)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No symbols in watchlist</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModifyWatchlistModal;
