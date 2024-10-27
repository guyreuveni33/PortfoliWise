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
    const [portfolioData, setPortfolioData] = useState([]);
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
                const response = await fetch('http://localhost:3001/api/alpaca/portfolio');
                const data = await response.json();
                setPortfolioData(data);
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            }
        };
        fetchPortfolioData();
    }, []);

    return (
        <div className={styles.wrapper}>
            <Sidebar activeLink={activeLink} handleLinkClick={handleLinkClick} />

            <div className={styles.mainContent}>
                <div className={styles.profileIcon}>
                    <img src="/User-profile-pic.png" alt="User Profile" />
                </div>
                <div className={styles.graphs}>
                    <PortfolioTable
                        portfolioData={portfolioData}
                        handleAnalyzerClick={handleAnalyzerClick}
                    />
                    <button className={styles.addPortfolioButton} onClick={handleAddPortfolio}>
                        <img className={styles.iconStyle} src="/plus.png" alt="Add Portfolio Icon" />Add Portfolio
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
