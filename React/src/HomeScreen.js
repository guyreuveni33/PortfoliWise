import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styleMenu/homeScreen.module.css';
import { Chart, DoughnutController, ArcElement, Legend, Tooltip } from 'chart.js';
import Sidebar from './components/Sidebar';
import BalanceCard from './components/home_screen_components/BalanceCard';
import WatchlistCard from './components/home_screen_components/WatchlistCard';
import MarketplaceCard from './components/home_screen_components/MarketplaceCard';
import PortfolioTable from './components/home_screen_components/PortfolioTable';
import PortfolioChart from './components/home_screen_components/PortfolioChart';
import ProfileIcon from './components/ProfileIcon';
import { useLocation } from 'react-router-dom';

Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

const HomeScreen = () => {
    const [activeLink, setActiveLink] = useState('home');
    const [activeTimeFilter, setActiveTimeFilter] = useState('week');
    const [userToken, setUserToken] = useState(null);
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [portfolioDataForChart, setPortfolioDataForChart] = useState([]);
    const [portfolioDataForTable, setPortfolioDataForTable] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const email = params.get('email');
        const nickname = params.get('nickname');

        if (token && email && nickname) {
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            localStorage.setItem('nickname', nickname);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const tempToken = localStorage.getItem('token');
        const tempEmail = localStorage.getItem('email');
        const tempNickname = localStorage.getItem('nickname');

        setUserToken(tempToken);
        setEmail(tempEmail);
        setNickname(tempNickname);
    }, [location]);

    const fetchPortfolioData = async () => {
        try {
            const activePortfolioId = localStorage.getItem('activePortfolioId');
            const response = await axios.get('http://localhost:3001/api/portfolios', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (response.data.length > 0) {
                const activePortfolio = response.data.find(
                    (portfolio) => portfolio.portfolioId === activePortfolioId
                );
                const positions = activePortfolio ? activePortfolio.positions : response.data[0].positions;
                return positions;
            }
            return [];
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
            return [];
        }
    };

    const fetchMarketData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/get-stocks');
            return response.data;
        } catch (error) {
            console.error('Error fetching market data:', error);
            return {};
        }
    };

    // Fetch initial data for chart and table
    useEffect(() => {
        const fetchInitialData = async () => {
            const initialData = await fetchPortfolioData();
            setPortfolioDataForChart(initialData);
            setPortfolioDataForTable(initialData);
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            const updatedData = await fetchPortfolioData();
            setPortfolioDataForTable(updatedData);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.app_container}>
            <Sidebar activeLink={activeLink} handleLinkClick={setActiveLink} />
            <div className={styles.main_content}>
                <ProfileIcon nickname={nickname} />
                <div className={styles.graphs_container}>
                    <BalanceCard
                        userToken={userToken}
                        activeTimeFilter={activeTimeFilter}
                        onTimeFilterClick={setActiveTimeFilter}
                    />
                    <WatchlistCard email={email} />
                    <MarketplaceCard fetchMarketData={fetchMarketData} />
                    <PortfolioTable portfolioData={portfolioDataForTable} />
                    <PortfolioChart portfolioData={portfolioDataForChart} />
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
