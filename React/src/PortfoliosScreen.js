// PortfolioScreen.js

import React, { useState, useEffect } from 'react';
import styles from './styleMenu/portfoliosScreen.module.css';
import Sidebar from "./components/Sidebar";
import PortfolioTable from './components/portfolio_screen_components/PortfolioTable';
import AddPortfolioModal from './components/portfolio_screen_components/AddPortfolioModal';
import AnalyzerModal from './components/portfolio_screen_components/AnalyzerModal';

function PortfolioScreen() {
    const [showAddPortfolioModal, setShowAddPortfolioModal] = useState(false);
    const [showAnalyzerModal, setShowAnalyzerModal] = useState(false);
    const [activeLink, setActiveLink] = useState('home');
    const [portfoliosData, setPortfoliosData] = useState([]);
    const [selectedStockSymbol, setSelectedStockSymbol] = useState('');

    const handleLinkClick = (link) => setActiveLink(link);
    const handleAddPortfolio = () => setShowAddPortfolioModal(true);
    const handleCloseAddPortfolio = () => setShowAddPortfolioModal(false);

    const handleAnalyzerClick = (symbol) => {
        setSelectedStockSymbol(symbol);
        setShowAnalyzerModal(true);
    };
    const handleCloseAnalyzer = () => setShowAnalyzerModal(false);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/portfolios', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error fetching portfolio data:', errorData);
                    setPortfoliosData([]);
                    return;
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setPortfoliosData(data);
                } else {
                    console.error('Unexpected data format:', data);
                    setPortfoliosData([]);
                }
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
                setPortfoliosData([]);
            }
        };
        fetchPortfolioData();
    }, [showAddPortfolioModal]);



    return (
        <div className={styles.wrapper}>
            <Sidebar activeLink={activeLink} handleLinkClick={handleLinkClick} />

            <div className={styles.mainContent}>
                <div className={styles.profileIcon}>
                    <img src="/User-profile-pic.png" alt="User Profile" />
                </div>
                <div className={styles.graphs}>
                    {portfoliosData.map((portfolio, index) => (
                        <PortfolioTable
                            index={index}
                            portfolioData={portfolio.positions}
                            handleAnalyzerClick={handleAnalyzerClick}
                        />
                    ))}
                    <button className={styles.addPortfolioButton} onClick={handleAddPortfolio}>
                        <img className={styles.buttonIcon} src="/plus.png" alt="Add Portfolio Icon" />Add Portfolio
                    </button>
                </div>
            </div>

            {showAddPortfolioModal && (
                <AddPortfolioModal handleClose={handleCloseAddPortfolio} />
            )}

            {showAnalyzerModal && (
                <AnalyzerModal
                    handleClose={handleCloseAnalyzer}
                    isVisible={showAnalyzerModal}
                    stockSymbol={selectedStockSymbol} // Pass selected stock symbol
                />
            )}
        </div>
    );
}

export default PortfolioScreen;
