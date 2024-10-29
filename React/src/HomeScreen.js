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

Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

const HomeScreen = () => {
    const [activeLink, setActiveLink] = useState('home');
    const [activeTimeFilter, setActiveTimeFilter] = useState('today');
    const [userToken, setUserToken] = useState(null); // Initialize state for token
    const [email, setEmail] = useState(''); // Initialize state for email
    const [portfolioData, setPortfolioData] = useState([]);

    // useEffect to handle token retrieval
    useEffect(() => {
        const tempToken = localStorage.getItem('token');
        setUserToken(tempToken);
    }, []); // Runs only once when the component mounts

    // useEffect to handle email retrieval
    useEffect(() => {
        const tempEmail = localStorage.getItem('email');
        setEmail(tempEmail);
    }, []); // Runs only once when the component mounts

    // useEffect to log changes to userToken and email
    useEffect(() => {
        if (userToken) {
            console.log('Token:', userToken);
        }
    }, [userToken]); // Runs whenever userToken is updated

    useEffect(() => {
        if (email) {
            console.log('Email:', email);
        }
    }, [email]); // Runs whenever email is updated


    const fetchMarketData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/get-stocks');
            return response.data;
        } catch (error) {
            console.error('Error fetching market data:', error);
            return {};
        }
    };

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/alpaca/portfolio');
                setPortfolioData(response.data);
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            }
        };
        fetchPortfolioData();
    }, []);



    return (
        <div className={styles.app_container}>
            <Sidebar activeLink={activeLink} handleLinkClick={setActiveLink}/>
            <div className={styles.main_content}>
                <div className={styles.profile_icon}>
                    <img src="/User-profile-pic.png" alt="User Profile" className={styles.profile_image}/>
                </div>
                <div className={styles.graphs_container}>
                    <BalanceCard activeTimeFilter={activeTimeFilter} onTimeFilterClick={setActiveTimeFilter}/>
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
