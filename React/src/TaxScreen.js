import React, { useState, useEffect } from 'react';
import styles from './TaxScreen.module.css';

const TaxScreen = () => {
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('tax'); // Set 'tax' as the default active link

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };
    const handleCalculateTax = () => {
        setIsTaxModalOpen(true);
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
            <div className={styles.sidebar}>
                <div className={styles.menu}>
                    <ul id={styles.a}>
                        <li>
                            <a id={styles.home_link}>
                                <img className={styles.icon_style} src="/home.png" alt="Home Icon" />
                                <span className={styles.text}>Home</span>
                            </a>
                        </li>
                        <li>
                            <a id={styles.portfolios_link}>
                                <img className={styles.icon_style} src="/hand.png" alt="Hand Icon" />
                                <span className={styles.text}>Portfolios</span>
                            </a>
                        </li>
                        <li>
                            <a id={styles.tax_link}>
                                <img className={styles.icon_style} src="/tax.png" alt="Tax Icon" />
                                <span className={styles.text}>Tax</span>
                            </a>
                        </li>
                        <li>
                            <a id={styles.settings_link}>
                                <img className={styles.icon_style} src="/settings.png" alt="Settings Icon" />
                                <span className={styles.text}>Settings</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <a className={styles.logout}>
                    <img className={styles.icon_style} src="/exit.png" alt="Exit Icon" />
                    <span className={styles.text}>Logout</span>
                </a>
            </div>

            {/* Main Content */}
            <div className={styles.main_content}>
                <div className={styles.profile_icon}>
                    <img src="/User-profile-pic.png" alt="User Profile" />
                </div>
                <div className={styles.portfolio_list}>
                    <div className={`${styles.portfolio_card} ${styles.section}`}>
                        <div className={styles.portfolio_header}>
                            <div className={styles.header_content}>
                                <h1>Your Portfolio</h1>
                                <div className={styles.right_header_container}>
                                    <span className={styles.year}>Year: 2024</span>
                                    <img src="/rotate-right.png" className={styles.icon_style_arrow} alt="Rotate Icon" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className={styles.profit}>Total Profit:</span>
                            <span className={`${styles.profit} ${styles.positive}`}> +$1300</span>
                        </div>
                    </div>
                    <button id={styles.calculate_tax} className={styles.calculate_tax_button} onClick={handleCalculateTax}>
                        <img className={styles.icon_style} src="/tax-icon.png" alt="Calculate Tax Icon" />
                        Calculate Tax
                    </button>
                </div>
            </div>

            {/* Tax Modal */}
            {isTaxModalOpen && (
                <div id={styles.tax_modal} className={styles.port_modal} onClick={handleCloseModal}>
                    <div className={styles.port_modal_content} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.port_close} id={styles.close_modal} onClick={handleCloseModal}>&times;</div>
                        <h1 className={styles.border_line}>Tax Summary for This Year</h1>
                        <p className={styles.tax_modal_text}>
                            Your combined portfolios profit for the year is <span className={styles.profit_amount}>$1,570</span>
                        </p>
                        <p className={styles.tax_modal_text}>Tax due: <span className={styles.tax_due}>$392.50</span></p>
                        <button id={styles.got_it} onClick={handleCloseModal}>
                            <img className={styles.icon_style_like} src="/like.png" alt="Like Icon" />
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaxScreen;
