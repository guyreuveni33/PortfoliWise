import React, {useState, useEffect} from 'react';
import axios from 'axios';
import styles from './styleMenu/homeScreen.module.css';
import {Chart, DoughnutController, ArcElement, Legend, Tooltip} from 'chart.js';
import Sidebar from "./components/Sidebar";
import BalanceCard from './components/home_screen_components/BalanceCard';
import WatchlistCard from './components/home_screen_components/WatchlistCard';
import MarketplaceCard from './components/home_screen_components/MarketplaceCard';
import PortfolioTable from './components/home_screen_components/PortfolioTable';
import PortfolioChart from './components/home_screen_components/PortfolioChart';
import ProfileIcon from './components/ProfileIcon';
import {useLocation} from "react-router-dom";

Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

const HomeScreen = () => {
    const [activeLink, setActiveLink] = useState('home');
    const [activeTimeFilter, setActiveTimeFilter] = useState('week');
    const [userToken, setUserToken] = useState(null);
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [portfolioData, setPortfolioData] = useState([]);
    const location = useLocation();

    useEffect(() => {
        // Parse query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const email = params.get('email');
        const nickname = params.get('nickname');

        if (token && email && nickname) {
            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            localStorage.setItem('nickname', nickname);

            // Remove query parameters from URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Retrieve from localStorage
        const tempToken = localStorage.getItem('token');
        const tempEmail = localStorage.getItem('email');
        const tempNickname = localStorage.getItem('nickname');

        setUserToken(tempToken);
        setEmail(tempEmail);
        setNickname(tempNickname);
    }, [location]);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const activePortfolioId = localStorage.getItem('activePortfolioId');
                const response = await axios.get('http://localhost:3001/api/portfolios', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data.length > 0) {
                    const activePortfolio = response.data.find(portfolio => portfolio.portfolioId === activePortfolioId);
                    setPortfolioData(activePortfolio ? activePortfolio.positions : response.data[0].positions);
                } else {
                    setPortfolioData([]);
                }
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            }
        };
        fetchPortfolioData();
    }, [userToken]);

    const fetchMarketData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/get-stocks');
            return response.data;
        } catch (error) {
            console.error('Error fetching market data:', error);
            return {};
        }
    };

    return (
        <div className={styles.app_container}>
            <Sidebar activeLink={activeLink} handleLinkClick={setActiveLink}/>
            <div className={styles.main_content}>
                <ProfileIcon nickname={nickname}/>
                <div className={styles.graphs_container}>
                    <BalanceCard userToken={userToken} activeTimeFilter={activeTimeFilter}
                                 onTimeFilterClick={setActiveTimeFilter}/>
                    <WatchlistCard email={email}/>
                    <MarketplaceCard fetchMarketData={fetchMarketData}/>
                    <PortfolioTable portfolioData={portfolioData}/>
                    <PortfolioChart portfolioData={portfolioData}/>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
