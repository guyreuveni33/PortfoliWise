import React, {useState} from 'react';
import styles from './styleMenu/homeScreen.module.css'; // Make sure this matches the exact file name
import { Chart, DoughnutController, ArcElement, Legend, Tooltip } from 'chart.js';
import Sidebar from "./components/Sidebar";

Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

const HomeScreen = () => {
const [activeLink, setActiveLink] = React.useState('home');

    const handleLinkClick = (link) => {
        setActiveLink(link);}
    React.useEffect(() => {
        // Portfolio chart setup
        const ctx = document.getElementById('portfolioChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['AMZ', 'TSLA'],
                datasets: [
                    {
                        label: 'Portfolio Distribution',
                        data: [60, 40], // Example data
                        backgroundColor: ['rgb(210,48,48)', 'rgb(248,203,2)'],
                        borderColor: ['rgba(210,48,48)', 'rgb(248,203,2)'],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                        },
                    },
                },
            },
        });
    }, []);

    return (
        <div className={styles.app_container}>
            <Sidebar activeLink={activeLink} handleLinkClick={handleLinkClick} />

            <div className={styles.main_content}>
                <div className={styles.profile_icon}>
                    <img src="/User-profile-pic.png" alt="User Profile" className={styles.profile_image} />
                </div>

                <div className={styles.graphs_container}>
                    <div className={`${styles.balance_graph} ${styles.section_container}`}>
                        <header>
                            <p>Your Balance</p>
                            <h1 className={styles.balance_text}>$7,033.22</h1>
                        </header>
                        <canvas id="balanceChart"></canvas>
                        <div className={`${styles.time_filters_container} ${styles.border_line_top}`}>
                            <button id="t1" className={`${styles.filter_button} ${styles.filter_button_active}`}>Today</button>
                            <button id="t2" className={styles.filter_button}>Week</button>
                            <button id="t3" className={styles.filter_button}>Month</button>
                            <button id="t4" className={styles.filter_button}>Year</button>
                        </div>
                    </div>

                    <div className={`${styles.watchlist_section} ${styles.section_container}`}>
                        <header className={styles.border_line}><h1>Watchlist</h1></header>
                        <table className={styles.watchlist_table}>
                            <tbody>
                            <tr>
                                <th>Symbol</th>
                                <th>Price</th>
                                <th>%Change</th>
                            </tr>
                            {/* Example data */}
                            <tr>
                                <td>NVDA</td>
                                <td>919.13</td>
                                <td className={styles.positive_change}>+7.16%</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={`${styles.marketplace_section} ${styles.section_container}`}>
                        <header className={styles.border_line}><h1>Marketplace</h1></header>
                        <table className={styles.market_table}>
                            <tbody>
                            <tr>
                                <th>Symbol</th>
                                <th>Price</th>
                                <th>%Change</th>
                            </tr>
                            {/* Example data */}
                            <tr>
                                <td>S&P</td>
                                <td>919.13</td>
                                <td className={styles.positive_change}>+7.16%</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={`${styles.portfolio_container} ${styles.section_container}`}>
                        <header className={styles.border_line}><h1>Your Portfolio</h1></header>
                        <table className={styles.portfolio_table}>
                            <tbody>
                            <tr>
                                <th>Name</th>
                                <th>Balance</th>
                                <th>Price</th>
                                <th>Today</th>
                                <th>Week</th>
                            </tr>
                            {/* Example data */}
                            <tr>
                                <td>AMD</td>
                                <td>$5,777</td>
                                <td>$200.77</td>
                                <td className={styles.positive_change}>+5.21%</td>
                                <td className={styles.negative_change}>-7.4%</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={`${styles.circle_chart_container} ${styles.section_container}`}>
                        <canvas id="portfolioChart" className={styles.portfolio_chart}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
