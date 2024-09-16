import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import './home-screen.css'; // Include your CSS file

const HomeScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token exists in local storage, redirect to login if not
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }

        // Initialize Chart.js for the portfolio chart
        const ctx = document.getElementById('portfolioChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['AMZ', 'TSLA'],
                datasets: [{
                    label: 'Portfolio Distribution',
                    data: [60, 40], // Example data
                    backgroundColor: ['rgb(210,48,48)', 'rgb(248,203,2)'],
                    borderColor: ['rgba(210,48,48)', 'rgb(248,203,2)'],
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom',
                    labels: {
                        fontColor: 'white'
                    }
                }
            }
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token on logout
        navigate('/login'); // Redirect to login page
    };

    return (
        <div>
            <div className="sidebar">
                <div className="menu">
                    <ul id="a">
                        <li>
                            <a href="/dashboard" className="active">
                                <img className="iconStyle" src="/home.png" alt="Home Icon" />
                                <span className="text">Home</span>
                            </a>
                        </li>
                        <li>
                            <a href="/portfolios" className="active">
                                <img className="iconStyle" src="/hand.png" alt="Portfolios Icon" />
                                <span className="text">Portfolios</span>
                            </a>
                        </li>
                        <li>
                            <a href="/tax" className="active">
                                <img className="iconStyle" src="/tax.png" alt="Tax Icon" />
                                <span className="text">Tax</span>
                            </a>
                        </li>
                        <li>
                            <a href="/settings" className="active">
                                <img className="iconStyle" src="/settings.png" alt="Settings Icon" />
                                <span className="text">Settings</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <button className="logout" onClick={handleLogout}>
                    <img className="iconStyle" src="/exit.png" alt="Logout Icon" />
                    <span className="text">Logout</span>
                </button>
            </div>

            <div className="main-content">
                <div className="profile-icon">
                    <img src="/User-profile-pic.png" alt="User Profile" />
                </div>

                <div className="graphs">
                    <div className="balance-graph section">
                        <header>
                            <p>Your Balance</p>
                            <h1 className="balance">$7,033.22</h1>
                        </header>
                        <canvas id="balanceChart"></canvas> {/* Placeholder for a chart */}
                        <div className="time-filters borderLineTop">
                            <button id="t1" className="filter active">Today</button>
                            <button id="t2" className="filter">Week</button>
                            <button id="t3" className="filter">Month</button>
                            <button id="t4" className="filter">Year</button>
                        </div>
                    </div>

                    <div className="watchlist section">
                        <header className="borderLine"><h1>Watchlist</h1></header>
                        <table className="watchlist-table">
                            <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Price</th>
                                <th>%Change</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr><td>NVDA</td><td>919.13</td><td className="positive">+7.16%</td></tr>
                            <tr><td>MMM</td><td>21.1</td><td className="negative">-3.22%</td></tr>
                            <tr><td>RUM</td><td>34.3</td><td className="positive">+2.11%</td></tr>
                            <tr><td>TSLA</td><td>223.3</td><td className="positive">+5.1%</td></tr>
                            <tr><td>PLTR</td><td>1.2</td><td className="positive">+2.9%</td></tr>
                            <tr><td>BZ</td><td>144.4</td><td className="positive">+1.7%</td></tr>
                            <tr><td>AMD</td><td>1500.4</td><td className="negative">-0.46%</td></tr>
                            <tr><td>SOUN</td><td>12.3</td><td className="negative">-12.23%</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="marketplace section">
                        <header className="borderLine"><h1>Marketplace</h1></header>
                        <table className="market-table">
                            <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Price</th>
                                <th>%Change</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr><td>S&amp;P</td><td>919.13</td><td className="positive">+7.16%</td></tr>
                            <tr><td>Dow</td><td>21.1</td><td className="negative">-3.22%</td></tr>
                            <tr><td>Nasdaq</td><td>34.3</td><td className="positive">+2.11%</td></tr>
                            <tr><td>Russel</td><td>223.3</td><td className="positive">+5.1%</td></tr>
                            <tr><td>BTC</td><td>1.2</td><td className="positive">+2.9%</td></tr>
                            <tr><td>ETH</td><td>144.4</td><td className="positive">+1.7%</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="portfolio section">
                        <header className="borderLine"><h1>Your Portfolio</h1></header>
                        <table className="portfolio-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Balance</th>
                                <th>Price</th>
                                <th>Today</th>
                                <th>Week</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr><td>AMD</td><td>$5,777</td><td>$200.77</td><td className="positive">+5.21%</td><td className="negative">-7.4%</td></tr>
                            <tr><td>AMZ</td><td>$5,722</td><td>$360</td><td className="negative">-2.4%</td><td className="positive">+2.12%</td></tr>
                            <tr><td>BLK</td><td>$377</td><td>$678</td><td className="positive">+1.1%</td><td className="negative">-27.4%</td></tr>
                            <tr><td>MAR</td><td>$676</td><td>$334.09</td><td className="positive">+3.3%</td><td className="positive">+4.23%</td></tr>
                            <tr><td>MMM</td><td>$137</td><td>$12.8</td><td className="positive">+2.13%</td><td className="negative">-2.2%</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="circle-chart section">
                        <canvas id="portfolioChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
