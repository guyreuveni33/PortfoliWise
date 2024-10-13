import React, { useState, useEffect } from 'react';
import './portfolios-screen.css';

function PortfolioScreen() {
    const [showAddPortfolioModal, setShowAddPortfolioModal] = useState(false);
    const [showAnalyzerModal, setShowAnalyzerModal] = useState(false);
    const [activeLink, setActiveLink] = useState('home'); // Default active link

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };
    const handleAddPortfolio = () => setShowAddPortfolioModal(true);
    const handleCloseAddPortfolio = () => setShowAddPortfolioModal(false);

    const handleAnalyzerClick = () => setShowAnalyzerModal(true);
    const handleCloseAnalyzer = () => setShowAnalyzerModal(false);

    // Example function to draw the gauge in the analyzer modal
    const drawGauge = (value) => {
        const svg = document.getElementById('gauge');
        svg.innerHTML = ''; // Clear previous contents

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
            drawGauge(Math.random()); // Random value for demonstration
        }
    }, [showAnalyzerModal]);

    return (
        <div className="app">
            <div className="sidebar">
                <div className="menu">
                    <ul id="a">
                        <li>
                            <a
                                id="home-link"
                                className={activeLink === 'home' ? 'active' : ''}
                                onClick={() => handleLinkClick('home')}
                            >
                                <img className="iconStyle" src="/home.png" alt="Home Icon" />
                                <span className="text">Home</span>
                            </a>
                        </li>
                        <li>
                            <a
                                id="portfolios-link"
                                className={activeLink === 'portfolios' ? 'active' : ''}
                                onClick={() => handleLinkClick('portfolios')}
                            >
                                <img className="iconStyle" src="/hand.png" alt="Hand Icon" />
                                <span className="text">Portfolios</span>
                            </a>
                        </li>
                        <li>
                            <a
                                id="tax-link"
                                className={activeLink === 'tax' ? 'active' : ''}
                                onClick={() => handleLinkClick('tax')}
                            >
                                <img className="iconStyle" src="/tax.png" alt="Tax Icon" />
                                <span className="text">Tax</span>
                            </a>
                        </li>
                        <li>
                            <a
                                id="settings-link"
                                className={activeLink === 'settings' ? 'active' : ''}
                                onClick={() => handleLinkClick('settings')}
                            >
                                <img className="iconStyle" src="/settings.png" alt="Settings Icon" />
                                <span className="text">Settings</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <a className="logout">
                    <img className="iconStyle" src="/exit.png" alt="Exit Icon" />
                    <span className="text">Logout</span>
                </a>
            </div>

            <div className="main-content">
                <div className="profile-icon">
                    <img src="/User-profile-pic.png" alt="User Profile" />
                </div>
                <div className="graphs">
                    <div className="portfolio section">
                        <header className="borderLine"><h1>Your Portfolio</h1></header>
                        <table className="portfolio-table">
                            <tr>
                                <th>Name</th>
                                <th>Balance</th>
                                <th>Price</th>
                                <th>Today</th>
                                <th>Week</th>
                                <th className="centerAnalyzer">Price Analyzer</th>
                            </tr>
                            <tr>
                                <td>AMZ</td>
                                <td>$5,722</td>
                                <td>$360</td>
                                <td className="negative">-2.4%</td>
                                <td className="positive">+2.12%</td>
                                <td className="centerAnalyzer">
                                    <button className="analyzerButton" onClick={handleAnalyzerClick}>
                                        <img className="analyzerStyle" src="/price-analyzer.png" alt="Analyzer Icon" />
                                    </button>
                                </td>
                            </tr>
                            {/* Repeat table rows as needed */}
                        </table>
                    </div>
                    <button className="add-portfolio-button" onClick={handleAddPortfolio}>
                        <img className="iconStyle" src="/plus.png" alt="Add Portfolio Icon" />Add Portfolio
                    </button>
                </div>
            </div>

            {/* Modals */}
            {showAddPortfolioModal && (
                <div id="addPortfolioModal" className="port-modal">
                    <div className="port-modal-content">
                        <div className="port-close" onClick={handleCloseAddPortfolio}>&times;</div>
                        <h1 className="borderLine">Add a new portfolio</h1>
                        <label htmlFor="apiAddress">API Address</label>
                        <input type="text" id="apiAddress" name="apiAddress" />
                        <button className="add-button" onClick={handleCloseAddPortfolio}>
                            <img className="port-icon-style" src="/plus.png" alt="Add Portfolio Icon" />Add
                        </button>
                    </div>
                </div>
            )}
            {showAnalyzerModal && (
                <div id="analyzerModal" className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseAnalyzer}>&times;</span>
                        <h2 id="stockName">AMZ</h2>
                        <svg id="gauge" width="200" height="100"></svg>
                        <p className="disclaimer">This should not be seen as an investment recommendation</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PortfolioScreen;
