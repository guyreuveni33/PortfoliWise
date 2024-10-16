import React, { useState, useEffect } from 'react';
import styles from './styleMenu/portfoliosScreen.module.css';
import Sidebar from "./components/Sidebar";

function PortfolioScreen() {
    const [showAddPortfolioModal, setShowAddPortfolioModal] = useState(false);
    const [showAnalyzerModal, setShowAnalyzerModal] = useState(false);
    const [activeLink, setActiveLink] = useState('home');

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };
    const handleAddPortfolio = () => setShowAddPortfolioModal(true);
    const handleCloseAddPortfolio = () => setShowAddPortfolioModal(false);

    const handleAnalyzerClick = () => setShowAnalyzerModal(true);
    const handleCloseAnalyzer = () => setShowAnalyzerModal(false);

    const drawGauge = (value) => {
        const svg = document.getElementById('gauge');
        svg.innerHTML = '';

        const width = 200;
        const height = 100;
        const thickness = 18;

        const describeArc = (x, y, radius, startAngle, endAngle) => {
            const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
                const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
                return {
                    x: centerX + (radius * Math.cos(angleInRadians)),
                    y: centerY + (radius * Math.sin(angleInRadians))
                };
            };

            const start = polarToCartesian(x, y, radius, endAngle);
            const end = polarToCartesian(x, y, radius, startAngle);
            const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
            return [
                "M", start.x, start.y,
                "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
            ].join(" ");
        };

        const background = document.createElementNS("http://www.w3.org/2000/svg", "path");
        background.setAttribute("d", describeArc(width / 2, height, height - thickness, 0, 180));
        background.setAttribute("fill", "transparent");
        background.setAttribute("stroke", "#444");
        background.setAttribute("stroke-width", thickness);
        svg.appendChild(background);

        const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arc.setAttribute("d", describeArc(width / 2, height, height - thickness, 0, value * 180));
        arc.setAttribute("fill", "transparent");
        arc.setAttribute("stroke", value > 0.66 ? "limegreen" : value > 0.33 ? "yellow" : "red");
        arc.setAttribute("stroke-width", thickness);
        svg.appendChild(arc);
    };

    useEffect(() => {
        if (showAnalyzerModal) {
            drawGauge(Math.random());
        }
    }, [showAnalyzerModal]);

    return (
        <div className={styles.wrapper}>
            <Sidebar activeLink={activeLink} handleLinkClick={handleLinkClick} />

            <div className={styles.mainContent}>
                <div className={styles.profileIcon}>
                    <img src="/User-profile-pic.png" alt="User Profile" />
                </div>
                <div className={styles.graphs}>
                    <div className={`${styles.portfolio} ${styles.section}`}>
                        <header className={styles.borderLine}><h1>Your Portfolio</h1></header>
                        <table className={styles.portfolioTable}>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Balance</th>
                                <th>Price</th>
                                <th>Today</th>
                                <th>Week</th>
                                <th className={styles.centerAnalyzer}>Price Analyzer</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>AMZ</td>
                                <td>$5,722</td>
                                <td>$360</td>
                                <td className={styles.negative}>-2.4%</td>
                                <td className={styles.positive}>+2.12%</td>
                                <td className={styles.centerAnalyzer}>
                                    <button className={styles.analyzerButton} onClick={handleAnalyzerClick}>
                                        <img className={styles.analyzerStyle} src="/price-analyzer.png" alt="Analyzer Icon" />
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <button className={styles.addPortfolioButton} onClick={handleAddPortfolio}>
                        <img className={styles.iconStyle} src="/plus.png" alt="Add Portfolio Icon" />Add Portfolio
                    </button>
                </div>
            </div>

            {showAddPortfolioModal && (
                <div className={styles.portModal}>
                    <div className={styles.portModalContent}>
                        <div className={styles.portClose} onClick={handleCloseAddPortfolio}>&times;</div>
                        <h1 className={styles.borderLine}>Add a new portfolio</h1>
                        <label htmlFor="apiAddress">API Address</label>
                        <input type="text" id="apiAddress" name="apiAddress" className={styles.inputText} />
                        <button className={styles.addButton} onClick={handleCloseAddPortfolio}>
                            <img className={styles.portIconStyle} src="/plus.png" alt="Add Portfolio Icon" />Add
                        </button>
                    </div>
                </div>
            )}
            {showAnalyzerModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={handleCloseAnalyzer}>&times;</span>
                        <h2 className={styles.stockName}>AMZ</h2>
                        <svg id="gauge" width="200" height="100"></svg>
                        <p className={styles.disclaimer}>This should not be seen as an investment recommendation</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PortfolioScreen;
