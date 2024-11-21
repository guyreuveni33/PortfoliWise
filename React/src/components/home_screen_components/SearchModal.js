import React, { useState, useEffect, useRef } from 'react';
import styles from '../../components_style/SearchModal.module.css';
import WatchlistService from '../../services/WatchlistService';

const SearchModal = ({ isOpen, onClose, onAddSymbol, existingSymbols = [], onReloadWatchlist }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [symbolSuggestions, setSymbolSuggestions] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [noResultsFound, setNoResultsFound] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setSymbolSuggestions([]);
            setSelectedSymbol(null);
            setNoResultsFound(false);
        }
    }, [isOpen]);

    const fetchSymbolSuggestions = async (term) => {
        if (term.trim()) {
            const suggestions = await WatchlistService.getSymbolSuggestions(term);
            setSymbolSuggestions(suggestions);

            // If no suggestions are found, replace selected symbol
            if (suggestions.length === 0) {
                setSelectedSymbol(null);
                setNoResultsFound(true);
            } else {
                setNoResultsFound(false);
            }
        } else {
            setSymbolSuggestions([]);
            setNoResultsFound(false);
        }
    };

    const handleSelectSymbol = (symbol) => {
        setSelectedSymbol(symbol);
        setSymbolSuggestions([]);
        setNoResultsFound(false);
        setSearchTerm('');
    };

    const handleAdd = async () => {
        if (selectedSymbol && !isAlreadyAdded) {
            await onAddSymbol(selectedSymbol);

            if (onReloadWatchlist) {
                await onReloadWatchlist();
            }

            setSelectedSymbol(null);
            onClose();
        }
    };

    const isAlreadyAdded = selectedSymbol && existingSymbols.includes(selectedSymbol);
    const canAdd = selectedSymbol && !isAlreadyAdded;

    if (!isOpen) return null;

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h1>Search Symbol</h1>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.searchInputContainer}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            const newTerm = e.target.value;
                            setSearchTerm(newTerm);
                            fetchSymbolSuggestions(newTerm);
                        }}
                        placeholder="Enter symbol..."
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.suggestionsContainer}>
                    {symbolSuggestions.length > 0 && (
                        <div className={styles.suggestionsDropdown} ref={dropdownRef}>
                            {symbolSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className={styles.suggestionItem}
                                    onClick={() => handleSelectSymbol(suggestion.symbol)}
                                >
                                    {suggestion.symbol} - {suggestion.name}
                                </div>
                            ))}
                        </div>
                    )}

                    {noResultsFound && searchTerm.trim() !== '' && (
                        <div className={styles.noResultsMessage}>
                            No symbol found for
                        </div>
                    )}
                </div>

                {selectedSymbol && !noResultsFound && (
                    <div className={styles.selectedSymbolContainer}>
                        Selected Symbol: {selectedSymbol}
                    </div>
                )}

                <button
                    className={canAdd ? styles.addButton : styles.addButtonDisabled}
                    onClick={handleAdd}
                    disabled={!canAdd}
                >
                    Add
                </button>

                {isAlreadyAdded && (
                    <div className={styles.alreadyAddedMessage}>
                        Already in watchlist
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchModal;