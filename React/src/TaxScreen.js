import React, { useState, useEffect } from 'react';
import styles from './styleMenu/taxScreen.module.css';
import Sidebar from "./components/Sidebar";
import PortfolioCard from './components/tax_screen_components/PortfolioCard';
import TaxButton from './components/tax_screen_components/TaxButton';
import TaxModal from './components/tax_screen_components/TaxModal';

const TaxScreen = () => {
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('tax'); // Set 'tax' as the default active link

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    const handleCalculateTax = () => {
        setIsTaxModalOpen(true);
        console.log(isTaxModalOpen)
    };

    const handleCloseModal = () => {
        setIsTaxModalOpen(false);
    };

    useEffect(() => {
        const currentUrl = window.location.pathname;

        const homeLink = document.getElementById('home_link');
        const portfoliosLink = document.getElementById('portfolios_link');
        const taxLink = document.getElementById('tax_link');
        const settingsLink = document.getElementById('settings_link');

        if (currentUrl.includes('home') && homeLink) {
            homeLink.classList.add('active');
        } else if (currentUrl.includes('portfolios') && portfoliosLink) {
            portfoliosLink.classList.add('active');
        } else if (currentUrl.includes('tax') && taxLink) {
            taxLink.classList.add('active');
        } else if (currentUrl.includes('settings') && settingsLink) {
            settingsLink.classList.add('active');
        }
    }, []);

    return (
        <div className={styles.wrapper}>
            {/* Sidebar */}
            <Sidebar activeLink={activeLink} handleLinkClick={handleLinkClick} />

            {/* Main Content */}
            <div className={styles.main_content}>
                <div className={styles.profile_icon}>
                    <img src="/User-profile-pic.png" alt="User Profile" />
                </div>
                <div className={styles.portfolio_list}>
                    <PortfolioCard />
                    <TaxButton handleCalculateTax={handleCalculateTax} />
                </div>
            </div>

            {/* Tax Modal */}
            <TaxModal isTaxModalOpen={isTaxModalOpen} handleCloseModal={handleCloseModal} />
        </div>
    );
};

export default TaxScreen;
