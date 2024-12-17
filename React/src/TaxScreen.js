import React, {useState, useEffect} from 'react';
import axios from 'axios';
import styles from './styleMenu/taxScreen.module.css';
import Sidebar from "./components/Sidebar";
import PortfolioCard from './components/tax_screen_components/PortfolioCard';
import TaxButton from './components/tax_screen_components/TaxButton';
import TaxModal from './components/tax_screen_components/TaxModal';
import ProfileIcon from "./components/ProfileIcon";
const API_URL = process.env.REACT_APP_API_URL; // Fetch the base URL from the .env file

const TaxScreen = () => {
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
    const [portfolios, setPortfolios] = useState([]);
    const [totalGains, setTotalGains] = useState(0);
    const [totalLosses, setTotalLosses] = useState(0);
    const [netGain, setNetGain] = useState(0);
    const [annualTax, setAnnualTax] = useState(0);
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        const tempNickname = localStorage.getItem('nickname');
        setNickname(tempNickname);
    }, []);

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/portfolios`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setPortfolios(response.data);
            } catch (error) {
                console.error('Error fetching portfolios:', error);
            }
        };

        fetchPortfolios();
    }, []);

    const calculateTaxAcrossPortfolios = async () => {
        let gains = 0;
        let losses = 0;

        try {
            const response = await axios.get(`${API_URL}/api/portfolio/annual-tax`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const {totalGains, totalLosses} = response.data;

            gains += totalGains;
            losses += totalLosses;
        } catch (error) {
            console.error('Error calculating tax:', error);
        }

        const net = gains - losses;
        const tax = net > 0 ? net * 0.25 : 0;

        setTotalGains(gains);
        setTotalLosses(losses);
        setNetGain(net);
        setAnnualTax(tax);
        setIsTaxModalOpen(true);
    };

    const handleCalculateTax = () => {
        calculateTaxAcrossPortfolios();
    };

    const handleCloseModal = () => {
        setIsTaxModalOpen(false);
    };

    return (
        <div className={styles.wrapper}>
            <Sidebar activeLink="tax"/>

            <div className={styles.main_content}>
                <ProfileIcon nickname={nickname} />
                <div className={styles.portfolio_list}>
                    {portfolios.map((portfolio, index) => (
                        <PortfolioCard
                            key={portfolio.portfolioId}
                            portfolioId={portfolio.portfolioId}
                            index={index}
                        />
                    ))}
                    <TaxButton handleCalculateTax={handleCalculateTax}/>
                </div>
            </div>

            <TaxModal
                isTaxModalOpen={isTaxModalOpen}
                handleCloseModal={handleCloseModal}
                annualTax={annualTax}
                netGain={netGain}
                totalGains={totalGains}
                totalLosses={totalLosses}
            />
        </div>
    );
};

export default TaxScreen;
