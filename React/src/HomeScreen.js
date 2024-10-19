import React, { useState } from 'react';
import styles from './styleMenu/homeScreen.module.css';
import { Chart, DoughnutController, ArcElement, Legend, Tooltip } from 'chart.js';
import Sidebar from "./components/Sidebar";
import BalanceCard from './components/BalanceCard';
import WatchlistCard from './components/WatchlistCard';
import MarketplaceCard from './components/MarketplaceCard';
import PortfolioTable from './components/PortfolioTable';
import PortfolioChart from './components/PortfolioChart';

Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

const HomeScreen = () => {
    const [activeLink, setActiveLink] = useState('home');
    const [activeTimeFilter, setActiveTimeFilter] = useState('today');

    // Mock data - In a real app, this would come from an API or props
    const mockData = {
        balance: '$7,033.22',
        watchlist: [{ symbol: 'NVDA', price: '919.13', change: 7.16 }],
        market: [{ symbol: 'S&P', price: '919.13', change: 7.16 }],
        portfolio: [{
            name: 'AMD',
            balance: '$5,777',
            price: '$200.77',
            todayChange: 5.21,
            weekChange: -7.4
        }],
        chartData: {
            labels: ['AMZ', 'TSLA'],
            datasets: [{
                label: 'Portfolio Distribution',
                data: [60, 40],
                backgroundColor: ['rgb(210,48,48)', 'rgb(248,203,2)'],
                borderColor: ['rgba(210,48,48)', 'rgb(248,203,2)'],
                borderWidth: 1,
            }]
        }
    };

    return (
        <div className={styles.app_container}>
            <Sidebar activeLink={activeLink} handleLinkClick={setActiveLink} />

            <div className={styles.main_content}>
                <div className={styles.profile_icon}>
                    <img src="/User-profile-pic.png" alt="User Profile" className={styles.profile_image} />
                </div>

                <div className={styles.graphs_container}>
                    <BalanceCard
                        balance={mockData.balance}
                        activeTimeFilter={activeTimeFilter}
                        onTimeFilterClick={setActiveTimeFilter}
                    />
                    <WatchlistCard watchlistData={mockData.watchlist} />
                    <MarketplaceCard marketData={mockData.market} />
                    <PortfolioTable portfolioData={mockData.portfolio} />
                    <PortfolioChart chartData={mockData.chartData} />
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;