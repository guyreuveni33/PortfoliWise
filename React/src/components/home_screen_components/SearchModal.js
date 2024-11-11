import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchModal.module.css';
import WatchlistService from '../../services/WatchlistService';

const SearchModal = ({ isOpen, onClose, onAddSymbol, existingSymbols = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [symbolSuggestions, setSymbolSuggestions] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Clear state when the modal is closed
        if (!isOpen) {
            setSearchTerm('');
            setSymbolSuggestions([]);
            setSelectedSymbol(null);
        }
    }, [isOpen]);

    const fetchSymbolSuggestions = async (term) => {
        if (term.trim()) {
            const suggestions = await WatchlistService.getSymbolSuggestions(term);
            setSymbolSuggestions(suggestions);
        } else {
            setSymbolSuggestions([]);
        }
    };

    const handleSelectSymbol = (symbol) => {
        setSelectedSymbol(symbol);
        setSymbolSuggestions([]);
        setSearchTerm('');
    };

    const handleAdd = () => {
        if (selectedSymbol && !isAlreadyAdded) {
            onAddSymbol(selectedSymbol);
            setSelectedSymbol(null);
            onClose(); // Close the modal after adding
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
                            setSearchTerm(e.target.value);
                            fetchSymbolSuggestions(e.target.value);
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
                </div>

                {selectedSymbol && (
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
